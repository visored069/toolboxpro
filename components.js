// ===== ToolBox Pro -- Cinematic Components v4 =====

// Homepage-only ambient effects: tool pages stay lightweight (INP/LCP budget)
var IS_HOMEPAGE = !!(document.getElementById('typewriter-text') || document.getElementById('tools-grid'));

// --- Canvas Particle Field (60fps, spring physics) ---
function initParticleCanvas() {
    if (!IS_HOMEPAGE) return;
    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H;
    var particles = [];
    var mouseX = -1000, mouseY = -1000;
    var dpr = window.devicePixelRatio || 1;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Particle class with spring physics
    function Particle() {
        this.reset(true);
    }
    Particle.prototype.reset = function(init) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 10;
        this.size = 0.5 + Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = -(0.05 + Math.random() * 0.2);
        this.opacity = 0.1 + Math.random() * 0.5;
        this.targetOpacity = this.opacity;
        this.twinkleSpeed = 0.005 + Math.random() * 0.015;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.hue = Math.random() > 0.85 ? 38 : Math.random() > 0.6 ? 260 : 230; // amber, violet, or indigo
        this.saturation = this.hue === 38 ? 70 : 65;
        this.lightness = this.hue === 38 ? 60 : 68;
        // Spring follow for mouse interaction
        this.springX = 0;
        this.springY = 0;
    };
    Particle.prototype.update = function(time) {
        this.x += this.speedX;
        this.y += this.speedY;
        // Twinkle
        this.opacity = this.targetOpacity * (0.6 + 0.4 * Math.sin(time * this.twinkleSpeed + this.twinklePhase));
        // Mouse repulsion (subtle)
        if (mouseX > 0) {
            var dx = this.x - mouseX;
            var dy = this.y - mouseY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                var force = (150 - dist) / 150;
                this.springX += (dx / dist) * force * 0.3;
                this.springY += (dy / dist) * force * 0.3;
            }
        }
        // Spring decay
        this.springX *= 0.92;
        this.springY *= 0.92;
        this.x += this.springX;
        this.y += this.springY;
        // Reset if off screen
        if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
    };
    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + this.hue + ',' + this.saturation + '%,' + this.lightness + '%,' + this.opacity + ')';
        ctx.fill();
        // Glow for larger particles
        if (this.size > 1.2) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = 'hsla(' + this.hue + ',' + this.saturation + '%,' + this.lightness + '%,' + (this.opacity * 0.08) + ')';
            ctx.fill();
        }
    };

    // Create particles
    var count = Math.min(80, Math.floor(W * H / 15000));
    for (var i = 0; i < count; i++) particles.push(new Particle());

    // Track mouse
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });
    document.addEventListener('mouseleave', function() { mouseX = -1000; mouseY = -1000; });

    // Animation loop
    var running = true;
    function animate(time) {
        if (!running) return;
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < particles.length; i++) {
            particles[i].update(time);
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Pause when hidden
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) { running = false; } else { running = true; requestAnimationFrame(animate); }
    });
}

