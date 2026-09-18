/*
 * AI Directories — Command Palette (Ctrl/Cmd + K or "/")
 * Unified site search: AI tools, AI categories, developer tools, guides & pages.
 * Arrow navigation, Enter to open, Escape to close.
 * Keys: dev tools use their slug directly; AI items use "ai:<slug>";
 *       categories "ai-cat:<slug>"; static pages "page:<path>".
 * Favorites/recents persist via the respective registries (localStorage, slugs only).
 */
(function () {
    'use strict';

    var backdrop, input, list, isOpen = false, items = [], selected = 0;

    var STATIC_ITEMS = [
        { key: 'page:/ai-tools/', name: 'AI Tools Directory', desc: 'Browse all curated AI tools', icon: 'fa-compass', cat: 'Page' },
        { key: 'page:/developer-tools/', name: 'Developer Tools', desc: '26 free browser-based utilities', icon: 'fa-code', cat: 'Page' },
        { key: 'page:/guides', name: 'Guides', desc: 'AI & developer guides', icon: 'fa-book-open', cat: 'Page' },
        { key: 'page:/about', name: 'About', desc: 'About AI Directories', icon: 'fa-circle-info', cat: 'Page' },
        { key: 'page:/contact', name: 'Contact', desc: 'Get in touch', icon: 'fa-envelope', cat: 'Page' }
    ];

    function ensureDom() {
        if (backdrop) return;
        backdrop = document.createElement('div');
        backdrop.className = 'cmdk-backdrop';
        backdrop.id = 'cmdk-backdrop';
        backdrop.innerHTML =
            '<div class="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">' +
            '<div class="cmdk-input-row"><i class="fas fa-magnifying-glass"></i>' +
            '<input class="cmdk-input" id="cmdk-input" type="text" placeholder="Search AI tools, developer tools, guides..." aria-label="Search site" autocomplete="off">' +
            '<span class="cmdk-esc">esc</span></div>' +
            '<div class="cmdk-list" id="cmdk-list" role="listbox" aria-label="Results"></div>' +
            '<div class="cmdk-footer"><span><b>\u2191\u2193</b> navigate</span><span><b>Enter</b> open</span><span><b>Esc</b> close</span></div>' +
            '</div>';
        document.body.appendChild(backdrop);
        input = document.getElementById('cmdk-input');
        list = document.getElementById('cmdk-list');

        backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) close(); });
        input.addEventListener('input', render);
        list.addEventListener('click', function (e) {
            var item = e.target.closest('.cmdk-item');
            if (item) go(item.getAttribute('data-slug'));
        });
    }

    function go(key) {
        if (key.indexOf('ai:') === 0) {
            if (window.AIRegistry) AIRegistry.recordView(key.slice(3));
            window.location.href = '/ai-tools/' + key.slice(3) + '/';
            return;
        }
        if (key.indexOf('ai-cat:') === 0) {
            window.location.href = '/ai-tools/' + key.slice(7) + '/';
            return;
        }
        if (key.indexOf('page:') === 0) {
            window.location.href = key.slice(5);
            return;
        }
        if (window.ToolRegistry) ToolRegistry.recordUse(key);
        window.location.href = key;
    }

    function score(text, q) {
        text = (text || '').toLowerCase();
        if (text.indexOf(q) === 0) return 100;
        if (text.indexOf(q) !== -1) return 60;
        return 0;
    }

    function render() {
        if (!window.ToolRegistry) { list.innerHTML = '<div class="cmdk-empty">Loading…</div>'; return; }
        var q = input.value.toLowerCase().trim();
        items = [];

        if (!q) {
            // recents + favorites (dev tools), then featured AI tools, then pages
            if (window.ToolRegistry) {
                ToolRegistry.getRecent().forEach(function (t) { items.push({ key: t.slug, name: t.name, desc: t.description, icon: t.icon, cat: t.category, group: 'Recently Used' }); });
                ToolRegistry.getFavorites().forEach(function (t) { items.push({ key: t.slug, name: t.name, desc: t.description, icon: t.icon, cat: t.category, group: 'Favorites' }); });
            }
            if (window.AIRegistry) {
                AIRegistry.featuredTools().forEach(function (t) { items.push({ key: 'ai:' + t.slug, name: t.name, desc: t.desc, icon: t.icon, cat: t.category, group: 'Featured AI Tools' }); });
            }
            STATIC_ITEMS.forEach(function (p) { items.push({ key: p.key, name: p.name, desc: p.desc, icon: p.icon, cat: p.cat, group: 'Explore' }); });
            if (window.ToolRegistry) {
                ToolRegistry.tools.slice(0, 8).forEach(function (t) { items.push({ key: t.slug, name: t.name, desc: t.description, icon: t.icon, cat: t.category, group: 'Developer Tools' }); });
            }
        } else {
            var ai = [];
            if (window.AIRegistry) {
                AIRegistry.tools.forEach(function (t) {
                    var s = Math.max(score(t.name, q), score(t.category, q) * 0.7, score(t.desc, q) * 0.5, score(t.company, q) * 0.8);
                    if (s > 0) ai.push({ key: 'ai:' + t.slug, name: t.name, desc: t.desc, icon: t.icon, cat: t.category, group: 'AI Tools', sc: s });
                });
                AIRegistry.categoryList().forEach(function (c) {
                    var s = score(c.name, q);
                    if (s > 0) ai.push({ key: 'ai-cat:' + c.slug, name: c.name, desc: c.count + ' curated tools', icon: c.icon, cat: 'Category', group: 'AI Categories', sc: s * 0.9 });
                });
            }
            ai.sort(function (a, b) { return b.sc - a.sc; });
            items = items.concat(ai.slice(0, 12));

            if (window.ToolRegistry) {
                var dev = [];
                ToolRegistry.tools.forEach(function (t) {
                    var s = Math.max(score(t.name, q), score(t.category, q) * 0.7, score(t.keywords || '', q) * 0.6, score(t.description, q) * 0.4);
                    if (s > 0) dev.push({ key: t.slug, name: t.name, desc: t.description, icon: t.icon, cat: t.category, group: 'Developer Tools', sc: s });
                });
                dev.sort(function (a, b) { return b.sc - a.sc; });
                items = items.concat(dev.slice(0, 10));
            }

            STATIC_ITEMS.forEach(function (p) {
                var s = Math.max(score(p.name, q), score(p.desc, q) * 0.5);
                if (s > 0) items.push({ key: p.key, name: p.name, desc: p.desc, icon: p.icon, cat: p.cat, group: 'Pages', sc: s });
            });
        }

        // de-dupe by key
        var seen = {};
        items = items.filter(function (it) {
            if (seen[it.key]) return false;
            seen[it.key] = 1;
            return true;
        }).slice(0, 28);

        if (!items.length) {
            list.innerHTML = '<div class="cmdk-empty">Nothing matches "' + q.replace(/</g, '&lt;') + '"</div>';
            return;
        }
        selected = 0;
        var html = '', lastGroup = null;
        items.forEach(function (it, i) {
            if (it.group !== lastGroup) {
                html += '<div class="cmdk-group-label">' + it.group + '</div>';
                lastGroup = it.group;
            }
            html += '<div class="cmdk-item' + (i === 0 ? ' selected' : '') + '" data-slug="' + it.key + '" role="option" aria-selected="' + (i === 0) + '">' +
                '<i class="fas ' + it.icon + ' cmdk-icon"></i>' +
                '<span><span class="cmdk-name">' + it.name + '</span><br><span class="cmdk-desc">' + it.desc + '</span></span>' +
                '<span class="cmdk-cat">' + it.cat + '</span></div>';
        });
        list.innerHTML = html;
    }

    function move(dir) {
        var els = list.querySelectorAll('.cmdk-item');
        if (!els.length) return;
        els[selected].classList.remove('selected');
        els[selected].setAttribute('aria-selected', 'false');
        selected = (selected + dir + els.length) % els.length;
        els[selected].classList.add('selected');
        els[selected].setAttribute('aria-selected', 'true');
        els[selected].scrollIntoView({ block: 'nearest' });
    }

    function open() {
        ensureDom();
        isOpen = true;
        backdrop.classList.add('open');
        input.value = '';
        render();
        setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
        if (!backdrop) return;
        isOpen = false;
        backdrop.classList.remove('open');
    }

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (isOpen) close(); else open();
            return;
        }
        if (!isOpen) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Enter') {
            e.preventDefault();
            var sel = list.querySelector('.cmdk-item.selected');
            if (sel) go(sel.getAttribute('data-slug'));
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key !== '/' || isOpen) return;
        var el = document.activeElement;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
        e.preventDefault();
        open();
    });

    window.ToolBoxPalette = { open: open, close: close };
})();
