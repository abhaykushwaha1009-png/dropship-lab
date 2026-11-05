import fs from 'node:fs';
const guides = JSON.parse(fs.readFileSync('site/_data/guides.json', 'utf8')).guides;
const dirs = new Set(fs.readdirSync('site', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name));
for (const g of guides) {
  for (const l of g.links || []) {
    const slug = (l.href || '').replace(/^\/|\/$/g, '');
    if (!dirs.has(slug)) console.log(`MISSING shop '${slug}' referenced by guide '${g.id}' (label: ${l.label})`);
  }
}
console.log('done');