// --- Toast ---
function showToast(message) {
    message = message || '[check] Copied to clipboard!';
    var toast = document.getElementById('copy-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copy-toast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2200);
}
function copyText(text) { navigator.clipboard.writeText(text).then(function() { showToast(); }); }
function copyElement(id) { var el = document.getElementById(id); if (el) copyText(el.textContent); }

// --- Theme Toggle ---
function initTheme() {
    var saved = localStorage.getItem('toolboxpro-theme');
    if (saved === 'light') { document.documentElement.classList.add('light'); }
    else if (saved === 'dark') { document.documentElement.classList.remove('light'); }
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) { document.documentElement.classList.add('light'); }
    updateThemeIcon();
}
function toggleTheme() {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('toolboxpro-theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
    updateThemeIcon();
}
function updateThemeIcon() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isLight = document.documentElement.classList.contains('light');
    btn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// --- Active Nav ---
function setActiveNav(page) {
    document.querySelectorAll('nav a').forEach(function(a) { a.classList.remove('active'); });
    var navEl = document.getElementById('nav-' + page);
    if (navEl) navEl.classList.add('active');
}

// --- FAQ Toggle ---
function toggleFaq(button) {
    var answer = button.nextElementSibling;
    var icon = button.querySelector('i');
    var isOpen = answer.style.display === 'block';
    document.querySelectorAll('.faq-answer').forEach(function(a) { a.style.display = 'none'; });
    document.querySelectorAll('.faq-item').forEach(function(item) { item.classList.remove('open'); });
    document.querySelectorAll('.faq-item button').forEach(function(b) { b.setAttribute('aria-expanded', 'false'); });
    document.querySelectorAll('.faq-item button i').forEach(function(i) { i.style.transform = 'rotate(0deg)'; });
    if (!isOpen) {
        answer.style.display = 'block';
        button.setAttribute('aria-expanded', 'true');
        button.closest('.faq-item').classList.add('open');
        if (icon) icon.style.transform = 'rotate(180deg)';
    }
}

// --- Search & Filter ---
function initSearch() {
    var searchInput = document.getElementById('tool-search');
    var clearBtn = document.getElementById('search-clear');
    var searchContainer = document.getElementById('search-container');
    if (!searchInput) return;
    // Safety net: never show the empty state on a fresh load with no query
    var noResults = document.getElementById('no-results');
    var countEl = document.getElementById('search-count');
    if (noResults) noResults.style.display = 'none';
    if (countEl) countEl.style.display = 'none';
    searchInput.addEventListener('focus', function() { if (searchContainer) searchContainer.classList.add('focused', 'expanded'); });
    searchInput.addEventListener('blur', function() { if (searchContainer) searchContainer.classList.remove('focused', 'expanded'); });
    searchInput.addEventListener('input', function() {
        var query = this.value.toLowerCase().trim();
        if (clearBtn) clearBtn.classList.toggle('visible', query.length > 0);
        filterTools(query, getActiveCategory());
        if (query.length >= 2) recordRecentSearch(query); else renderRecentSearches();
    });
    searchInput.addEventListener('focus', function() {
        renderRecentSearches();
    });
}
function clearSearch() {
    var searchInput = document.getElementById('tool-search');
    if (searchInput) { searchInput.value = ''; searchInput.dispatchEvent(new Event('input')); searchInput.focus(); }
}
function getActiveCategory() {
    var active = document.querySelector('.filter-tab.active');
    return active ? active.getAttribute('data-category') : 'all';
}
function filterTools(query, category) {
    // Scope to the main grid — dynamic sections (Favorites/Recent) must not be filtered
    var cards = document.querySelectorAll('.tools-grid .tool-card');
    var visible = 0;
    var firstMatch = null;
    cards.forEach(function(card) {
        var name = (card.getAttribute('data-name') || '').toLowerCase();
        var tags = (card.getAttribute('data-tags') || '').toLowerCase();
        var desc = (card.getAttribute('data-desc') || '').toLowerCase();
        var cardCategory = card.getAttribute('data-category') || '';
        var matchesSearch = !query || name.indexOf(query) !== -1 || tags.indexOf(query) !== -1 || desc.indexOf(query) !== -1;
        var matchesCategory = category === 'all' || cardCategory === category;
        if (matchesSearch && matchesCategory) {
            card.classList.remove('hidden');
            card.style.transitionDelay = (visible * 0.04) + 's';
            if (!card.classList.contains('reveal')) card.classList.add('reveal');
            if (query && !firstMatch) firstMatch = card;
            visible++;
        } else {
            card.classList.add('hidden');
            card.classList.remove('reveal');
            card.style.transitionDelay = '0s';
        }
    });
    // Highlight matched text on visible cards (names + descriptions)
    highlightMatches(query);
    var countEl = document.getElementById('search-count');
    var noResults = document.getElementById('no-results');
    if (countEl) {
        if (query || category !== 'all') {
            var total = (window.ToolRegistry ? ToolRegistry.count() : cards.length);
            countEl.innerHTML = 'Showing <strong>' + visible + '</strong> of ' + total + ' tools';
            countEl.style.display = 'block';
        }
        else { countEl.style.display = 'none'; }
    }
    if (noResults) {
        if (visible === 0) {
            buildEmptyState(query, category);
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
}

// --- Search Match Highlighting ---
function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function highlightMatches(query) {
    var cards = document.querySelectorAll('.tools-grid .tool-card');
    cards.forEach(function(card) {
        var h3 = card.querySelector('h3');
        var p = card.querySelector('p');
        [h3, p].forEach(function(el) {
            if (!el) return;
            var original = el.getAttribute('data-original');
            if (original === null) {
                original = el.innerHTML;
                el.setAttribute('data-original', original);
            }
            if (!query || card.classList.contains('hidden')) { el.innerHTML = original; return; }
            var re;
            try { re = new RegExp('(' + escapeRegExp(query) + ')', 'ig'); } catch (e) { el.innerHTML = original; return; }
            el.innerHTML = original.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(re, '<mark class="hl">$1</mark>');
        });
    });
}
function setCategory(cat) {
    document.querySelectorAll('.filter-tab').forEach(function(tab) {
        var isActive = tab.getAttribute('data-category') === cat;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    var searchInput = document.getElementById('tool-search');
    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    filterTools(query, cat);
    if (query) recordRecentSearch(query);
}

// --- Recent Searches (session-only, in-memory) ---
var recentSearches = [];
var RECENT_MAX = 5;
var POPULAR_TERMS = ['json', 'password', 'qr code', 'color', 'markdown', 'regex'];
function recordRecentSearch(term) {
    if (!term || term.length < 2) return;
    recentSearches = recentSearches.filter(function(t) { return t !== term; });
    recentSearches.unshift(term);
    if (recentSearches.length > RECENT_MAX) recentSearches.length = RECENT_MAX;
    renderRecentSearches();
}
function renderRecentSearches() {
    var wrap = document.getElementById('recent-searches');
    var chips = document.getElementById('recent-chips');
    if (!wrap || !chips) return;
    if (!recentSearches.length) { wrap.classList.remove('show'); chips.innerHTML = ''; return; }
    chips.innerHTML = recentSearches.map(function(term) {
        return '<button class="recent-chip" data-term="' + escapeHtml(term) + '"><i class="fas fa-clock-rotate-left"></i> ' + escapeHtml(term) + '</button>';
    }).join('');
    chips.querySelectorAll('.recent-chip').forEach(function(btn) {
        btn.addEventListener('click', function() { fillSearch(btn.getAttribute('data-term')); });
    });
    var active = getActiveCategory();
    var searchInput = document.getElementById('tool-search');
    var hasQuery = searchInput && searchInput.value.trim().length > 0;
    var show = !hasQuery && active === 'all';
    wrap.classList.toggle('show', show);
}
function clearAllRecentSearches() {
    recentSearches = [];
    renderRecentSearches();
}
function fillSearch(term) {
    var searchInput = document.getElementById('tool-search');
    if (!searchInput) return;
    searchInput.value = term;
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
}

// --- Empty State (no results) ---
function buildEmptyState(query, category) {
    var qEl = document.getElementById('no-results-q');
    var titleEl = document.getElementById('no-results-title');
    var msgEl = document.getElementById('no-results-msg');
    var sugWrap = document.getElementById('no-results-suggestions');
    var sugChips = document.getElementById('suggestion-chips');
    if (qEl) qEl.textContent = query ? '"' + query + '"' : '';
    if (titleEl) titleEl.textContent = query ? 'No matches for "' + query + '"' : 'Nothing in ' + category;
    if (msgEl) {
        if (query && category !== 'all') msgEl.textContent = 'No ' + category.toLowerCase() + ' tools match that search. Try another term or clear the category filter.';
        else if (query) msgEl.textContent = 'Check the spelling, or try one of these popular searches instead.';
        else msgEl.textContent = 'Try a different category, or reset to browse all 20 tools.';
    }
    if (sugWrap && sugChips) {
        if (query) {
            sugWrap.classList.add('show');
            sugChips.innerHTML = POPULAR_TERMS.map(function(term) {
                return '<button class="suggestion-chip" data-term="' + escapeHtml(term) + '">' + escapeHtml(term) + '</button>';
            }).join('');
            sugChips.querySelectorAll('.suggestion-chip').forEach(function(btn) {
                btn.addEventListener('click', function() { fillSearch(btn.getAttribute('data-term')); });
            });
        } else {
            sugWrap.classList.remove('show');
            sugChips.innerHTML = '';
        }
    }
}
function resetAllFilters() {
    var searchInput = document.getElementById('tool-search');
    if (searchInput) searchInput.value = '';
    setCategory('all');
    var countEl = document.getElementById('search-count');
    if (countEl) countEl.style.display = 'none';
    var noResults = document.getElementById('no-results');
    if (noResults) noResults.style.display = 'none';
    var recent = document.getElementById('recent-searches');
    if (recent) renderRecentSearches();
}

// --- Filter Tabs: keyboard navigation (ArrowLeft / ArrowRight / Home / End) ---
function initFilterKeyboardNav() {
    var tabsBar = document.getElementById('filter-tabs');
    if (!tabsBar) return;
    tabsBar.addEventListener('keydown', function(e) {
        var tabs = Array.prototype.slice.call(tabsBar.querySelectorAll('.filter-tab'));
        var idx = tabs.indexOf(document.activeElement);
        if (idx === -1) return;
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); next.focus(); }
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilterKeyboardNav);
} else {
    initFilterKeyboardNav();
}

// --- Scroll Reveal ---
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('.tool-card').forEach(function(c) { c.classList.add('reveal'); }); return; }
    var cards = document.querySelectorAll('.tools-grid .tool-card');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var card = entry.target;
                var index = Array.prototype.indexOf.call(cards, card);
                card.style.transitionDelay = (Math.min(index, 12) * 0.05) + 's';
                requestAnimationFrame(function() { card.classList.add('reveal'); });
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(function(card) { observer.observe(card); });
}

// --- Header Scroll Shadow ---
function initHeaderScroll() {
    var header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
}

// --- Favorite Stars on tool cards (homepage) ---
function initFavStars() {
    if (!window.ToolRegistry) return;
    document.querySelectorAll('.tool-card').forEach(function (card) {
        var slug = card.getAttribute('href');
        if (!slug || slug.indexOf('/') !== -1 || slug.indexOf('.html') !== -1) return;
        if (card.querySelector('.fav-star')) return;
        var btn = document.createElement('button');
        btn.className = 'fav-star' + (ToolRegistry.isFavorite(slug) ? ' active' : '');
        btn.setAttribute('aria-label', (ToolRegistry.isFavorite(slug) ? 'Remove ' : 'Add ') + (card.getAttribute('data-name') || 'tool') + (ToolRegistry.isFavorite(slug) ? ' from favorites' : ' to favorites'));
        btn.setAttribute('aria-pressed', ToolRegistry.isFavorite(slug) ? 'true' : 'false');
        btn.innerHTML = ToolRegistry.isFavorite(slug) ? '★' : '☆';
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var nowFav = ToolRegistry.toggleFavorite(slug);
            btn.classList.toggle('active', nowFav);
            btn.innerHTML = nowFav ? '★' : '☆';
            btn.setAttribute('aria-pressed', nowFav ? 'true' : 'false');
            window.dispatchEvent(new Event('toolboxpro:favs-changed'));
        });
        card.appendChild(btn);
    });
}

