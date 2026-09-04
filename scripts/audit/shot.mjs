import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const ROOT = '/Users/fumiya/Downloads/uneri';
const part = process.argv[2], out = process.argv[3], vw = Number(process.argv[4] || 1200);
const server = createServer(async (req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = p.startsWith('/reference/') ? path.join(ROOT, p) : path.join(ROOT, 'dist', p);
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'content-type': { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }[path.extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file)); } catch { res.writeHead(404); res.end(); }
});
await new Promise((ok) => server.listen(4397, ok));
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: vw, height: 900 } });
await pg.goto(`http://localhost:4397/reference/fixtures/${part}.html`);
await pg.evaluate(() => document.fonts.ready);
await pg.locator('article').screenshot({ path: out });
await b.close(); server.close();
