// Smooth scroll for in-page anchors only (same document)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const id = anchor.getAttribute('href');
    if (!id || id === '#') return;

    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        const navEl = document.querySelector('.nav');
        const navHeight = navEl ? navEl.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Nav background on scroll (theme-aware via CSS variables)
const nav = document.querySelector('.nav');
if (nav) {
    const syncNavScrollState = () => {
        nav.dataset.scrolled = window.pageYOffset > 50 ? 'true' : '';
    };

    syncNavScrollState();
    window.addEventListener('scroll', syncNavScrollState, { passive: true });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .stat-item, .animate-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Preload critical fonts
if ('fonts' in document) {
    Promise.all([
        document.fonts.load('400 1rem Inter'),
        document.fonts.load('600 1rem Inter'),
        document.fonts.load('300 3rem Inter'),
        document.fonts.load('600 1rem Syne'),
        document.fonts.load('700 1rem Syne'),
        document.fonts.load('800 0.6rem Syne')
    ]).then(() => {
        document.body.classList.add('fonts-loaded');
    });
}
