/*
 * ToolBox Pro — Per-tool SEO content (part 1: tools 1-10)
 * Every fact here matches the actual tool UI. No fabricated features.
 */
window.TOOL_SEO = window.TOOL_SEO || {};

window.TOOL_SEO['json-formatter'] = {
    h1: 'JSON Formatter & Validator',
    intro: 'JSON (JavaScript Object Notation) is the standard format APIs use to exchange data. In the wild it usually arrives as one long, unreadable line. This tool pretty-prints JSON with proper indentation, minifies it to save bytes, and validates it against JSON syntax — so broken payloads fail loudly with a clear message instead of silently breaking your code.',
    howToTitle: 'How to format JSON',
    howTo: [
        'Paste your JSON into the input box (or just start typing).',
        'Click Format to pretty-print it with 2-space indentation.',
        'Click Minify to strip all whitespace into a single compact line.',
        'Click Validate to check the syntax — you\u2019ll get an error message pointing at the problem if the JSON is invalid.',
        'Click Copy to copy the result to your clipboard.'
    ],
    exampleTitle: 'JSON formatting example',
    exampleIntro: 'This minified JSON:',
    exampleCode: '{"name":"Ada","role":"admin","tags":["math","pioneering"],"active":true}',
    exampleAfter: 'becomes this when formatted:',
    exampleOut: '{\n  "name": "Ada",\n  "role": "admin",\n  "tags": [\n    "math",\n    "pioneering"\n  ],\n  "active": true\n}',
    faq: [
        ['Is my JSON uploaded to a server?', 'No. Formatting, minifying, and validating all happen locally in your browser. Your data never leaves your device.'],
        ['What does the validator catch?', 'It catches JSON syntax errors — missing commas, unquoted keys, trailing commas, unescaped quotes, and mismatched brackets. It does not validate a JSON Schema.'],
        ['Why does my JSON with comments fail?', 'JSON has no comment syntax. Comments are allowed in JSON5 and some config files, but standard JSON parsers — including this one — reject them.']
    ],
    relatedLabel: 'Related JSON tools'
};

window.TOOL_SEO['word-counter'] = {
    h1: 'Word & Character Counter',
    intro: 'A real-time counter for words, characters (with and without spaces), sentences, paragraphs, and estimated reading time. Useful for essays with strict limits, tweets and meta descriptions with hard caps, and judging how long a draft takes to read.',
    howToTitle: 'How to count words and characters',
    howTo: [
        'Type or paste your text into the box — counts update as you type.',
        'Watch the stat boxes for words, characters, characters without spaces, sentences, and paragraphs.',
        'The reading-time estimate assumes roughly 200 words per minute of silent reading.'
    ],
    exampleTitle: 'What counts as a word?',
    exampleCode: null,
    exampleIntro: 'Words are split on whitespace, so "don\u2019t" is one word and "state-of-the-art" is also one word. A sentence ends at ., !, or ?. Paragraphs are separated by blank lines. Numbers like 42 count as words too.',
    exampleAfter: null,
    faq: [
        ['Is my text stored anywhere?', 'No. Counting happens in your browser and nothing is sent or saved.'],
        ['Does it count emoji?', 'Emoji count toward characters. Whether an emoji counts as a word depends on surrounding whitespace.'],
        ['Can I count a book-length text?', 'Yes — counting runs locally, so very long texts work, limited only by your device\u2019s memory.']
    ],
    relatedLabel: 'Related writing tools'
};

