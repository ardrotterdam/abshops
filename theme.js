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

    function themeLabels() {
        var lang = document.documentElement.lang === 'en' ? 'en' : 'nl';
        if (lang === 'en') {
            return {
                toDark: 'Switch to dark theme',
                toLight: 'Switch to light theme'
            };
        }
        return {
            toDark: 'Schakel naar donker thema',
            toLight: 'Schakel naar licht thema'
        };
    }

    function refresh() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var L = themeLabels();
        btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
        btn.setAttribute('aria-label', isDark ? L.toLight : L.toDark);
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

    document.addEventListener('abshops:i18n-applied', refresh);

    refresh();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindThemeToggle);
} else {
    bindThemeToggle();
}
