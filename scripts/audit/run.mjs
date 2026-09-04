#!/usr/bin/env node
/**
 * uneri audit runner — spec/04-audit.md §2
 *
 *   node scripts/audit/run.mjs <part> [--no-build] [--port 4399]
 *
 * Renders reference/fixtures/<part>.html (SWELL) and dist/catalog/<part>/ (uneri)
 * side by side, per [data-variant] and per viewport, and writes:
 *   audits/<part>/shots/<variant>-<vw>-{ref,impl,diff}.png
 *   audits/<part>/report.json
 *   audits/<part>/report.md
 */
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const args = process.argv.slice(2);
const part = args.find((a) => !a.startsWith('--'));
if (!part) {
  console.error('usage: node scripts/audit/run.mjs <part> [--no-build] [--port N]');
  process.exit(2);
}
const noBuild = args.includes('--no-build');
const port = Number(args[args.indexOf('--port') + 1]) || 4399;

const VIEWPORTS = [375, 768, 1200];
const SHOT_PAD = 24; // px of surroundings included in every screenshot
const THRESH = { pixelPct: 0.3, boxPx: 1, colorDist: 3, lengthPx: 0.5, inkCentrePx: 2, inkSizeRatio: 0.3 };
const STYLE_PROPS = [
  'color', 'background-color', 'background-image',
  'border-top-width', 'border-top-style', 'border-top-color',
  'border-right-width', 'border-right-style', 'border-right-color',
  'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
  'border-left-width', 'border-left-style', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
  'box-shadow', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-align', 'text-decoration-line', 'text-decoration-color',
  'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-items', 'align-content', 'justify-content', 'grid-template-columns',
  'object-fit', 'vertical-align',
  'display', 'gap', 'width', 'min-width', 'max-width', 'height', 'opacity', 'counter-reset', 'counter-increment',
  'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay',
  'animation-name', 'animation-duration', 'animation-timing-function', 'animation-iteration-count', 'animation-direction', 'animation-fill-mode',
  'position', 'top', 'right', 'bottom', 'left', 'z-index', 'transform', 'clear', 'float',
  'visibility', 'pointer-events', 'box-sizing', 'overflow-x', 'overflow-y',
  'background-size', 'background-repeat', 'background-position', 'background-clip',
];
// parts whose hover state matters (spec/04-audit.md §2-5)
const HOVER_PARTS = new Set(['button', 'link-list', 'box-menu', 'blog-card', 'banner-link', 'accordion', 'faq', 'tab']);

// parts with CSS animations (spec/04-audit.md §2.2). uneri writes its own keyframes, so the moving
// state can never match frame for frame; both sides are frozen and only the static design compared.
const ANIM_PARTS = new Set(['button']);
// pausing (instead of removing) keeps animation-* comparable while pinning every animated property
// to the 0% frame on both sides; transitions are removed so hover end-states are read directly
// animations only: transitions are left alone so `transition-*` stays comparable; a forced hover
// finishes its transitions through the Web Animations API before anything is read
const FREEZE_CSS = '*, *::before, *::after { animation-play-state: paused !important; animation-delay: 0s !important; }';

const MOTION_STEPS = 16; // frames sampled across one animation cycle for the filmstrip
// uneri writes its own keyframes, so the name can never match
const ANIM_SKIP_PROPS = new Set(['animation-name']);

