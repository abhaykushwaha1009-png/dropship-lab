// Static audit of docs/ (GitHub Pages root): link/image integrity, checkout wiring,
// required head tags, content depth. Writes tools/audit.json and prints a summary.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/antigravity/AI Money Ops/drop shopping';
const DOCS = path.join(ROOT, 'docs');
const BASE = '/dropship-lab/';

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else files.push(p);
  }
})(DOCS);

const htmls = files.filter(f => f.endsWith('.html'));
const rel = f => '/' + path.relative(DOCS, f).split(path.sep).join('/');
const exists = new Set(files.map(rel).map(r => r.replace(/\/index\.html$/, '/')));

const out = { pages: [], problems: [] };
const P = (m) => out.problems.push(m);

for (const f of htmls) {
  const r = rel(f);
  const c = fs.readFileSync(f, 'utf8');
  const page = { file: r, bytes: c.length, brokenLocal: [], extLinks: [], checks: {} };

  // --- local links
  for (const m of c.matchAll(/(?:href|src)="([^"#?][^"]*)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(u)) continue;
    const clean = u.replace(/^\/dropship-lab\//, '/').split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = clean.endsWith('/') ? clean : clean;
    if (!exists.has(target) && !exists.has(target + '/')) {
      // file may exist directly
      const direct = path.join(DOCS, clean.replace(/^\//, ''));
      if (!fs.existsSync(direct)) page.brokenLocal.push(u);
    }
  }

  // --- external links
  for (const m of c.matchAll(/href="(https?:\/\/[^"]+)"/g)) page.extLinks.push(m[1]);

  // --- head/SEO requirements
  const has = (re) => re.test(c);
  page.checks.base = has(/<base href="\/dropship-lab\/">/);
  page.checks.canonical = has(/rel="canonical"/);
  page.checks.ogImage = has(/property="og:image"/);
  page.checks.jsonld = has(/application\/ld\+json/);
  page.checks.csp = has(/Content-Security-Policy/);
  page.checks.title = (c.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  page.checks.desc = /name="description" content="([^"]{50,})"/.test(c);
  page.checks.viewport = has(/name="viewport"/);

  // --- commerce wiring
  page.checks.buyLink = (c.match(/href="(https?:\/\/(?:gumroad|whop|checkout|buy\.stripe|pay)[^"]*)"/gi) || []).length;
  page.checks.price = (c.match(/[$£€]\s?\d[\d.,]*/g) || []).slice(0, 4);

  if (!page.checks.base) P(`${r}: missing <base href>`);
  if (!page.checks.canonical) P(`${r}: missing canonical`);
  if (!page.checks.ogImage) P(`${r}: missing og:image`);
  if (page.checks.title.length < 15) P(`${r}: short title "${page.checks.title}"`);
  if (!page.checks.desc) P(`${r}: missing/short meta description`);
  if (page.brokenLocal.length) P(`${r}: ${page.brokenLocal.length} broken local refs: ${page.brokenLocal.slice(0, 5).join(', ')}`);
  out.pages.push(page);
}

fs.writeFileSync(path.join(ROOT, 'tools', 'audit.json'), JSON.stringify(out, null, 1));
console.log(`pages=${htmls.length} problems=${out.problems.length}`);
for (const p of out.problems.slice(0, 60)) console.log(' - ' + p);
const noBuy = out.pages.filter(p => p.file.includes('/') && p.checks.buyLink === 0 && p.file.split('/').length > 2);
console.log(`pages without checkout link: ${noBuy.length}`);
for (const p of noBuy.slice(0, 40)) console.log('   ' + p.file);
