/**
 * Simulate compiled Vercel redirect routes from .vercel/output/config.json
 */
import fs from 'node:fs';

const config = JSON.parse(fs.readFileSync('.vercel/output/config.json', 'utf8'));
const routes = config.routes.filter((r) => r.status === 308 && r.src);

function applyOnce(pathname) {
    for (const r of routes) {
        const re = new RegExp(r.src);
        const m = pathname.match(re);
        if (!m) continue;
        let loc = r.headers.Location;
        for (let i = 1; i < m.length; i++) {
            loc = loc.replace(new RegExp('\\$' + i, 'g'), m[i] ?? '');
        }
        return { status: r.status, location: loc, src: r.src };
    }
    return null;
}

function follow(pathname, max = 5) {
    const hops = [];
    let cur = pathname;
    for (let i = 0; i < max; i++) {
        const hit = applyOnce(cur);
        if (!hit) break;
        hops.push(hit);
        cur = hit.location;
    }
    return hops;
}

const cases = [
    '/',
    '/index.html',
    '/websites.html',
    '/ai-oplossingen.html',
    '/nl',
    '/en',
    '/nl/websites/',
    '/en/websites/',
    '/nl/websites/index.html',
    '/en/websites/index.html',
    '/insights/ai-automation/',
    '/nl/',
    '/nl/websites',
    '/en/websites',
    '/nl/insights',
    '/webshops.html',
    '/contact.html',
    '/bedankt.html',
    '/insights',
    '/insights/',
    '/nl/index.html',
    '/en/index.html'
];

let bad = 0;
for (const c of cases) {
    const hops = follow(c);
    const final = hops.length ? hops[hops.length - 1].location : '(no redirect)';
    const chain = hops.length > 1;
    if (chain) bad++;
    console.log(
        `${c} => ${hops.length ? hops.map((h) => `${h.status} ${h.location}`).join(' -> ') : '200 (static/no redirect)'}${chain ? '  !! CHAIN' : ''}`
    );
}
console.log(bad ? `\nFAIL: ${bad} multi-hop chains` : '\nOK: no multi-hop chains among tested paths');
process.exit(bad ? 1 : 0);