window.TOOL_SEO['password-generator'] = {
    h1: 'Secure Password Generator',
    intro: 'Generates cryptographically strong passwords using the browser\u2019s Web Crypto API — the same class of randomness used in security software. Pick a length, choose which character sets to include, and get a password that\u2019s practically impossible to brute-force.',
    howToTitle: 'How to generate a strong password',
    howTo: [
        'Drag the length slider — 16+ characters is a sensible default for anything important.',
        'Toggle uppercase letters, lowercase, numbers, and symbols on or off.',
        'The password regenerates automatically; use the visibility toggle if you want to read it.',
        'Copy it with one click and paste it straight into the signup or password-manager field.',
        'Check the built-in strength meter before you commit.'
    ],
    exampleTitle: 'What makes a password strong?',
    exampleCode: null,
    exampleIntro: 'Length beats complexity: a 16-character random password is vastly harder to crack than an 8-character one, even with symbols. Randomness matters more than cleverness — "Tr0ub4dor&3" is weaker than any 16-character random string this tool produces. For accounts you care about, use a password manager and let this tool fill it.',
    exampleAfter: null,
    faq: [
        ['Are these passwords really random?', 'Yes. The tool uses crypto.getRandomValues from the Web Crypto API — a cryptographically secure random number generator, not Math.random.'],
        ['Is the password sent anywhere?', 'No. Generation happens entirely on your device. We never see, store, or transmit generated passwords.'],
        ['Should I use all character types?', 'For most sites, yes — but some systems reject symbols or have length caps. Toggle sets off to match whatever the site allows; keep length as high as it permits.']
    ],
    relatedLabel: 'Related security tools'
};

window.TOOL_SEO['color-picker'] = {
    h1: 'Color Picker — HEX, RGB & HSL',
    intro: 'Pick a color visually and get instant HEX, RGB, and HSL values, ready to paste into CSS, design tools, or brand guidelines. Colors are the same regardless of format — these are just three ways of writing them.',
    howToTitle: 'How to pick a color and get its codes',
    howTo: [
        'Click the color swatch to open your browser\u2019s native picker, or type a value directly.',
        'The tool converts live: change HEX and the RGB/HSL values update.',
        'Copy any format with its copy button and paste into your CSS or design tool.'
    ],
    exampleTitle: 'HEX vs RGB vs HSL',
    exampleCode: '#6C5CE7  \u2192  rgb(108, 92, 231)  \u2192  hsl(248, 74%, 63%)',
    exampleIntro: 'All three notations above describe the same purple. HEX is compact and ubiquitous in CSS; RGB maps directly to screen channels; HSL (hue, saturation, lightness) is easiest for humans — want a darker variant? Just lower the L.',
    exampleAfter: null,
    faq: [
        ['Are picked colors exact across devices?', 'The values are mathematically exact, but screens render colors differently depending on display calibration and color profiles.'],
        ['Can I enter an RGB value and get HEX?', 'Yes — enter any supported format and the equivalents update live.'],
        ['Does it support alpha transparency?', 'The picker works with solid colors. For transparency use rgba()/hsla() in CSS and adjust the alpha channel manually.']
    ],
    relatedLabel: 'Related design tools'
};

window.TOOL_SEO['base64-encoder-decoder'] = {
    h1: 'Base64 Encoder & Decoder',
    intro: 'Base64 turns binary data into plain text using 64 safe characters, which is why it shows up in data URIs, email attachments, JWTs, and API payloads. Encode text to Base64 or decode Base64 back to readable text — instantly, in your browser.',
    howToTitle: 'How to encode and decode Base64',
    howTo: [
        'Paste text into the input box.',
        'Click Encode to convert it to Base64.',
        'Click Decode to convert Base64 back to the original text.',
        'Copy the result with one click.'
    ],
    exampleTitle: 'Base64 example',
    exampleCode: 'Hello, World!  \u2192  SGVsbG8sIFdvcmxkIQ==',
    exampleIntro: 'The = signs at the end are padding — Base64 output is always a multiple of 4 characters. Decoding is strict: malformed input produces an error rather than garbage.',
    exampleAfter: null,
    faq: [
        ['Is Base64 encryption?', 'No. Base64 is an encoding, not encryption — anyone can decode it instantly. Never use it to hide secrets; use proper cryptography.'],
        ['Why does Base64 make text longer?', 'It packs 3 bytes into 4 characters, so output is roughly 33% larger than the input.'],
        ['Can it handle emoji and non-English text?', 'Yes — encoding and decoding operate on UTF-8, so all Unicode text round-trips correctly.']
    ],
    relatedLabel: 'Related encoding tools'
};

