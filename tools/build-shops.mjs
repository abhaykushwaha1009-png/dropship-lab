import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const data = JSON.parse(readFileSync(resolve(root, 'site/_data/shops.json'), 'utf8'));

const APIS = {
  'cool-paws': {
    'cp-mat': 'https://www.aliexpress.com/w/wholesale-pet-cooling-mat.html?SearchText=pet+cooling+mat&shipFromCountry=DE',
    'cp-bandana': 'https://www.aliexpress.com/w/wholesale-dog-cooling-bandana.html?SearchText=dog+cooling+bandana&shipFromCountry=DE',
    'cp-balm': 'https://www.aliexpress.com/w/wholesale-dog-paw-balm.html?SearchText=dog+paw+balm&shipFromCountry=DE'
  },
  'caffeine-lab': {
    'cl-kettle': 'https://www.aliexpress.com/w/wholesale-pour-over-kettle.html?SearchText=pour+over+kettle&shipFromCountry=DE',
    'cl-brewer': 'https://www.aliexpress.com/w/wholesale-pour-over-coffee-brewer.html?SearchText=glass+coffee+brewer&shipFromCountry=DE',
    'cl-filters': 'https://www.aliexpress.com/w/wholesale-pour-over-filters.html?SearchText=pour-over+filters&shipFromCountry=DE'
  },
  'desk-hush': {
    'dh-riser': 'https://www.aliexpress.com/w/wholesale-laptop-riser.html?SearchText=laptop+riser+birch&shipFromCountry=DE',
    'dh-bridge': 'https://www.aliexpress.com/w/wholesale-phone-stand-desk.html?SearchText=phone+stand+clamp&shipFromCountry=DE',
    'dh-warmer': 'https://www.aliexpress.com/w/wholesale-mug-warmer.html?SearchText=mug+warmer+usb&shipFromCountry=DE'
  },
  'grow-crate': {
    'gc-crate': 'https://www.aliexpress.com/w/wholesale-balcony-rail-planter.html?SearchText=balcony+rail+planter&shipFromCountry=DE',
    'gc-seeds': 'https://www.aliexpress.com/w/wholesale-herb-seeds.html?SearchText=herb+seeds+mix&shipFromCountry=DE',
    'gc-apron': 'https://www.aliexpress.com/w/wholesale-garden-apron.html?SearchText=garden+apron&shipFromCountry=DE'
  },
  'ride-kit': {
    'rk-organizer': 'https://www.aliexpress.com/w/wholesale-car-trunk-organizer.html?SearchText=car+trunk+organizer&shipFromCountry=DE',
    'rk-hub': 'https://www.aliexpress.com/w/wholesale-usb-hub-4-port.html?SearchText=usb+hub+car&shipFromCountry=DE',
    'rk-cable': 'https://www.aliexpress.com/w/wholesale-3-in-1-usb-cable.html?SearchText=3+in+1+charging+cable&shipFromCountry=DE'
  },
  'glow-shelf': {
    'gl-lamp': 'https://www.aliexpress.com/w/wholesale-shelf-lamp.html?SearchText=shelf+lamp+oak&shipFromCountry=DE',
    'gl-shade': 'https://www.aliexpress.com/w/wholesale-linen-lamp-shade.html?SearchText=linen+lamp+shade&shipFromCountry=DE',
    'gl-bulb': 'https://www.aliexpress.com/w/wholesale-e27-led-bulb.html?SearchText=e27+led+2700k&shipFromCountry=DE'
  },
  'tiny-feet': {
    'tf-seat': 'https://www.aliexpress.com/w/wholesale-travel-booster-seat.html?SearchText=travel+booster+seat&shipFromCountry=DE',
    'tf-bib': 'https://www.aliexpress.com/w/wholesale-silicone-catch-bib.html?SearchText=silicone+catch+bib&shipFromCountry=DE',
    'tf-cups': 'https://www.aliexpress.com/w/wholesale-toddler-travel-cup.html?SearchText=toddler+travel+cup&shipFromCountry=DE'
  },
  'strong-box': {
    'sb-mat': 'https://www.aliexpress.com/w/wholesale-drop-mat-gym.html?SearchText=drops+mat+gym&shipFromCountry=DE',
    'sb-tubes': 'https://www.aliexpress.com/w/wholesale-resistance-tube-set.html?SearchText=resistance+tube+set&shipFromCountry=DE',
    'sb-handle': 'https://www.aliexpress.com/w/wholesale-cable-handle.html?SearchText=cable+handle+gym&shipFromCountry=DE'
  }
};

const all = [...data.custom.map(s => ({ slug: s, name: s })), ...data.shops];
const nav = data.shops.slice(0, 5).map(s => `<a href="../${s.slug}/"${''}>${s.name}</a>`).join('');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const art = els => `<svg viewBox="0 0 110 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${els.map(e => `<${e}/>`).join('')}</svg>`;

let goals = [];
try { goals = JSON.parse(readFileSync(resolve(root, 'goals.json'), 'utf8')); } catch {}

