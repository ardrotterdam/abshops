/**
 * Read-only pre-deployment review of locale pages + sitemap + redirects.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const issues = [];
const notes = [];

function walk(dir) {
    const out = [];
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) out.push(...walk(p));
        else if (ent.name === 'index.html') out.push(p);
    }
    return out;
}

function rel(p) {
    return path.relative(ROOT, p).replace(/\\/g, '/');
}

function localeFromFile(file) {
    const r = rel(file);
    if (r.startsWith('nl/')) return 'nl';
    if (r.startsWith('en/')) return 'en';
    return null;
}

function slugFromFile(file) {
    const r = rel(file);
    const parts = r.split('/');
    // nl/index.html -> ''
    // nl/websites/index.html -> websites
    if (parts.length === 2) return '';
    return parts[1];
}

function expectedCanonical(lang, slug) {
    return slug ? `https://abshops.nl/${lang}/${slug}` : `https://abshops.nl/${lang}/`;
}

const pages = [...walk(path.join(ROOT, 'nl')), ...walk(path.join(ROOT, 'en'))];
const byKey = new Map();

for (const file of pages) {
    const lang = localeFromFile(file);
    const slug = slugFromFile(file);
    const html = fs.readFileSync(file, 'utf8');
    const key = `${lang}/${slug || ''}`;
    byKey.set(key, { file, lang, slug, html });

    // Old .html links (internal)
    const oldHtml = [
        ...html.matchAll(/href="([^"]*\.html[^"]*)"/g)
    ].map((m) => m[1]);
    const badOld = oldHtml.filter(
        (h) =>
            !h.startsWith('http') &&
            !h.includes('googletagmanager') &&
            (h.includes('websites.html') ||
                h.includes('webshops.html') ||
                h.includes('ai-oplossingen.html') ||
                h.includes('insights.html') ||
                h.includes('contact.html') ||
                h.includes('bedankt.html') ||
                h === 'index.html' ||
                h.endsWith('/index.html'))
    );
    if (badOld.length) {
        issues.push(`${rel(file)}: old .html links → ${badOld.join(', ')}`);
    }

    // Canonical
    const can = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    const expectCan = expectedCanonical(lang, slug);
    if (can !== expectCan) {
        issues.push(`${rel(file)}: canonical ${can} !== ${expectCan}`);
    }

    // Hreflang
    const hrefs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(
        (m) => [m[1], m[2]]
    );
    const map = Object.fromEntries(hrefs);
    const nlUrl = expectedCanonical('nl', slug);
    const enUrl = expectedCanonical('en', slug);
    if (map.nl !== nlUrl || map.en !== enUrl || map['x-default'] !== nlUrl) {
        issues.push(
            `${rel(file)}: hreflang mismatch nl=${map.nl} en=${map.en} x-default=${map['x-default']}`
        );
    }

    // html lang
    const htmlLang = (html.match(/<html lang="([^"]+)"/) || [])[1];
    if (htmlLang !== lang) {
        issues.push(`${rel(file)}: html lang=${htmlLang} expected ${lang}`);
    }

    // Relative asset pitfalls from nested folders
    const relAssets = [
        ...html.matchAll(/(?:href|src)="(?!\/|https?:|mailto:|tel:|#|data:)([^"]+)"/g)
    ].map((m) => m[1]);
    const risky = relAssets.filter(
        (a) =>
            a.endsWith('.css') ||
            a.endsWith('.js') ||
            a.endsWith('.webp') ||
            a.endsWith('.png') ||
            a.endsWith('.svg') ||
            a.startsWith('assets/') ||
            a.startsWith('styles') ||
            a.startsWith('i18n') ||
            a.startsWith('theme') ||
            a.startsWith('script') ||
            a.startsWith('mobile-nav') ||
            a.startsWith('lead-form')
    );
    if (risky.length) {
        issues.push(`${rel(file)}: relative assets may break → ${risky.join(', ')}`);
    }

    // SEO meta language sniff (title + description + og)
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    const desc =
        (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    const ogTitle =
        (html.match(/<meta property="og:title" content="([^"]*)"/) || [])[1] || '';
    const ogDesc =
        (html.match(/<meta property="og:description" content="([^"]*)"/) || [])[1] || '';
    const seoBlob = `${title}\n${desc}\n${ogTitle}\n${ogDesc}`;

    const dutchMarkers = [
        'laten maken',
        'webdesign &',
        'Webdesign &',
        'digitale',
        'Digitale',
        'Nederland',
        'vrijblijvend',
        'aanvraag',
        'ondernemers',
        'Automatisering voor',
        'Workflows die het werk',
        'Laten we',
        'Bedankt voor',
        'Website laten'
    ];
    const englishMarkers = [
        'built for discovery',
        'built to be found',
        'digital workflows',
        'Digital commerce',
        'no-obligation',
        'Business automation',
        'Let’s connect',
        "Let's connect",
        'Thank you for',
        'Schedule a',
        'for businesses'
    ];

    if (lang === 'en') {
        for (const m of dutchMarkers) {
            if (seoBlob.includes(m)) {
                // allow "Rotterdam" context; skip Nederlands label outside SEO? these are SEO fields only
                issues.push(`${rel(file)}: Dutch marker in EN SEO meta: "${m}"`);
            }
        }
    }
    if (lang === 'nl') {
        for (const m of englishMarkers) {
            if (seoBlob.includes(m)) {
                issues.push(`${rel(file)}: English marker in NL SEO meta: "${m}"`);
            }
        }
    }
}

// Reciprocal hreflang pairs for main slugs
for (const slug of ['', 'websites', 'webshops', 'automation', 'insights', 'contact', 'bedankt']) {
    const nl = byKey.get(`nl/${slug}`);
    const en = byKey.get(`en/${slug}`);
    if (!nl || !en) {
        issues.push(`missing pair for slug "${slug}"`);
        continue;
    }
    const nlH = Object.fromEntries(
        [...nl.html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [
            m[1],
            m[2]
        ])
    );
    const enH = Object.fromEntries(
        [...en.html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [
            m[1],
            m[2]
        ])
    );
    if (nlH.en !== expectedCanonical('en', slug) || enH.nl !== expectedCanonical('nl', slug)) {
        issues.push(`non-reciprocal hreflang for slug "${slug}"`);
    }
}

// Sitemap vs canonicals
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const smLocs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexable = [...byKey.keys()].filter((k) => !k.endsWith('bedankt') && !k.includes('bedankt'));
for (const key of indexable) {
    const { lang, slug } = byKey.get(key);
    const can = expectedCanonical(lang, slug);
    if (!smLocs.includes(can)) {
        issues.push(`sitemap missing canonical ${can}`);
    }
}
for (const loc of smLocs) {
    if (loc.includes('.html')) issues.push(`sitemap has legacy .html: ${loc}`);
    if (loc.includes('/bedankt')) issues.push(`sitemap includes thank-you: ${loc}`);
}

// File existence for clean URLs
const clean = [
    'nl/index.html',
    'en/index.html',
    'nl/websites/index.html',
    'en/websites/index.html',
    'nl/webshops/index.html',
    'en/webshops/index.html',
    'nl/automation/index.html',
    'en/automation/index.html',
    'nl/insights/index.html',
    'en/insights/index.html',
    'nl/contact/index.html',
    'en/contact/index.html',
    'insights/ai-automation/index.html'
];
for (const f of clean) {
    if (!fs.existsSync(path.join(ROOT, f))) issues.push(`missing file for clean URL: ${f}`);
    else notes.push(`resolves: /${f.replace(/index\\.html$/, '').replace(/index.html$/, '')}`);
}

// Redirect chain analysis (static simulation)
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
notes.push(`redirect count: ${vercel.redirects.length}`);

console.log('=== PREDEPLOY REVIEW ===');
console.log(`pages scanned: ${pages.length}`);
if (issues.length) {
    console.log(`ISSUES (${issues.length}):`);
    for (const i of issues) console.log(' - ' + i);
    process.exitCode = 1;
} else {
    console.log('No content/SEO issues found in generated pages + sitemap.');
}
console.log(`notes: ${notes.length}`);
