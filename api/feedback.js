/*
 * POST /api/feedback — Vercel serverless function (zero npm dependencies).
 *
 * Pipeline: origin check -> JSON parse -> size limit -> field validation ->
 * per-IP rate limit -> sanitize -> deliver (webhook or log) -> 202.
 *
 * Secrets: FEEDBACK_WEBHOOK_URL lives in Vercel Project Settings -> Environment
 * Variables only. It is NEVER referenced by client-side code. With no webhook
 * configured the endpoint still validates and accepts submissions (they appear
 * in Vercel function logs), so the widget never lies to the user.
 *
 * Response contract (client treats 2xx as delivered):
 *   202 {ok:true}                      accepted
 *   400 {ok:false,error:"..."}          invalid input (client shows failure)
 *   405 / 413 / 429 / 500               method / size / rate / server errors
 *   400 for invalid JSON? No — 400 with ok:false (client maps to failure)
 */

const MAX_BODY_BYTES = 4 * 1024;          // 4 KB is generous for one message
const MAX_MESSAGE_CHARS = 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;    // 10 minutes
const RATE_MAX_REQUESTS = 5;              // per IP per window

// In-memory rate limiting. Per-serverless-instance: approximate but free, and
// the webhook/log layer is the real abuse boundary. Cold starts reset it —
// documented, not a correctness dependency.
const rateHits = new Map();

function sweepRateHits() {
  const cutoff = Date.now() - RATE_WINDOW_MS;
  for (const [key, entry] of rateHits) {
    if (entry.reset < cutoff) rateHits.delete(key);
  }
}

const EMOJI_RATINGS = ['love', 'good', 'meh', 'bad'];

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  if (Array.isArray(fwd) && fwd.length) return String(fwd[0]).trim();
  return req.headers['x-real-ip'] || 'unknown';
}

function rateLimit(ip) {
  const now = Date.now();
  sweepRateHits();
  const entry = rateHits.get(ip);
  if (!entry || entry.reset < now) {
    rateHits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return { allowed: true };
  }
  entry.count += 1;
  if (entry.count > RATE_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }
  return { allowed: true };
}

/*
 * Strip control characters (newlines/tabs kept — the webhook uses a fenced
 * block so line breaks render as the user typed them), trim, clamp length.
 * Sanitized text is rendered as TEXT in the webhook payload — never
 * interpolated into HTML or Markdown links — so injection stops here.
 */
function sanitizeText(value, max) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  if (!origin && !referer) return true; // non-browser client; rate limit still applies
  if (origin) {
    try {
      return new URL(origin).host === req.headers.host;
    } catch (e) { return false; }
  }
  try {
    return new URL(referer).host === req.headers.host;
  } catch (e) { return false; }
}

module.exports = async function handler(req, res) {
  // Method
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }

  // CSRF hardening: same-origin browser requests only (curl may omit Origin;
  // it still hits validation + rate limit, so nothing is opened up).
  if (!sameOrigin(req)) {
    return json(res, 403, { ok: false, error: 'Cross-origin submissions are not accepted' });
  }

  // Body size cap before parsing
  const declared = parseInt(req.headers['content-length'] || '0', 10);
  if (declared > MAX_BODY_BYTES) {
    return json(res, 413, { ok: false, error: 'Payload too large' });
  }

  // Parse JSON body (nodejs runtime gives us the stream)
  let raw = '';
  let overflow = false;
  await new Promise(function (resolve) {
    req.on('data', function (chunk) {
      if (overflow) return; // already tripped; keep draining below
      raw += chunk;
      if (raw.length > MAX_BODY_BYTES) {
        overflow = true;
        raw = '';
        req.resume(); // drain the rest so the 413 below can actually be sent
      }
    });
    req.on('end', resolve);
    req.on('error', resolve);
  });
  if (overflow) return json(res, 413, { ok: false, error: 'Payload too large' });

  let body;
  try {
    body = JSON.parse(raw || '{}');
  } catch (e) {
    return json(res, 400, { ok: false, error: 'Invalid JSON' });
  }

  // Rate limit (after cheap rejects, before storage/delivery work)
  const ip = clientIp(req);
  const rl = rateLimit(ip);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfter || RATE_WINDOW_MS / 1000));
    return json(res, 429, { ok: false, error: 'Too many submissions — try again later' });
  }

  // Validate — server-side truth, independent of client markup
  const rating = EMOJI_RATINGS.indexOf(body.rating) !== -1 ? body.rating : '';
  const message = sanitizeText(body.message, MAX_MESSAGE_CHARS);
  const page = sanitizeText(body.page, 200);
  if (!rating && !message) {
    return json(res, 400, { ok: false, error: 'Pick a rating or leave a message' });
  }

  const submission = {
    rating: rating,
    message: message,
    page: page || 'unknown',
    ts: new Date().toISOString(),
  };

  // Deliver: webhook if configured (secret stays server-side), else log.
  let delivered = 'log';
  const webhook = process.env.FEEDBACK_WEBHOOK_URL;
  if (webhook) {
    try {
      const outcome = await forward(webhook, submission, ip);
      delivered = outcome;
    } catch (e) {
      console.error('[feedback] webhook delivery failed:', e && e.message);
      return json(res, 502, { ok: false, error: 'Delivery failed — please retry' });
    }
  }

  console.log('[feedback] accepted:', JSON.stringify(submission), 'ip=' + ip, 'delivered=' + delivered);
  return json(res, 202, { ok: true });
};

/*
 * Webhook delivery with hard timeout. Discord-style JSON payload (Discord,
 * Slack compatible-enough via their incoming-webhook adapters; Make/Zapier and
 * a plain collector accept any JSON). Message text is plain text — the caller
 * already stripped control characters.
 */
function forward(webhookUrl, submission, ip) {
  return new Promise(function (resolve, reject) {
    let u;
    try { u = new URL(webhookUrl); } catch (e) { return reject(new Error('invalid webhook URL')); }
    if (u.protocol !== 'https:') return reject(new Error('webhook must be https'));

    const content =
      '**New feedback** (' + submission.ts + ')\n' +
      'Page: ' + submission.page + '\n' +
      'Rating: ' + (submission.rating || '—') + '\n' +
      'IP: ' + ip + '\n' +
      '---\n' +
      (submission.message || '(no message)');

    const payload = JSON.stringify({ content: content });
    const mod = require('https');
    const reqOut = mod.request(u, {
      method: 'POST',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, function (resOut) {
      resOut.resume();
      if (resOut.statusCode >= 200 && resOut.statusCode < 300) return resolve('webhook:' + resOut.statusCode);
      reject(new Error('webhook responded ' + resOut.statusCode));
    });
    reqOut.on('timeout', function () { reqOut.destroy(new Error('webhook timeout')); });
    reqOut.on('error', reject);
    reqOut.end(payload);
  });
}
