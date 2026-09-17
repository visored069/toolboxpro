/*
 * ToolBox Pro — Guide Registry
 * To add a new guide: append an entry here, then create <slug>.html.
 * The /guides index page renders this list automatically.
 * Fields: slug (URL), title, description, icon (Font Awesome class),
 * color (hex, used for the icon gradient), date (display string).
 */
(function (global) {
    'use strict';
    global.GUIDES_DATA = [
        {
            slug: 'best-free-ai-image-generators',
            title: 'Best Free AI Image Generators (2026)',
            description: 'A practical comparison of Leonardo.Ai, Playground AI, Adobe Firefly, Bing Image Creator, and Craiyon — what each is best for, key limitations, and who should use which.',
            icon: 'fa-wand-magic-sparkles',
            color: '#b48c6c',
            date: 'Sep 2026'
        }
    ];
})(window);