window.TOOL_SEO['url-encoder-decoder'] = {
    h1: 'URL Encoder & Decoder',
    intro: 'URLs can only contain a limited set of characters — spaces, ampersands, question marks, hash symbols, and non-English letters must be percent-encoded before they can appear in a link or query string. This tool encodes text for safe use in URLs and decodes percent-encoded strings back to readable text.',
    howToTitle: 'How to encode and decode URLs',
    howTo: [
        'Paste the text or URL fragment into the input box.',
        'Click Encode to percent-encode unsafe characters (spaces become %20, etc.).',
        'Click Decode to turn percent-encoded text back into readable characters.',
        'Copy the result with one click.'
    ],
    exampleTitle: 'URL encoding example',
    exampleCode: 'hello world&more  \u2192  hello%20world%26more',
    exampleIntro: 'A space becomes %20 and & becomes %26 because & separates query parameters — without encoding, anything after an unencoded & would be treated as a new parameter. This is the difference between a link that works and one that silently truncates.',
    exampleAfter: null,
    faq: [
        ['What exactly gets encoded?', 'Characters with special meaning in URLs — spaces, &, =, ?, #, %, and non-ASCII letters — get percent-encoded so your value survives intact inside a single URL component.'],
        ['Why do I see + instead of %20 sometimes?', 'HTML form submissions historically encode spaces as +. In query strings both usually work; in path segments use %20.'],
        ['Is my data sent anywhere?', 'No. Encoding and decoding run entirely in your browser.']
    ],
    relatedLabel: 'Related encoding tools'
};

window.TOOL_SEO['lorem-ipsum-generator'] = {
    h1: 'Lorem Ipsum Generator',
    intro: 'Generate classic Lorem Ipsum placeholder text by paragraph, sentence, or word count. Placeholder text lets you judge typography, spacing, and layout without being distracted by real content — a staple of design mockups since the 1500s (the underlying text is scrambled Cicero).',
    howToTitle: 'How to generate placeholder text',
    howTo: [
        'Choose how many paragraphs you need.',
        'Click Generate to produce the placeholder text.',
        'Copy it with one click and paste into your mockup, CMS, or design file.'
    ],
    exampleTitle: 'Why not just type "text text text"?',
    exampleCode: null,
    exampleIntro: 'Lorem Ipsum has a natural-looking distribution of word lengths and sentence rhythms, so layouts filled with it expose real spacing problems — ragged edges, cramped lines, orphaned headings — that uniform filler hides.',
    exampleAfter: null,
    faq: [
        ['Is the text real Latin?', 'It\u2019s derived from Cicero\u2019s "De Finibus Bonorum et Malorum" (45 BC), scrambled into nonsense — readable-looking but deliberately meaningless.'],
        ['Can I generate a specific word count?', 'Generate paragraphs, then trim — or regenerate until the length fits your mockup.'],
        ['Is placeholder text bad for SEO?', 'On live pages, yes — placeholder text is thin content. Use it in mockups and private staging only.']
    ],
    relatedLabel: 'Related design tools'
};

