#!/usr/bin/env node
/*
 * Registry dashboard — generates registry-dashboard.html (gitignored, local-only,
 * never deployed): dataset health, category counts, freshness aging, lint status,
 * and the last external link check (if one has been run).
 * Run: node registry-dashboard.js   → then open registry-dashboard.html
 */
const fs = require('fs');
const { execSync } = require('child_process');
const vm = require('vm');

// ---------- load registry ----------
const sandbox = {
    window: {},
    document: { addEventListener() {}, querySelectorAll() { return []; }, dispatchEvent() {}, readyState: 'complete' },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('ai-registry.js', 'utf8'), sandbox);
const R = sandbox.window.AIRegistry;

// ---------- lint ----------
let lint = { ok: true, output: '' };
try {
    lint.output = execSync('node lint-registry.js', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (e) {
    lint.ok = false;
    lint.output = (e.stdout || '') + (e.stderr || '');
}

// ---------- link report ----------
let linkReport = 'No external link check run yet — `node check-external-links.js`.';
if (fs.existsSync('link-report.md')) linkReport = fs.readFileSync('link-report.md', 'utf8');

// ---------- freshness buckets ----------
const TODAY = new Date();
function ageDays(iso) { return Math.floor((TODAY - new Date(iso + 'T00:00:00Z')) / 86400000); }
const tools = R.tools.map(t => ({ ...t, age: ageDays(t.lastVerified || '2026-01-01') }));
const stale30 = tools.filter(t => t.age > 30).sort((a, b) => b.age - a.age);
const fresh7 = tools.filter(t => t.age <= 7);
const oldest = [...tools].sort((a, b) => b.age - a.age)[0];

const cats = R.categoryList();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const catRows = cats.map(c => {
    const list = R.byCategory(c.name);
    const newest = Math.min(...list.map(t => ageDays(t.lastVerified || '2026-01-01')));
    const bar = Math.round((c.count / Math.max(...cats.map(x => x.count))) * 100);
    return `<tr><td><a href="ai-tools/${c.slug}/" target="_blank">${esc(c.name)}</a></td><td>${c.count}</td>
    <td><div style="background:linear-gradient(90deg,#6366f1 ${bar}%,rgba(255,255,255,.08) ${bar}%);height:8px;border-radius:4px"></div></td>
    <td class="${newest > 30 ? 'warn' : 'ok'}">${newest}d ago</td></tr>`;
}).join('\n');

const staleRows = stale30.slice(0, 15).map(t =>
    `<tr><td>${esc(t.name)}</td><td><a href="ai-tools/${t.slug}/" target="_blank">${esc(t.slug)}</a></td><td>${t.lastVerified}</td><td class="${t.age > 60 ? 'warn' : 'ok'}">${t.age}d</td><td><a href="${esc(t.url)}" target="_blank" rel="noopener">open ↗</a></td></tr>`
).join('\n') || '<tr><td colspan="5" class="ok">Every tool verified within the last 30 days ✓</td></tr>';

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Registry Dashboard — AI Directories (local)</title>
<style>
:root{color-scheme:dark}
body{font-family:ui-sans-serif,system-ui,sans-serif;background:#0b0b12;color:#e4e4ef;margin:0;padding:32px;max-width:1100px;margin-inline:auto}
h1{font-size:1.5rem;margin:0 0 4px} .sub{color:#8e8e9c;font-size:.85rem;margin-bottom:28px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:28px}
.card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:18px}
.card .n{font-size:1.9rem;font-weight:800} .card .l{color:#8e8e9c;font-size:.78rem;margin-top:4px}
h2{font-size:1rem;margin:32px 0 12px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.08em;font-size:.78rem}
table{width:100%;border-collapse:collapse;font-size:.86rem}
th{text-align:left;color:#8e8e9c;font-weight:600;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.09);font-size:.72rem;text-transform:uppercase;letter-spacing:.06em}
td{padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.05)}
a{color:#a5b4fc;text-decoration:none} a:hover{text-decoration:underline}
.ok{color:#34d399}.warn{color:#fbbf24}.bad{color:#f87171}
pre{background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px;font-size:.78rem;overflow:auto;white-space:pre-wrap}
.badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:.75rem;font-weight:700}
.badge.ok{background:rgba(52,211,153,.12)}.badge.bad{background:rgba(248,113,113,.14)}
.pill{font-size:.7rem;color:#8e8e9c;border:1px solid rgba(255,255,255,.12);border-radius:99px;padding:2px 8px;margin-left:8px}
</style></head><body>
<h1>Registry Dashboard <span class="pill">local only — never deployed</span></h1>
<div class="sub">AI Directories · generated ${TODAY.toISOString().slice(0, 10)} from ai-registry.js</div>

<div class="grid">
<div class="card"><div class="n">${R.tools.length}</div><div class="l">AI tools</div></div>
<div class="card"><div class="n">${cats.length}</div><div class="l">Categories</div></div>
<div class="card"><div class="n">${fresh7.length}</div><div class="l">Verified ≤ 7 days</div></div>
<div class="card"><div class="n ${stale30.length ? 'warn' : 'ok'}">${stale30.length}</div><div class="l">Stale (&gt; 30 days)</div></div>
<div class="card"><div class="n">${oldest ? oldest.age : 0}d</div><div class="l">Oldest verification${oldest ? ` (${esc(oldest.name)})` : ''}</div></div>
</div>

<h2>Lint guardrail ${lint.ok ? '<span class="badge ok">PASS</span>' : '<span class="badge bad">FAIL</span>'}</h2>
<pre>${esc(lint.output || 'ok')}</pre>

<h2>Categories</h2>
<table><tr><th>Category</th><th>Tools</th><th style="width:30%">Share</th><th>Newest verification</th></tr>
${catRows}
</table>

<h2>Oldest verifications (verify these next)</h2>
<table><tr><th>Tool</th><th>Slug</th><th>lastVerified</th><th>Age</th><th></th></tr>
${staleRows}
</table>

<h2>Last external link check</h2>
<pre>${esc(linkReport)}</pre>

<script>console.log('local dashboard — static snapshot, refresh by re-running node registry-dashboard.js');</script>
</body></html>`;

fs.writeFileSync('registry-dashboard.html', html);
console.log(`registry-dashboard.html written (${R.tools.length} tools, lint ${lint.ok ? 'PASS' : 'FAIL'}, ${stale30.length} stale)`);
if (!lint.ok) process.exitCode = 1;
