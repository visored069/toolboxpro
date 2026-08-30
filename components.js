// ===== ToolBox Pro - Shared Components =====

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

function showToast(message = '✓ Copied to clipboard!') {
    let toast = document.getElementById('copy-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copy-toast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => showToast());
}

function copyElement(id) {
    const el = document.getElementById(id);
    if (el) copyText(el.textContent);
}

// Active nav
function setActiveNav(page) {
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    const navEl = document.getElementById('nav-' + page);
    if (navEl) navEl.classList.add('active');
}

// FAQ Toggle
function toggleFaq(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('i');
    const isOpen = answer.style.display === 'block';
    
    // Close all other FAQs
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
    document.querySelectorAll('.faq-item button i').forEach(i => i.style.transform = 'rotate(0deg)');
    
    if (!isOpen) {
        answer.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    // Auto-set active nav based on page
    const path = window.location.pathname;
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
