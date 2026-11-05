import fs from 'node:fs';
const shops = ['cold-sleep'];
let out = fs.readFileSync('docs/guides/why-cold-sleep.html', 'utf8');
for (const s of shops) out = out.split(`"../${s}/"`).join(`"${s}/"`);
console.log(out.split('\n').filter((l) => l.includes('cold-sleep/')).map((l) => l.slice(0, 70)));
