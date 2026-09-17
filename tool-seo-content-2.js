/*
 * ToolBox Pro — Per-tool SEO content (part 2: tools 11-20)
 * Every fact here matches the actual tool UI. No fabricated features.
 */
window.TOOL_SEO = window.TOOL_SEO || {};

window.TOOL_SEO['uuid-generator'] = {
    h1: 'UUID Generator (v4 GUID)',
    intro: 'A UUID (Universally Unique Identifier) is a 128-bit identifier that\u2019s practically guaranteed to be unique without any central authority — perfect for database keys, request IDs, file names, and distributed systems. This tool generates random version-4 UUIDs using the Web Crypto API and supports standard, uppercase, and no-hyphen formats.',
    howToTitle: 'How to generate a UUID',
    howTo: [
        'Pick a format: standard lowercase, uppercase, or no hyphens.',
        'Choose how many UUIDs you need.',
        'Click Generate — new random UUIDs appear instantly.',
        'Copy one with its button, or Copy All to grab the whole list.'
    ],
    exampleTitle: 'What a v4 UUID looks like',
    exampleCode: '3f8a2c1e-7b4d-4e9a-9c2f-1a5b8d3e7c4f',
    exampleIntro: 'The structure is 8-4-4-4-12 hex digits. In a v4 UUID the third group starts with a 4 (the version) — everything else is pure randomness, giving 122 random bits: you could generate a billion UUIDs per second for a century and stay unlikely to collide.',
    exampleAfter: null,
    faq: [
        ['UUID vs GUID — what\u2019s the difference?', 'None, practically. GUID is Microsoft\u2019s name for the same concept; UUID is the standard term.'],
        ['Are generated UUIDs safe to use as database keys?', 'Yes for uniqueness, with a caveat: fully random v4 UUIDs scatter across indexes, which can hurt insert performance at very large scale. Some teams prefer ordered UUIDs (v7) for hot indexes.'],
        ['Can two UUIDs collide?', 'Astronomically unlikely — 122 random bits means you\u2019d need to generate trillions before collision odds become worth thinking about.'],
        ['Is generation really random?', 'Yes — crypto.getRandomValues from the Web Crypto API, generated locally.']
    ],
    relatedLabel: 'Related developer tools'
};

window.TOOL_SEO['json-to-csv'] = {
    h1: 'JSON to CSV Converter',
    intro: 'Convert JSON arrays of objects into CSV for spreadsheets. Every key found across the array becomes a column; each object becomes a row. Values containing commas or quotes are properly escaped so Excel and Google Sheets parse them cleanly.',
    howToTitle: 'How to convert JSON to CSV',
    howTo: [
        'Paste a JSON array of objects, e.g. [{"name":"Ada"},{"name":"Alan"}].',
        'Click Convert — the CSV appears with columns derived from all keys.',
        'Copy the CSV and paste it into a .csv file or straight into a spreadsheet.'
    ],
    exampleTitle: 'Conversion example',
    exampleCode: '[{"name":"Ada","year":1815},{"name":"Alan","year":1912}]',
    exampleOut: 'name,year\nAda,1815\nAlan,1912',
    exampleAfter: 'Objects with different keys still work: the union of all keys becomes the columns, and missing values are left empty.',
    faq: [
        ['Does it work with nested JSON?', 'Nested objects and arrays are flattened to their JSON representation inside a cell. For deeply nested data, reshape it to a flat array first for the cleanest CSV.'],
        ['Why does my spreadsheet mangle long numbers?', 'Excel converts long digit strings (like IDs) to floats and loses precision. Format those columns as text in your spreadsheet.'],
        ['Is there a size limit?', 'Conversion runs locally, so the practical limit is your browser\u2019s memory — easily hundreds of thousands of rows.']
    ],
    relatedLabel: 'Related JSON tools'
};

