/*
 * Link integrity checker for AI Directories (static site).
 * - Every local href/src in .html files must resolve to a real file.
 *   Clean URLs ("json-formatter") map to "json-formatter.html".
 * - Also checks url(...) refs and known asset strings inside .js files.
 * Anchors (#), mailto:, tel:, javascript:, data: and external http(s) are skipped.
 * Run: node check-links.js   (exit 1 on real failures)
 */
const fs = require('fs');
const path = require('path');

function walk(dir) {
    let out = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === '.git' || e.name === '.freebuff' || e.name === 'facelessforge') continue;
        const p = dir === '.' ? e.name : dir + '/' + e.name;
        if (e.isDirectory()) out = out.concat(walk(p));
        else if (e.name.endsWith('.html')) out.push(p);
    }
    return out;
}
const files = walk('.');
const SRC_REF = /(?:src|href)\s*=\s*["']([^"']+)["']/g;
const CSS_URL = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;

function normTarget(raw, fromFile) {
    let t = raw.trim();
    if (!t || t.startsWith('#') || /^(mailto:|tel:|javascript:|data:)/i.test(t)) return null;
    if (/\$\{|^\$\d/.test(t)) return null; // JS template literal / regex backreference
    if (/^https?:\/\//i.test(t)) return null; // external
    t = t.split('#')[0];
    if (!t) return null; // pure anchor
    if (t === '/') return 'index.html';
    if (t.startsWith('/')) { t = t.slice(1); }
    else {
        // resolve ../ and ./ segments against the referring page's directory
        const baseDir = path.dirname(fromFile);
        t = path.normalize(path.join(baseDir, t)).split(path.sep).join('/');
    }
    if (t.endsWith('/')) t += 'index.html';
    // clean URL: no extension -> try .html
    if (!path.extname(t)) {
        if (fs.existsSync(t)) return t;
        return t + '.html';
    }
    return t;
}

let total = 0, broken = [];
for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    let m;
    SRC_REF.lastIndex = 0;
    while ((m = SRC_REF.exec(html))) {
        const target = normTarget(m[1], f);
        if (!target) continue;
        total++;
        if (!fs.existsSync(target)) broken.push(`${f} -> ${m[1]} (missing ${target})`);
    }
}

// assets referenced from JS (service worker precache lists etc.) — skip tooling scripts
for (const jf of fs.readdirSync('.').filter(f => f.endsWith('.js') && !f.endsWith('.min.js') && !/^(check-|gen-|endgame-|inject-|perf-|test-)/.test(f))) {
    const src = fs.readFileSync(jf, 'utf8');
    let m;
    SRC_REF.lastIndex = 0;
    while ((m = SRC_REF.exec(src))) {
        const target = normTarget(m[1], jf);
        if (!target || !/\.(html|css|png|svg|jpg|xml|txt|json|webmanifest|ico|woff2?)$/i.test(target)) continue;
        total++;
        if (!fs.existsSync(target)) broken.push(`${jf} -> ${m[1]} (missing ${target})`);
    }
    CSS_URL.lastIndex = 0;
    while ((m = CSS_URL.exec(src))) {
        const t = m[1].trim();
        if (!t || /^https?:|^data:/.test(t)) continue;
        total++;
        if (!fs.existsSync(t)) broken.push(`${jf} -> url(${t}) missing`);
    }
}

console.log(`Checked ${total} local references across ${files.length} HTML pages + JS.`);
if (broken.length) {
    console.log(`BROKEN (${broken.length}):`);
    broken.forEach(b => console.log('  ' + b));
    process.exit(1);
} else {
    console.log('All internal references resolve. ✓');
}
