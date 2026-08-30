// ===== ToolBox Pro - Shared Components v2 =====

// --- Particles ---
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.width = particle.style.height = (Math.random() * 4 + 1) + 'px';
        container.appendChild(particle);
    }
}

// --- Toast ---
function showToast(message) {
    message = message || '✓ Copied to clipboard!';
    let toast = document.getElementById('copy-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copy-toast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2000);
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(function() { showToast(); });
}

function copyElement(id) {
    var el = document.getElementById(id);
    if (el) copyText(el.textContent);
}

// --- Theme Toggle ---
function initTheme() {
    var saved = localStorage.getItem('toolboxpro-theme');
    if (saved === 'light') {
        document.documentElement.classList.add('light');
    } else if (saved === 'dark') {
        document.documentElement.classList.remove('light');
    } else {
        // Auto-detect system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.classList.add('light');
        }
    }
    updateThemeIcon();
}

function toggleTheme() {
    document.documentElement.classList.toggle('light');
    var isLight = document.documentElement.classList.contains('light');
    localStorage.setItem('toolboxpro-theme', isLight ? 'light' : 'dark');
    updateThemeIcon();
}

function updateThemeIcon() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isLight = document.documentElement.classList.contains('light');
    btn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
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
    document.querySelectorAll('.faq-item button i').forEach(function(i) { i.style.transform = 'rotate(0deg)'; });

    if (!isOpen) {
        answer.style.display = 'block';
        if (icon) icon.style.transform = 'rotate(180deg)';
    }
}

// --- Search & Filter (Homepage) ---
function initSearch() {
    var searchInput = document.getElementById('tool-search');
    var clearBtn = document.getElementById('search-clear');
    var countEl = document.getElementById('search-count');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        var query = this.value.toLowerCase().trim();
        if (clearBtn) clearBtn.classList.toggle('visible', query.length > 0);
        filterTools(query, getActiveCategory());
    });
}

function clearSearch() {
    var searchInput = document.getElementById('tool-search');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    }
}

function getActiveCategory() {
    var active = document.querySelector('.filter-tab.active');
    return active ? active.getAttribute('data-category') : 'all';
}

function filterTools(query, category) {
    var cards = document.querySelectorAll('.tool-card');
    var visible = 0;
    cards.forEach(function(card) {
        var name = (card.getAttribute('data-name') || '').toLowerCase();
        var tags = (card.getAttribute('data-tags') || '').toLowerCase();
        var cardCategory = card.getAttribute('data-category') || '';
        var matchesSearch = !query || name.indexOf(query) !== -1 || tags.indexOf(query) !== -1;
        var matchesCategory = category === 'all' || cardCategory === category;
        if (matchesSearch && matchesCategory) {
            card.classList.remove('hidden');
            visible++;
        } else {
            card.classList.add('hidden');
        }
    });
    var countEl = document.getElementById('search-count');
    var noResults = document.getElementById('no-results');
    if (countEl) {
        if (query || category !== 'all') {
            countEl.innerHTML = 'Showing <strong>' + visible + '</strong> of 20 tools';
            countEl.style.display = 'block';
        } else {
            countEl.style.display = 'none';
        }
    }
    if (noResults) {
        noResults.style.display = visible === 0 ? 'block' : 'none';
    }
}

function setCategory(cat) {
    document.querySelectorAll('.filter-tab').forEach(function(tab) {
        tab.classList.toggle('active', tab.getAttribute('data-category') === cat);
    });
    var searchInput = document.getElementById('tool-search');
    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    filterTools(query, cat);
}

// --- Analytics (localStorage-based) ---
function initAnalytics() {
    var badge = document.getElementById('analytics-badge');
    if (!badge) return;
    var key = 'toolboxpro-views-' + window.location.pathname;
    var count = parseInt(localStorage.getItem(key) || '0', 10);
    count++;
    localStorage.setItem(key, count.toString());
    var totalKey = 'toolboxpro-total-views';
    var total = parseInt(localStorage.getItem(totalKey) || '0', 10);
    total++;
    localStorage.setItem(totalKey, total.toString());
    var display = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
    badge.querySelector('.analytics-count').textContent = display;
}

// --- Back to Top ---
function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    createParticles();
    initSearch();
    initAnalytics();
    initBackToTop();

    // Theme toggle button in header
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    // Auto-set active nav based on page
    var path = window.location.pathname;
    if (path.includes('json-formatter')) setActiveNav('json-formatter');
    else if (path.includes('word-counter')) setActiveNav('word-counter');
    else if (path.includes('password-generator')) setActiveNav('password-generator');
    else if (path.includes('color-picker')) setActiveNav('color-picker');
    else if (path.includes('base64')) setActiveNav('base64');
    else if (path.includes('url-encoder')) setActiveNav('url-encoder');
    else if (path.includes('lorem')) setActiveNav('lorem');
    else if (path.includes('qr-code')) setActiveNav('qr-code');
    else if (path.includes('hash')) setActiveNav('hash');
    else if (path.includes('about')) setActiveNav('about');
    else if (path.includes('contact')) setActiveNav('contact');
    else if (path.includes('privacy')) setActiveNav('privacy');
    else if (path.includes('terms')) setActiveNav('terms');
    else setActiveNav('tools');
});
