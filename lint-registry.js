#!/usr/bin/env node
/*
 * Registry guardrail — run before any deploy that touches the dataset.
 * Fails (exit 1) if any AI tool description contains unverified claims:
 *   - digits (counts, versions, durations) unless whitelisted per-tool
 *   - superlatives / popularity claims
 *   - model version strings
 * Also validates structural integrity (counts, categories, colors, slugs).
 * Usage: node lint-registry.js
 */
const fs = require('fs');
const vm = require('vm');

// Digits allowed in descriptions, per tool slug (each entry must be a verifiable
// product name/feature, not a metric). Keep this list short and auditable.
const DIGIT_WHITELIST = {
    'chatgpt': ['custom gpts'],          // "GPTs" product naming
    'dall-e-3': ['dall·e 3', 'dall-e 3'], // product name itself
    'copilot-365': ['microsoft 365'],
    'office-copilot': ['microsoft 365'],
    'v0-by-vercel': ['v0'],              // product name
    'gpts-factory': ['gpts'],
};

const SUPERLATIVES = [
    /\bbest\b/i, /\bmost (popular|capable|used|trusted|advanced|powerful|realistic)\b/i,
    /\bindustry[- ]leading\b/i, /\b#1\b/i, /\bworld'?s (largest|best|first)\b/i,
    /\btop[- ]rated\b/i, /\bthe leading\b/i, /\bnumber one\b/i,
    /\bunbeatable\b/i, /\bunmatched\b/i, /\brevolutionary\b/i, /\bgame[- ]changing\b/i,
    // unverifiable quality/speed claims (audit 2026-09-20)
    /\bstudio[- ]quality\b/i, /\bultra[- ]fast\b/i, /\bin (seconds|minutes)\b/i,
    /\bmassive (community|library)\b/i, /\bcommercial license\b/i, /\bbeautiful\b/i,
];

const MODEL_STRINGS = [
    /\bGPT-[345o]\b/i, /\bGPT-4[.5o]?\b/i, /\bClaude [234]\b/i, /\bOpus \d\b/i, /\bSonnet \d\b/i,
    /\bGemini \d+(\.\d+)?\b/i, /\bLlama ?[234]\b/i, /\bMistral \d+\b/i, /\bDeepSeek [Vv]\d+\b/i,
    /\bSDXL\b/i, /\bStable Diffusion [XV]?\d*\b/i, /\bDALL·?E ?[23]\b/i, /\bFLUX(\.\d)?\b/i,
    /\bVeo \d?\b/i, /\bGen-[123]\b/i, /\bRunway Gen-\d+\b/i, /\bo[13](-mini|-preview)?\b/i,
    /\bGrok-[234]\b/i, /\bWhisper (large|v\d)\b/i, /\bQwen\d*([.-]\d)?\b/i, /\bKling \d+(\.\d)?\b/i,
];

// Unverified metrics: counts, durations, percentages (even without a model name)
const METRIC_PATTERNS = [
    /\b\d+\+?\s*(million|billion|k\b|M\b|contacts|users|models|voices|avatars|languages|sources|templates|use cases|integrations|tools|agents|minutes|seconds|hours|videos|images|words|tickets)\b/i,
    /\b\d{3,}\+?\b/,            // bare big numbers (100+, 275M, 500K…)
    /\b\d+(\.\d+)?%\+?/,        // percentages ("50%+ of tickets")
    /up to \d+/i,               // "up to 60s", "up to 2 minutes"
    /\b\d+[kKmM]\+/,            // 500K+, 250K+
];

