/**
 * Build locale-prefixed static pages (nl/…, en/…) with server-visible translations.
 * Zero npm deps — uses Node vm + string transforms against i18n.js DICT.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://abshops.nl';

const PAGES = [
    { src: 'index.html', slug: '', pageId: 'index' },
    { src: 'websites.html', slug: 'websites', pageId: 'websites' },
    { src: 'webshops.html', slug: 'webshops', pageId: 'webshops' },
    { src: 'ai-oplossingen.html', slug: 'automation', pageId: 'ai' },
    { src: 'insights.html', slug: 'insights', pageId: 'insights' },
    { src: 'contact.html', slug: 'contact', pageId: 'contact' },
    { src: 'bedankt.html', slug: 'bedankt', pageId: 'bedankt', noindex: true }
];

function loadDict() {
    const code = fs.readFileSync(path.join(ROOT, 'i18n.js'), 'utf8');
    const sandbox = {
        window: {
            location: { pathname: '/', href: 'https://abshops.nl/' },
            ABshopsI18n: null
        },
        document: {
            readyState: 'complete',
            addEventListener() {},
            querySelectorAll() {
                return [];
            },
            querySelector() {
                return null;
            },
            createElement() {
                return {
                    setAttribute() {},
                    appendChild() {},
                    classList: { add() {}, remove() {}, toggle() {} }
                };
            },
            dispatchEvent() {},
            head: { appendChild() {} },
            body: {
                getAttribute() {
                    return null;
                },
                classList: { add() {}, remove() {} },
                setAttribute() {}
            }
        },
        localStorage: {
            getItem() {
                return null;
            },
            setItem() {}
        },
        CustomEvent: class CustomEvent {
            constructor(type, init) {
                this.type = type;
                this.detail = init && init.detail;
            }
        },
        setTimeout(fn) {
            fn();
        },
        console
    };
    vm.runInNewContext(code, sandbox, { filename: 'i18n.js' });
    return sandbox.window.ABshopsI18n.dict;
}

function getRaw(dict, lang, keyPath) {
    const parts = keyPath.split('.');
    let cur = dict[lang];
    for (const p of parts) {
        if (cur == null || typeof cur !== 'object') return undefined;
        cur = cur[p];
    }
    return cur;
}

function t(dict, lang, keyPath) {
    let v = getRaw(dict, lang, keyPath);
    if (v !== undefined && v !== null) return String(v);
    if (lang !== 'nl') {
        v = getRaw(dict, 'nl', keyPath);
        if (v !== undefined && v !== null) return String(v);
    }
    return '';
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function localePath(lang, slug) {
    if (!slug) return `/${lang}/`;
    return `/${lang}/${slug}`;
}

function absoluteUrl(lang, slug) {
    const p = localePath(lang, slug);
    return p.endsWith('/') ? `${SITE}${p}` : `${SITE}${p}`;
}

function attr(attrs, name) {
    const re = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i');
    const m = attrs.match(re);
    return m ? m[1] : null;
}

function hasAttrFlag(attrs, name, value) {
    return attr(attrs, name) === value;
}

function setOrReplaceAttr(attrs, name, value) {
    const re = new RegExp(`\\b${name}\\s*=\\s*"[^"]*"`, 'i');
    const encoded = value.replace(/"/g, '&quot;');
    if (re.test(attrs)) return attrs.replace(re, `${name}="${encoded}"`);
    return `${attrs} ${name}="${encoded}"`;
}

function findMatchingClose(html, startIdx, tagName) {
    const openRe = new RegExp(`<${tagName}\\b`, 'gi');
    const closeRe = new RegExp(`</${tagName}>`, 'gi');
    let depth = 1;
    let i = startIdx;
    while (i < html.length && depth > 0) {
        openRe.lastIndex = i;
        closeRe.lastIndex = i;
        const openM = openRe.exec(html);
        const closeM = closeRe.exec(html);
        if (!closeM) return -1;
        if (openM && openM.index < closeM.index) {
            depth += 1;
            i = openM.index + openM[0].length;
        } else {
            depth -= 1;
            if (depth === 0) return closeM.index;
            i = closeM.index + closeM[0].length;
        }
    }
    return -1;
}

function applyBindings(html, dict, lang) {
    let out = '';
    let i = 0;
    // Match data-i18n="…" or data-i18n-placeholder="…" only — not data-i18n-page / data-i18n-attr / etc.
    const openTagRe =
        /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?\b(?:data-i18n|data-i18n-placeholder)="[^"]*"[^>]*)>/g;

    while (i < html.length) {
        openTagRe.lastIndex = i;
        const m = openTagRe.exec(html);
        if (!m) {
            out += html.slice(i);
            break;
        }

        const tagStart = m.index;
        out += html.slice(i, tagStart);

        const tagName = m[1];
        let attrs = m[2];
        const afterOpen = tagStart + m[0].length;
        const voidTags = new Set([
            'img',
            'input',
            'br',
            'hr',
            'meta',
            'link',
            'source',
            'area',
            'col',
            'embed',
            'wbr'
        ]);
        const selfClosing =
            /\/\s*$/.test(attrs) || m[0].endsWith('/>') || voidTags.has(tagName.toLowerCase());

        function applyAttrTranslations() {
            const key = attr(attrs, 'data-i18n');
            const phKey = attr(attrs, 'data-i18n-placeholder');
            const attrList = attr(attrs, 'data-i18n-attr');
            if (key) {
                const val = t(dict, lang, key);
                if (val && attrList) {
                    for (const a of attrList.split(/\s+/).filter(Boolean)) {
                        attrs = setOrReplaceAttr(attrs, a, val);
                    }
                }
            }
            if (phKey) {
                const pv = t(dict, lang, phKey);
                if (pv) attrs = setOrReplaceAttr(attrs, 'placeholder', pv);
            }
        }

        if (selfClosing) {
            const hadSlash = /\/\s*$/.test(attrs) || m[0].trimEnd().endsWith('/>');
            attrs = attrs.replace(/\/\s*$/, '');
            applyAttrTranslations();
            out += hadSlash ? `<${tagName}${attrs} />` : `<${tagName}${attrs}>`;
            i = afterOpen;
            continue;
        }

        const closeIdx = findMatchingClose(html, afterOpen, tagName);
        if (closeIdx < 0) {
            applyAttrTranslations();
            out += `<${tagName}${attrs}>`;
            i = afterOpen;
            continue;
        }

        const inner = html.slice(afterOpen, closeIdx);
        const closeTag = `</${tagName}>`;
        const key = attr(attrs, 'data-i18n');
        const phKey = attr(attrs, 'data-i18n-placeholder');
        const suppress = hasAttrFlag(attrs, 'data-i18n-suppress-text', 'true');
        const useHtml = hasAttrFlag(attrs, 'data-i18n-html', 'true');
        const attrList = attr(attrs, 'data-i18n-attr');

        let newInner = inner;
        if (key) {
            const val = t(dict, lang, key);
            if (val) {
                if (attrList) {
                    for (const a of attrList.split(/\s+/).filter(Boolean)) {
                        attrs = setOrReplaceAttr(attrs, a, val);
                    }
                }
                if (!suppress) {
                    newInner = useHtml ? val : escapeHtml(val);
                }
            }
        }

        // Parents that only translate attributes still contain nested data-i18n children.
        if (suppress || !key) {
            newInner = applyBindings(newInner, dict, lang);
        }

        if (phKey) {
            const pv = t(dict, lang, phKey);
            if (pv) attrs = setOrReplaceAttr(attrs, 'placeholder', pv);
        }

        out += `<${tagName}${attrs}>${newInner}${closeTag}`;
        i = closeIdx + closeTag.length;
    }

    // Placeholders without data-i18n
    out = out.replace(
        /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*\bdata-i18n-placeholder="([^"]+)"[^>]*)>/g,
        (full, tag, attrs, phKey) => {
            if (/\bdata-i18n=/.test(attrs)) return full;
            const pv = t(dict, lang, phKey);
            if (!pv) return full;
            return `<${tag}${setOrReplaceAttr(attrs, 'placeholder', pv)}>`;
        }
    );

    return out;
}

function rewriteInternalLinks(html, lang) {
    const map = [
        [/href="index\.html"/g, `href="${localePath(lang, '')}"`],
        [/href="\.\.\/\.\.\/index\.html"/g, `href="${localePath(lang, '')}"`],
        [/href="websites\.html"/g, `href="${localePath(lang, 'websites')}"`],
        [/href="webshops\.html"/g, `href="${localePath(lang, 'webshops')}"`],
        [/href="ai-oplossingen\.html"/g, `href="${localePath(lang, 'automation')}"`],
        [/href="contact\.html"/g, `href="${localePath(lang, 'contact')}"`],
        [/href="contact\.html#/g, `href="${localePath(lang, 'contact')}#`],
        [/href="\/insights\.html"/g, `href="${localePath(lang, 'insights')}"`],
        [/href="insights\.html"/g, `href="${localePath(lang, 'insights')}"`],
        [/href="bedankt\.html"/g, `href="${localePath(lang, 'bedankt')}"`],
        [/href="insights\//g, 'href="/insights/']
    ];

    // Fix contact.html# after contact.html was already rewritten — do hash first
    html = html.replace(/href="contact\.html#([^"]*)"/g, `href="${localePath(lang, 'contact')}#$1"`);
    html = html.replace(/href="websites\.html#([^"]*)"/g, `href="${localePath(lang, 'websites')}#$1"`);
    html = html.replace(/href="webshops\.html#([^"]*)"/g, `href="${localePath(lang, 'webshops')}#$1"`);
    html = html.replace(/href="ai-oplossingen\.html#([^"]*)"/g, `href="${localePath(lang, 'automation')}#$1"`);

    for (const [re, rep] of map) html = html.replace(re, rep);
    return html;
}

function absolutizeAssets(html) {
    return html
        .replace(/href="styles\.css/g, 'href="/styles.css')
        .replace(/src="theme\.js"/g, 'src="/theme.js"')
        .replace(/src="i18n\.js"/g, 'src="/i18n.js"')
        .replace(/src="script\.js"/g, 'src="/script.js"')
        .replace(/src="mobile-nav\.js/g, 'src="/mobile-nav.js')
        .replace(/src="lead-form\.js"/g, 'src="/lead-form.js"')
        .replace(/href="abshops-/g, 'href="/abshops-')
        .replace(/src="abshops-/g, 'src="/abshops-')
        .replace(/src="images\//g, 'src="/images/')
        .replace(/href="images\//g, 'href="/images/')
        .replace(/src="workflow-/g, 'src="/workflow-')
        .replace(/href="workflow-/g, 'href="/workflow-')
        .replace(/src="assets\//g, 'src="/assets/')
        .replace(/href="assets\//g, 'href="/assets/');
}

function replaceLangSwitch(html, lang, slug) {
    const nlUrl = localePath('nl', slug);
    const enUrl = localePath('en', slug);
    const nlActive = lang === 'nl' ? ' is-active' : '';
    const enActive = lang === 'en' ? ' is-active' : '';
    const nlPressed = lang === 'nl' ? 'true' : 'false';
    const enPressed = lang === 'en' ? 'true' : 'false';

    const compact = `<div
                    class="lang-switch lang-switch--compact"
                    role="group"
                    data-i18n="lang.groupAria"
                    data-i18n-suppress-text="true"
                    data-i18n-attr="aria-label"
                    aria-label="${lang === 'en' ? 'Language' : 'Taal'}"
                >
                    <a href="${nlUrl}" class="lang-switch-btn${nlActive}" data-lang="nl" hreflang="nl" aria-pressed="${nlPressed}"${lang === 'nl' ? ' aria-current="true"' : ''}>NL</a>
                    <a href="${enUrl}" class="lang-switch-btn${enActive}" data-lang="en" hreflang="en" aria-pressed="${enPressed}"${lang === 'en' ? ' aria-current="true"' : ''}>EN</a>
                </div>`;

    const full = `<div class="lang-switch" role="group" aria-label="${lang === 'en' ? 'Language' : 'Taal'}">
                    <a href="${nlUrl}" class="lang-switch-btn${nlActive}" data-lang="nl" hreflang="nl" aria-pressed="${nlPressed}"${lang === 'nl' ? ' aria-current="true"' : ''}><span>Nederlands</span></a>
                    <a href="${enUrl}" class="lang-switch-btn${enActive}" data-lang="en" hreflang="en" aria-pressed="${enPressed}"${lang === 'en' ? ' aria-current="true"' : ''}><span>English</span></a>
                </div>`;

    html = html.replace(
        /<div\s+class="lang-switch lang-switch--compact"[\s\S]*?<\/div>/,
        compact
    );
    html = html.replace(/<div class="lang-switch" role="group">[\s\S]*?<\/div>/, full);
    return html;
}

function updateHeadSeo(html, dict, lang, slug, pageId) {
    const prefix = `${pageId}.`;
    const title = t(dict, lang, prefix + 'metaTitle');
    const desc = t(dict, lang, prefix + 'metaDesc');
    const ogTitle = t(dict, lang, prefix + 'ogTitle') || title;
    const ogDesc = t(dict, lang, prefix + 'ogDesc') || desc;
    const url = absoluteUrl(lang, slug);
    const altUrl = absoluteUrl(lang === 'nl' ? 'en' : 'nl', slug);
    const locale = lang === 'en' ? 'en_US' : 'nl_NL';
    const altLocale = lang === 'en' ? 'nl_NL' : 'en_US';
    const nlUrl = absoluteUrl('nl', slug);
    const enUrl = absoluteUrl('en', slug);

    html = html.replace(/<html\s+lang="[^"]*">/, `<html lang="${lang}">`);

    if (title) {
        html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
    }
    if (desc) {
        html = html.replace(
            /<meta name="description" content="[^"]*">/,
            `<meta name="description" content="${escapeHtml(desc)}">`
        );
    }

    html = html.replace(
        /<meta property="og:title" content="[^"]*">/,
        `<meta property="og:title" content="${escapeHtml(ogTitle)}">`
    );
    html = html.replace(
        /<meta property="og:description" content="[^"]*">/,
        `<meta property="og:description" content="${escapeHtml(ogDesc)}">`
    );
    html = html.replace(
        /<meta property="og:url" content="[^"]*">/,
        `<meta property="og:url" content="${url}">`
    );
    html = html.replace(
        /<meta property="og:locale" content="[^"]*">/,
        `<meta property="og:locale" content="${locale}">`
    );

    if (lang === 'en') {
        const ogAltMap = {
            index: 'ABshops — digital commerce studio Rotterdam',
            websites: 'ABshops — web design and websites Rotterdam',
            webshops: 'ABshops — Shopify stores Rotterdam',
            ai: 'ABshops — automation and digital workflows Rotterdam',
            insights: 'ABshops Insights',
            contact: 'ABshops — contact Rotterdam digital commerce studio',
            bedankt: 'ABshops — request received'
        };
        if (ogAltMap[pageId]) {
            html = html.replace(
                /<meta property="og:image:alt" content="[^"]*">/,
                `<meta property="og:image:alt" content="${escapeHtml(ogAltMap[pageId])}">`
            );
        }
    }
    // Remove any existing alternate locale meta; re-add one
    html = html.replace(/<meta property="og:locale:alternate"[^>]*>\s*/g, '');
    html = html.replace(
        /(<meta property="og:locale" content="[^"]*">)/,
        `$1\n    <meta property="og:locale:alternate" content="${altLocale}">`
    );

    html = html.replace(
        /<meta name="twitter:title" content="[^"]*">/,
        `<meta name="twitter:title" content="${escapeHtml(ogTitle)}">`
    );
    html = html.replace(
        /<meta name="twitter:description" content="[^"]*">/,
        `<meta name="twitter:description" content="${escapeHtml(ogDesc)}">`
    );

    html = html.replace(
        /<link rel="canonical" href="[^"]*">/,
        `<link rel="canonical" href="${url}">`
    );

    // Remove existing hreflang then inject after canonical
    html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">\s*/g, '');
    const hreflang = [
        `<link rel="alternate" hreflang="nl" href="${nlUrl}">`,
        `<link rel="alternate" hreflang="en" href="${enUrl}">`,
        `<link rel="alternate" hreflang="x-default" href="${nlUrl}">`
    ].join('\n    ');
    html = html.replace(
        /(<link rel="canonical" href="[^"]*">)/,
        `$1\n    ${hreflang}`
    );

    return html;
}