// --- Record tool usage on tool pages ---
function initUsageRecording() {
    if (!window.ToolRegistry) return;
    var path = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '');
    if (path && ToolRegistry.bySlug(path)) ToolRegistry.recordUse(path);
}

// --- Personal Sections: Favorites & Recently Used ---
function initPersonalSections() {
    if (!window.ToolRegistry) return;
    var favSec = document.getElementById('favorites-section');
    var recSec = document.getElementById('recent-section');
    if (!favSec && !recSec) return;

    function cardHtml(t, isFav) {
        return '<a href="' + t.slug + '" class="tool-card dyn-card reveal" data-name="' + t.name + '" data-tags="' + t.keywords + '" data-desc="' + t.description + '" data-category="' + t.category + '">' +
            '<div class="tool-icon"><i class="fas ' + t.icon + '"></i></div>' +
            '<h3>' + t.name + '</h3>' +
            '<p>' + t.description + '</p>' +
            '<div class="tool-card-footer"><span class="tool-tag">' + t.category + '</span>' +
            (isFav ? '<span class="dyn-fav-ind" title="Favorite">★</span>' : '') + '</div></a>';
    }
    function render() {
        var favs = ToolRegistry.getFavorites();
        var rec = ToolRegistry.getRecent().filter(function (s) { return favs.indexOf(s) === -1; });
        if (favSec) {
            var grid = document.getElementById('favorites-grid');
            var aiFavs = [];
            if (window.AIRegistry) {
                aiFavs = AIRegistry.getFavorites().map(function (t) {
                    return { slug: 'ai-tools/' + t.slug + '/', name: t.name, description: t.desc, icon: t.icon, category: t.category, keywords: (t.tags || []).join(' ') + ' ' + t.category };
                });
            }
            if (favs.length || aiFavs.length) {
                grid.innerHTML = aiFavs.map(function (t) { return cardHtml(t, true); }).join('') +
                    favs.map(function (s) { return cardHtml(ToolRegistry.bySlug(s), true); }).join('');
                favSec.style.display = 'block';
                if (window.AIRegistry) AIRegistry.syncFavButtons(grid);
            } else {
                grid.innerHTML = '<div class="dyn-empty"><i class="fas fa-star" aria-hidden="true"></i><p>No favorites yet — tap the ☆ on any card to pin it here.</p></div>';
                favSec.style.display = 'none';
            }
        }
        if (recSec) {
            var rgrid = document.getElementById('recent-grid');
            if (rec.length) {
                rgrid.innerHTML = rec.map(function (s) { return cardHtml(ToolRegistry.bySlug(s), false); }).join('');
                recSec.style.display = 'block';
            } else { recSec.style.display = 'none'; }
        }
    }
    render();
    window.addEventListener('toolboxpro:favs-changed', render);
    document.addEventListener('aid:favs-changed', render);
}

