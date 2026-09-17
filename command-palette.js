/*
 * ToolBox Pro — Command Palette (Ctrl/Cmd + K)
 * Instant tool search, arrow navigation, Enter to open, Escape to close.
 * Surfaces Recently Used + Favorites (localStorage, slugs only).
 */
(function () {
    'use strict';

    var backdrop, input, list, isOpen = false, items = [], selected = 0;

    function ensureDom() {
        if (backdrop) return;
        backdrop = document.createElement('div');
        backdrop.className = 'cmdk-backdrop';
        backdrop.id = 'cmdk-backdrop';
        backdrop.innerHTML =
            '<div class="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">' +
            '<div class="cmdk-input-row"><i class="fas fa-magnifying-glass"></i>' +
            '<input class="cmdk-input" id="cmdk-input" type="text" placeholder="Search tools... (name, keyword, category)" aria-label="Search tools" autocomplete="off">' +
            '<span class="cmdk-esc">esc</span></div>' +
            '<div class="cmdk-list" id="cmdk-list" role="listbox" aria-label="Tools"></div>' +
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

    function go(slug) {
        if (window.ToolRegistry) ToolRegistry.recordUse(slug);
        window.location.href = slug;
    }

    function matchScore(t, q) {
        if (!q) return 1;
        var name = t.name.toLowerCase(), kw = t.keywords.toLowerCase(), cat = t.category.toLowerCase(), desc = t.description.toLowerCase();
        if (name.indexOf(q) === 0) return 100;
        if (name.indexOf(q) !== -1) return 80;
        if (kw.indexOf(q) !== -1) return 60;
        if (cat.indexOf(q) !== -1) return 40;
        if (desc.indexOf(q) !== -1) return 20;
        return 0;
    }

    function render() {
        if (!window.ToolRegistry) { list.innerHTML = '<div class="cmdk-empty">Registry not loaded</div>'; return; }
        var q = input.value.toLowerCase().trim();
        var favs = ToolRegistry.getFavorites();
        var rec = ToolRegistry.getRecent();
        items = [];

        function push(slug, group) {
            var t = ToolRegistry.bySlug(slug);
            if (!t) return;
            var s = matchScore(t, q);
            if (s > 0 || !q) items.push({ t: t, group: group, score: s });
        }

        if (!q) {
            rec.forEach(function (s) { push(s, 'Recently Used'); });
            favs.forEach(function (s) { if (rec.indexOf(s) === -1) push(s, 'Favorites'); });
            ToolRegistry.tools.forEach(function (t) { push(t.slug, 'All Tools'); });
        } else {
            ToolRegistry.tools.forEach(function (t) { push(t.slug, 'Results'); });
            items.sort(function (a, b) { return b.score - a.score; });
        }

        // de-dupe
        var seen = {};
        items = items.filter(function (it) {
            if (seen[it.t.slug]) return false;
            seen[it.t.slug] = 1;
            return true;
        }).slice(0, 24);

        if (!items.length) {
            list.innerHTML = '<div class="cmdk-empty">No tools match "' + q.replace(/</g, '&lt;') + '"</div>';
            return;
        }
        selected = 0;
        var html = '', lastGroup = null;
        items.forEach(function (it, i) {
            if (it.group !== lastGroup) {
                html += '<div class="cmdk-group-label">' + it.group + '</div>';
                lastGroup = it.group;
            }
            html += '<div class="cmdk-item' + (i === 0 ? ' selected' : '') + '" data-slug="' + it.t.slug + '" role="option" aria-selected="' + (i === 0) + '">' +
                '<i class="fas ' + it.t.icon + ' cmdk-icon"></i>' +
                '<span><span class="cmdk-name">' + it.t.name + '</span><br><span class="cmdk-desc">' + it.t.description + '</span></span>' +
                '<span class="cmdk-cat">' + it.t.category + '</span></div>';
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
        // Open: Ctrl/Cmd+K anywhere (overrides old search-focus behavior)
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

    // "/" opens the palette when not typing in a field (progressive upgrade)
    document.addEventListener('keydown', function (e) {
        if (e.key !== '/' || isOpen) return;
        var el = document.activeElement;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
        e.preventDefault();
        open();
    });

    window.ToolBoxPalette = { open: open, close: close };
})();
