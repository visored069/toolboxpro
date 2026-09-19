#!/usr/bin/env node
/*
 * Injects registry-generated JSON-LD into ai-tools/index.html (replaces the
 * existing CollectionPage block). Structured data is derived 1:1 from the
 * dataset — names, categories, URLs, and the modifiedTime all come from the
 * registry, so it can never drift from what the page actually shows.
 * No ratings/reviews (none exist). Idempotent. Run: node gen-structured-data.js
 */
const fs = require('fs');
const vm = require('vm');

const SITE = 'https://aidirectories.in';
const FILE = 'ai-tools/index.html';

// ---------- load registry ----------
const sandbox = {
    window: {},
    document: { addEventListener() {}, querySelectorAll() { return []; }, dispatchEvent() {}, readyState: 'complete' },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('ai-registry.js', 'utf8'), sandbox);
const R = sandbox.window.AIRegistry;

// newest lastVerified across the dataset = when the directory data was last touched
const modifiedTime = R.tools
    .map(t => t.lastVerified)
    .filter(Boolean)
    .sort()
    .pop();

const categoryOf = (catName) => {
    const c = R.categoryList().find(x => x.name === catName);
    return c ? c.slug : null;
};

// ItemList: every tool, with its real detail URL + category (slug-parity)
const itemListElement = R.tools.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
        '@type': 'SoftwareApplication',
        name: t.name,
        applicationCategory: t.category,
        url: `${SITE}/ai-tools/${t.slug}`,
        ...(t.desc ? { description: t.desc } : {}),
        offers: { '@type': 'Offer', price: t.pricing === 'free' ? '0' : undefined, priceCurrency: 'USD' },
    },
}));

// Drop undefined price values cleanly (freemium/paid have no truthful single price)
for (const li of itemListElement) {
    if (li.item.offers.price === undefined) delete li.item.offers;
}

const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Tools Directory',
    description: `Curated directory of ${R.tools.length} hand-picked AI tools across ${R.categoryList().length} categories.`,
    url: `${SITE}/ai-tools`,
    ...(modifiedTime ? { dateModified: modifiedTime } : {}),
    mainEntity: {
        '@type': 'ItemList',
        numberOfItems: R.tools.length,
        itemListElement,
    },
};

const json = JSON.stringify(data, null, 2);

let html = fs.readFileSync(FILE, 'utf8');
const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
const block = `<script type="application/ld+json">\n    ${json.replace(/\n/g, '\n    ')}\n    </script>`;

if (re.test(html)) {
    html = html.replace(re, block);
    console.log('replaced existing JSON-LD block');
} else {
    html = html.replace('</head>', `    ${block}\n</head>`);
    console.log('inserted JSON-LD block');
}
fs.writeFileSync(FILE, html);

// validate: block parses as JSON and counts match registry
const parsed = JSON.parse(json);
console.log(`CollectionPage OK: ${parsed.mainEntity.numberOfItems} items, dateModified=${parsed.dateModified || 'none'}`);
const withOffers = parsed.mainEntity.itemListElement.filter(x => x.item.offers).length;
console.log(`offers on free tools: ${withOffers}/${parsed.mainEntity.numberOfItems}`);
