/*
 * AI Directories — Guide Registry
 * To add a new guide: append an entry here, then create <slug>.html.
 * The /guides index page renders this list automatically.
 * Fields: slug (URL), title, description, icon (Font Awesome class),
 * color (hex, used for the icon gradient), date (display string).
 */
(function (global) {
    'use strict';
    global.GUIDES_DATA = [
        {
            slug: 'best-ai-coding-tools',
            title: 'Best AI Coding Tools (2026)',
            description: 'Cursor, Copilot, Claude, Codeium and more compared by how they actually fit your workflow — plus what AI coding tools are still bad at.',
            icon: 'fa-code',
            color: '#818cf8',
            date: 'Sep 2026'
        },
        {
            slug: 'best-free-ai-image-generators',
            title: 'Best Free AI Image Generators (2026)',
            description: 'A practical comparison of Leonardo.Ai, Playground AI, Adobe Firefly, Bing Image Creator, and Craiyon — what each is best for, key limitations, and who should use which.',
            icon: 'fa-wand-magic-sparkles',
            color: '#b48c6c',
            date: 'Sep 2026'
        },
        {
            slug: 'json-vs-yaml',
            title: 'JSON vs YAML: Which Format Should You Use?',
            description: 'Where the two formats differ, what each is good at, and how to convert between them without breaking types — with real config and API examples.',
            icon: 'fa-right-left',
            color: '#818cf8',
            date: 'Sep 2026'
        },
        {
            slug: 'how-base64-encoding-works',
            title: 'How Base64 Encoding Works (and When to Use It)',
            description: 'The 64-character alphabet explained, why encoded data is 33% bigger, and the everyday uses — data URIs, JWTs, email attachments, API payloads.',
            icon: 'fa-lock',
            color: '#34d399',
            date: 'Sep 2026'
        },
        {
            slug: 'regex-testing-guide',
            title: 'How to Test Regular Expressions',
            description: 'A practical workflow: test cases first, anchors everywhere, and the four patterns that break in production — with a cheatsheet of proven patterns.',
            icon: 'fa-asterisk',
            color: '#f472b6',
            date: 'Sep 2026'
        }
    ];
})(window);
