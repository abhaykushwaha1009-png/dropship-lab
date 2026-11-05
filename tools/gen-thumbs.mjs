// One-off generator: hub card thumbnails for every JSON-built shop.
// Line-art product trio in the shop accent, on a solid accent field.
// Custom shops (hearth, kitchen, paws) keep their hand-drawn scenes.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(resolve(root, 'site/_data/shops.json'), 'utf8'));
const custom = new Set(data.custom);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const glyph = (art, accent, x, y) =>
  `<svg x="${x}" y="${y}" width="110" height="120" viewBox="0 0 110 120" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${art.map(e => `<${e}/>`).join('')}</svg>`;

for (const s of data.shops) {
  if (custom.has(s.slug)) continue;
  const positions = [40, 265, 490];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-label="${esc(s.name)} — ${esc(s.kicker)}">
<rect width="640" height="480" fill="${s.accent}"/>
<circle cx="80" cy="70" r="90" fill="#ffffff" opacity=".07"/>
<circle cx="580" cy="380" r="120" fill="#ffffff" opacity=".07"/>
${s.products.map((p, i) => `<rect x="${positions[i] - 10}" y="118" width="160" height="204" rx="18" fill="#ffffff"/>` + glyph(p.art, s.accent, positions[i] + 25, 160)).join('\n')}
<text x="320" y="400" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="34" font-weight="800" fill="#ffffff">${esc(s.name)}</text>
<text x="320" y="436" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="600" fill="#ffffff" opacity=".82">${esc(s.kicker)}</text>
</svg>
`;
  writeFileSync(resolve(root, `site/assets/img/${s.slug}.svg`), svg);
  console.log(`thumb ${s.slug}`);
}