window.TOOL_SEO['qr-code-generator'] = {
    h1: 'QR Code Generator',
    intro: 'Create QR codes that any modern phone camera can scan — for links, plain text, Wi-Fi details, contact info, or anything else you can type. The code is generated locally and rendered as an image you can download.',
    howToTitle: 'How to create a QR code',
    howTo: [
        'Type or paste the content — a URL, text, anything.',
        'Click Generate to render the QR code.',
        'Download the image or scan it directly from the screen to test.'
    ],
    exampleTitle: 'What fits in a QR code?',
    exampleCode: null,
    exampleIntro: 'A QR code holds up to a few thousand characters, but less is more: shorter content produces a simpler, easier-to-scan code. For URLs, consider whether a link shortener would make the code easier to scan from a distance — and always test-scan before printing.',
    exampleAfter: null,
    faq: [
        ['Do QR codes expire?', 'No. A QR code is just a picture of data — it works forever. What expires is the destination, if you encode a link that later dies.'],
        ['Can I use the generated codes commercially?', 'Yes. QR codes are generated locally with no watermark and no tracking; you own the output.'],
        ['Why won\u2019t my printed code scan?', 'Usually contrast or size: ensure dark code on a light background, at least 2\u00D72 cm for close scanning, and don\u2019t stretch the image non-uniformly.']
    ],
    relatedLabel: 'Related utility tools'
};

window.TOOL_SEO['hash-generator'] = {
    h1: 'Hash Generator — MD5, SHA-1 & SHA-256',
    intro: 'A hash function converts any text into a fixed-length fingerprint: the same input always yields the same output, and even a one-character change produces a completely different hash. This tool computes MD5, SHA-1, and SHA-256 hashes locally in your browser.',
    howToTitle: 'How to generate a hash',
    howTo: [
        'Type or paste any text into the input box.',
        'All three hashes (MD5, SHA-1, SHA-256) compute automatically as you type.',
        'Copy whichever digest you need with its copy button.'
    ],
    exampleTitle: 'The same text always hashes the same',
    exampleCode: 'hello  \u2192  2cf24dba5fb0a30e26e83b2ac5b9e29e... (SHA-256)',
    exampleIntro: 'Change one letter — "Hello" vs "hello" — and every hash changes completely. That\u2019s the property that makes hashes useful for verifying downloads, detecting duplicate content, and fingerprinting data.',
    exampleAfter: null,
    faq: [
        ['Which hash should I use?', 'SHA-256 for anything new. MD5 and SHA-1 are shown because older systems still require them, but both are cryptographically broken for security purposes — never use them to verify untrusted data.'],
        ['Can a hash be reversed?', 'Not directly — hashing is one-way. Weak passwords hashed with MD5 can be recovered via rainbow tables, which is exactly why password storage uses slower, salted algorithms like bcrypt or Argon2 instead.'],
        ['Is my text uploaded?', 'No. Hashing happens in your browser using the Web Crypto API.']
    ],
    relatedLabel: 'Related security tools'
};

window.TOOL_SEO['text-case-converter'] = {
    h1: 'Text Case Converter',
    intro: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, alternating case, and inverse case — instantly, with one click per format. Handy for headlines, constants, cleaning up accidentally-capslocked text, and formatting conventions.',
    howToTitle: 'How to convert text case',
    howTo: [
        'Paste your text into the input box.',
        'Click the button for the case you want — the conversion applies immediately.',
        'Copy the result with one click.'
    ],
    exampleTitle: 'Case conversion example',
    exampleCode: 'the quick brown fox  \u2192  The Quick Brown Fox (Title Case)',
    exampleIntro: 'Title Case capitalizes each word; Sentence case capitalizes only after sentence endings; alternating and inverse case exist for jokes, styling, and undoing accidental caps lock.',
    exampleAfter: null,
    faq: [
        ['What\u2019s the difference between Title and Sentence case?', 'Title Case: Every Word Starts Big. Sentence case: only the first letter of each sentence — generally more readable for body text.'],
        ['Does it handle accented characters?', 'Yes — conversions use Unicode case mappings, so accented letters convert correctly.'],
        ['Can I undo a conversion?', 'Inverting case twice returns the original for alternating and inverse case. For Title/Sentence conversions, keep the original text until you\u2019re happy with the result.']
    ],
    relatedLabel: 'Related writing tools'
};
