/*
 * AI Directories — site-wide smooth scrolling (Lenis).
 * Loaded on every page. No-ops safely if the CDN lib fails,
 * and skips entirely for prefers-reduced-motion users.
 * Adopts an existing Lenis instance (pages with their own init)
 * instead of creating a second one.
 */
(function () {
    'use strict';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof Lenis === 'undefined') return;

    if (!window.__lenis) {
        window.__lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            smoothWheel: true
        });
        function raf(time) { window.__lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    // Keep GSAP ScrollTrigger in sync with smooth scrolling where GSAP is present.
    if (window.ScrollTrigger && window.__lenis) {
        try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* already registered */ }
        window.__lenis.on('scroll', ScrollTrigger.update);
    }
})();
