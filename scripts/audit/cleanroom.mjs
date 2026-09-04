#!/usr/bin/env node
/**
 * Clean-room check — spec/04-audit.md §5
 *
 * Fails if any src/styles or src/components file
 *   - mentions "swell" at all, or
 *   - contains a run of N (default 3) consecutive declarations that also appear,
 *     in the same order, inside a single rule of the SWELL reference CSS.
 *
 * Single shared declarations are expected (measured values like the font stack are
 * identical by design); the same *sequence* of declarations is what suggests copying.
 *
 *   node scripts/audit/cleanroom.mjs [runLen=3]
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const RUN = Number(process.argv[2]) || 3;
const REF_DIR = path.join(ROOT, 'reference', 'swell', 'build', 'css');
const SRC_DIRS = ['src/styles', 'src/components'].map((d) => path.join(ROOT, d));

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(css|astro|ts|js)$/.test(e.name)) out.push(p);
  }
  return out;
}

// -> array of rules, each an array of normalized "prop:value" strings
function rules(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  const re = /\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const decls = m[1].split(';').map((d) => d.replace(/\s+/g, '').replace(/!important/g, '').toLowerCase()).filter((d) => d.includes(':'));
    if (decls.length) out.push(decls);
  }
  return out;
}
const runsOf = (decls) => { const r = []; for (let i = 0; i + RUN <= decls.length; i++) r.push(decls.slice(i, i + RUN).join(';')); return r; };

const refFiles = (await readdir(REF_DIR).catch(() => [])).filter((f) => f.endsWith('.css'));
if (!refFiles.length) console.log('no reference css found; skipping copy check');
const refRuns = new Set();
for (const f of refFiles) for (const r of rules(await readFile(path.join(REF_DIR, f), 'utf8'))) for (const run of runsOf(r)) refRuns.add(run);

let bad = 0;
for (const dir of SRC_DIRS) {
  for (const file of await walk(dir).catch(() => [])) {
    const raw = await readFile(file, 'utf8');
    const rel = path.relative(ROOT, file);
    if (/swell/i.test(raw)) { console.log(`NG  ${rel}: contains "swell"`); bad++; }
    const css = file.endsWith('.astro') ? (raw.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || []).join('\n') : raw;
    const hits = new Set();
    for (const r of rules(css)) for (const run of runsOf(r)) if (refRuns.has(run)) hits.add(run);
    for (const h of hits) { console.log(`NG  ${rel}: declaration run "${h}" also appears in reference css`); bad++; }
  }
}
console.log(bad ? `\ncleanroom: FAIL (${bad})` : `cleanroom: OK (${refRuns.size} reference runs indexed)`);
process.exit(bad ? 1 : 0);