// --- Surprise Me: jump to a random tool ---
function initSurpriseMe() {
    var btn = document.getElementById('surprise-btn');
    if (!btn || !window.ToolRegistry) return;
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        var tools = ToolRegistry.tools;
        var pick = tools[Math.floor(Math.random() * tools.length)];
        if (window.initPageTransitions && document.getElementById('page-transition')) {
            var pt = document.getElementById('page-transition');
            pt.classList.add('active');
            setTimeout(function () { window.location.href = pick.slug; }, 350);
        } else {
            window.location.href = pick.slug;
        }
    });
}

// --- Animated Counter ---
function initAnimatedCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'), 10);
                animateCounter(el, 0, target, 1200);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { observer.observe(c); });
}
function animateCounter(el, start, end, duration) {
    var startTime = null;
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (end - start) * eased) + '+';
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// --- Mouse-follow Ambient Blob ---
function initAmbientParallax() {
    if (!IS_HOMEPAGE) return;
    var blobs = document.querySelectorAll('.ambient-blob');
    if (!blobs.length || ('ontouchstart' in window)) return;
    var mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    function lerp(a, b, f) { return a + (b - a) * f; }
    function update() {
        currentX = lerp(currentX, mouseX, 0.03);
        currentY = lerp(currentY, mouseY, 0.03);
        blobs.forEach(function(blob, i) {
            var s = (i + 1) * 8;
            blob.style.transform = 'translate(' + (currentX * s) + 'px, ' + (currentY * s) + 'px)';
        });
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// --- Parallax Scroll ---
function initParallax() {
    if (!IS_HOMEPAGE) return;
    var blobs = document.querySelectorAll('.ambient-blob');
    var grid = document.querySelector('.cosmic-grid');
    var nebula = document.querySelector('.nebula');
    var aurora = document.querySelector('.aurora');
    window.addEventListener('scroll', function() {
        var scrollY = window.scrollY;
        blobs.forEach(function(blob, i) { blob.style.marginTop = (-scrollY * (i + 1) * 0.06) + 'px'; });
        if (grid) grid.style.transform = 'translateY(' + (-scrollY * 0.02) + 'px)';
        if (nebula) nebula.style.transform = 'translateY(' + (-scrollY * 0.04) + 'px)';
        if (aurora) aurora.style.transform = 'translateY(' + (-scrollY * 0.01) + 'px)';
    }, { passive: true });
}

// --- Smooth Card Press ---
function initCardPress() {
    document.querySelectorAll('.tool-card').forEach(function(card) {
        card.addEventListener('mousedown', function() { this.style.transform = 'translateY(-2px) scale(0.98)'; this.style.transitionDuration = '0.1s'; });
        card.addEventListener('mouseup', function() { this.style.transform = ''; this.style.transitionDuration = ''; });
        card.addEventListener('mouseleave', function() { this.style.transform = ''; this.style.transitionDuration = ''; });
    });
}

// --- Cursor Spotlight (with trailing ring) ---
function initCursorSpotlight() {
    if (!IS_HOMEPAGE || 'ontouchstart' in window) return;
    var spotlight = document.getElementById('cursor-spotlight');
    var ring = document.getElementById('cursor-spotlight-ring');
    if (!spotlight) return;
    var targetX = 0, targetY = 0, currentX = 0, currentY = 0, ringCurrentX = 0, ringCurrentY = 0;
    var isActive = false, spotlightSize = 300, ringSize = 350;
    document.addEventListener('mousemove', function(e) {
        targetX = e.clientX; targetY = e.clientY;
        if (!isActive) { isActive = true; spotlight.classList.add('active'); if (ring) ring.classList.add('active'); }
    }, { passive: true });
    document.addEventListener('mouseleave', function() {
        isActive = false; spotlight.classList.remove('active'); if (ring) ring.classList.remove('active');
    });
    function animate() {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        spotlight.style.transform = 'translate(' + (currentX - spotlightSize) + 'px, ' + (currentY - spotlightSize) + 'px)';
        ringCurrentX += (targetX - ringCurrentX) * 0.04;
        ringCurrentY += (targetY - ringCurrentY) * 0.04;
        if (ring) ring.style.transform = 'translate(' + (ringCurrentX - ringSize) + 'px, ' + (ringCurrentY - ringSize) + 'px)';
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// --- Typewriter Hero (Staggered fade-slide up) ---
function initTypewriter() {
    var el = document.getElementById('typewriter-text');
    if (!el) return;
    var childNodes = el.childNodes;
    var wrapper = document.createDocumentFragment();
    var charIndex = 0;

    for (var i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];
        if (node.nodeType === 3) { // text node
            for (var j = 0; j < node.textContent.length; j++) {
                var ch = node.textContent[j];
                var span = document.createElement('span');
                span.className = 'typewriter-char' + (ch === ' ' ? ' space' : '');
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                span.style.animationDelay = (charIndex * 0.03) + 's';
                wrapper.appendChild(span);
                charIndex++;
            }
        } else if (node.nodeType === 1) {
            if (node.tagName === 'BR') {
                wrapper.appendChild(document.createElement('br'));
            } else {
                // Styled element like <span> with gradient
                var clone = document.createElement(node.tagName.toLowerCase());
                if (node.className) clone.className = node.className;
                var computed = window.getComputedStyle(node);
                clone.style.background = computed.background;
                clone.style.webkitBackgroundClip = computed.webkitBackgroundClip;
                clone.style.webkitTextFillColor = computed.webkitTextFillColor;
                clone.style.backgroundClip = computed.backgroundClip;
                var innerText = node.textContent;
                for (var k = 0; k < innerText.length; k++) {
                    var c = innerText[k];
                    var sp = document.createElement('span');
                    sp.className = 'typewriter-char' + (c === ' ' ? ' space' : '');
                    sp.textContent = c === ' ' ? '\u00A0' : c;
                    sp.style.animationDelay = (charIndex * 0.03) + 's';
                    clone.appendChild(sp);
                    charIndex++;
                }
                wrapper.appendChild(clone);
            }
        }
    }

    // Blinking cursor
    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.style.animationDelay = (charIndex * 0.03) + 's';

    el.innerHTML = '';
    el.style.visibility = 'visible';
    el.appendChild(wrapper);
    el.appendChild(cursor);

    // Remove cursor after animation
    setTimeout(function() {
        cursor.style.transition = 'opacity 0.5s';
        cursor.style.opacity = '0';
        setTimeout(function() { if (cursor.parentNode) cursor.parentNode.removeChild(cursor); }, 500);
    }, charIndex * 30 + 2000);
}

// --- Click Particle Burst ---
function initClickBurst() {
    if (!IS_HOMEPAGE || 'ontouchstart' in window) return;
    var container = document.getElementById('click-bursts');
    if (!container) return;
    var colors = [
        'rgba(255, 255, 255, 0.7)',
        'rgba(129, 140, 248, 0.8)',
        'rgba(167, 139, 250, 0.7)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(192, 132, 252, 0.6)'
    ];
    document.addEventListener('click', function(e) {
        var count = 14 + Math.floor(Math.random() * 8);
        for (var i = 0; i < count; i++) {
            var particle = document.createElement('div');
            particle.className = 'burst-particle';
            var size = 2 + Math.random() * 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            var color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = '0 0 ' + (size * 2) + 'px ' + color;
            container.appendChild(particle);
            var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            var distance = 50 + Math.random() * 120;
            var dx = Math.cos(angle) * distance;
            var dy = Math.sin(angle) * distance;
            var duration = 500 + Math.random() * 400;
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0)', opacity: 0 }
            ], { duration: duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' });
            setTimeout((function(p) { return function() { if (p.parentNode) p.parentNode.removeChild(p); }; })(particle), duration + 50);
        }
    });
}

// --- Floating Code Symbols ---
function initCodeSymbols() {
    var container = document.getElementById('code-symbols');
    if (!container) return;
    var symbols = ['{ }', '< />', '/ *', '=>', '===', '++', '::', '//', '&&', '||', '!=', '[]', '()', '##', '**', 'fn()', 'let', 'var', 'if()', 'for()', '0x', '$', '>>', '<<', '.map', '.filter', 'async'];
    var maxSymbols = 25;
    var spawnInterval = null;
    function spawnSymbol() {
        if (container.children.length >= maxSymbols) return;
        var el = document.createElement('div');
        el.className = 'code-symbol';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.bottom = '-30px';
        el.style.fontSize = (10 + Math.random() * 8) + 'px';
        var duration = 20 + Math.random() * 25;
        var delay = Math.random() * 2;
        el.style.animationDuration = duration + 's';
        el.style.animationDelay = delay + 's';
        el.style.marginLeft = (Math.random() * 60 - 30) + 'px';
        container.appendChild(el);
        setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, (duration + delay) * 1000 + 500);
    }
    for (var i = 0; i < 10; i++) setTimeout(spawnSymbol, i * 600);
    spawnInterval = setInterval(spawnSymbol, 3000);
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) clearInterval(spawnInterval); else spawnInterval = setInterval(spawnSymbol, 3000);
    });
}

