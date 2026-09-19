#!/usr/bin/env node
/*
 * Injects registry-generated SoftwareApplication JSON-LD into all 80 AI tool
 * detail pages (alongside the existing BreadcrumbList block). Everything comes
 * from the registry 1:1 — no ratings, no fabricated prices (Offer price:0 only
 * for genuinely free tools), operatingSystem "Web", dateModified = lastVerified.
 * Idempotent: skips pages that already carry the marker. Run: node gen-detail-schema.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = 'https://aidirectories.in';
const MARKER = 'aid:schema';

// ---------- registry ----------
const sandbox = {
    window: {},
    document: { addEventListener() {}, querySelectorAll() { return []; }, dispatchEvent() {}, readyState: 'complete' },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('ai-registry.js', 'utf8'), sandbox);
const R = sandbox.window.AIRegistry;

function detailFiles() {
    const acc = [];
    for (const e of fs.readdirSync('ai-tools', { withFileTypes: true })) {
        if (!e.isDirectory() || e.name.startsWith('ai-')) continue; // categories have no SoftwareApplication
        const f = path.join('ai-tools', e.name, 'index.html');
        if (fs.existsSync(f)) acc.push({ slug: e.name, file: f });
    }
    return acc;
}

let injected = 0, skipped = 0, missing = [];
for (const { slug, file } of detailFiles()) {
    const t = R.bySlug(slug);
    if (!t) { missing.push(slug); continue; }

    const data = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: t.name,
        applicationCategory: t.category,
        operatingSystem: 'Web',
        url: `${SITE}/ai-tools/${slug}`,
        description: t.desc,
        dateModified: t.lastVerified || undefined,
    };
    if (t.pricing === 'free') data.offers = { '@type': 'Offer', price: '0', priceCurrency: 'USD' };
    if (data.dateModified === undefined) delete data.dateModified;

    let html = fs.readFileSync(file, 'utf8');
    const json = JSON.stringify(data);

    if (html.includes(MARKER)) {
        // refresh existing block
        const re = new RegExp(`<script type="application/ld\\+json" data-gen="${MARKER}">[\\s\\S]*?</script>`);
        if (re.test(html)) {
            html = html.replace(re, `<script type="application/ld+json" data-gen="${MARKER}">\n    ${json}\n    </script>`);
            fs.writeFileSync(file, html);
            skipped++;
            continue;
        }
        console.warn(`  ! ${slug}: marker present but block malformed — skipping`);
        continue;
    }

    // insert right after the BreadcrumbList block
    const anchor = /<\/script>(\s*\n)(\s*)<link rel="stylesheet" href="https:\/\/unpkg\.com\/lenis/;

    const block = `<script type="application/ld+json" data-gen="${MARKER}">\n    ${json}\n    </script>`;
    if (anchor.test(html)) {
        html = html.replace(anchor, (m) => `</script>\n    ${block}` + m.slice(m.indexOf('\n')));
        fs.writeFileSync(file, html);
        injected++;
    } else {
        // fallback: after first ld+json block close
        const fallback = /(<script type="application\/ld\+json">[\s\S]*?<\/script>)/;
        if (fallback.test(html)) {
            html = html.replace(fallback, (m, b) => b + `\n    ${block}`);
            fs.writeFileSync(file, html);
            injected++;
        } else {
            console.warn(`  ! ${slug}: no anchor found — skipped`);
        }
    }
}

console.log(`SoftwareApplication schema: ${injected} injected, ${skipped} refreshed, ${missing.length} without registry entry`);
if (missing.length) console.log('  missing:', missing.join(', '));
