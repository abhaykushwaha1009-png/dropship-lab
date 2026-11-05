// Rebuild docs/ (GitHub Pages root for the public repo) from site/ (Firebase root).
// - copies every file, injects <base href="/dropship-lab/"> and rewrites root-relative
//   hrefs so the site works under the /dropship-lab/ project path;
// - injects the Content-Security-Policy meta into every HTML page;
// - regenerates sitemap.xml + robots.txt for the Pages base URL.
// Idempotent: docs/ is wiped and rebuilt from scratch each run.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/antigravity/AI Money Ops/drop shopping';
const SITE = path.join(ROOT, 'site');
const DOCS = path.join(ROOT, 'docs');
const BASE = 'https://abhaykushwaha.github.io/dropship-lab/';
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://dropship-lab-974ef.web.app; connect-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'";
const KEEP = ['README.md', 'SUPPLIERS.md', 'firebase.json', '.firebaserc', 'fb_projects.txt'];

const shops = fs.readdirSync(SITE, { withFileTypes: true })
  .filter(d => d.isDirectory() && !['assets', 'legal', '_data'].includes(d.name))
  .map(d => d.name).sort();
if (shops.length !== 15) throw new Error(`expected 15 shops, found ${shops.length}`);

// remember root-level extras that live only in docs/
const extras = KEEP.filter(f => fs.existsSync(path.join(DOCS, f)))
  .map(f => [f, fs.readFileSync(path.join(DOCS, f))]);

fs.rmSync(DOCS, { recursive: true, force: true });
fs.cpSync(SITE, DOCS, { recursive: true });
for (const [f, buf] of extras) fs.writeFileSync(path.join(DOCS, f), buf);

const rewrite = (html, slug) => {
  let out = html;
  if (!out.includes('<base href="/dropship-lab/">')) {
    out = out.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="/dropship-lab/">');
  }
  for (const s of shops) out = out.split(`"../${s}/"`).join(`"${s}/"`);
  out = out.split('"../assets/').join('"assets/');
  out = out.split('"../legal/').join('"legal/');
  for (const s of shops) out = out.split(`href="/${s}/"`).join(`href="${s}/"`);
  out = out.split('href="/"').join('href="./"');
  if (!out.includes('http-equiv="Content-Security-Policy"')) {
    out = out.replace('<meta name="viewport"',
      `<meta http-equiv="Content-Security-Policy" content="${CSP}">\n<meta name="viewport"`);
  }
  return out;
};

let n = 0;
const walk = dir => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!e.name.endsWith('.html')) continue;
    const rel = path.relative(DOCS, p).split(path.sep);
    const slug = rel.length > 1 && shops.includes(rel[0]) ? rel[0] : null;
    fs.writeFileSync(p, rewrite(fs.readFileSync(p, 'utf8'), slug));
    n++;
  }
};
walk(DOCS);

const urls = [BASE, ...shops.map(s => `${BASE}${s}/`),
  ...['privacy', 'returns', 'shipping'].map(l => `${BASE}legal/${l}.html`)];
fs.writeFileSync(path.join(DOCS, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u, i) => `  <url><loc>${u}</loc><priority>${i === 0 ? '1.0' : '0.9'}</priority></url>`).join('\n') +
  '\n</urlset>\n');
fs.writeFileSync(path.join(DOCS, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n`);
console.log(`rewrote ${n} html files, ${shops.length} shops, sitemap ${urls.length} urls`);