// --- Floating Geometric Shapes (Bigger) ---
function initFloatingShapes() {
    var container = document.getElementById('floating-shapes');
    if (!container) return;
    var shapeTypes = ['shape-triangle', 'shape-diamond', 'shape-ring', 'shape-cross', 'shape-dots', 'shape-plus', 'shape-hex'];
    var maxShapes = 18;
    var spawnInterval = null;
    function spawnShape() {
        if (container.children.length >= maxShapes) return;
        var shape = document.createElement('div');
        var type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.className = 'shape ' + type;
        shape.style.left = Math.random() * 100 + '%';
        var scale = 0.8 + Math.random() * 1.0;
        shape.style.transform = 'scale(' + scale + ')';
        var duration = 15 + Math.random() * 18;
        var delay = Math.random() * 3;
        shape.style.animationDuration = duration + 's';
        shape.style.animationDelay = delay + 's';
        container.appendChild(shape);
        setTimeout(function() { if (shape.parentNode) shape.parentNode.removeChild(shape); }, (duration + delay) * 1000 + 500);
    }
    for (var i = 0; i < 8; i++) setTimeout(spawnShape, i * 800);
    spawnInterval = setInterval(spawnShape, 2500);
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) clearInterval(spawnInterval); else spawnInterval = setInterval(spawnShape, 2500);
    });
}