// parts that draw icons (spec/04-audit.md §2.1). The reference uses an icon font and uneri uses
// SVG, so the glyph itself can never match. For these parts the pixel diff is taken with the glyph
// painted transparent on both sides, and the glyph is compared separately by its ink box.
const ICON_GLYPH_CSS = {
  ref: '[class*="is-style-icon_"]::before, [class*="is-style-big_icon_"]::before { color: transparent !important; }',
  impl: '[class*="un-box--icon-"]::before { background-color: transparent !important; } [class*="un-box--big-icon-"]::before { background-image: none !important; }',
};
const ICON_PARTS = {
  box: ICON_GLYPH_CSS, // group variants may hold icon boxes
  list: {
    ref: '.is-style-check_list>li::before, .is-style-good_list>li::before, .is-style-bad_list>li::before, .is-style-triangle_list>li::before { color: transparent !important; }',
    impl: '.un-list--check>li::before, .un-list--good>li::before, .un-list--bad>li::before, .un-list--triangle>li::before { background-color: transparent !important; }',
  },
  'icon-box': ICON_GLYPH_CSS,
};
const iconPart = ICON_PARTS[part] ?? null;
// glyph-only style props: never comparable between an icon font and an SVG
const ICON_SKIP_PROPS = new Set(['content', 'font-family', 'background-image', 'mask-image', 'background-size', 'background-repeat', 'background-position']);
const isIconPseudo = (rec) => /icomoon/i.test(rec['font-family'] ?? '');

// ---------- build ----------
if (!noBuild) {
  const r = spawnSync('npx', ['astro', 'build'], { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// ---------- static server: / -> dist, /reference -> reference ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = p.startsWith('/reference/') ? path.join(ROOT, p) : path.join(ROOT, 'dist', p);
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('404 ' + p);
  }
});
await new Promise((ok) => server.listen(port, ok));

const REF_URL = `http://localhost:${port}/reference/fixtures/${part}.html`;
const IMPL_URL = `http://localhost:${port}/catalog/${part}/`;
const outDir = path.join(ROOT, 'audits', part);
const shotDir = path.join(outDir, 'shots');
await rm(shotDir, { recursive: true, force: true }); // stale shots from an earlier run would mislead the review
await mkdir(shotDir, { recursive: true });

// ---------- helpers ----------
const rgb = (s) => { const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
const colorDist = (a, b) => { const A = rgb(a), B = rgb(b); if (!A || !B) return a === b ? 0 : Infinity; if (A[3] === 0 && B[3] === 0) return 0; return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]) + Math.abs(A[3] - B[3]) * 255; };
const px = (s) => { const m = s && s.match(/^(-?[\d.]+)px$/); return m ? +m[1] : null; };
function styleEqual(prop, a, b) {
  if (a === b) return true;
  if (prop === 'content') { const n = (v) => v.replace(/counter\([^),]+/g, 'counter('); if (n(a) === n(b)) return true; }
  if (/color$/.test(prop)) return colorDist(a, b) <= THRESH.colorDist;
  const pa = px(a), pb = px(b);
  if (pa !== null && pb !== null) return Math.abs(pa - pb) <= THRESH.lengthPx;
  { // multi-length values such as transform-origin: "0px 10.8047px"
    const la = a.split(/\s+/), lb = b.split(/\s+/);
    if (la.length > 1 && la.length === lb.length && la.every((v) => px(v) !== null) && lb.every((v) => px(v) !== null)) {
      return la.every((v, i) => Math.abs(px(v) - px(lb[i])) <= THRESH.lengthPx);
    }
  }
  // the reference CSS is autoprefixed, so its transition lists carry -webkit- duplicates
  if (prop === 'transition-property') {
    const n = (v) => v.split(',').map((x) => x.trim()).filter((x) => !x.startsWith('-webkit-')).join(',');
    if (n(a) === n(b)) return true;
  }
  if (/^transition-(duration|delay|timing-function)$/.test(prop)) {
    const uni = (v) => { const l = v.split(',').map((x) => x.trim()); return l.every((x) => x === l[0]) ? l[0] : null; };
    const ua = uni(a), ub = uni(b);
    if (ua !== null && ua === ub) return true;
  }
  // the bundler drops default positions: circle(12%) == circle(12% at 50% 50%)
  if (prop === 'clip-path') { const n = (v) => v.replace(/\s+at\s+50%\s+50%/, ''); if (n(a) === n(b)) return true; }
  if (/^counter-(increment|reset)$/.test(prop)) { const n = (v) => v.replace(/^\S+/, 'counter'); if (n(a) === n(b)) return true; }
  if (prop === 'box-shadow' || prop === 'background-image') {
    // compare token-wise with color tolerance
    const ta = a.split(/(rgba?\([^)]*\))/), tb = b.split(/(rgba?\([^)]*\))/);
    if (ta.length !== tb.length) return false;
    return ta.every((t, i) => rgb(t) ? colorDist(t, tb[i]) <= THRESH.colorDist : t.replace(/\s+/g, '') === tb[i].replace(/\s+/g, ''));
  }
  return false;
}

