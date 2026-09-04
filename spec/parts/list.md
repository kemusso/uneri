# List — リスト装飾（C1）

- 状態: impl
- 参照: SWELL リストブロックのスタイル `.is-style-note_list` `.is-style-check_list` `.is-style-good_list` `.is-style-bad_list` `.is-style-triangle_list` `.is-style-num_circle`
- 依存トークン: `--un-color-list-check` `--un-color-list-good` `--un-color-list-bad` `--un-color-list-triangle` `--un-color-list-num` `--un-color-text`
- ファイル: `src/components/List.astro`, `src/styles/parts/list.css`, `src/pages/catalog/list.astro`, `reference/fixtures/list.html`

## 1. 用途

本文中の箇条書き。素の `ul` / `ol`（A1 の既定）に加え、マーカーを記号・アイコン・連番丸に差し替えた 6 種を持つ。

## 2. API

```ts
interface Props extends HTMLAttributes<'ul'> {
  variant?: 'default' | 'note' | 'check' | 'good' | 'bad' | 'triangle' | 'num-circle'; // 既定 'default'
  ordered?: boolean; // true で ol。'num-circle' は常に ol
  class?: string;
  id?: string;
}
```

slot: default（`li` の並び）

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | なし | `ul` | disc、A1 の既定 |
| `note` | `variant="note"` | `.is-style-note_list` | 0.9em・※ マーカー |
| `check` | `variant="check"` | `.is-style-check_list` | メインカラーのチェック |
| `good` | `variant="good"` | `.is-style-good_list` | 緑の丸 |
| `bad` | `variant="bad"` | `.is-style-bad_list` | 赤のバツ |
| `triangle` | `variant="triangle"` | `.is-style-triangle_list` | 黄の三角 |
| `num-circle` | `variant="num-circle"` | `ol.is-style-num_circle` | メインカラーの丸に白い連番 |
| `ordered-default` | `ordered` | `ol` | decimal、A1 の既定 |
| `check-nested` | `variant="check"` + 入れ子 ul | `.is-style-check_list` + `ul` | 入れ子はマーカーが小さな丸に変わる |
| `num-circle-nested` | `variant="num-circle"` + 入れ子 ol | `.is-style-num_circle` + `ol` | 入れ子は塗りなしの丸（線＋番号のみ）、`scale(.7)` |
| `num-circle-ul` | `variant="num-circle"` + 入れ子 ul | `.is-style-num_circle` + `ul` | 入れ子の箇条書きは番号なしの極小の点 |
| `note-nested` | `variant="note"` + 入れ子 ul | `.is-style-note_list` + `ul` | 入れ子にも ※ が付く |
| `num-circle-reversed` | `variant="num-circle" reversed` | `ol[reversed].is-style-num_circle` | 直下だけ逆順（入れ子は通常）|
| `note-ordered-nested` | `variant="note" ordered` + 入れ子 ul | `ol.is-style-note_list` + `ul` | 連番が付くのは直下だけ |
| `note-reversed` | `variant="note" ordered reversed` | `ol[reversed].is-style-note_list` | `※-1` `※-2` |
| `num-circle-deep` | 3 階層 | 同上 | ol→ul→ol でそれぞれの見た目になる |
| `note-ordered` | `variant="note" ordered` | `ol.is-style-note_list` | マーカーが `※1` `※2` の連番 |

## 4. マークアップ

