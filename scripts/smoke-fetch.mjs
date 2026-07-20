const base = 'http://127.0.0.1:4173';
const urls = [
    '/nl/websites',
    '/en/websites',
    '/nl/',
    '/en/automation',
    '/styles.css',
    '/i18n.js',
    '/insights/ai-automation/'
];

const rows = [];
for (const u of urls) {
    const r = await fetch(base + u);
    const t = await r.text();
    const lang = (t.match(/<html lang="([^"]+)"/) || [])[1] || null;
    rows.push({
        u,
        status: r.status,
        len: t.length,
        lang,
        hasEnHero: t.includes('Websites built to be found'),
        hasNlHero: t.includes('Websites die vindbaar zijn'),
        hasCssRule: t.includes('.lang-switch-btn')
    });
}
console.log(JSON.stringify(rows, null, 2));
