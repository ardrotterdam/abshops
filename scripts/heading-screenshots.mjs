import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const label = process.argv[2] || 'after';
const fontsOnlyUrl = process.argv[3] || null; // optional: only log fonts for this path suffix
const base = 'http://127.0.0.1:4173';
const outDir = path.join('scripts', 'heading-shots', label);
fs.mkdirSync(outDir, { recursive: true });

const edgePath =
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const launchOptions = fs.existsSync(edgePath)
  ? { executablePath: edgePath, headless: true }
  : { channel: 'msedge', headless: true };

const pages = [
  { name: 'nl-home', url: '/nl/', wait: 'h1.hero-title' },
  { name: 'en-home', url: '/en/', wait: 'h1.hero-title' },
  { name: 'nl-insights', url: '/nl/insights', wait: 'h1.hero-title' },
  { name: 'en-insights', url: '/en/insights', wait: 'h1.hero-title' },
  { name: 'nl-websites', url: '/nl/websites', wait: 'h1.hero-title' },
  { name: 'en-websites', url: '/en/websites', wait: 'h1.hero-title' },
];

async function logFonts(page, pageLabel) {
  const fonts = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).fontFamily : null;
    };
    const pageLead = document.querySelector('.page-lead');
    const bodyP = document.querySelector('body p');
    return {
      heroTitle: pick('h1.hero-title'),
      insightsCardH3: pick('.insights-topic-card h3'),
      pageLeadOrBodyP: pageLead
        ? getComputedStyle(pageLead).fontFamily
        : bodyP
          ? getComputedStyle(bodyP).fontFamily
          : null,
      logoName: pick('.logo-name'),
      sectionLabel: pick('.section-label'),
    };
  });
  console.log(`FONTS ${pageLabel} ${JSON.stringify(fonts)}`);
  return fonts;
}

const browser = await chromium.launch(launchOptions);

for (const p of pages) {
  const skipShots = fontsOnlyUrl && p.url !== fontsOnlyUrl;
  for (const viewport of [
    { tag: 'desktop', width: 1440, height: 900 },
    { tag: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    await page.goto(base + p.url, { waitUntil: 'networkidle' });
    await page.waitForSelector(p.wait);
    const heading = page.locator(p.wait).first();
    await heading.scrollIntoViewIfNeeded();

    if (!skipShots) {
      const box = await heading.boundingBox();
      const file = path.join(outDir, `${p.name}-${viewport.tag}.png`);
      if (box) {
        await page.screenshot({
          path: file,
          clip: {
            x: Math.max(0, box.x - 24),
            y: Math.max(0, box.y - 40),
            width: Math.min(viewport.width - 8, box.width + 48),
            height: Math.min(viewport.height - 8, box.height + 120),
          },
        });
      } else {
        await page.screenshot({ path: file, fullPage: false });
      }

      if (p.name.includes('insights')) {
        const card = page.locator('.insights-topic-card h3').first();
        if ((await card.count()) > 0) {
          await card.scrollIntoViewIfNeeded();
          const cbox = await card.boundingBox();
          const cfile = path.join(outDir, `${p.name}-card-${viewport.tag}.png`);
          if (cbox) {
            await page.screenshot({
              path: cfile,
              clip: {
                x: Math.max(0, cbox.x - 16),
                y: Math.max(0, cbox.y - 16),
                width: Math.min(
                  viewport.width - 8,
                  Math.max(220, cbox.width + 32),
                ),
                height: Math.min(200, cbox.height + 80),
              },
            });
          }
        }
      }
    }

    if (!fontsOnlyUrl || p.url === fontsOnlyUrl) {
      await logFonts(page, `${label} ${p.name} ${viewport.tag}`);
    }

    await page.close();
  }
}

await browser.close();
console.log('Wrote screenshots to', outDir);