function rewriteJsonLdBlocks(html, lang, slug, pageId) {
    const url = absoluteUrl(lang, slug);
    const home = absoluteUrl(lang, '');
    const websites = absoluteUrl(lang, 'websites');
    const webshops = absoluteUrl(lang, 'webshops');
    const automation = absoluteUrl(lang, 'automation');
    const contact = absoluteUrl(lang, 'contact');
    const insights = absoluteUrl(lang, 'insights');
    const bedankt = absoluteUrl(lang, 'bedankt');

    return html.replace(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
        (full, json) => {
            let j = json
                .replaceAll('https://abshops.nl/websites.html', websites)
                .replaceAll('https://abshops.nl/webshops.html', webshops)
                .replaceAll('https://abshops.nl/ai-oplossingen.html', automation)
                .replaceAll('https://abshops.nl/contact.html', contact)
                .replaceAll('https://abshops.nl/insights.html', insights)
                .replaceAll('https://abshops.nl/bedankt.html', bedankt)
                .replace(/"item": "https:\/\/abshops\.nl\/"/g, `"item": "${home}"`);

            if (pageId === 'index') {
                j = j.replace(/"url": "https:\/\/abshops\.nl\/"/g, `"url": "${home}"`);
                j = j.replaceAll(`${home}#organization`, `${SITE}/#organization`);
                j = j.replaceAll(`${home}#service-`, `${SITE}/#service-`);
            }

            if (lang === 'en') {
                const enReplacements = [
                    [
                        'Moderne digitale commerce studio uit Rotterdam: websites, Shopify-webshops, SEO, workflows met slimme tooling en digitale bedrijfsinrichting voor ondernemers die online willen groeien.',
                        'Modern digital commerce studio from Rotterdam: websites, Shopify stores, SEO, practical workflows and digital business infrastructure for teams that want to grow online.'
                    ],
                    [
                        'Websiteontwikkeling en webdesign',
                        'Website development and web design'
                    ],
                    ['Websiteontwikkeling', 'Website development'],
                    [
                        'Modern webdesign, snelle responsive websites, Next.js en Vercel waar het past, en SEO-vriendelijke structuur.',
                        'Modern web design, fast responsive websites, Next.js and Vercel when it fits, and SEO-friendly structure.'
                    ],
                    [
                        'Modern webdesign, snelle responsive websites, Next.js en Vercel waar passend, SEO-vriendelijke structuur. Rotterdam en Nederland.',
                        'Modern web design, fast responsive websites, Next.js and Vercel when appropriate, SEO-friendly structure. Rotterdam and the Netherlands.'
                    ],
                    [
                        'Shopify en ecommerceontwikkeling',
                        'Shopify and ecommerce development'
                    ],
                    [
                        'Shopify inrichting en backendconfiguratie, producten en collecties, navigatie en conversie, affiliate- en ecommerce-workflows, optimalisatie van webshops.',
                        'Shopify setup and backend configuration, products and collections, navigation and conversion, affiliate and ecommerce workflows, store optimization.'
                    ],
                    [
                        'Shopify specialist voor inrichting, catalogi, navigatie, conversie en ecommerce SEO. Rotterdam en Nederland.',
                        'Shopify specialist for setup, catalogs, navigation, conversion and ecommerce SEO. Rotterdam and the Netherlands.'
                    ],
                    ['Shopify webshop ontwikkeling', 'Shopify store development'],
                    [
                        'Automatisering en workflows voor bedrijven',
                        'Business automation and workflows'
                    ],
                    ['Automatisering en workflows', 'Automation and workflows'],
                    ['Automatisering voor bedrijven', 'Business automation'],
                    [
                        'Praktische workflows met ondersteunende automatisering en agents waar nodig — menselijke regie, privacybewust. ABshops, Rotterdam, Nederland en Europa.',
                        'Practical workflows with supporting automation and agents where needed — human oversight, privacy-aware. ABshops, Rotterdam, the Netherlands and Europe.'
                    ],
                    [
                        'Praktische workflows met ondersteunende automatisering en agents waar nodig, inhoudsproductie en bedrijfsprocessen — altijd met menselijke regie en kwaliteitscontrole.',
                        'Practical workflows with supporting automation and agents where needed, content production and business processes — always with human oversight and quality control.'
                    ],
                    [
                        'Praktische automatisering en workflows voor bedrijven met menselijke regie. Rotterdam.',
                        'Practical automation and workflows for businesses with human oversight. Rotterdam.'
                    ],
                    [
                        'Google Workspace en digitale infrastructuur',
                        'Google Workspace and digital infrastructure'
                    ],
                    [
                        'Google Workspace en e-mail voor het team, domeinen en DNS, hosting en deployment, technische basis voor kleine bedrijven.',
                        'Google Workspace and team email, domains and DNS, hosting and deployment — technical foundations for small businesses.'
                    ],
                    [
                        'Neem contact op voor websites, Shopify-webshops, SEO, workflows en digitale bedrijfsinrichting. Rotterdam, Nederland en Europa.',
                        'Contact us about websites, Shopify stores, SEO, workflows and digital infrastructure. Rotterdam, the Netherlands and Europe.'
                    ],
                    [
                        'Digitale commerce studio uit Rotterdam: websites, Shopify-webshops, AI-workflows en digitale bedrijfsinrichting voor ondernemers.',
                        'Digital commerce studio from Rotterdam: websites, Shopify stores, AI workflows and digital infrastructure for business owners.'
                    ],
                    ['"name": "Nederland"', '"name": "Netherlands"'],
                    [
                        'Praktische insights voor ondernemers: AI-workflows, Shopify & ecommerce, webdevelopment en automatisering.',
                        'Practical insights for business owners: AI workflows, Shopify & ecommerce, web development and automation.'
                    ],
                    [
                        'Insights voor digitale commerce en slimme workflows',
                        'Insights for digital commerce and practical workflows'
                    ],
                    [
                        'Korte, werkbare notities over AI voor teams, Shopify en ecommerce, moderne websites en automation — geschreven vanuit projectpraktijk bij ABshops.',
                        'Short, practical notes on AI for teams, Shopify and ecommerce, modern websites and automation — written from ABshops project work.'
                    ],
                    ['"name": "AI & automatisering"', '"name": "AI & automation"'],
                    ['"name": "Bedankt"', '"name": "Thank you"'],
                    ['"name": "Automatisering"', '"name": "Automation"'],
                    [
                        'Bevestiging van een ontvangen aanvraag bij ABshops.',
                        'Confirmation that ABshops received your request.'
                    ],
                    ['Rotterdam, Nederland en Europa', 'Rotterdam, the Netherlands and Europe'],
                    ['Rotterdam en Nederland', 'Rotterdam and the Netherlands'],
                    ['"inLanguage": "nl-NL"', '"inLanguage": "en-US"'],
                    ['"inLanguage": "nl"', '"inLanguage": "en"']
                ];
                for (const [from, to] of enReplacements) {
                    j = j.replaceAll(from, to);
                }
            }

            return `<script type="application/ld+json">${j}</script>`;
        }
    );
}

