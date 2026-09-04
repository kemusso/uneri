#!/usr/bin/env node
/**
 * Container check — spec/04-audit.md §5
 *
 *   node scripts/audit/standalone.mjs [part …] [--verbose]
 *
 * A part must decorate the same way outside `.un-content` as inside it (spec/01-coding-rules.md §3).
 * For every `[data-variant]` of every built catalog page this renders the markup twice — inside
 * `.un-content` and in a bare div with the same typography — then, for every rule in
 * `src/styles/parts/*.css`, compares exactly the properties that rule declares on exactly the
 * elements (and pseudo-elements) it targets. Anything that only lands inside the container fails.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const only = args.filter((a) => !a.startsWith('--'));
// decoration-critical properties, compared on every decorated element and every pseudo-element even
// when no part rule declares them — otherwise deleting a declaration would go unnoticed
const CRITICAL = ['content', 'position', 'display', 'box-sizing', 'color', 'background-color', 'background-image',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-color',
  'border-radius', 'box-shadow', 'mask-image', 'clip-path', 'transform', 'opacity', 'overflow',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'counter-increment', 'counter-reset'];
// elements a part decorates itself: a BEM modifier, minus the parts that are container-scoped on
// purpose (headings and the article-body element defaults)
// every element a part decorates itself, minus the ones that are container-scoped on purpose:
// headings, the article-body element defaults, and a plain (unmodified) list
const DECORATED = '[class*="un-"]:not([class*="un-heading"]):not([class*="un-content"])'
  + ':not([class*="un-image"]):not([class*="un-table"]):not(.un-list:not([class*="--"]))';
const VIEWPORT = 900; // wide enough for the 600px min-width rules, narrow enough to skip 960/1200
const TYPO = 'color:#333;font-family:var(--un-font-family);font-size:1rem;font-weight:500;line-height:1.8';

// ---------- collect the declarations each part rule makes ----------
const partsDir = path.join(ROOT, 'src', 'styles', 'parts');
// heading.css styles bare h2/h3/h4 inside the article body, so it is container-scoped by design
// (spec/01-coding-rules.md §3). Everything else must stand on its own.
const CONTAINER_SCOPED = new Set(['heading.css']);
const rules = [];
// the blanket rules first: every decorated element and every pseudo, whatever the CSS declares
for (const [selector, pseudo] of [[DECORATED, null], [DECORATED, '::before'], [DECORATED, '::after'], [`${DECORATED} li`, '::before'], [`${DECORATED} li`, '::after']]) {
  rules.push({ file: '(critical)', selector, pseudo, props: CRITICAL });
}
for (const file of (await readdir(partsDir)).filter((f) => f.endsWith('.css'))) {
  let css = await readFile(path.join(partsDir, file), 'utf8');
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // keep rules at the top level and inside `min-width: 600px` (the viewport used here)
  const blocks = [];
  css.replace(/@media([^{]+)\{([\s\S]*?)\n\}/g, (m, cond, body) => { if (/min-width:\s*600px/.test(cond)) blocks.push(body); return ''; });
  blocks.push(css.replace(/@media[^{]+\{[\s\S]*?\n\}/g, '').replace(/@keyframes[^{]+\{[\s\S]*?\n\}/g, ''));
  for (const body of blocks) {
    for (const m of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const decls = m[2].split(';').map((d) => d.trim()).filter((d) => d.includes(':') && !d.startsWith('--'));
      // a length declared as a percentage (or a calc on one) resolves against content the article
      // container is entitled to style, so comparing its used value across contexts proves nothing
      const props = decls
        .filter((d) => !/^(width|height|min-|max-|top|right|bottom|left|inset)/.test(d.split(':')[0].trim()) || !/%|calc\(/.test(d))
        .map((d) => d.split(':')[0].trim());
      if (!props.length) continue;
      for (const sel of m[1].split(',').map((x) => x.trim()).filter(Boolean)) {
        // heading.css styles bare elements and is container-scoped on purpose (spec/01 §3);
        // a `.un-content` prefix in any other part file is itself the failure
        if (sel.includes('.un-content')) {
          if (CONTAINER_SCOPED.has(file)) continue;
          rules.push({ file, selector: sel, pseudo: null, props: [], containerScoped: true });
          continue;
        }
        const pe = sel.match(/::?(before|after)$/);
        rules.push({ file, selector: sel.replace(/::?(before|after)$/, '').trim() || '*', pseudo: pe ? `::${pe[1]}` : null, props });
      }
    }
  }
}

// ---------- render every catalog variant in both contexts ----------
const port = 4394;
const server = createServer(async (req, res) => {
  let file = path.join(ROOT, 'dist', decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(await readFile(file)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((ok) => server.listen(port, ok));
const cssDir = path.join(ROOT, 'dist', '_astro');
const built = (await Promise.all((await readdir(cssDir)).filter((f) => f.endsWith('.css')).map((f) => readFile(path.join(cssDir, f), 'utf8')))).join('\n');
const parts = (await readdir(path.join(ROOT, 'dist', 'catalog'), { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name).filter((p) => !only.length || only.includes(p));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: VIEWPORT, height: 800 } });

const measure = async (html, open, close) => {
  await page.setContent(`<style>${built}</style><body style="margin:0"><div style="width:600px">${open}<div id="un-sample">${html}</div>${close}</div>`);
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate((rules) => rules.map((r) => {
    let els = [];
    const sample = document.getElementById('un-sample');
    try {
      els = [...document.querySelectorAll(r.selector)].filter((el) => sample.contains(el));
    } catch { return []; }
    return els.map((el, i) => {
      const cs = getComputedStyle(el, r.pseudo);
      const v = {};
      for (const p of r.props) v[p] = cs.getPropertyValue(p);
      // bare headings are container-scoped by design, so em-based values that resolve against
      // their font-size are not comparable outside the container
      const bareHeading = /^h[1-6]$/i.test(el.tagName) && !/(^|\s)un-[a-z0-9-]+/.test(el.className || '');
      return { i, v, bareHeading };
    });
  }), rules);
};

let bad = 0, checked = 0;
for (const part of parts) {
  await page.goto(`http://localhost:${port}/catalog/${part}/`);
  const variants = await page.$$eval('[data-variant]', (els) => els.map((e) => ({ name: e.dataset.variant, html: e.innerHTML })));
  for (const v of variants) {
    checked++;
    const inside = await measure(v.html, '<div class="un-content">', '</div>');
    const outside = await measure(v.html, `<div style="${TYPO}">`, '</div>');
    const diffs = [];
    rules.forEach((r, ri) => {
      if (r.containerScoped) { diffs.push(`${r.file}: rule "${r.selector}" depends on .un-content`); return; }
      const a = inside[ri], b = outside[ri];
      if (a.length !== b.length) { diffs.push(`${r.selector}${r.pseudo ?? ''}: matched ${a.length} inside, ${b.length} outside`); return; }
      a.forEach((node, n) => {
        if (node.bareHeading) return;
        for (const p of r.props) if (node.v[p] !== b[n].v[p]) diffs.push(`${r.selector}${r.pseudo ?? ''}[${n}] ${p}: in=${node.v[p]} out=${b[n].v[p]}`);
      });
    });
    if (diffs.length) { bad++; console.log(`NG  ${part}/${v.name}  (${diffs.length})`); for (const d of [...new Set(diffs)].slice(0, verbose ? 999 : 5)) console.log(`      ${d}`); }
    else if (verbose) console.log(`OK  ${part}/${v.name}`);
  }
}
await browser.close(); server.close();
console.log(bad ? `\nstandalone: FAIL (${bad}/${checked})` : `\nstandalone: OK (${checked} variants, ${rules.length} rules)`);
process.exit(bad ? 1 : 0);
