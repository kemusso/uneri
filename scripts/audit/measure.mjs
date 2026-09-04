#!/usr/bin/env node
/**
 * Measure computed styles in a reference fixture (clean-room-safe: observes rendering, not source).
 *
 *   node scripts/audit/measure.mjs <part> "<css selector>" [--vw 1200] [--all] [--pseudo] [--props color,padding-top]
 *
 * Prints computed styles of the first (or --all) matching element(s) in reference/fixtures/<part>.html,
 * plus its bounding box. --pseudo also dumps ::before / ::after.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const args = process.argv.slice(2);
const [part, selector] = args.filter((a) => !a.startsWith('--') && !/^\d+$/.test(a) && !args[args.indexOf(a) - 1]?.startsWith('--'));
if (!part || !selector) { console.error('usage: measure.mjs <part> "<selector>" [--vw N] [--all] [--pseudo] [--props a,b] [--impl]'); process.exit(2); }
const vw = Number(args[args.indexOf('--vw') + 1]) || 1200;
const all = args.includes('--all');
const pseudo = args.includes('--pseudo');
const useImpl = args.includes('--impl');
const propsArg = args.includes('--props') ? args[args.indexOf('--props') + 1].split(',') : null;

const DEFAULT_PROPS = ['display', 'position', 'width', 'height', 'color', 'background-color', 'background-image', 'background-size', 'background-position', 'border', 'border-radius', 'box-shadow', 'padding', 'margin', 'font-size', 'font-weight', 'font-family', 'line-height', 'letter-spacing', 'text-align', 'text-decoration-line', 'gap', 'opacity', 'overflow', 'z-index'];
const PSEUDO_EXTRA = ['content', 'top', 'left', 'right', 'bottom', 'transform', 'border-color', 'border-width', 'border-style'];

const port = 4398;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = p.startsWith('/reference/') ? path.join(ROOT, p) : path.join(ROOT, 'dist', p);
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((ok) => server.listen(port, ok));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: vw, height: 900 } });
const url = useImpl ? `http://localhost:${port}/catalog/${part}/` : `http://localhost:${port}/reference/fixtures/${part}.html`;
const r = await page.goto(url);
if (!r?.ok()) { console.error('not found:', url); await browser.close(); server.close(); process.exit(1); }
await page.evaluate(() => document.fonts.ready);

const out = await page.evaluate(({ selector, all, pseudo, props, extra }) => {
  const els = all ? [...document.querySelectorAll(selector)] : [document.querySelector(selector)].filter(Boolean);
  return els.map((el) => {
    const cs = getComputedStyle(el);
    const b = el.getBoundingClientRect();
    const rec = { tag: el.tagName.toLowerCase(), class: el.className, box: { x: +b.left.toFixed(2), y: +(b.top + scrollY).toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) }, style: {} };
    for (const p of props) rec.style[p] = cs.getPropertyValue(p);
    if (pseudo) for (const pe of ['::before', '::after']) {
      const pcs = getComputedStyle(el, pe);
      if (pcs.content && pcs.content !== 'none' && pcs.content !== 'normal') { rec[pe] = {}; for (const p of [...props, ...extra]) rec[pe][p] = pcs.getPropertyValue(p); }
    }
    return rec;
  });
}, { selector, all, pseudo, props: propsArg ?? DEFAULT_PROPS, extra: PSEUDO_EXTRA });

await browser.close(); server.close();
if (!out.length) { console.log('no match:', selector); process.exit(1); }
for (const rec of out) {
  console.log(`\n<${rec.tag} class="${rec.class}">  box ${rec.box.w}×${rec.box.h} at (${rec.box.x},${rec.box.y}) @${vw}px`);
  for (const [k, v] of Object.entries(rec.style)) if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') console.log(`  ${k}: ${v}`);
  for (const pe of ['::before', '::after']) if (rec[pe]) { console.log(`  ${pe}`); for (const [k, v] of Object.entries(rec[pe])) if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== 'rgba(0, 0, 0, 0)') console.log(`    ${k}: ${v}`); }
}
