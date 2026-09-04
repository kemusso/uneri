# audit: accordion  (2026-09-04) — 再審査

verdict: **FAIL**

## 0. 前回 FAIL 項目の解消確認

| # | 前回の指摘 | 結果 |
|---|---|---|
| 1 | 開いた本文に上下 padding が無い | **未解消**（下記 FAIL-1）。`padding: 0 1em` → `1em` の追加自体は入ったが、`simple` / `border` の左右 padding が壊れた。加えて「参照は開かないので比較できない」という spec §7 の線引きが**事実に反する**（FAIL-2） |
| 2 | `word-break: break-all` が無い | **解消**。`long` バリアントが 375/768/1200 とも pixel diff 0 / box Δ 0。折り返し位置も目視一致 |
| 3 | 開いた状態の `overflow` | **解消**。開状態で両側 `overflow: hidden`（実測） |
| 4 | `.un-accordion__icon` の `line-height: 1.8em` ハードコード | **解消**。全 computed プロパティ総当たりでも `line-height` に差分なし |
| 5 | ink box が複数項目の和集合になる（ツールの穴） | **未対応**。再現確認済（FAIL-4a） |
| 6 | 矢印を上下逆にしても PASS する（ツールの穴） | **未対応**。再現確認済（FAIL-4b） |

## 1. 自動計測（`node scripts/audit/run.mjs accordion --no-build --port 4409`）

verdict(auto): PASS。5 バリアント × 3 viewport × hover 有無 = 30 行すべて
pixel diff 0 % / box Δ 0-0 / style diffs 0。ink Δ（中心x/中心y/w/h）は
375 で `0/0.5/0/1`（main は `0/0/0/2`）、768・1200 で `0.5/1/1/0`。閾値内。

→ **自動計測は閉じた状態しか見ていない。以下は独自検証で見つけた差分。**

## 2. FAIL 項目（実装者への指示）

### FAIL-1. `simple` / `border` の開いた本文の左右 padding が 2 倍

| variant | vw | プロパティ | 参照 | 実装 |
|---|---|---|---|---|
| simple | 375 | `.un-accordion__body` の `padding-left` / `padding-right`（`[open]` 時） | `7.5px`（0.5em） | `15px` |
| border | 375 | 同上 | `7.5px` | `15px` |
| simple | 768 / 1200 | 同上 | `8px` | `16px` |
| border | 768 / 1200 | 同上 | `8px` | `16px` |

参照 CSS: `.swell-block-accordion.is-style-border .swell-block-accordion__body,
.swell-block-accordion.is-style-simple .swell-block-accordion__body{border-top:1px dashed …;margin:0 .5em;padding:1em .5em}`
（開状態の左右 padding は 0.5em。閉状態は `padding-top/bottom` だけが `0!important` になる）

原因: `src/styles/parts/accordion.css` の

```css
[open] > .un-accordion__body { height: auto; padding: 1em; opacity: 1; }
```

が **実効詳細度 (0,2,0)**（属性 1 + クラス 1）で、後続の

```css
.un-accordion--simple > :where(.un-accordion__item) > :where(.un-accordion__body),
.un-accordion--border > :where(.un-accordion__item) > :where(.un-accordion__body) {
  padding-right: 0.5em; padding-left: 0.5em;
}
```

（`:where()` は 0 なので **(0,1,0)**）を上書きしてしまう。ショートハンド `padding: 1em` が
左右まで塗り潰す点も含めて設計ミス。spec/01 §3 の「詳細度は最大 (0,2,0)」の数え上げでは属性
セレクタを除外するため、書き手が (0,1,0) のつもりで書いて実カスケードで負けている典型。

再現: 参照 fixture の `<details>` に `class="is-opened"` を足し、カタログの `<details>` に
`open` を足して computed style を突き合わせると上表の差が出る（375/768/1200 すべて）。
入れ子（`main` の開いた本文に `simple` のアコーディオンを入れる）でも同じ差が出る。

### FAIL-2. fixture / spec §7 の「開いた状態は比較できない」は事実に反する

spec/parts/accordion.md §7 は

> 参照は JS で開閉する（`details` の `open` 属性では開かず、`[open]` を付けても本文は閉じたまま）。
> …**開いた状態は参照に対応物が無く比較できない**。

としているが、参照 CSS の閉状態は

```css
:not(.is-opened) > .swell-block-accordion__body { height:0!important; opacity:0; padding-bottom:0!important; padding-top:0!important }
```

の **1 本だけ**。`details` に `is-opened` クラスを付けるだけで JS 無しに開状態が完全再現できる
（`reference/swell/build/css/blocks.css`。実測で本文高さ・padding・opacity・overflow すべて確定した）。
`[open]` で開かないのは事実だが、それは「比較できない」ことを意味しない。

この誤った線引きにより `open` バリアントを fixture とカタログから外したため、FAIL-1 のバグが
自動計測で 30 行すべて PASS のまま素通りした。**`open` バリアント（`default` / `simple` /
`border` / `main` の 4 系統を開いた状態）を fixture 側は `class="is-opened"`、カタログ側は
`open` prop で復活させ、spec §7 の記述を訂正すること。**

### FAIL-3. 開いた状態の `--opened` アイコンの `transform` が参照と一致しない

| 対象 | 参照 | 実装 |
|---|---|---|
| `[open]` 時の `.un-accordion__icon--opened` の `transform` | `matrix(1, 0, 0, 1, 0, 0)`（`scale(1) rotate(0)`。caret-**up** グリフをそのまま出す） | `matrix(-1, 0, 0, -1, 0, 0)`（`scale(-1)`。caret-**down** の mask を 180° 反転して代用） |