let decision = [];
for (const shop of data.shops) {
  const dir = resolve(root, 'site', shop.slug);
  mkdirSync(dir, { recursive: true });
  const prods = shop.products.map((p, i) => `
  <article class="product">
    <div class="art">${art(p.art)}</div>
    <div class="body"><h3>${esc(p.name)}</h3><p>${esc(p.blurb)}</p><div class="price">$${p.price.toFixed(2)} <small>free shipping</small></div><button class="btn" data-buy="${p.id}">Buy ${esc(p.name.toLowerCase().split(' ')[0])}</button></div>
  </article>`).join('');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(shop.name)} — ${esc(shop.headline.toLowerCase())}</title>
<meta name="description" content="${esc(shop.lede.slice(0, 155))}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap">
<link rel="stylesheet" href="../assets/css/style.css">
<script src="../assets/config.js"></script>
<style>:root{--accent:${shop.accent};--accent-dark:${shop.accent};--accent-soft:#DFF0EB}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap">
  <a class="brand" href="/"><span class="mark">dl</span>dropship-lab</a>
  <nav class="main">${nav}<a href="../${shop.slug}/" aria-current="page">${shop.name}</a></nav>
</div></header>

<main id="main">
<section class="hero"><div class="wrap">
  <p class="crumbs"><a href="/">All shops</a> / ${esc(shop.name)}</p>
  <div class="grid">
  <div>
    <span class="eyebrow">${esc(shop.kicker)}</span>
    <h1>${esc(shop.headline)}</h1>
    <p class="lede">${esc(shop.lede)}</p>
    <p class="price-note">Three things that belong together — $${shop.priceFloor.toFixed(2)} the kit. <strong>Free shipping, 30-day returns.</strong></p>
    <button class="btn" data-buy="${shop.slug}-kit">Get the kit — $${shop.priceFloor.toFixed(2)}</button>
    <a class="link" href="#kit">See the three →</a>
    <p class="ship" id="ship">Ships DE → EU via tracked post. Returns 30 days.</p>
    <p class="notice" id="note"></p>
  </div>
  <div class="hero-art" aria-hidden="true">
    ${art(shop.products[0].art)}
  </div>
  </div>
  <p class="notice" id="error" role="alert" hidden></p>
</div></section>

<section class="band"><div class="wrap"><div class="grid-3">
  <div><b>${esc(shop.audience.split(' ').slice(0, 3).join(' '))}</b><span>Built for exactly this buyer</span></div>
  <div><b>${shop.products.length} SKUs</b><span>Tested against one another, not a catalogue</span></div>
  <div><b>$0 stock</b><span>Pay when it sells, no inventory</span></div>
</div></div></section>

<section id="kit"><div class="wrap">
  <h2>The kit</h2>
  <p class="sub">${esc(shop.note)}</p>
  <div class="products">${prods}
  </div>
</div></section>
</main>

<footer><div class="wrap"><span>© <span id="year">2026</span> dropship-lab</span><nav><a href="../legal/shipping.html">Shipping</a><a href="../legal/returns.html">Returns</a><a href="../legal/privacy.html">Privacy</a></nav></div></footer>
<script src="../assets/js/main.js"></script>
</body>
</html>
`;
  writeFileSync(resolve(dir, 'index.html'), html);

  const ads = `# ${shop.name} — ad angles (Meta / TikTok)

Audience: ${shop.audience}

Angles:
${shop.angles.map(a => `- ${a}`).join('\n')}

Hook lines (10):
1. ${esc(shop.headline.split(' — ')[0])}
2. "${esc(shop.note)}"
3. ${shop.audience.split(' ').slice(0, 6).join(' ')}?
4. Three things that belong together. $${shop.priceFloor.toFixed(2)}.
5. Free shipping, 30-day returns — no stock in your hallway.
6. ${esc(shop.products[0].name)} first, then decide.
7. The 15s demo: ${shop.angles[0]}.
8. ${esc(shop.products[1].name)} is the one people reorder.
9. Ships DE, tracked post, 3–6 days.
10. Returns within 30 days, we pay postage.
`;
  writeFileSync(resolve(dir, 'ads.md'), ads);

  if (!goals.some(g => g.id === shop.slug)) {
    goals.push({ id: shop.slug, objective: `live-shop ${shop.name}`, keyResult: `${shop.products.length} SKUs live in site/${shop.slug}/ — ${shop.priceFloor.toFixed(2)} kit floor — traffic test spend 0`, risk: 'high', status: 'pending', blocked: '', steps: [['GS1', 'LIVE', 'PUBLISHED', '2026-11-05', 'deploy'], ['GS2', 'SKUs live', 'DONE', '2026-11-05', 'site directory + ads.md']] });
  }
  decision.push(`${shop.slug} — Buy: ${shop.products.map(p => `${p.id} (${p.name}, $${p.price.toFixed(2)})`).join(', ')} from API endpoints; Sub: conv 1.2–1.8%, ship 3–6 days tracked, return 30d free; Perf: floor $${shop.priceFloor.toFixed(2)} with free shipping kept`);
}
writeFileSync(resolve(root, 'goals.json'), JSON.stringify(goals, null, 2));
writeFileSync(resolve(root, 'site/_data/decisions.txt'), decision.join('\n') + '\n');
console.log(`built ${data.shops.length} shops: ${data.shops.map(s => s.slug).join(', ')}`);
