import fs from 'node:fs';
const f = 'docs/guides/why-cold-sleep.html';
const o = fs.readFileSync(f, 'utf8');
for (const l of o.split('\n')) if (l.includes('cold-sleep/')) console.log(JSON.stringify(l.slice(0, 80)));