// collect computed styles of element tree (depth ≤ 4), keyed by a structural path
const COLLECT = (root, { depthMax, props }) => {
  const out = [];
  const walk = (el, pathStr, depth) => {
    const cs = getComputedStyle(el);
    const rec = { path: pathStr, tag: el.tagName.toLowerCase(), text: (el.childNodes.length && el.firstChild.nodeType === 3 ? el.firstChild.textContent.trim().slice(0, 20) : ''), style: {} };
    for (const p of props) rec.style[p] = cs.getPropertyValue(p);
    for (const pe of ['::before', '::after']) {
      const pcs = getComputedStyle(el, pe);
      if (pcs.content && pcs.content !== 'none' && pcs.content !== 'normal') {
        const s = {};
        for (const p of [...props, 'content', 'font-family', 'transform-origin', 'white-space', 'clip-path', 'letter-spacing', 'counter-increment', 'counter-reset']) s[p] = pcs.getPropertyValue(p);
        rec[pe] = s;
      }
    }
    out.push(rec);
    if (depth >= depthMax) return;
    let i = 0;
    for (const c of el.children) walk(c, `${pathStr}>${c.tagName.toLowerCase()}[${i++}]`, depth + 1);
  };
  walk(root, root.tagName.toLowerCase(), 0);
  return out;
};

// paints/unpaints the icon glyphs of a page (icon parts only)
async function setGlyphHidden(page, css, hidden) {
  await page.evaluate(({ css, hidden }) => {
    let el = document.getElementById('un-audit-hide-glyph');
    if (!el) { el = document.createElement('style'); el.id = 'un-audit-hide-glyph'; document.head.append(el); }
    el.textContent = hidden ? css : '';
  }, { css, hidden });
}

// bounding box of the pixels that appear when the glyph is painted
function inkBox(shownBuf, hiddenBuf) {
  const a = PNG.sync.read(shownBuf), b = PNG.sync.read(hiddenBuf);
  if (a.width !== b.width || a.height !== b.height) return null;
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
  for (let y = 0; y < a.height; y++) {
    for (let x = 0; x < a.width; x++) {
      const i = (y * a.width + x) * 4;
      const d = Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2]));
      if (d > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
  }
  return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

// one PNG per side stacking N frames of the animation cycle, so motion can be reviewed by eye
async function filmstrip(page, variant) {
  const loc = page.locator(`[data-variant="${variant}"]`).first();
  const frames = [];
  for (let i = 0; i < MOTION_STEPS; i++) {
    // seek with the Web Animations API: `animation-delay` on an already-paused animation does not
    // move it, and leaves a hold time that differs between runs
    await page.evaluate(({ i, steps }) => {
      document.getElementById('un-motion')?.remove();
      for (const a of document.getAnimations()) {
        a.pause();
        const d = a.effect?.getTiming?.().duration;
        if (typeof d === 'number' && d > 0) a.currentTime = (d * i) / steps;
      }
    }, { i, steps: MOTION_STEPS });
    frames.push(PNG.sync.read(await loc.screenshot())); // not 'disabled': that would reset the animation
  }
  await page.evaluate(() => { for (const a of document.getAnimations()) a.play(); });
  const w = Math.max(...frames.map((f) => f.width)), h = frames.reduce((a, f) => a + f.height, 0);
  const out = new PNG({ width: w, height: h });
  let y = 0;
  for (const f of frames) { PNG.bitblt(f, out, 0, 0, f.width, f.height, 0, y); y += f.height; }
  return PNG.sync.write(out);
}

