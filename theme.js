/*
 * AI Directories — shared theme toggle for pages without components.js.
 * Applies html.light + persists to the site-wide 'toolboxpro-theme' key.
 * Initial application happens in <head> (no-flash); this only wires the button.
 */
(function () {
    'use strict';
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function syncIcon() {
        var icon = btn.querySelector('i');
        if (!icon) return;
        var isLight = document.documentElement.classList.contains('light');
        icon.classList.toggle('fa-sun', !isLight);
        icon.classList.toggle('fa-moon', isLight);
    }

    syncIcon();
    btn.addEventListener('click', function () {
        document.documentElement.classList.toggle('light');
        try {
            localStorage.setItem('toolboxpro-theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
        } catch (e) { /* storage unavailable */ }
        syncIcon();
    });
})();
