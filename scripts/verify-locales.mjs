import fs from 'node:fs';

const checks = [];
function assert(cond, msg) {
    checks.push({ ok: !!cond, msg });
}
function read(p) {
    return fs.readFileSync(p, 'utf8');
}

const nl = read('nl/websites/index.html');
const en = read('en/websites/index.html');
assert(nl.includes('lang="nl"'), 'nl/websites html lang=nl');
assert(en.includes('lang="en"'), 'en/websites html lang=en');
assert(nl.includes('Websites die vindbaar zijn'), 'nl/websites Dutch hero in source');
assert(en.includes('Websites built to be found'), 'en/websites English hero in source');
assert(!en.includes('Websites die vindbaar zijn'), 'en/websites no Dutch hero');
assert(nl.includes('canonical" href="https://abshops.nl/nl/websites"'), 'nl canonical');
assert(en.includes('canonical" href="https://abshops.nl/en/websites"'), 'en canonical');
assert(nl.includes('hreflang="en" href="https://abshops.nl/en/websites"'), 'nl has en hreflang');
assert(en.includes('hreflang="nl" href="https://abshops.nl/nl/websites"'), 'en has nl hreflang');
assert(nl.includes('hreflang="x-default" href="https://abshops.nl/nl/websites"'), 'x-default nl');
assert(en.includes('href="/nl/websites"') && en.includes('href="/en/websites"'), 'lang switch links');
assert(en.includes('name="_next" value="https://abshops.nl/en/bedankt"'), 'en form thank-you');
assert(nl.includes('name="_next" value="https://abshops.nl/nl/bedankt"'), 'nl form thank-you');
assert(!en.includes('href="styles.css'), 'no relative styles.css on en');
assert(en.includes('href="/styles.css'), 'absolute styles on en');
assert(fs.existsSync('insights/ai-automation/index.html'), 'insight article preserved');
assert(fs.existsSync('insights/shopify-ecommerce/index.html'), 'shopify article preserved');
assert(fs.existsSync('insights/webdevelopment/index.html'), 'web article preserved');

const v = JSON.parse(read('vercel.json'));
assert(
    v.redirects.some((r) => r.source === '/' && r.destination === '/nl/'),
    'redirect /'
);
assert(
    v.redirects.some((r) => r.source === '/websites.html' && r.destination === '/nl/websites'),
    'redirect websites'
);
assert(
    v.redirects.some(
        (r) => r.source === '/ai-oplossingen.html' && r.destination === '/nl/automation'
    ),
    'redirect automation'
);

const sm = read('sitemap.xml');
assert(sm.includes('https://abshops.nl/nl/websites'), 'sitemap nl websites');
assert(sm.includes('https://abshops.nl/en/websites'), 'sitemap en websites');
assert(sm.includes('hreflang="x-default"'), 'sitemap x-default');
assert(sm.includes('/insights/ai-automation/'), 'sitemap keeps articles');
assert(!sm.includes('websites.html'), 'sitemap no legacy .html');
assert(!sm.includes('/bedankt'), 'sitemap excludes thank-you');

const enIdx = read('en/index.html');
assert(enIdx.includes('Shopify stores<br> and pragmatic AI workflows'), 'en home hero');
assert(enIdx.includes('src="/assets/'), 'en home absolute assets');

const enAuto = read('en/automation/index.html');
assert(enAuto.includes('lang="en"'), 'en automation lang');
assert(enAuto.includes('Business automation'), 'en automation English meta');

const enContact = read('en/contact/index.html');
assert(enContact.includes('Let’s connect') || enContact.includes("Let's connect"), 'en contact hero');
assert(
    enContact.includes('name="redirect" value="https://abshops.nl/en/bedankt"'),
    'en contact redirect'
);

let failed = 0;
for (const c of checks) {
    console.log((c.ok ? 'PASS' : 'FAIL') + ': ' + c.msg);
    if (!c.ok) failed += 1;
}
console.log('---');
console.log(failed ? failed + ' failed' : 'All ' + checks.length + ' checks passed');
process.exit(failed ? 1 : 0);
