(function applyStoredTheme() {
    try {
        var stored = localStorage.getItem('abshops-theme');
        var theme = stored === 'dark' || stored === 'light' ? stored : 'light';
        document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();

function bindThemeToggle() {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    function refresh() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
        btn.setAttribute('aria-label', isDark ? 'Schakel naar licht thema' : 'Schakel naar donker thema');
    }

    btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try {
            localStorage.setItem('abshops-theme', next);
        } catch (e) {
            /* ignore */
        }
        refresh();
    });

    refresh();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindThemeToggle);
} else {
    bindThemeToggle();
}