window.TOOL_SEO['regex-tester'] = {
    h1: 'Regex Tester — Test Regular Expressions Live',
    intro: 'Regular expressions are a pattern language for finding and validating text — email shapes, date formats, log lines, you name it. This tester shows every match live as you type the pattern, so you can iterate quickly instead of guess-and-refresh in code.',
    howToTitle: 'How to test a regular expression',
    howTo: [
        'Type your pattern in the regex field — leading and trailing slashes not needed.',
        'Paste sample text into the test-string area.',
        'Matches highlight instantly as you type either side.',
        'Iterate on the pattern until you capture exactly what you need, then copy it into your code.'
    ],
    exampleTitle: 'A practical regex example',
    exampleCode: '\\d{4}-\\d{2}-\\d{2}  matches  2026-09-17',
    exampleIntro: '\\d means any digit, {4} means exactly four of them — so this pattern finds ISO-style dates anywhere in text. Small building blocks like these combine into patterns far more precise than any find-and-replace.',
    exampleAfter: null,
    faq: [
        ['Which regex flavor does this use?', 'JavaScript (ECMAScript) regex, matching what runs in every browser and Node.js. Other languages (Python, PCRE) have small differences like lookbehind support and named-group syntax.'],
        ['Why doesn\u2019t my pattern match across lines?', 'By default ^ and $ anchor to the whole string, and . doesn\u2019t match newlines. Enable multiline (m) or dotall (s) flags where available, or use [\\s\\S] instead of a dot.'],
        ['My regex works here but not in my code — why?', 'Check escaping: in many languages the string literal eats one level of backslashes, so "\\d" written in code becomes \d in the actual pattern.'],
        ['Can regex validate an email perfectly?', 'Fully RFC-compliant email regex is famously monstrous. In practice a simple pattern plus a confirmation email is the robust approach.']
    ],
    relatedLabel: 'Related text tools'
};

window.TOOL_SEO['markdown-preview'] = {
    h1: 'Markdown Preview — Live Editor & Renderer',
    intro: 'Markdown is the lightweight formatting language used everywhere from READMEs to chat apps: # for headings, ** for bold, backticks for code. This tool renders your Markdown side by side with the formatted result as you type, so you can check syntax before publishing.',
    howToTitle: 'How to preview Markdown',
    howTo: [
        'Type or paste Markdown in the left pane.',
        'The rendered output updates live in the right pane.',
        'Use Load Example to see a demo covering headings, bold/italic, code blocks, links, and blockquotes.',
        'Copy the rendered result when you\u2019re happy with it.'
    ],
    exampleTitle: 'Markdown syntax example',
    exampleCode: '## Heading\n**bold** *italic* `code`\n- list item\n[link](https://example.com)',
    exampleIntro: 'That snippet renders as a subheading, bold and italic text, inline code, a bulleted list, and a hyperlink — the 20% of Markdown syntax that covers 95% of everyday writing.',
    exampleAfter: null,
    faq: [
        ['Which Markdown flavor is supported?', 'Core Markdown: headings, bold, italic, inline code, fenced code blocks, lists, links, images, and blockquotes. Extended features like tables depend on the renderer\u2019s support.'],
        ['Is my Markdown saved?', 'No — rendering happens live in your browser with nothing stored or sent. Copy your work before closing the tab.'],
        ['Why do GitHub and this preview differ slightly?', 'GitHub adds extensions (task lists, autolinks, table alignment). Core syntax renders identically; extended syntax may differ.']
    ],
    relatedLabel: 'Related developer tools'
};

window.TOOL_SEO['css-minifier'] = {
    h1: 'CSS Minifier — Compress & Beautify',
    intro: 'Minifying CSS strips comments, whitespace, and the final semicolon to produce the smallest possible stylesheet — fewer bytes means faster page loads. This tool also beautifies: expanding minified CSS back into readable, indented form for debugging.',
    howToTitle: 'How to minify CSS',
    howTo: [
        'Paste your CSS into the input box.',
        'Click Minify to compress it — the tool reports the size saving.',
        'Click Beautify to expand minified CSS back into readable form.',
        'Copy the result with one click.'
    ],
    exampleTitle: 'Minification example',
    exampleCode: '.card {\n  color: #333333;\n  margin: 0 auto;\n}  \u2192  .card{color:#333;margin:0 auto}',
    exampleIntro: 'Newlines and indentation gone, the trailing semicolon dropped. Individually tiny savings; across a real stylesheet they add up to measurably faster downloads — especially on mobile connections.',
    exampleAfter: null,
    faq: [
        ['How much smaller will my CSS get?', 'Typically 20\u201340% for hand-written CSS — more if it\u2019s comment-heavy, less if it was already written compactly.'],
        ['Is minified CSS safe to edit?', 'Don\u2019t. Keep the readable source, minify as a build/deploy step, and use Beautify here only to inspect minified output temporarily.'],
        ['Does it rename classes like big build tools?', 'No — this minifier is lossless: it only removes whitespace and comments, never changing selectors or property names.']
    ],
    relatedLabel: 'Related developer tools'
};