閉状態の `--closed`（両側 `matrix(1,0,0,1)`）と `--opened`（両側 `matrix(-0.5,0,0,-0.5)`）は一致するので、
現行の閉状態限定の審査では出ない。spec/04-audit.md §2.1 は除外プロパティを
`content / font-family / background-image / mask-image / background-size / background-repeat /
background-position / display / width / height / transform-origin` に限定し、
**`transform` は「通常どおり比較する」と明記している**。FAIL-2 に従って `open` バリアントを
戻すとこの行が style diff として出る。上向き caret の SVG を別に持つか、
§2.1 の除外リストに `transform` を加える根拠を spec に書くか、どちらかで決着させること。

### FAIL-4. 審査ツールの穴（前回指摘・未対応。今回実験で再現）

**(a) ink box が「バリアント内の全グリフの和集合」になっている**

`run.mjs` の `inkBox()` は `[data-variant]` 要素まるごとのスクリーンショット 1 枚から外接矩形を
1 個だけ取る。2 項目のアコーディオンでは 2 個の caret を囲む縦長の箱になり、
高さは約 77px。閾値は「寸法 ±30%（最低 3px）」なので **±23px** まで許される。

実験: `dist/catalog/accordion/index.html` に
`.un-accordion__item:nth-child(2) .un-accordion__icon > *::before{mask-size:.5em .5em}`
を注入（2 項目めの caret だけ半分の大きさ）→ **verdict PASS**（ink Δ `0.5/1.5/1/1`、style diffs 0）。
※`mask-size` は §2.1 の除外プロパティなので computed style でも捕まらない。

対策案: ink box を「グリフを描く要素ごと」に取り、要素単位で中心 ±2px / 寸法 ±30% を判定する。

**(b) 矢印を上下逆にしても PASS する**

実験: 同ページに `--_caret` を上向き三角
（`M12 8 4 16h16z`）に差し替えた `<style>` を注入 → **verdict PASS**
（pixel diff 0 / box Δ 0 / ink Δ 0.5/0/1/0 / style diffs 0）。
mask の data URI は §2.1 の除外プロパティなので、向きの情報がどこにも入らない。
（`transform: scaleY(-1)` で反転した場合だけは `transform` の style diff で検出できた。
つまり「CSS で反転」は捕まるが「SVG で反転」は捕まらない、という中途半端な状態。）

対策案: ink 画像の行ごとのインク量プロファイル（上半分／下半分の質量比）を参照と突き合わせる。
実測値は参照 2.68〜2.69、実装 2.85〜2.97（正しい向き）で、反転すればこれが逆転する。

## 3. 目視所見

- 閉じた状態は `default` / `simple` / `border` / `main` / `long` とも 375 / 768 / 1200 で
  参照と見分けがつかない（`-diff.png` は全面白）。帯の色、1px 罫線、破線の位置、caret の
  大きさ・太さ・位置すべて一致。
- `long`: 長い URL が `break-all` で 3 行に折り返され、折り返し位置も参照と同一。caret は
  右端に垂直中央で残る。
- icon-shape: 参照はアイコンフォント（icomoon）の caret、実装は SVG mask の三角。
  形は微妙に違う（実装の方が幅 1px 広く、高さ 0.25px 低い）が §4 の許容範囲。
- `summary` の既定マーカーは両側とも出ていない。ただし computed の `list-style-type` は
  参照 `disclosure-closed`（`::-webkit-details-marker{display:none}` で隠す旧式）、
  実装 `none`（`list-style: none`）。見た目は同一なので可とする。

## 4. 仕様適合

- **バリアント網羅**: spec §3 の 5 バリアント（`default` / `simple` / `border` / `main` / `long`）は
  すべてカタログにある。ただし `AccordionItem` の `open` prop を使うバリアントが 1 つも無く、
  spec §6 の受け入れ基準「開いたときに本文が出る」が審査で一度も検証されていない → **NG**（FAIL-2）。
- **props**: `Accordion { variant?: 'default'|'simple'|'border'|'main'; class?; id? }`、
  `AccordionItem { title: string; open?: boolean; class?; id? }`。どちらも spec §2 と一致、
  既定値も `variant='default'` / `open=false` で一致 → OK。
- **コーディング規則**: `!important` なし、`swell` 文字列なし、リテラル色は `#fff` と mask 内の
  `%23000` のみ（白/黒は許容）、`un-` 接頭辞と BEM、状態は `[open]` 属性で表現、
  ベンダープレフィックスの手書きは `::-webkit-details-marker`（疑似要素であり参照と同じ
  必要悪）のみ → 文言上は OK。ただし FAIL-1 のとおり **詳細度の数え上げ規則（属性セレクタを
  除外する）が実カスケードと乖離しており、規則どおり書いて壊れている**。規則側の見直しも要検討。
- **`cleanroom.mjs`**: OK（1900 reference runs indexed、一致なし）。
- **`standalone.mjs`**: OK（accordion 5 バリアント）。感度確認として dist の
  `.un-accordion__title` を `.un-content .un-accordion__title` に書き換えたところ
  `standalone: FAIL (5/5)` を返したので、検出力は生きている。
- **依存トークン**: spec 記載の `--un-color-gray` / `--un-color-border` / `--un-color-main` と
  CSS の使用トークンが一致 → OK。