// --- DOM Particles (Twinkle stars, supplement to canvas) ---
function createParticles() {
    if (!IS_HOMEPAGE) return;
    var container = document.getElementById('particles');
    if (!container) return;
    for (var i = 0; i < 60; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        var size = Math.random() * 3 + 0.5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDuration = (Math.random() * 6 + 3) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        if (size > 2) particle.style.boxShadow = '0 0 ' + (size * 2) + 'px rgba(129, 140, 248, 0.3)';
        container.appendChild(particle);
    }
}

// --- Analytics ---
// --- Back to Top ---
function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function() { btn.classList.toggle('visible', window.scrollY > 400); }, { passive: true });
    btn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

// --- PWA Install ---
var deferredPrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault(); deferredPrompt = e;
    if (!localStorage.getItem('toolboxpro-pwa-dismissed')) {
        var banner = document.getElementById('pwa-banner');
        if (banner) setTimeout(function() { banner.classList.add('visible'); }, 3000);
    }
});
function installPWA() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(choice) {
        if (choice.outcome === 'accepted') showToast('App installed successfully!');
        deferredPrompt = null; dismissPWA();
    });
}
function dismissPWA() {
    var banner = document.getElementById('pwa-banner');
    if (banner) banner.classList.remove('visible');
    localStorage.setItem('toolboxpro-pwa-dismissed', '1');
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() { navigator.serviceWorker.register('/sw.js').catch(function() {}); });
}

