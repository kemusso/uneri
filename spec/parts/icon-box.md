# IconBox — アイコン付きボックス（B2 / B3）

- 状態: pass
- 参照: SWELL 段落ブロックのスタイル `.is-style-icon_*`（小）/ `.is-style-big_icon_*`（大）
- 依存トークン: `--un-color-icon-*` `--un-color-icon-*-bg` `--un-color-bg` `--un-radius-sm`
- ファイル: `src/components/Box.astro`（`icon` / `bigIcon` prop）, `src/styles/parts/icon-box.css`, `src/pages/catalog/icon-box.astro`, `reference/fixtures/icon-box.html`

## 1. 用途

段落の左（小）または上（大）にアイコンを添えたボックス。小は塗り背景＋左にアイコンと縦罫、大は枠線＋上辺に円形アイコン。

## 2. API

`Box` に prop を足す。`variant` とは排他。

```ts
interface Props extends HTMLAttributes<'div'> {
  icon?: 'good' | 'bad' | 'info' | 'announce' | 'pen' | 'book';        // B2（小）
  bigIcon?: 'point' | 'good' | 'bad' | 'check' | 'batsu' | 'hatena' | 'caution' | 'memo'; // B3（大）
  as?: 'div' | 'p';
  class?: string;
  id?: string;
}
```

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `icon-good` | `icon="good"` | `.is-style-icon_good` | 薄緑背景・緑アイコン・縦罫 |
| `icon-bad` | `icon="bad"` | `.is-style-icon_bad` | 薄水色背景・青アイコン |
| `icon-info` | `icon="info"` | `.is-style-icon_info` | 薄桃背景・桃アイコン |
| `icon-announce` | `icon="announce"` | `.is-style-icon_announce` | 薄橙背景・橙アイコン |
| `icon-pen` | `icon="pen"` | `.is-style-icon_pen` | 薄灰背景・灰アイコン |
| `icon-book` | `icon="book"` | `.is-style-icon_book` | 薄ベージュ背景 |
| `big-icon-point` | `bigIcon="point"` | `.is-style-big_icon_point` | 橙枠・上辺中央左に橙円 |
| `big-icon-good` | `bigIcon="good"` | `.is-style-big_icon_good` | 緑枠（`--un-color-icon-check`）|
| `big-icon-bad` | `bigIcon="bad"` | `.is-style-big_icon_bad` | 赤枠（`--un-color-icon-batsu`）|
| `big-icon-check` | `bigIcon="check"` | `.is-style-big_icon_check` | 緑枠 |
| `big-icon-batsu` | `bigIcon="batsu"` | `.is-style-big_icon_batsu` | 赤枠 |
| `big-icon-hatena` | `bigIcon="hatena"` | `.is-style-big_icon_hatena` | 青枠 |
| `big-icon-caution` | `bigIcon="caution"` | `.is-style-big_icon_caution` | 黄枠 |
| `big-icon-memo` | `bigIcon="memo"` | `.is-style-big_icon_memo` | 灰枠 |

各バリアントは先頭に段落を 1 つ置く（`:not(:first-child)` の余白規則を露出させるため。spec/04-audit.md §2.0）。

## 4. マークアップ

```html
<p class="un-box un-box--icon-good">…</p>
<p class="un-box un-box--big-icon-point">…</p>
```

アイコンは `::before` の `mask-image`（小）/ `background-image`（大）に data URI の SVG を置く。アイコンフォントは使わない。

## 5. 計測値（参照の実測）

### 小（icon_*）

| 対象 | プロパティ | 値 |
|---|---|---|
| root | padding | 1em 1em 1em 4.25em |
| root | background | `--un-color-icon-<name>-bg` |
| root | border-radius / line-height / color | 2px / 1.6 / `--un-color-text` |
| root | border-width / border-color | 0 / `--un-color-icon-<name>`（枠を足したときの既定色）|
| root | position | relative |
| ::before（アイコン）| left / top / transform | 1.25em / 50% / `translateY(-50%) scale(1.5)` |
| ::before | width / height | 1em / 1.6em（= line-height）|
| ::before | 色 | `--un-color-icon-<name>`（実描画は 1.5 倍で 24px 相当）|
| ::before | mask-position | `center calc(50% - 0.12em)`（参照グリフが行box中央よりやや上にあるため）|
| ::after（縦罫）| left / top / bottom / width / opacity | 3.25em / 25% / 25% / 1px / 0.4 |
| ::after | border-right | 1px solid `--un-color-icon-<name>` |

### 大（big_icon_*）

| 対象 | プロパティ | <600 | ≥600 |
|---|---|---|---|
| root | padding | 2em 1.5em 1.5em | 2.5em 2em 2em |
| ::before | left（自身の font-size 基準）| 0.5em | 0.75em |

| 対象 | プロパティ | 値 |
|---|---|---|
| root | border | 2px solid `--un-color-icon-<name>` |
| root | margin-top | 2.5em（先頭以外。円が上にはみ出す分の余白）|
| root | line-height | 1.8（本文と同じ）|
| root | position | relative |
| ::before | font-size / line-height | 1.25em（親基準 = 20px @16）/ 1 |
| ::before | width / height / border-radius | 2em / 2em（**自身の font-size 基準** = 40px）/ 50% |
| ::before | background / border | `--un-color-icon-<name>` / 2px solid `--un-color-bg` |
| ::before | top / transform | -1px / `translateY(-50%)` |
| ::before | color / background-size | #fff（グリフは白）/ 1em（= 20px）|
| ::before | display / align-items / justify-content / padding-left | flex / center / center / 0.05em（1px。グリフの光学中心合わせ）|

色の対応: big good = `--un-color-icon-check`、big bad = `--un-color-icon-batsu`（参照の実測値が小の good/bad と異なるため）。

## 6. 受け入れ基準

- [ ] 全 14 バリアントが 375 / 768 / 1200 で（グリフを消した状態の）pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] アイコンの描画領域（ink box）の中心が参照と ±2px、寸法が ±30% 以内（形は問わない）
- [ ] 小の縦罫の位置・高さ（25%〜75%）が一致
- [ ] 大の円がボックス上辺に半分かかる（top -1px + translateY(-50%)）

## 7. 備考

- 参照はアイコンフォント（icomoon）で描画しているが、uneri は data URI の SVG を使う。したがって `content` / `font-family` / `background-image` は原理的に一致しない。審査ではこれらを icon-shape として除外し、代わりに「グリフを透明にした状態の pixel diff」と「ink box の一致」で判定する（spec/04-audit.md §2.1）。
- グリフの形は参照と同一ではなく、意味（チェック・バツ・電球等）が同じ図形を自作する。SVG のパスは本リポジトリで書き起こしたもので、外部のアイコンセットは使っていない（`src/styles/parts/icon-box.css` の `--_glyph` に data URI で埋め込む）。