window.TOOL_SEO['timestamp-converter'] = {
    h1: 'Unix Timestamp Converter',
    intro: 'A Unix timestamp is the number of seconds elapsed since January 1, 1970 UTC — the standard way computers store points in time, immune to time zones and daylight saving ambiguity. Convert timestamps to human-readable dates and back, live as you type.',
    howToTitle: 'How to convert a Unix timestamp',
    howTo: [
        'Paste a timestamp to see the exact UTC date and time.',
        'Type a date to get its Unix timestamp in seconds.',
        'Conversion happens both directions, live as you type.',
        'Copy either result with its copy button.'
    ],
    exampleTitle: 'Reading a timestamp',
    exampleCode: '0  \u2192  Jan 1 1970 00:00:00 UTC',
    exampleIntro: 'Bigger numbers are later dates. Timestamps in milliseconds (13 digits instead of 10) are common in JavaScript — if your converted date is wildly wrong, you probably mixed up seconds and milliseconds.',
    exampleAfter: null,
    faq: [
        ['Seconds or milliseconds?', 'Unix timestamps are classically seconds (10 digits today). JavaScript\u2019s Date.now() returns milliseconds (13 digits). If your converted date is wildly off, you probably mixed them up.'],
        ['Do timestamps handle time zones?', 'A timestamp is an absolute moment — no zone attached. This tool displays it in UTC; the same instant is a different wall-clock time in each time zone.'],
        ['What happens in 2038?', '32-bit systems overflow on January 19, 2038 (the Y2K38 problem). Modern 64-bit systems — including every device running this tool — are unaffected for billions of years.']
    ],
    relatedLabel: 'Related utility tools'
};

window.TOOL_SEO['ip-lookup'] = {
    h1: 'IP Address Lookup',
    intro: 'Every device on the internet has an IP address, and public IPs carry useful metadata: approximate location, internet service provider, organization, and timezone. Look up any public IPv4 or IPv6 address to see that information.',
    howToTitle: 'How to look up an IP address',
    howTo: [
        'Enter a public IP address (IPv4 like 8.8.8.8, or IPv6).',
        'Run the lookup to see the network\u2019s organization/ISP, country, and region.',
        'Results come from public IP geolocation data — copy what you need.'
    ],
    exampleTitle: 'What an IP lookup tells you (and what it doesn\u2019t)',
    exampleCode: '8.8.4.4  \u2192  Google (org), United States (country)',
    exampleIntro: 'Geolocation resolves to the network\u2019s registered location — often a city or, for big providers, just a country. It can identify the organization and region but never a precise street address or an individual person.',
    exampleAfter: null,
    faq: [
        ['How accurate is IP geolocation?', 'Country-level is usually reliable; city-level is approximate and can be off, especially for mobile networks and VPNs.'],
        ['Does this reveal who someone is?', 'No. An IP identifies a network connection, not a person. Many households and offices share one public IP.'],
        ['Why do some IPs return no location?', 'Reserved ranges, newly allocated blocks, and some corporate networks have no public geolocation records.']
    ],
    relatedLabel: 'Related network tools'
};