```html
<ul class="un-list un-list--check"><li>…</li></ul>
<ol class="un-list un-list--num-circle"><li>…</li></ol>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

共通: `li` は margin `.25em 0` / line-height 1.5（A1 と同値だが、`.un-content` の外でも成立するようパーツ側でも指定する）。`.un-list` 配下は `box-sizing: border-box`。装飾つきは `list-style: none`、`li` は `position: relative`（A1 で付与）。

| style | 対象 | プロパティ | 値 |
|---|---|---|---|
| note | ul | font-size / opacity / padding-left | 0.9em / 0.85 / 0.25em（3.6px）|
| note | li | padding-left / margin | 1.25em（18px）/ .5em 0（7.2px）|
| note | li::before | content / 位置 / 寸法 / transform | `"※"` / absolute top 0 left 0 / 幅 auto×1.5em / `scale(.75)`、origin `left center`、`white-space: nowrap` |
| note（ol）| li / li::before | padding-left / content / letter-spacing | 1.75em / `"※" counter()` / 1px |
| 入れ子 | ul, ol | padding-left / list-style | 0 / none |
| num-circle | ol（入れ子含む）| counter-reset | あり（`ul` には付けない）|
| 入れ子（num-circle の中の ul）| li / li::before | padding-left / content / counter / transform | 1.25em / `""` / `none` / `scale(.15)`（塗りつぶしの点）|
| 入れ子（note）| li / li::before | 親と同じ（子孫セレクタで適用）|
| 入れ子（check 等）| li / li::before | padding-left / content / clip-path | 1.5em / `" "` / `circle(12% at 50% 50%)`（マーカー色の小さな丸）|
| 入れ子（num-circle）| li::before | 背景 / 色 / opacity / transform | 透明（`box-shadow` の輪のみ）/ `--un-color-list-num` / 0.75 / `scale(.7)` |
| check / good / bad / triangle | ul | padding-left | 0.25em（4px）|
| check / good / bad / triangle | li | padding-left | 1.5em（24px）|
| check / good / bad / triangle | li::before | 位置 / 寸法 | absolute top 0 left 0 / 1em×1.5em |
| check | li::before | 色 | `--un-color-list-check`（#04384c）|
| good | li::before | 色 | `--un-color-list-good`（#86dd7b）|
| bad | li::before | 色 | `--un-color-list-bad`（#f36060）|
| triangle | li::before | 色 | `--un-color-list-triangle`（#f4e03a）|
| num-circle | ol | padding-left | 0.25em |
| num-circle | li | padding-left | 2em（32px）|
| num-circle | li::before | content / display / text-align | `counter(li)` / block / center |
| num-circle | li::before | 寸法 / border-radius | 1.8em（28.8px）正方 / 50% |
| num-circle | li::before | 色 / 背景 / line-height | #fff / `--un-color-list-num` / 1.8（無単位）|
| num-circle | li::before | box-sizing | content-box |
| num-circle | li::before | box-shadow | `0 0 0 1px --un-color-list-num`（縁を 1px 太らせる）|
| num-circle | li::before | 位置 / transform | absolute top -0.15em（-2.4px）left 1px / `scale(.75)`、origin `left center` |

## 6. 受け入れ基準

- [ ] 全 17 バリアントが 375 / 768 / 1200 で（グリフを透明にした状態の）pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] マーカーの ink box が参照と中心 ±2px・寸法 ±30% 以内
- [ ] num-circle の連番が丸の中央に来る（縦横とも）
- [ ] 折り返した 2 行目がマーカーの右に揃う（ぶら下げインデント）

- [ ] `.un-content` の外に置いても装飾が成立する（クラスだけで完結）

## 7. 備考

- `ol[reversed]` のときは直下の `li` だけ `counter-increment: un-li -1`（`num-circle` と `note` の両方。参照と同じく子結合子）。
- 参照は「直下だけに効かせる規則（`>`）」と「入れ子にも効かせる規則（子孫）」を使い分けている。uneri も同じ使い分けにする: 連番・`※` の連番化は `>`、マーカーの箱と入れ子の見た目は子孫。

- check / good / bad / triangle のマーカーは参照ではアイコンフォント。uneri は data URI の SVG を `mask-image` で使う（spec/04-audit.md §2.1 の扱い）。
- note の `※` と num-circle の連番は文字なので、SVG ではなくそのまま文字で描く。
- マーカーの基準となる `li { position: relative }` もパーツ側で指定する（`.un-content` の外でも成立させるため）。
- パーツ CSS は `.un-content` を前置しない。素の要素の既定は `base.css` 側で `:where()` に包んで詳細度 0 にしてあるため、クラス 1 つで上書きできる（spec/01-coding-rules.md §3）。
- `is-style-index` / `is-style-border` は SWELL のリストスタイルではない（参照で描画に変化なし）ため、パーツ表から除外した。
