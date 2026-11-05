// Inject the Content-Security-Policy meta into every site/ HTML page (Firebase root).
// Idempotent: skips pages that already carry it.
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'C:/antigravity/AI Money Ops/drop shopping/site';
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://dropship-lab-974ef.web.app; connect-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'";

let n = 0;
const walk = dir => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!e.name.endsWith('.html')) continue;
    const html = fs.readFileSync(p, 'utf8');
    if (html.includes('http-equiv="Content-Security-Policy"')) continue;
    fs.writeFileSync(p, html.replace('<meta name="viewport"',
      `<meta http-equiv="Content-Security-Policy" content="${CSP}">\n<meta name="viewport"`));
    n++;
  }
};
walk(SITE);
console.log(`csp added to ${n} pages`);
