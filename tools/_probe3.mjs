import fs from 'node:fs';
const SITE = 'site';
const shops = fs.readdirSync(SITE, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !['assets', 'legal', '_data', '.firebase', 'guides'].includes(d.name))
  .map((d) => d.name).sort();
console.log(shops.length, shops.includes('cold-sleep'));
let out = fs.readFileSync('docs/guides/why-cold-sleep.html', 'utf8');
for (const s of shops) out = out.split(`"../${s}/"`).join(`"${s}/"`);
console.log(out.split('\n').filter((l) => l.includes('cold-sleep/')).map((l) => l.slice(0, 60)));