function rewriteFormRedirects(html, lang) {
    const thankYou = `${SITE}${localePath(lang, 'bedankt')}`;
    return html
        .replaceAll('https://abshops.nl/bedankt.html', thankYou)
        .replace(/name="_next" value="[^"]*"/g, `name="_next" value="${thankYou}"`)
        .replace(/name="redirect" value="[^"]*"/g, `name="redirect" value="${thankYou}"`);
}

function markBodyLocale(html, lang) {
    if (/data-locale=/.test(html)) {
        return html.replace(/data-locale="[^"]*"/, `data-locale="${lang}"`);
    }
    return html.replace('<body ', `<body data-locale="${lang}" `).replace(
        '<body>',
        `<body data-locale="${lang}">`
    );
}

function buildPage(dict, page, lang) {
    const srcPath = path.join(ROOT, page.src);
    let html = fs.readFileSync(srcPath, 'utf8');

    html = applyBindings(html, dict, lang);
    html = updateHeadSeo(html, dict, lang, page.slug, page.pageId);
    html = replaceLangSwitch(html, lang, page.slug);
    html = rewriteInternalLinks(html, lang);
    html = absolutizeAssets(html);
    html = rewriteFormRedirects(html, lang);
    html = rewriteJsonLdBlocks(html, lang, page.slug, page.pageId);
    html = markBodyLocale(html, lang);

    // Ensure mobile subtitle keys still resolved (already via applyBindings)
    const outDir = page.slug
        ? path.join(ROOT, lang, page.slug)
        : path.join(ROOT, lang);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'index.html');
    fs.writeFileSync(outFile, html, 'utf8');
    return outFile;
}

function main() {
    const dict = loadDict();
    const written = [];
    for (const page of PAGES) {
        for (const lang of ['nl', 'en']) {
            written.push(buildPage(dict, page, lang));
        }
    }
    console.log('Wrote', written.length, 'locale pages:');
    for (const f of written) console.log(' -', path.relative(ROOT, f));
}

main();