function loadRegistry() {
    const code = fs.readFileSync('ai-registry.js', 'utf8');
    const sandbox = {
        window: {},
        document: { addEventListener() {}, querySelectorAll() { return []; }, dispatchEvent() {}, readyState: 'complete' },
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    return sandbox.window.AIRegistry;
}

let errors = 0;
const fail = (msg) => { errors++; console.error('  ✗ ' + msg); };
const ok = (msg) => console.log('  ✓ ' + msg);

console.log('Registry guardrail\n==================');

// ---------- 1. description content ----------
const R = loadRegistry();
console.log(`\nDescriptions (${R.tools.length} tools):`);
for (const t of R.tools) {
    const label = `${t.slug}: "${t.desc.slice(0, 50)}${t.desc.length > 50 ? '…' : ''}"`;

    // model strings — always an error
    for (const re of MODEL_STRINGS) {
        const m = t.desc.match(re);
        if (m) fail(`${label} — model/version string: "${m[0]}"`);
    }

    // superlatives — always an error
    for (const re of SUPERLATIVES) {
        const m = t.desc.match(re);
        if (m) fail(`${label} — unsupported superlative: "${m[0]}"`);
    }

    // digits — allowed only when every digit run is whitelisted for this tool
    // ("3D"/"2D"/"text-to-3D" are capability terms, not claims — exempt them)
    const descNoDims = t.desc.replace(/(?:text|image|video)[ -]to[ -][23]d|[23]d\b/gi, '');
    const digitRuns = descNoDims.match(/\d[\w.,+·-]*/g) || [];
    const wl = (DIGIT_WHITELIST[t.slug] || []).map(s => s.toLowerCase());
    for (const run of digitRuns) {
        const norm = run.toLowerCase().replace(/[+.,]+$/, '');
        const whitelisted = wl.some(w => norm.includes(w.replace(/[^a-z0-9·-]/g, '')) || w.includes(norm.replace(/[^a-z0-9·-]/g, '')));
        if (!whitelisted) fail(`${label} — unverified figure: "${run}" (add to DIGIT_WHITELIST only if verifiable)`);
    }

    // metric phrasing — error even with whitelist (whitelist is for names, not metrics)
    for (const re of METRIC_PATTERNS) {
        const m = t.desc.match(re);
        if (m) fail(`${label} — unverified metric: "${m[0]}"`);
    }
}

// ---------- 2. structural integrity ----------
console.log('\nStructure:');
if (R.tools.length === 80) ok(`tool count: ${R.tools.length}`);
else fail(`tool count is ${R.tools.length}, expected 80 — every count on the site derives from this`);

const slugs = new Set();
for (const t of R.tools) {
    if (slugs.has(t.slug)) fail(`duplicate slug: ${t.slug}`);
    slugs.add(t.slug);
    if (!t.lastVerified || !/^\d{4}-\d{2}-\d{2}$/.test(t.lastVerified)) fail(`${t.slug}: missing/malformed lastVerified (${t.lastVerified})`);
    if (!/^#[0-9a-fA-F]{6}$/.test(t.color)) fail(`${t.slug}: invalid color "${t.color}" (must be 6-digit hex — page templates append alpha suffixes)`);
    if (!/^https:\/\//.test(t.url)) fail(`${t.slug}: non-HTTPS url`);
    for (const f of ['name', 'desc', 'category', 'icon', 'pricing']) {
        if (!t[f]) fail(`${t.slug}: missing field "${f}"`);
    }
    if (!['free', 'freemium', 'paid'].includes(t.pricing)) fail(`${t.slug}: unknown pricing "${t.pricing}"`);
}
ok('slug/favorite/url/field checks done');

const cats = R.categoryList();
const total = cats.reduce((s, c) => s + c.count, 0);
if (total === R.tools.length) ok(`category counts sum to ${total}`);
else fail(`category counts sum to ${total}, but dataset has ${R.tools.length} tools`);

for (const c of cats) {
    if (c.count < 6) fail(`category "${c.name}" has only ${c.count} tools (min 6 — no thin category pages)`);
}

// ---------- result ----------
console.log('');
if (errors) {
    console.error(`FAILED: ${errors} problem${errors > 1 ? 's' : ''}. Fix the dataset — do not suppress checks.`);
    process.exit(1);
}
console.log('All checks passed. ✓');
