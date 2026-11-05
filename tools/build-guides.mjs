import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = resolve(root, 'site');
const outDir = resolve(root, 'site', 'guides');
mkdirSync(outDir, { recursive: true });

const { guides } = JSON.parse(readFileSync(resolve(site, '_data/guides.json'), 'utf8'));
const extra = JSON.parse(readFileSync(resolve(site, '_data/catalog-extra.json'), 'utf8'));
const TID = 'dropship-lab-21';
const SHOP_NAMES = { hearth: 'Hearth', kitchen: 'Kitchen', paws: 'Paws', 'car-clean': 'Car Clean', 'desk-hush': 'Desk Hush', 'cool-paws': 'Cool Paws' };
const GBP = (p) => `&pound;${p.toFixed(2)}`;
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://dropship-lab-974ef.web.app; connect-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'";
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

for (const g of guides) {
  const shopName = SHOP_NAMES[g.shop] ?? g.shop;
  const canonical = `https://dropship-lab-974ef.web.app/guides/${g.slug}.html`;
  const body = g.body.map((p) => `  <p>${esc(p)}</p>`).join('\n');
  const links = g.links.map((l) => `      <li><a href="..${l.href}">${esc(l.label)}</a> — ${esc(l.note)}</li>`).join('\n');
  const buy = `https://www.amazon.co.uk/s?k=${encodeURIComponent(g.search)}&tag=${TID}`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(g.title)} — Dropship Lab</title>
<meta name="description" content="${esc(g.dek)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Dropship Lab">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(g.title)}">
<meta property="og:description" content="${esc(g.dek)}">
<meta property="og:image" content="https://dropship-lab-974ef.web.app/assets/og/${g.shop}.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="../assets/css/style.css">
<script src="../assets/config.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap">
  <a class="brand" href="/"><span class="mark">dl</span>dropship-lab</a>
  <nav class="main"><a href="../${g.shop}/">${esc(shopName)}</a><a href="/">All shops</a></nav>
</div></header>

<main id="main">
<article class="wrap guide">
  <p class="crumbs"><a href="/">All shops</a> / <a href="../${g.shop}/">${esc(shopName)}</a> / Guide</p>
  <h1>${esc(g.title)}</h1>
  <p class="dek">${esc(g.dek)}</p>
${body}
  <p><a class="btn" data-buy href="${buy}" target="_blank" rel="noopener sponsored">Shop ${esc(g.search)} on Amazon</a></p>
  <h2>Where to start</h2>
  <ul class="guide-links">
${links}
  </ul>
  <p class="note">Prices and stock live on Amazon. Links carry the ${TID} tag; the price you pay is the same.</p>
</article>
</main>

<footer><div class="wrap"><span>&copy; <span id="year">2026</span> dropship-lab</span><nav><a href="../legal/shipping.html">Shipping</a><a href="../legal/returns.html">Returns</a><a href="../legal/privacy.html">Privacy</a></nav></div></footer>
<script src="../assets/js/main.js"></script>
</body>
</html>
`;
  writeFileSync(resolve(outDir, `${g.slug}.html`), html);
}

/* ---- shop-page blocks: kit + guide teaser ---- */
for (const shop of extra.shops) {
  const file = resolve(site, shop.slug, 'index.html');
  let html = readFileSync(file, 'utf8');
  const rows = shop.products.map((p, i) => `    <li><label><input type="checkbox" data-kit-item data-kit-price="${p.price}" data-kit-name="${esc(p.name)}"${i === 0 ? ' checked' : ''}> ${esc(p.name)} <span>${GBP(p.price)}</span></label></li>`).join('\n');
  const kitSearch = shop.products.map((p) => p.name).join(' ');
  const kit = `<p class="kit-save" data-kit-summary aria-live="polite">Kit total ${GBP(shop.products.reduce((a, p) => a + p.price, 0))} — tick what you want.</p>`;
  const block = `<!--kit:start-->
<h2>${esc(shop.kitName)} <span class="tag">${GBP(shop.kitPrice)}</span></h2>
<p>Buy the lot for ${GBP(shop.kitPrice)} instead of ${GBP(shop.products.reduce((a, p) => a + p.price, 0))}. Untick anything you already own.</p>
<ul class="kit-list">
${rows}
</ul>
${kit}
<p><a class="btn" data-add-kit data-kit="${shop.kitId}" href="https://www.amazon.co.uk/s?k=${encodeURIComponent(kitSearch)}&tag=${TID}" target="_blank" rel="noopener sponsored">Add ${esc(shop.kitName)} to Amazon basket</a></p>
<!--kit:end-->`;

  const mine = guides.filter((g) => g.shop === shop.slug);
  const teaser = mine.length
    ? `<!--guides:start-->
<h2>Read first</h2>
<ul class="guide-links">
${mine.map((g) => `  <li><a href="../guides/${g.slug}.html">${esc(g.title)}</a> — ${esc(g.dek)}</li>`).join('\n')}
</ul>
<!--guides:end-->`
    : '';

  html = html.replace(/<!--kit:start-->[\s\S]*?<!--kit:end-->/, '').replace(/<!--guides:start-->[\s\S]*?<!--guides:end-->/, '');
  const anchor = '\n</main>';
  html = html.replace(anchor, `\n${block}\n${teaser}\n</main>`);
  writeFileSync(file, html);
}

console.log(`guides: ${guides.length} written, kits injected on ${extra.shops.length} shops`);
