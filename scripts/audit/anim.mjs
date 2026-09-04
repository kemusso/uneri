#!/usr/bin/env node
/** anim.mjs <part> "<selector>" [--pseudo ::after] [--impl] [--steps 12] — sample an animation's frames. */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const args = process.argv.slice(2);
const [part, selector] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const pseudo = args.includes('--pseudo') ? args[args.indexOf('--pseudo') + 1] : '::after';
const steps = Number(args[args.indexOf('--steps') + 1]) || 12;
const useImpl = args.includes('--impl');
const server = createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = p.startsWith('/reference/') ? path.join(ROOT, p) : path.join(ROOT, 'dist', p);
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'content-type': { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }[path.extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file)); } catch { res.writeHead(404); res.end(); }
});
await new Promise((ok) => server.listen(4393, ok));
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1200, height: 900 } });
await pg.goto(`http://localhost:4393${useImpl ? `/catalog/${part}/` : `/reference/fixtures/${part}.html`}`);
await pg.evaluate(() => document.fonts.ready);
const dur = await pg.evaluate(({ selector, pseudo }) => parseFloat(getComputedStyle(document.querySelector(selector), pseudo).animationDuration), { selector, pseudo });
console.log(`duration ${dur}s`);
for (let i = 0; i <= steps; i++) {
  const t = (dur * i) / steps;
  const v = await pg.evaluate(({ selector, pseudo, t }) => {
    const st = document.getElementById('un-anim') ?? document.head.appendChild(Object.assign(document.createElement('style'), { id: 'un-anim' }));
    st.textContent = `*, *::before, *::after { animation-play-state: paused !important; animation-delay: -${t}s !important; }`;
    const cs = getComputedStyle(document.querySelector(selector), pseudo);
    return { transform: cs.transform, opacity: cs.opacity, left: cs.left, width: cs.width };
  }, { selector, pseudo, t });
  console.log(`${(100 * i / steps).toFixed(0).padStart(3)}%  opacity=${v.opacity}  transform=${v.transform}  left=${v.left} w=${v.width}`);
}
await b.close(); server.close();
