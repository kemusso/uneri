#!/usr/bin/env node
/** hover.mjs <part> "<selector>" [--vw N] [--impl] — computed styles before/after hovering. */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const args = process.argv.slice(2);
const [part, selector] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const vw = Number(args[args.indexOf('--vw') + 1]) || 1200;
const useImpl = args.includes('--impl');
const props = (args.includes('--props') ? args[args.indexOf('--props') + 1] : 'background-color,color,box-shadow,transform,opacity,border-top-color,filter,translate').split(',');
const server = createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = p.startsWith('/reference/') ? path.join(ROOT, p) : path.join(ROOT, 'dist', p);
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'content-type': { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }[path.extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file)); } catch { res.writeHead(404); res.end(); }
});
await new Promise((ok) => server.listen(4395, ok));
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: vw, height: 900 } });
await pg.goto(`http://localhost:4395${useImpl ? `/catalog/${part}/` : `/reference/fixtures/${part}.html`}`);
await pg.evaluate(() => document.fonts.ready);
const read = () => pg.evaluate(({ selector, props }) => {
  const el = document.querySelector(selector); const cs = getComputedStyle(el);
  const out = { self: {}, before: {}, after: {} };
  for (const p of props) { out.self[p] = cs.getPropertyValue(p); out.before[p] = getComputedStyle(el, '::before').getPropertyValue(p); out.after[p] = getComputedStyle(el, '::after').getPropertyValue(p); }
  return out;
}, { selector, props });
const cold = await read();
await pg.locator(selector).first().hover();
await pg.waitForTimeout(600);
const hot = await read();
for (const k of ['self', 'before', 'after']) for (const p of props) if (cold[k][p] !== hot[k][p]) console.log(`${k} ${p}: ${cold[k][p]}  ->  ${hot[k][p]}`);
await b.close(); server.close();
