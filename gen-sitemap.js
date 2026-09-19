#!/usr/bin/env node
/*
 * Sitemap generator — single source of truth: the filesystem + ai-registry.js.
 * - Discovers real pages (static .html and directory index.html) at the site root
 * - AI tool pages get lastmod from the tool's lastVerified date (data freshness)
 * - Everything else falls back to git last-commit date, then today
 * - Excludes internal/demo files; never invents URLs
 * Usage: node gen-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const vm = require('vm');

const SITE = 'https://aidirectories.in';
const TODAY = new Date().toISOString().slice(0, 10);

// ---------- load registry for lastVerified ----------
const sandbox = {
    window: {},
    document: { addEventListener() {}, querySelectorAll() { return []; }, dispatchEvent() {}, readyState: 'complete' },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('ai-registry.js', 'utf8'), sandbox);
const VERIFIED = {};
for (const t of sandbox.window.AIRegistry.tools) VERIFIED[t.slug] = t.lastVerified;

// ---------- discover pages ----------
function walk(dir, acc) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name[0] === '.' || e.name === 'node_modules' || e.name === 'facelessforge' || e.name === 'scripts') continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, acc);
        else if (e.name === 'index.html') acc.push(dir);
        else if (e.name.endsWith('.html')) acc.push(p.replace(/\.html$/, ''));
    }
    return acc;
}
const raw = walk('.', []);
const EXCLUDE = [/og-image$/, /^3d-/, /^dev-server/, /-test$/, /-demo$/, /^test-/, /^404$/, /^premium$/, /noindex/];
const pages = raw
    .map(p => p.split(path.sep).join('/').replace(/\/index$/, ''))
    .map(p => (p === '.' || p === '' ? '/' : '/' + p))
    .filter(p => !EXCLUDE.some(re => re.test(p.slice(1))))
    .sort();

// URL for each page = its own <link rel="canonical"> (single source of truth).
// Falls back to a computed path (trailing slash for directory pages) only if the
// tag is missing or points off-domain — and warns so it can be fixed at the source.
function pageUrl(p) {
    const candidates = p === '/'
        ? ['index.html']
        : [p.slice(1) + '/index.html', p.slice(1) + '.html'];
    for (const f of candidates) {
        if (fs.existsSync(f)) {
            const m = fs.readFileSync(f, 'utf8').match(/rel="canonical" href="([^"]*)"/);
            if (m) {
                if (m[1].startsWith(SITE)) return m[1];
                console.warn(`  ! ${f}: canonical "${m[1]}" is off-domain — using computed path`);
            }
        }
    }
    const isDir = fs.existsSync(path.join('.', p.slice(1), 'index.html'));
    return SITE + (p === '/' ? '/' : p + (isDir ? '/' : ''));
}

function gitDate(urlPath) {
    const candidates = urlPath === '/' ? 'index.html' : urlPath.slice(1) + '.html';
    const candidates2 = urlPath === '/' ? 'index.html' : urlPath.slice(1) + '/index.html';
    for (const c of [candidates, candidates2]) {
        try {
            const d = execSync(`git log -1 --format=%cs -- "${c}"`, { encoding: 'utf8' }).trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
        } catch (e) { /* not in git */ }
    }
    return TODAY;
}

// AI detail pages: lastmod = lastVerified (the real data-freshness signal)
function lastmodFor(urlPath) {
    const m = urlPath.match(/^\/ai-tools\/([a-z0-9-]+)$/);
    if (m && VERIFIED[m[1]]) return VERIFIED[m[1]];
    return gitDate(urlPath);
}

function priorityFor(p) {
    if (p === '/') return '1.0';
    if (p === '/ai-tools' || p === '/developer-tools' || p === '/guides') return '0.9';
    if (/^\/ai-tools\/ai-/.test(p)) return '0.8';
    if (/^\/ai-tools\//.test(p)) return '0.7';
    return '0.6';
}
function changefreqFor(p) {
    if (p === '/') return 'daily';
    if (p === '/ai-tools' || /^\/ai-tools\/ai-/.test(p)) return 'weekly';
    if (/^\/ai-tools\//.test(p)) return 'monthly';
    return 'monthly';
}

const urls = pages.map(p => {
    const lm = lastmodFor(p);
    return `    <url><loc>${pageUrl(p)}</loc><lastmod>${lm}</lastmod><changefreq>${changefreqFor(p)}</changefreq><priority>${priorityFor(p)}</priority></url>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync('sitemap.xml', xml);

// ---------- report ----------
const toolCount = urls.filter(u => /\/ai-tools\/[a-z0-9-]+\/?</.test(u)).length;
const verifiedCount = urls.filter(u => {
    const m = u.match(/\/ai-tools\/([a-z0-9-]+)\/?</);
    return m && VERIFIED[m[1]];
}).length;
console.log(`sitemap.xml written: ${urls.length} URLs`);
console.log(`  AI tool pages: ${toolCount} (lastmod from lastVerified: ${verifiedCount})`);
console.log(`  other pages: ${urls.length - toolCount} (lastmod from git/ today)`);
