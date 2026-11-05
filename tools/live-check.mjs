// Live verification of every published shop on BOTH hosts (Firebase + GitHub Pages).
// Read-only: fetches real URLs, asserts required production markers, prints a defect table.
// Usage: node tools/live-check.mjs            (all shops, both hosts)
//        node tools/live-check.mjs caffeine-lab
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const SITE_DIR = path.join(SITE, '_data');
const HOSTS = [
  { name: 'firebase', base: 'https://dropship-lab-974ef.web.app/' },
  { name: 'pages', base: 'https://abhaykushwaha1009-png.github.io/dropship-lab/' },
];
const UA = 'Mozilla/5.0 (compatible; dropship-lab-check/1.0)';
const STALE = ['abhaykushwaha.github.io/', 'localhost', '127.0.0.1'];
const PLACEHOLDER = ['TODO', 'Lorem ipsum', 'XXX', 'Your Studio', 'example.com', 'coming soon'];

const only = process.argv[2];
const shops = fs.readdirSync(SITE, { withFileTypes: true })
  .filter(d => d.isDirectory() && !['assets', 'legal', '_data'].includes(d.name))
  .map(d => d.name).sort()
  .filter(s => !only || s === only);

async function get(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
    const body = await res.text();
    return { status: res.status, body, ms: Date.now() - t0 };
  } catch (e) {
    return { status: 0, body: '', ms: Date.now() - t0, err: String(e.message || e) };
  }
}

const pick = (html, re) => { const m = html.match(re); return m ? (m[1] || '').trim() : ''; };
const defects = [];
const rows = [];

for (const shop of shops) {
  const data = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'shops.json'), 'utf8'));
  const meta = (data.shops || []).find(s => s.slug === shop) || null;
  for (const host of HOSTS) {
    const url = host.base + shop + '/';
    const r = await get(url);
    const local = [];
    if (r.status !== 200) local.push(`status ${r.status || r.err}`);

    const html = r.body;
    const title = pick(html, /<title>([^<]*)<\/title>/i);
    const desc = pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
    const canonical = pick(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
    const ogImage = pick(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);

    if (!title) local.push('no <title>'); else if (title.length < 15 || title.length > 70) local.push(`title len ${title.length}`);
    if (!desc) local.push('no meta description'); else if (desc.length < 50 || desc.length > 175) local.push(`desc len ${desc.length}`);
    if (!canonical) local.push('no canonical'); else if (canonical !== url) local.push(`canonical ${canonical}`);
    if (!ogImage) local.push('no og:image'); else if (!ogImage.startsWith(host.base)) local.push('og:image not absolute-on-host');
    if (!/hashid|\/buy|checkout|cart/i.test(html)) local.push('no checkout path');
    if (!/(£|\$|CHF|₹|€)\s?\d/.test(html)) local.push('no visible price');
    const h1 = (html.match(/<h1[\s>]/gi) || []).length;
    if (h1 !== 1) local.push(`h1 count ${h1}`);
    for (const s of STALE) if (html.includes(s)) local.push(`stale ref ${s}`);
    for (const p of PLACEHOLDER) if (html.includes(p)) local.push(`placeholder ${p}`);
    if (!/<img[^>]+alt=["'][^"']+["']/i.test(html)) local.push('no descriptive img alt');
    if (meta && meta.priceFloor && !html.includes(String(meta.priceFloor).replace(/,/g, ''))) local.push(`floor price ${meta.priceFloor} missing`);

    // asset integrity of declared og:image
    if (ogImage && ogImage.startsWith('http')) {
      const a = await get(ogImage);
      if (a.status !== 200) local.push(`og:image status ${a.status}`);
    }
    rows.push({ shop, host: host.name, url, ms: r.ms, status: r.status, defects: local });
    if (local.length) defects.push({ shop, host: host.name, url, local });
    process.stdout.write(`${r.status === 200 && !local.length ? 'OK  ' : 'FAIL'} ${host.name.padEnd(8)} ${shop}\n`);
  }
}

for (const host of HOSTS) {
  for (const p of ['robots.txt', 'sitemap.xml']) {
    const r = await get(host.base + p);
    if (r.status !== 200) defects.push({ shop: `__${p}`, host: host.name, url: host.base + p, local: [`status ${r.status}`] });
    else if (p === 'robots.txt' && !r.body.includes(host.base)) defects.push({ shop: '__robots', host: host.name, url: host.base + p, local: ['robots sitemap not on this host'] });
    else if (p === 'sitemap.xml') {
      const missing = shops.filter(s => !r.body.includes(host.base + s + '/'));
      if (missing.length) defects.push({ shop: '__sitemap', host: host.name, url: host.base + p, local: [`${missing.length} shops missing`] });
    }
  }
}

fs.writeFileSync(path.join(ROOT, 'tools', 'live-check.json'), JSON.stringify({ at: new Date().toISOString(), shops: shops.length, rows, defects }, null, 2));
console.log(`\n${shops.length} shops x ${HOSTS.length} hosts, ${defects.length} defective URLs`);
for (const d of defects) console.log(`  ${d.host} ${d.url}\n    - ${d.local.join('\n    - ')}`);
process.exit(defects.length ? 1 : 0);