// --- Feedback Widget ---
function initFeedback() {
    var fab = document.getElementById('feedback-fab');
    var panel = document.getElementById('feedback-panel');
    if (!fab || !panel) return;
    var selectedEmoji = '';
    fab.addEventListener('click', function() { panel.classList.toggle('open'); });
    panel.querySelectorAll('.feedback-emoji').forEach(function(btn) {
        btn.addEventListener('click', function() {
            panel.querySelectorAll('.feedback-emoji').forEach(function(b) { b.classList.remove('selected'); });
            this.classList.add('selected');
            selectedEmoji = this.getAttribute('data-rating');
        });
    });
    var submitBtn = document.getElementById('feedback-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            var textarea = document.getElementById('feedback-text');
            var message = textarea ? textarea.value.trim() : '';
            if (!selectedEmoji && !message) { showToast('Pick a rating or leave a message!'); return; }
            var feedback = { page: window.location.pathname, rating: selectedEmoji, message: message, timestamp: new Date().toISOString() };
            var stored = JSON.parse(localStorage.getItem('toolboxpro-feedback') || '[]');
            stored.push(feedback);
            localStorage.setItem('toolboxpro-feedback', JSON.stringify(stored));
            panel.querySelector('.feedback-form').style.display = 'none';
            var thanks = document.getElementById('feedback-thanks');
            if (thanks) thanks.style.display = 'block';
            setTimeout(function() {
                panel.classList.remove('open'); panel.querySelector('.feedback-form').style.display = 'block';
                if (thanks) thanks.style.display = 'none';
                if (textarea) textarea.value = '';
                panel.querySelectorAll('.feedback-emoji').forEach(function(b) { b.classList.remove('selected'); });
                selectedEmoji = '';
            }, 2500);
        });
    }
}

// --- Performance Monitoring ---
function initPerformance() {
    var perfBadge = document.getElementById('perf-badge');
    if (!perfBadge) return;
    window.addEventListener('load', function() {
        setTimeout(function() {
            var perf = performance.getEntriesByType('navigation')[0];
            if (perf) {
                var loadTime = Math.round(perf.loadEventEnd - perf.startTime);
                var domReady = Math.round(perf.domContentLoadedEventEnd - perf.startTime);
                perfBadge.querySelector('.perf-load').textContent = loadTime + 'ms load';
                perfBadge.querySelector('.perf-dom').textContent = domReady + 'ms DOM';
                var dot = perfBadge.querySelector('.dot-green');
                if (loadTime > 2000) dot.style.background = '#e74c3c';
                else if (loadTime > 1000) dot.style.background = '#fdcb6e';
            }
        }, 100);
    });
}

// --- Cookie Consent Banner ---
function initCookieBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner || localStorage.getItem('toolboxpro-cookies-accepted')) return;
    setTimeout(function() { banner.classList.add('visible'); }, 2000);
}
function acceptCookies() {
    localStorage.setItem('toolboxpro-cookies-accepted', '1');
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('visible');
}
function dismissCookies() {
    localStorage.setItem('toolboxpro-cookies-accepted', '1');
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('visible');
}

// --- Mobile Menu ---
function initMobileMenu() {
    var toggle = document.getElementById('mobile-menu-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;
    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'nav-overlay';
    document.body.appendChild(overlay);
    function closeMenu() {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        overlay.classList.remove('visible');
    }
    toggle.addEventListener('click', function() {
        var isOpen = nav.classList.contains('open');
        if (isOpen) { closeMenu(); }
        else {
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            nav.classList.add('open');
            overlay.classList.add('visible');
        }
    });
    overlay.addEventListener('click', closeMenu);
    nav.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMenu); });
}

// --- Page Transitions ---
function initPageTransitions() {
    // Create overlay if it doesn't exist
    var overlay = document.getElementById('page-transition');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'page-transition';
        overlay.id = 'page-transition';
        document.body.appendChild(overlay);
    }

    // Check if we arrived from an internal page (transition in)
    var referrer = document.referrer;
    var isInternal = referrer && referrer.indexOf(window.location.origin) !== -1;
    if (isInternal) {
        overlay.classList.add('active');
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                overlay.classList.remove('active');
            });
        });
    }

    // Intercept clicks on internal links
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href]');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0 || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
        // Skip external links, same-page anchors, and feedback/cookie buttons
        if (link.classList.contains('cookie-btn') || link.classList.contains('pwa-dismiss') || link.classList.contains('pwa-install-btn')) return;
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(function() { window.location.href = href; }, 300);
    });
}

