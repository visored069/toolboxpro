#!/usr/bin/env node
/*
 * Test harness for api/feedback.js — mounts the Vercel handler on a plain
 * Node HTTP server (identical (req, res) contract) and asserts the full
 * status-code / sanitization / rate-limit matrix.
 * Run: node scripts/test-feedback-api.js
 */
const http = require('http');
const assert = require('assert');

process.env.FEEDBACK_WEBHOOK_URL = ''; // log-only mode for the main matrix

const handler = require('../api/feedback.js');
const server = http.createServer(handler);

function post(port, path, body, headers) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? '' : (typeof body === 'string' ? body : JSON.stringify(body));
    const req = http.request({
      host: '127.0.0.1', port, path, method: 'POST',
      headers: Object.assign({
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Origin': 'http://127.0.0.1:' + port,
        'Host': '127.0.0.1:' + port,
      }, headers || {}),
    }, res => {
      let out = '';
      res.on('data', c => out += c);
      res.on('end', () => resolve({ status: res.statusCode, body: out ? JSON.parse(out) : null }));
    });
    req.on('error', reject);
    req.end(data);
  });
}

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  let passed = 0, failed = 0;

  async function check(name, fn) {
    try { await fn(); passed++; console.log('  ok  ' + name); }
    catch (e) { failed++; console.log('  FAIL ' + name + ' — ' + e.message); }
  }

  console.log('api/feedback.js test matrix\n===========================');

  // Distinct X-Forwarded-For per case: the rate limiter buckets by IP and
  // would otherwise exhaust the shared 'unknown' bucket mid-matrix.
  let ipSeq = 1;
  const nextIp = () => '198.51.100.' + (ipSeq++);

  await check('valid submission -> 202 {ok:true}', async () => {
    const r = await post(port, '/api/feedback', { rating: 'good', message: 'Great tool!', page: '/json-formatter' }, { 'X-Forwarded-For': nextIp() });
    assert.strictEqual(r.status, 202);
    assert.strictEqual(r.body.ok, true);
  });

  await check('message-only (no rating) -> 202', async () => {
    const r = await post(port, '/api/feedback', { rating: '', message: 'Add dark mode pls' }, { 'X-Forwarded-For': nextIp() });
    assert.strictEqual(r.status, 202);
  });

  await check('rating-only (no message) -> 202', async () => {
    const r = await post(port, '/api/feedback', { rating: 'love', message: '' }, { 'X-Forwarded-For': nextIp() });
    assert.strictEqual(r.status, 202);
  });

  await check('empty everything -> 400 with ok:false (client must NOT show success)', async () => {
    const r = await post(port, '/api/feedback', { rating: '', message: '   ' });
    assert.strictEqual(r.status, 400);
    assert.strictEqual(r.body.ok, false);
  });

  await check('invalid rating value -> 202 (rating dropped, message kept)', async () => {
    const r = await post(port, '/api/feedback', { rating: '<script>', message: 'hi' }, { 'X-Forwarded-For': nextIp() });
    assert.strictEqual(r.status, 202);
  });

  await check('control characters stripped from stored message', async () => {
    const orig = console.log;
    let logged = '';
    console.log = function () { logged = Array.prototype.slice.call(arguments).join(' '); };
    try {
      const r = await post(port, '/api/feedback', { rating: 'bad', message: 'line1\u0000\u0007line2\u000bend' }, { 'X-Forwarded-For': nextIp() });
      assert.strictEqual(r.status, 202);
    } finally { console.log = orig; }
    // the server-side log shows what was actually accepted/stored
    assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(logged), 'control chars survived sanitization: ' + JSON.stringify(logged));
    assert.ok(logged.includes('line1'), 'legit text must survive: ' + logged);
  });

  await check('message over 1000 chars accepted, clamped to 1000', async () => {
    // 1200 chars: exceeds MAX_MESSAGE_CHARS but fits the 4KB body cap
    const orig = console.log;
    let logged = '';
    console.log = function () { logged = Array.prototype.slice.call(arguments).join(' '); };
    try {
      const r = await post(port, '/api/feedback', { rating: 'good', message: 'x'.repeat(1200) }, { 'X-Forwarded-For': nextIp() });
      assert.strictEqual(r.status, 202);
    } finally { console.log = orig; }
    const stored = JSON.parse(logged.replace(/^\[feedback\] accepted: /, '').replace(/ ip=.*$/, ''));
    assert.strictEqual(stored.message.length, 1000, 'clamp failed, stored length ' + stored.message.length);
  });

  await check('invalid JSON -> 400 ok:false', async () => {
    const r = await post(port, '/api/feedback', '{"rating": "good", broken', { 'X-Forwarded-For': nextIp() });
    assert.strictEqual(r.status, 400);
    assert.strictEqual(r.body.ok, false);
  });

  await check('GET -> 405', async () => {
    const r = await new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port, path: '/api/feedback' }, res => {
        let out = ''; res.on('data', c => out += c);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(out || '{}') }));
      }).on('error', reject);
    });
    assert.strictEqual(r.status, 405);
  });

  await check('cross-origin Origin header -> 403', async () => {
    const r = await post(port, '/api/feedback', { rating: 'good', message: 'x' }, { Origin: 'https://evil.example', 'X-Forwarded-For': nextIp() });
    assert.strictEqual(r.status, 403);
  });

  await check('payload over 4KB -> 413', async () => {
    const r = await post(port, '/api/feedback', { rating: 'good', message: 'y'.repeat(6000) }, { 'X-Forwarded-For': nextIp() });
    assert.strictEqual(r.status, 413);
  });

  await check('rate limit: 6th request from same IP -> 429', async () => {
    // The harness shares one server (one rateHits map); prior requests already
    // consumed slots for 127.0.0.1, so this IP is near the cap. Use distinct
    // X-Forwarded-For per request elsewhere; here force a fresh bucket.
    const ip = '203.0.113.77';
    let last;
    for (let i = 0; i < 6; i++) {
      last = await post(port, '/api/feedback', { rating: 'good', message: 'rl ' + i }, { 'X-Forwarded-For': ip });
    }
    assert.strictEqual(last.status, 429);
    assert.ok(last.body.error.includes('Too many'));
  });

  await check('distinct IP after rate limit -> 202 (isolation)', async () => {
    const r = await post(port, '/api/feedback', { rating: 'meh', message: 'other ip' }, { 'X-Forwarded-For': '198.51.100.9' });
    assert.strictEqual(r.status, 202);
  });

  await check('response carries no-store + nosniff', async () => {
    const res = await new Promise((resolve, reject) => {
      const data = JSON.stringify({ rating: 'good', message: 'headers' });
      const req = http.request({
        host: '127.0.0.1', port, path: '/api/feedback', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), 'Origin': 'http://127.0.0.1:' + port, 'X-Forwarded-For': '198.51.100.10' },
      }, resolve);
      req.on('error', reject); req.end(data);
    });
    assert.strictEqual(res.headers['cache-control'], 'no-store');
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
  });

  // --- webhook mode: local relay as stand-in for Discord/Slack ---
  await check('webhook mode: forwards sanitized payload, 202; down webhook -> 502', async () => {
    // Fresh handler instance with webhook env set; separate server so the
    // rate-limit map and handler closure pick up the env.
    delete require.cache[require.resolve('../api/feedback.js')];
    process.env.FEEDBACK_WEBHOOK_URL = 'http://127.0.0.1:0/__never__'; // port 0 => connection refused fast
    const handler2 = require('../api/feedback.js');
    const server2 = http.createServer(handler2);
    await new Promise(r => server2.listen(0, '127.0.0.1', r));
    const p2 = server2.address().port;
    try {
      const r = await post(p2, '/api/feedback', { rating: 'good', message: 'via webhook' }, { 'X-Forwarded-For': '198.51.100.11' });
      assert.strictEqual(r.status, 502); // webhook unreachable -> 502, client must show failure
      assert.strictEqual(r.body.ok, false);
    } finally {
      server2.close();
      process.env.FEEDBACK_WEBHOOK_URL = '';
      delete require.cache[require.resolve('../api/feedback.js')];
    }
  });

  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  server.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('harness error:', e); process.exit(1); });