window.TOOL_SEO['random-number-generator'] = {
    h1: 'Random Number Generator',
    intro: 'Generate random numbers in any range — integers for games, giveaways, and sampling, or decimals for simulations. Choose how many numbers you need, set min/max bounds, optionally sort the output, and roll dice with the built-in dice mode.',
    howToTitle: 'How to generate random numbers',
    howTo: [
        'Set your minimum and maximum values.',
        'Choose how many numbers to generate, and integer or decimal mode.',
        'Optionally enable sorting (ascending, descending) or use dice mode.',
        'Click Generate and copy the results.'
    ],
    exampleTitle: 'Fair picks for giveaways',
    exampleCode: 'Range 1\u2013100, count 1, integer mode  \u2192  one uniformly random winner',
    exampleIntro: 'Every value in the range is equally likely. For a giveaway among numbered entries, generate one integer between 1 and the entry count — that\u2019s the whole procedure, and it\u2019s as fair as the underlying randomness.',
    exampleAfter: null,
    faq: [
        ['How random are these numbers?', 'The tool uses your browser\u2019s random source — cryptographically strong randomness, suitable for games, draws, and sampling. It is not certified for cryptographic key generation or gambling regulation.'],
        ['Can the same number appear twice?', 'Yes — draws are independent by default, so duplicates are possible (and expected in large sets). If you need unique values, generate and de-duplicate, or use a range equal to the count.'],
        ['What\u2019s dice mode?', 'A quick preset that simulates dice rolls — integers from 1 to the number of sides you pick.']
    ],
    relatedLabel: 'Related utility tools'
};

window.TOOL_SEO['html-to-text'] = {
    h1: 'HTML to Text Converter',
    intro: 'Strip HTML tags from markup and get clean plain text — useful for extracting article content, preparing email-safe text versions, cleaning scraped HTML, or reading a page\u2019s actual words without the tag noise.',
    howToTitle: 'How to convert HTML to plain text',
    howTo: [
        'Paste your HTML — full documents or fragments both work.',
        'The plain-text extraction strips tags and keeps the readable content.',
        'Copy the cleaned text with one click.'
    ],
    exampleTitle: 'Conversion example',
    exampleCode: '<p>Hello <b>world</b></p>  \u2192  Hello world',
    exampleIntro: 'Tags disappear; their text content remains. Structural tags like paragraphs and line breaks become whitespace so sentences don\u2019t run together.',
    exampleAfter: null,
    faq: [
        ['Are scripts and styles removed too?', 'The extractor targets visible text content — script and style contents don\u2019t appear in the output. Always sanity-check automated extraction on important documents.'],
        ['Will HTML entities like &amp; be converted?', 'Yes — entities decode to their characters (&amp; becomes &), so the text reads naturally.'],
        ['Is my HTML uploaded anywhere?', 'No — extraction runs entirely in your browser.']
    ],
    relatedLabel: 'Related text tools'
};

window.TOOL_SEO['text-diff-checker'] = {
    h1: 'Text Diff Checker — Compare Two Texts',
    intro: 'Compare two versions of text and see exactly what was added and what was removed — line by line. Perfect for reviewing contract edits, checking two config versions, verifying an email rewrite, or finding what changed between drafts.',
    howToTitle: 'How to compare two texts',
    howTo: [
        'Paste the original text in the first box.',
        'Paste the changed text in the second box.',
        'Run the comparison — added and removed lines are highlighted.',
        'Read the diff top to bottom; each change shows its side of the edit.'
    ],
    exampleTitle: 'Reading a diff',
    exampleCode: '- old line\n+ new line',
    exampleIntro: 'Lines starting with a minus existed only in the original; plus lines exist only in the new version; unchanged lines appear once between them. This is the same convention git uses.',
    exampleAfter: null,
    faq: [
        ['Does it compare words or whole lines?', 'Line by line — a single changed word marks that line as changed. For word-level granularity, compare shorter passages.'],
        ['Can it ignore whitespace changes?', 'Whitespace-only differences can still register as changes depending on normalization. Trim or normalize text first if whitespace noise drowns real edits.'],
        ['Is my text stored?', 'No — comparison runs locally in your browser and nothing is sent or saved.']
    ],
    relatedLabel: 'Related writing tools'
};