// --- Keyboard Shortcuts ---
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        var searchInput = document.getElementById('tool-search');
        var isInputFocused = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');

        // Ctrl+K / Cmd+K and "/" are handled by command-palette.js
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') return;
        if (e.key === '/' && !isInputFocused) return;
        // Ctrl+\ -- toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
            e.preventDefault();
            toggleTheme();
            return;
        }
        // Ctrl+Up -- scroll to top
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        // ? -- show shortcuts (when not in input)
        if (e.key === '?' && !isInputFocused) {
            e.preventDefault();
            showShortcuts();
            return;
        }
        // Escape -- close modals
        if (e.key === 'Escape') {
            closeShortcuts();
        }
    });
}
function showShortcuts() {
    var overlay = document.getElementById('shortcuts-overlay');
    if (overlay) overlay.classList.add('visible');
}
function closeShortcuts() {
    var overlay = document.getElementById('shortcuts-overlay');
    if (overlay) overlay.classList.remove('visible');
}

// --- Skeleton Loader ---
function initSkeletonLoader() {
    if (!IS_HOMEPAGE) return;
    var cards = document.querySelectorAll('.tool-card');
    if (!cards.length) return;
    // Add skeleton class to cards
    cards.forEach(function(card) { card.classList.add('skeleton'); });
    // Remove skeleton after content loads
    setTimeout(function() {
        cards.forEach(function(card, i) {
            setTimeout(function() { card.classList.remove('skeleton'); }, i * 50);
        });
    }, 600);
}

// --- Password Strength Meter ---
function calcPasswordStrength(password) {
    var score = 0;
    if (!password) return { score: 0, label: '', color: 'transparent', percent: 0 };
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    var levels = [
        { label: 'Very Weak', color: '#ef4444', percent: 16 },
        { label: 'Weak', color: '#f97316', percent: 33 },
        { label: 'Fair', color: '#eab308', percent: 50 },
        { label: 'Strong', color: '#22c55e', percent: 75 },
        { label: 'Very Strong', color: '#10b981', percent: 100 }
    ];
    var idx = Math.min(Math.floor(score * 4 / 6), 4);
    var level = levels[idx];
    // Deduct for too short
    if (password.length < 6) { idx = 0; level = levels[0]; }
    return { score: idx, label: level.label, color: level.color, percent: level.percent };
}
function updatePasswordStrength() {
    var output = document.getElementById('pwd-output');
    var bar = document.getElementById('strength-bar');
    var label = document.getElementById('strength-label');
    if (!output || !bar || !label) return;
    var password = output.textContent || '';
    var strength = calcPasswordStrength(password);
    bar.style.width = strength.percent + '%';
    bar.style.background = strength.color;
    label.textContent = strength.label;
    label.style.color = strength.color;
}

// --- Password Visibility Toggle ---
function togglePasswordVisibility() {
    var output = document.getElementById('pwd-output');
    var btn = document.getElementById('pwd-visibility-btn');
    if (!output || !btn) return;
    var isHidden = output.getAttribute('data-hidden') === 'true';
    if (isHidden) {
        output.textContent = output.getAttribute('data-password') || output.textContent;
        output.setAttribute('data-hidden', 'false');
        btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        output.setAttribute('data-password', output.textContent);
        var masked = output.textContent.replace(/./g, '*');
        output.textContent = masked;
        output.setAttribute('data-hidden', 'true');
        btn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initPersonalSections();
    initSurpriseMe();
    initFavStars();
    initUsageRecording();
    initParticleCanvas();
    createParticles();
    initTypewriter();
    initSearch();
    initScrollReveal();
    initHeaderScroll();
    initAnimatedCounters();
    initAmbientParallax();
    initParallax();
    initCardPress();
    initCursorSpotlight();
    initFloatingShapes();
    initCodeSymbols();
    initClickBurst();
    initBackToTop();
    initFeedback();
    initPerformance();
    initSkeletonLoader();
    initCookieBanner();
    initMobileMenu();
    initKeyboardShortcuts();

    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    var path = window.location.pathname;
    if (path === '/' || path === '/index' || path === '') setActiveNav('home');
    else if (path.indexOf('developer-tools') === 0 ||
        path.includes('json-formatter') || path.includes('word-counter') ||
        path.includes('password-generator') || path.includes('color-picker') ||
        path.includes('base64') || path.includes('url-encoder') ||
        path.includes('lorem') || path.includes('qr-code') || path.includes('hash')) setActiveNav('devtools');
    else if (path.includes('ai-tools')) setActiveNav('ai');
    else if (path.includes('about')) setActiveNav('about');
    else if (path.includes('contact')) setActiveNav('contact');
    else if (path.includes('guides') || path.includes('json-vs-yaml') || path.includes('how-base64') || path.includes('regex-testing')) setActiveNav('guides');
    // legal pages: no nav item highlighted

    // --- Page Transition ---
    initPageTransitions();
});
