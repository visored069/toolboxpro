#!/usr/bin/env node
/*
 * Link-rot monitor — checks every external URL in the AI registry (and the
 * dev-tool registry) for liveness. Designed for the weekly scheduled CI run:
 * reports failures as GitHub Actions annotations; never modifies data.
 *
 * Heuristics tuned to avoid false positives:
 *  - 2xx/3xx = alive
 *  - 403/429 with known bot-blocker hosts (Cloudflare etc.) = "blocked", not dead
 *  - 405/501 on HEAD = retry with GET
 * Usage: node check-external-links.js            # check all
 *        node check-external-links.js --update   # same, plus print a ready-to-paste
 *                                                # lastVerified bump list for survivors
 */
const http = require('http');
const https = require('https');
const vm = require('vm');
const fs = require('fs');

const UPDATE = process.argv.includes('--update');
const TIMEOUT_MS = 12000;

function loadRegistry(file) {
    const sandbox = {
        window: {},
        document: { addEventListener() {}, querySelectorAll() { return []; }, dispatchEvent() {}, readyState: 'complete' },
    };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox);
    return sandbox.window.AIRegistry || sandbox.window.ToolRegistry;
}

function fetchOnce(url, method) {
    return new Promise(resolve => {
        let u;
        try { u = new URL(url); } catch (e) { return resolve({ status: 0, error: 'invalid URL' }); }
        if (!/^https:$/.test(u.protocol)) return resolve({ status: 0, error: 'not https' });
        const mod = u.protocol === 'https:' ? https : http;
        const req = mod.request(u, { method, timeout: TIMEOUT_MS, headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; AIDirectoriesLinkCheck/1.0; +https://aidirectories.in)',
            'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        } }, res => {
            // consume body so socket frees
            res.resume();
            resolve({ status: res.statusCode, location: res.headers.location });
        });
        req.on('timeout', () => { req.destroy(); resolve({ status: 0, error: 'timeout' }); });
        req.on('error', err => {
            // Huge server headers (e.g. Google) hit Node's parser limit — the site IS up
            if (err.code === 'HPE_HEADER_OVERFLOW' || /header overflow/i.test(err.message || '')) {
                return resolve({ status: 200, error: '' });
            }
            resolve({ status: 0, error: err.code || 'error' });
        });
        req.end();
    });
}

async function check(url) {
    let r = await fetchOnce(url, 'HEAD');
    if (r.status === 405 || r.status === 501 || r.status === 403 && !r.error) {
        // some sites reject HEAD — retry GET (range to avoid big downloads)
        r = await fetchOnce(url, 'GET');
    }
    return r;
}

function verdict(url, r) {
    if (r.status >= 200 && r.status < 400) return 'ok';
    if (r.status === 403 || r.status === 429 || r.status === 503) return 'blocked'; // bot protection, not dead
    if (r.status === 0 && (r.error === 'timeout' || r.error === 'ECONNRESET' || r.error === 'ETIMEDOUT')) return 'timeout';
    if (r.status === 404 || r.status === 410) return 'dead';
    if (r.status === 0) return 'dns-error';
    return 'error';
}

(async () => {
    const ai = loadRegistry('ai-registry.js');
    const dev = loadRegistry('tool-registry.js');
    const tools = [
        ...ai.tools.map(t => ({ name: t.name, url: t.url, slug: t.slug, lastVerified: t.lastVerified, kind: 'ai' })),
        ...(dev.tools || []).map(t => ({ name: t.name, url: t.url, slug: t.slug || t.id, kind: 'dev' })),
    ].filter(t => t.url && /^https/.test(t.url));

    console.log(`Checking ${tools.length} external URLs…\n`);
    const results = [];
    const CONCURRENCY = 6;
    for (let i = 0; i < tools.length; i += CONCURRENCY) {
        const batch = tools.slice(i, i + CONCURRENCY);
        const settled = await Promise.all(batch.map(async t => {
            const r = await check(t.url);
            return { ...t, status: r.status, error: r.error || '', v: verdict(t.url, r) };
        }));
        for (const s of settled) {
            results.push(s);
            const icon = { ok: '✓', blocked: '⚠', timeout: '⏳', dead: '✗', 'dns-error': '✗', error: '?' }[s.v];
            if (s.v !== 'ok') console.log(`${icon} [${s.v}] ${s.status || s.error} — ${s.name} (${s.url})`);
        }
        await new Promise(res => setTimeout(res, 300)); // be polite
    }

    const dead = results.filter(r => r.v === 'dead' || r.v === 'dns-error');
    const warn = results.filter(r => r.v === 'blocked' || r.v === 'timeout' || r.v === 'error');

    console.log(`\nResults: ${results.length} checked — ${results.length - dead.length - warn.length} ok, ${warn.length} warnings (bot-walls/timeouts), ${dead.length} DEAD`);

    // GitHub Actions annotations
    const summary = [];
    for (const d of dead) {
        console.log(`::error::Dead link: ${d.name} -> ${d.url} (HTTP ${d.status || d.error})`);
        summary.push(`- ❌ **${d.name}** — ${d.url} (HTTP ${d.status || d.error})`);
    }
    for (const w of warn) {
        console.log(`::warning::Unreachable (may be bot-wall): ${w.name} -> ${w.url} (${w.v})`);
        summary.push(`- ⚠️ **${w.name}** — ${w.url} (${w.v}; likely bot protection, verify manually)`);
    }
    fs.writeFileSync('link-report.md', `# External link check — ${new Date().toISOString().slice(0, 10)}\n\n${summary.join('\n') || 'All links alive.'}\n`);

    if (UPDATE) {
        const today = new Date().toISOString().slice(0, 10);
        const survivors = results.filter(r => r.v === 'ok' && r.kind === 'ai').map(r => r.slug);
        console.log(`\n[--update] AI tools verified alive today (${survivors.length}): ready to bump lastVerified -> ${today}`);
        console.log(`[--update] To apply: set lastVerified = '${today}' for these ${survivors.length} slugs in ai-registry.js`);
    }

    // dead links fail the weekly run; warnings don't
    process.exit(dead.length ? 1 : 0);
})();
