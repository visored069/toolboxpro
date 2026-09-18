/*
 * ToolBox Pro — Centralized Tool Registry
 * Single source of truth for all developer tools.
 * Counts and related tools are GENERATED from this file — never hardcode.
 * To add a tool: add an entry here + create <slug>.html.
 */
(function (global) {
    'use strict';

    var TOOLS = [
        { id: 'json-formatter', name: 'JSON Formatter', slug: 'json-formatter', description: 'Format, validate, and beautify your JSON data instantly.', category: 'Developer', keywords: 'json format validate beautify minify', icon: 'fa-code', component: 'json-formatter.html', relatedTools: ['json-to-csv', 'json-to-yaml', 'markdown-preview'] },
        { id: 'json-to-yaml', name: 'JSON to YAML', slug: 'json-to-yaml', description: 'Convert between JSON and YAML instantly — both directions, in your browser.', category: 'Developer', keywords: 'json yaml convert transform config', icon: 'fa-right-left', component: 'json-to-yaml.html', relatedTools: ['json-formatter', 'json-to-csv', 'markdown-preview'] },
        { id: 'jwt-decoder', name: 'JWT Decoder', slug: 'jwt-decoder', description: 'Decode JWT tokens and inspect headers, payloads, and expiry dates locally.', category: 'Security', keywords: 'jwt token decode header payload expiry', icon: 'fa-id-card', component: 'jwt-decoder.html', relatedTools: ['hash-generator', 'base64-encoder-decoder', 'password-generator'] },
        { id: 'xml-formatter', name: 'XML Formatter', slug: 'xml-formatter', description: 'Format, minify, and validate XML with proper indentation.', category: 'Developer', keywords: 'xml format minify validate pretty indent', icon: 'fa-file-code', component: 'xml-formatter.html', relatedTools: ['json-formatter', 'json-to-yaml', 'css-minifier'] },
        { id: 'url-parser', name: 'URL Parser', slug: 'url-parser', description: 'Break any URL into protocol, host, path, and query parameters.', category: 'Developer', keywords: 'url parse query string parameters host path', icon: 'fa-scissors', component: 'url-parser.html', relatedTools: ['url-encoder-decoder', 'regex-tester', 'json-formatter'] },
        { id: 'html-entity-converter', name: 'HTML Entity Converter', slug: 'html-entity-converter', description: 'Escape and unescape HTML entities — convert code to safe display text.', category: 'Developer', keywords: 'html entities escape unescape encode decode ampersand', icon: 'fa-code', component: 'html-entity-converter.html', relatedTools: ['html-to-text', 'markdown-preview', 'url-encoder-decoder'] },
        { id: 'image-to-base64', name: 'Image to Base64', slug: 'image-to-base64', description: 'Convert any image to a Base64 data URI — private, in your browser.', category: 'Developer', keywords: 'image base64 data uri convert embed', icon: 'fa-image', component: 'image-to-base64.html', relatedTools: ['base64-encoder-decoder', 'qr-code-generator', 'color-picker'] },
        { id: 'word-counter', name: 'Word Counter', slug: 'word-counter', description: 'Count words, characters, sentences, and paragraphs in real time.', category: 'Writing', keywords: 'word count characters sentences paragraphs', icon: 'fa-font', component: 'word-counter.html', relatedTools: ['text-case-converter', 'text-diff-checker', 'lorem-ipsum-generator'] },
        { id: 'password-generator', name: 'Password Generator', slug: 'password-generator', description: 'Generate secure, cryptographically random passwords with strength meter.', category: 'Security', keywords: 'password generate secure random strength', icon: 'fa-key', component: 'password-generator.html', relatedTools: ['hash-generator', 'uuid-generator', 'base64-encoder-decoder'] },
        { id: 'color-picker', name: 'Color Picker', slug: 'color-picker', description: 'Pick colors and get HEX, RGB, and HSL values with palette suggestions.', category: 'Design', keywords: 'color hex rgb hsl pick palette design', icon: 'fa-palette', component: 'color-picker.html', relatedTools: ['random-number-generator', 'lorem-ipsum-generator', 'qr-code-generator'] },
        { id: 'base64-encoder-decoder', name: 'Base64 Encoder/Decoder', slug: 'base64-encoder-decoder', description: 'Encode and decode Base64 strings instantly in your browser.', category: 'Developer', keywords: 'base64 encode decode', icon: 'fa-file-code', component: 'base64-encoder-decoder.html', relatedTools: ['url-encoder-decoder', 'image-to-base64', 'hash-generator'] },
        { id: 'url-encoder-decoder', name: 'URL Encoder/Decoder', slug: 'url-encoder-decoder', description: 'Encode and decode URLs and query strings safely.', category: 'Developer', keywords: 'url encode decode percent', icon: 'fa-link', component: 'url-encoder-decoder.html', relatedTools: ['url-parser', 'base64-encoder-decoder', 'json-formatter'] },
        { id: 'lorem-ipsum-generator', name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator', description: 'Generate placeholder text (Lorem Ipsum) for designs and mockups.', category: 'Design', keywords: 'lorem ipsum placeholder text dummy', icon: 'fa-align-left', component: 'lorem-ipsum-generator.html', relatedTools: ['word-counter', 'text-case-converter', 'color-picker'] },
        { id: 'qr-code-generator', name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create QR codes for URLs, text, and Wi-Fi with custom colors.', category: 'Utility', keywords: 'qr code generate scan', icon: 'fa-qrcode', component: 'qr-code-generator.html', relatedTools: ['random-number-generator', 'color-picker', 'uuid-generator'] },
        { id: 'hash-generator', name: 'Hash Generator', slug: 'hash-generator', description: 'Generate MD5, SHA-1, and SHA-256 hashes from any text.', category: 'Security', keywords: 'hash md5 sha1 sha256', icon: 'fa-fingerprint', component: 'hash-generator.html', relatedTools: ['password-generator', 'base64-encoder-decoder', 'uuid-generator'] },
        { id: 'text-case-converter', name: 'Text Case Converter', slug: 'text-case-converter', description: 'Convert text between UPPERCASE, lowercase, Title Case, and Sentence case.', category: 'Writing', keywords: 'text case upper lower title sentence', icon: 'fa-font', component: 'text-case-converter.html', relatedTools: ['word-counter', 'text-diff-checker', 'lorem-ipsum-generator'] },
        { id: 'uuid-generator', name: 'UUID Generator', slug: 'uuid-generator', description: 'Generate random v4 UUIDs instantly with one click copy.', category: 'Developer', keywords: 'uuid guid generate unique identifier', icon: 'fa-dna', component: 'uuid-generator.html', relatedTools: ['hash-generator', 'random-number-generator', 'password-generator'] },
        { id: 'json-to-csv', name: 'JSON to CSV', slug: 'json-to-csv', description: 'Convert JSON arrays to CSV format for spreadsheets instantly.', category: 'Developer', keywords: 'json csv convert export spreadsheet', icon: 'fa-table', component: 'json-to-csv.html', relatedTools: ['json-formatter', 'json-to-yaml', 'markdown-preview'] },
        { id: 'regex-tester', name: 'Regex Tester', slug: 'regex-tester', description: 'Test regular expressions against sample text with match highlighting.', category: 'Developer', keywords: 'regex regular expression pattern match test', icon: 'fa-asterisk', component: 'regex-tester.html', relatedTools: ['json-formatter', 'text-diff-checker', 'url-encoder-decoder'] },
        { id: 'markdown-preview', name: 'Markdown Preview', slug: 'markdown-preview', description: 'Write Markdown and see the rendered preview side by side.', category: 'Developer', keywords: 'markdown md preview editor render', icon: 'fa-markdown', component: 'markdown-preview.html', relatedTools: ['json-formatter', 'json-to-csv', 'word-counter'] },
        { id: 'css-minifier', name: 'CSS Minifier', slug: 'css-minifier', description: 'Compress and beautify CSS with size-savings stats.', category: 'Developer', keywords: 'css minify compress beautify format stylesheet', icon: 'fa-wind', component: 'css-minifier.html', relatedTools: ['json-formatter', 'markdown-preview', 'color-picker'] },
        { id: 'timestamp-converter', name: 'Timestamp Converter', slug: 'timestamp-converter', description: 'Convert Unix timestamps to human dates and back, live as you type.', category: 'Developer', keywords: 'timestamp unix date time convert epoch', icon: 'fa-clock', component: 'timestamp-converter.html', relatedTools: ['random-number-generator', 'json-to-csv', 'uuid-generator'] },
        { id: 'ip-lookup', name: 'IP Lookup', slug: 'ip-lookup', description: 'Look up any public IP address — location, ISP, and timezone.', category: 'Utility', keywords: 'ip address lookup location geolocation', icon: 'fa-globe', component: 'ip-lookup.html', relatedTools: ['random-number-generator', 'uuid-generator', 'timestamp-converter'] },
        { id: 'random-number-generator', name: 'Random Number Generator', slug: 'random-number-generator', description: 'Generate random numbers in any range, decimals or integers, dice mode.', category: 'Utility', keywords: 'random number integer decimal dice', icon: 'fa-dice', component: 'random-number-generator.html', relatedTools: ['uuid-generator', 'password-generator', 'qr-code-generator'] },
        { id: 'html-to-text', name: 'HTML to Text', slug: 'html-to-text', description: 'Strip HTML tags and extract clean plain text from markup.', category: 'Developer', keywords: 'html strip tags text extract convert', icon: 'fa-eraser', component: 'html-to-text.html', relatedTools: ['html-entity-converter', 'markdown-preview', 'word-counter'] },
        { id: 'text-diff-checker', name: 'Text Diff Checker', slug: 'text-diff-checker', description: 'Compare two texts and highlight added/removed lines.', category: 'Writing', keywords: 'text diff compare difference highlight', icon: 'fa-code-compare', component: 'text-diff-checker.html', relatedTools: ['word-counter', 'markdown-preview', 'regex-tester'] }
    ];

    function escapeHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    var REGISTRY = {
        tools: TOOLS,
        categories: function () {
            var seen = {}, out = [];
            TOOLS.forEach(function (t) { if (!seen[t.category]) { seen[t.category] = 1; out.push(t.category); } });
            return out;
        },
        count: function () { return TOOLS.length; },
        byCategory: function (cat) { return TOOLS.filter(function (t) { return t.category === cat; }); },
        bySlug: function (slug) {
            for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].slug === slug) return TOOLS[i];
            return null;
        },
        related: function (slug) {
            var tool = REGISTRY.bySlug(slug);
            if (!tool) return [];
            return (tool.relatedTools || []).map(REGISTRY.bySlug).filter(Boolean);
        },
        categoryCounts: function () {
            var counts = {};
            TOOLS.forEach(function (t) { counts[t.category] = (counts[t.category] || 0) + 1; });
            return counts;
        },
        renderToolFooter: function (slug) {
            var tool = REGISTRY.bySlug(slug);
            if (!tool) return;
            var main = document.getElementById('main-content');
            if (!main || document.getElementById('registry-footer')) return;
            // Related tools are rendered statically by inject-seo-content.js;
            // only the note bar is injected here to avoid duplicate sections.
            var html = '<div id="registry-footer"><p class="registry-note">' + TOOLS.length + ' free tools &middot; Everything runs in your browser</p></div>';
            main.insertAdjacentHTML('beforeend', html);
        },
        renderFooterCounts: function () {
            var el = document.getElementById('footer-tools-count');
            if (el) el.textContent = TOOLS.length + '+ tools';
        },
        // --- Favorites & Recently Used (localStorage stores slugs only, never user input) ---
        favKey: 'toolboxpro-favorites',
        recentKey: 'toolboxpro-recent-tools',
        _read: function (key) {
            try {
                var raw = localStorage.getItem(key);
                var arr = raw ? JSON.parse(raw) : [];
                var reg = REGISTRY;
                return Array.isArray(arr) ? arr.filter(function (s) { return reg.bySlug(s); }) : [];
            } catch (e) { return []; }
        },
        _write: function (key, arr) {
            try { localStorage.setItem(key, JSON.stringify(arr.slice(0, key === this.recentKey ? 8 : 50))); } catch (e) {}
        },
        getFavorites: function () { return this._read(this.favKey); },
        isFavorite: function (slug) { return this.getFavorites().indexOf(slug) !== -1; },
        toggleFavorite: function (slug) {
            if (!REGISTRY.bySlug(slug)) return false;
            var favs = this.getFavorites();
            var i = favs.indexOf(slug);
            if (i === -1) favs.unshift(slug); else favs.splice(i, 1);
            this._write(this.favKey, favs);
            return i === -1;
        },
        getRecent: function () { return this._read(this.recentKey); },
        recordUse: function (slug) {
            if (!REGISTRY.bySlug(slug)) return;
            var rec = this.getRecent().filter(function (s) { return s !== slug; });
            rec.unshift(slug);
            this._write(this.recentKey, rec);
        },
        renderSharedFooter: function () {
            // Normalize minimal tool-page footers to the full site footer
            var footer = document.querySelector('footer');
            if (!footer || footer.querySelector('.footer-content')) return;
            var credit = footer.querySelector('.footer-bottom');
            var html = '<div class="footer-content">' +
                '<div><div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">' +
                '<div style="width:35px;height:35px;background:var(--gradient-1);border-radius:8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-toolbox" style="color:white;" aria-hidden="true"></i></div>' +
                '<span style="font-weight:700;font-size:1.1rem;">ToolBox Pro</span></div>' +
                '<p style="color:var(--text-secondary);font-size:0.85rem;">Free online developer tools for everyone.</p></div>' +
                '<div><h4>Quick Links</h4><ul><li><a href="/">Home</a></li><li><a href="ai-tools">AI Tools Directory</a></li><li><a href="guides">Guides</a></li><li><a href="about">About Us</a></li><li><a href="contact">Contact</a></li></ul></div>' +
                '<div><h4>Popular Tools</h4><ul><li><a href="json-formatter">JSON Formatter</a></li><li><a href="password-generator">Password Generator</a></li><li><a href="qr-code-generator">QR Code Generator</a></li><li><a href="word-counter">Word Counter</a></li></ul></div>' +
                '<div><h4>Legal</h4><ul><li><a href="privacy">Privacy Policy</a></li><li><a href="terms">Terms of Service</a></li></ul></div>' +
                '<div><h4>Connect</h4><div class="social-links"><a href="#" aria-label="Twitter"><i class="fab fa-twitter" aria-hidden="true"></i></a><a href="#" aria-label="GitHub"><i class="fab fa-github" aria-hidden="true"></i></a><a href="#" aria-label="Discord"><i class="fab fa-discord" aria-hidden="true"></i></a></div></div>' +
                '</div>';
            footer.insertAdjacentHTML('afterbegin', html);
            if (credit) {
                credit.insertAdjacentHTML('beforeend', '<p id="footer-tools-count" style="margin-top:6px;"></p>');
                REGISTRY.renderFooterCounts();
            }
        },
        updateGridCounts: function () {
            document.querySelectorAll('.filter-tab').forEach(function (tab) {
                var cat = tab.getAttribute('data-category');
                var n = cat === 'all' ? TOOLS.length : REGISTRY.byCategory(cat).length;
                var el = tab.querySelector('.tab-count');
                if (el) el.textContent = n;
            });
        }
    };

    global.ToolRegistry = REGISTRY;
})(window);