// forcing the pseudo-class through CDP is deterministic; moving the mouse is not (the pointer can
// miss, and the state can be lost between the screenshot and the style read)
const cdpByPage = new WeakMap();
async function cdpFor(page) {
  if (!cdpByPage.has(page)) {
    const session = await page.context().newCDPSession(page);
    await session.send('DOM.enable'); await session.send('CSS.enable');
    cdpByPage.set(page, session);
  }
  return cdpByPage.get(page);
}
async function forceHover(page, variant, on) {
  const cdp = await cdpFor(page);
  const { root } = await cdp.send('DOM.getDocument');
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-variant="${variant}"] :is(a,button,summary,[role=tab])` });
  if (nodeId) await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: on ? ['hover'] : [] });
}

async function capture(page, variant, hover, glyphCss) {
  const loc = page.locator(`[data-variant="${variant}"]`).first();
  if (!(await loc.count())) return null;
  await loc.scrollIntoViewIfNeeded();
  if (hover) {
    await forceHover(page, variant, true);
    // jump every transition to its end instead of waiting it out: deterministic and much faster
    await page.evaluate(() => { for (const a of document.getAnimations()) if (a.constructor.name === 'CSSTransition') a.finish(); });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
  }
  if (ANIM_PARTS.has(part)) {
    // pin every live animation to its first frame: the CSS freeze alone leaves a race between
    // "still paused at 0%" and "animation already dropped by :hover"
    await page.evaluate(() => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = 0; } });
  }
  const box = await loc.boundingBox();
  const styles = await loc.evaluate(COLLECT, { depthMax: 6, props: STYLE_PROPS });
  // snap the wrapper to an integer y before shooting: a fractional offset changes how 1px
  // borders anti-alias and would show up as a diff that has nothing to do with the part
  await loc.evaluate((el) => {
    const top = el.getBoundingClientRect().top;
    const frac = top - Math.floor(top);
    if (frac) el.style.marginTop = `${parseFloat(getComputedStyle(el).marginTop) + (1 - frac)}px`;
  });
  // shoot a padded region: badges and rules that stick out of the variant box must be compared too
  const shoot = async () => {
    // fullPage so the clip is in page coordinates and never gets cut off by the viewport
    const b = await loc.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; });
    const clip = { x: Math.max(0, b.x - SHOT_PAD), y: Math.max(0, b.y - SHOT_PAD), width: b.w + SHOT_PAD * 2, height: b.h + SHOT_PAD * 2 };
    return page.screenshot({ animations: 'disabled', fullPage: true, clip });
  };
  const png = await shoot();
  let glyphless = null;
  if (glyphCss) {
    await setGlyphHidden(page, glyphCss, true);
    glyphless = await shoot();
    await setGlyphHidden(page, glyphCss, false);
  }
  await loc.evaluate((el) => { el.style.marginTop = ''; });
  if (hover) await forceHover(page, variant, false);
  return { box, png, glyphless, styles };
}

function diffStyles(ref, impl) {
  const diffs = [];
  const byPath = new Map(impl.map((r) => [r.path, r]));
  for (const r of ref) {
    const m = byPath.get(r.path);
    if (!m) { diffs.push({ path: r.path, prop: '(element)', ref: r.tag, impl: '(missing)' }); continue; }
    for (const p of STYLE_PROPS) {
      if (r.path === ref[0].path && /^margin-/.test(p)) continue; // wrapper margins come from the harness page, not the part
      if (ANIM_PARTS.has(part) && ANIM_SKIP_PROPS.has(p)) continue;
      if (!styleEqual(p, r.style[p], m.style[p])) diffs.push({ path: r.path, prop: p, ref: r.style[p], impl: m.style[p] });
    }
    for (const pe of ['::before', '::after']) {
      if (!r[pe] && !m[pe]) continue;
      if (!r[pe] || !m[pe]) { diffs.push({ path: r.path + pe, prop: '(pseudo)', ref: r[pe] ? 'present' : 'absent', impl: m[pe] ? 'present' : 'absent' }); continue; }
      const icon = iconPart && isIconPseudo(r[pe]);
      for (const p of Object.keys(r[pe])) {
        if (icon && ICON_SKIP_PROPS.has(p)) continue; // glyph-only: verified by the ink box instead
        if (ANIM_PARTS.has(part) && ANIM_SKIP_PROPS.has(p)) continue; // keyframes are ours to name
        if (icon && p === 'background-color' && rgb(r[pe][p])?.[3] === 0) continue; // ref paints the glyph as text, uneri as a mask fill
        if (!styleEqual(p, r[pe][p], m[pe][p])) diffs.push({ path: r.path + pe, prop: p, ref: r[pe][p], impl: m[pe][p] });
      }
    }
  }
  const refPaths = new Set(ref.map((r) => r.path));
  for (const m of impl) if (!refPaths.has(m.path)) diffs.push({ path: m.path, prop: '(element)', ref: '(missing)', impl: m.tag });
  return diffs;
}

function pixelDiff(aBuf, bBuf) {
  const a = PNG.sync.read(aBuf), b = PNG.sync.read(bBuf);
  const w = Math.max(a.width, b.width), h = Math.max(a.height, b.height);
  const pad = (img) => { if (img.width === w && img.height === h) return img; const o = new PNG({ width: w, height: h }); o.data.fill(255); PNG.bitblt(img, o, 0, 0, img.width, img.height, 0, 0); return o; };
  const A = pad(a), B = pad(b), D = new PNG({ width: w, height: h });
  const n = pixelmatch(A.data, B.data, D.data, w, h, { threshold: 0.1, includeAA: false });
  return { pct: (n / (w * h)) * 100, png: PNG.sync.write(D) };
}

// ---------- run ----------
const browser = await chromium.launch();
const results = [];
try {
  for (const vw of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 1 });
    const ref = await ctx.newPage(); const impl = await ctx.newPage();
    const r1 = await ref.goto(REF_URL); const r2 = await impl.goto(IMPL_URL);
    if (!r1?.ok()) throw new Error(`reference fixture not found: ${REF_URL}`);
    if (!r2?.ok()) throw new Error(`catalog page not found: ${IMPL_URL}`);
    await Promise.all([ref.evaluate(() => document.fonts.ready), impl.evaluate(() => document.fonts.ready)]);
    if (ANIM_PARTS.has(part)) {
      for (const pg of [ref, impl]) await pg.addStyleTag({ content: FREEZE_CSS });
    }
    const variants = await ref.$$eval('[data-variant]', (els) => els.map((e) => e.dataset.variant));
    const implVariants = new Set(await impl.$$eval('[data-variant]', (els) => els.map((e) => e.dataset.variant)));
    for (const v of variants) {
      // hover is only worth shooting where the part actually reacts to it
      const hasHoverRule = HOVER_PARTS.has(part);
      for (const hover of hasHoverRule ? [false, true] : [false]) {
        const tag = hover ? `${v}-hover` : v;
        const R = await capture(ref, v, hover, iconPart?.ref);
        const I = implVariants.has(v) ? await capture(impl, v, hover, iconPart?.impl) : null;
        if (!I) { results.push({ variant: tag, vw, missing: true }); continue; }
        const pd = pixelDiff(R.glyphless ?? R.png, I.glyphless ?? I.png);
        await writeFile(path.join(shotDir, `${tag}-${vw}-ref.png`), R.png);
        await writeFile(path.join(shotDir, `${tag}-${vw}-impl.png`), I.png);
        await writeFile(path.join(shotDir, `${tag}-${vw}-diff.png`), pd.png);
        const animates = ANIM_PARTS.has(part) && !hover && vw === VIEWPORTS.at(-1)
          && await ref.evaluate((v) => {
            const el = document.querySelector(`[data-variant="${v}"]`);
            return document.getAnimations().some((a) => el.contains(a.effect?.target ?? null));
          }, v);
        if (animates) {
          await writeFile(path.join(shotDir, `${tag}-${vw}-ref-motion.png`), await filmstrip(ref, v));
          await writeFile(path.join(shotDir, `${tag}-${vw}-impl-motion.png`), await filmstrip(impl, v));
        }
        if (R.glyphless) await writeFile(path.join(shotDir, `${tag}-${vw}-ref-noglyph.png`), R.glyphless);
        if (I.glyphless) await writeFile(path.join(shotDir, `${tag}-${vw}-impl-noglyph.png`), I.glyphless);
        const boxD = { w: Math.abs(R.box.width - I.box.width), h: Math.abs(R.box.height - I.box.height) };
        const sd = diffStyles(R.styles, I.styles);
        let ink = null;
        if (iconPart) {
          const a = inkBox(R.png, R.glyphless), b = inkBox(I.png, I.glyphless);
          const centre = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
          ink = { ref: a, impl: b, delta: a && b ? { x: +Math.abs(centre(a).x - centre(b).x).toFixed(1), y: +Math.abs(centre(a).y - centre(b).y).toFixed(1), w: Math.abs(a.w - b.w), h: Math.abs(a.h - b.h) } : null };
          // the glyphs are different drawings, so only their placement and rough size must agree
          ink.pass = !a && !b // a variant of an icon part need not contain an icon
            ? true
            : !!ink.delta && ink.delta.x <= THRESH.inkCentrePx && ink.delta.y <= THRESH.inkCentrePx
              && ink.delta.w <= Math.max(3, a.w * THRESH.inkSizeRatio) && ink.delta.h <= Math.max(3, a.h * THRESH.inkSizeRatio);
        }
        results.push({ variant: tag, vw, pixelPct: +pd.pct.toFixed(3), box: boxD, refBox: { w: R.box.width, h: R.box.height }, implBox: { w: I.box.width, h: I.box.height }, styleDiffs: sd, ink,
          pass: pd.pct <= THRESH.pixelPct && boxD.w <= THRESH.boxPx && boxD.h <= THRESH.boxPx && sd.length === 0 && (!ink || ink.pass) });
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}

const verdict = results.every((r) => r.pass) ? 'PASS' : 'FAIL';
await writeFile(path.join(outDir, 'report.json'), JSON.stringify({ part, date: new Date().toISOString(), thresholds: THRESH, verdict, results }, null, 2));

const inkCol = iconPart ? ' ink Δ (中心x/中心y/w/h) |' : '';
const inkSep = iconPart ? '---|' : '';
let md = `# audit(auto): ${part}  ${new Date().toISOString().slice(0, 10)}\n\nverdict: **${verdict}**\n`;
if (iconPart) md += `\npixel diff は spec/04-audit.md §2.1 によりグリフを透明にした状態で計測。グリフは ink box で比較。\n`;
md += `\n| variant | vw | pixel diff % | box Δ (w/h) |${inkCol} style diffs | pass |\n|---|---|---|---|${inkSep}---|---|\n`;
for (const r of results) {
  if (r.missing) { md += `| ${r.variant} | ${r.vw} | — | — |${iconPart ? ' — |' : ''} MISSING IN IMPL | ❌ |\n`; continue; }
  const inkCell = iconPart ? ` ${r.ink?.delta ? `${r.ink.delta.x}/${r.ink.delta.y}/${r.ink.delta.w}/${r.ink.delta.h}` : r.ink?.ref || r.ink?.impl ? 'ONE SIDE ONLY' : '—'} |` : '';
  md += `| ${r.variant} | ${r.vw} | ${r.pixelPct} | ${r.box.w}/${r.box.h} |${inkCell} ${r.styleDiffs.length} | ${r.pass ? '✅' : '❌'} |\n`;
}
md += '\n## style diffs\n';
for (const r of results) {
  if (!r.styleDiffs?.length) continue;
  md += `\n### ${r.variant} @${r.vw}\n| element | prop | ref | impl |\n|---|---|---|---|\n`;
  for (const d of r.styleDiffs.slice(0, 40)) md += `| \`${d.path}\` | ${d.prop} | \`${d.ref}\` | \`${d.impl}\` |\n`;
  if (r.styleDiffs.length > 40) md += `| … | ${r.styleDiffs.length - 40} more | | |\n`;
}
await writeFile(path.join(outDir, 'report.md'), md);
console.log(md);
console.log(`shots: ${shotDir}`);
process.exit(verdict === 'PASS' ? 0 : 1);
