# Mark / Text — テキスト装飾（A3）

- 状態: impl
- 参照: SWELL の `.mark_yellow` `.mark_blue` `.mark_green` `.mark_orange`（マーカー）、`.font_col_red` `.font_col_blue` `.font_col_green` `.font_col_main`（文字色）、`.swl-fz.u-fz-xs`〜`-xl`（文字サイズ）、`.u-thin`（薄字）
- 依存トークン: `--un-color-mark-*` `--un-color-deep-1/2/3` `--un-color-main` `--un-fz-xs/sm/md/lg/xl`
- ファイル: `src/components/Mark.astro`, `src/components/Text.astro`, `src/styles/parts/text.css`, `src/pages/catalog/text.astro`, `reference/fixtures/text.html`

## 1. 用途

本文の一部を目立たせるインライン装飾。マーカー線・文字色・文字サイズ・薄字の 4 系統。

## 2. API

```ts
// Mark — マーカー線
interface Props extends HTMLAttributes<'span'> {
  color?: 'yellow' | 'blue' | 'green' | 'orange' | (string & {}); // 既定 'yellow'。任意の CSS 色も可
  class?: string;
  id?: string;
}

// Text — 文字色・サイズ・薄字
interface Props extends HTMLAttributes<'span'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {}); // 任意の CSS 長さも可
  color?: 'red' | 'blue' | 'green' | 'main' | (string & {});
  thin?: boolean; // opacity .8
  class?: string;
  id?: string;
}
```

名前付きの値はトークンに、それ以外の文字列はそのまま custom property（`--un-mark-color` / `--un-text-color` / `--un-text-size`）に流す。クラスは増やさない（spec/01-coding-rules.md §2）。
利用者の `style` は破棄せず、パーツが組み立てた custom property の後ろに連結する（文字列・オブジェクトのどちらでも。`src/lib/style.ts`）。
`color` を指定したときは装飾範囲内のリンク色も追従させる（`--un-color-link: currentColor`。参照の `.swl-inline-color` と同じ）。

slot: default（装飾するテキスト）

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `mark-yellow` | `<Mark>` | `.mark_yellow` | 下 36% が黄色の線 |
| `mark-blue` | `<Mark color="blue">` | `.mark_blue` | 青 |
| `mark-green` | `<Mark color="green">` | `.mark_green` | 緑 |
| `mark-orange` | `<Mark color="orange">` | `.mark_orange` | 橙 |
| `color-red` | `<Text color="red">` | `.font_col_red` | #e44141 |
| `color-blue` | `<Text color="blue">` | `.font_col_blue` | #3d79d5 |
| `color-green` | `<Text color="green">` | `.font_col_green` | #63a84d |
| `color-main` | `<Text color="main">` | `.font_col_main` | メインカラー |
| `size-xs` | `<Text size="xs">` | `.u-fz-xs` | 0.75em |
| `size-sm` | `<Text size="sm">` | `.u-fz-s` | 0.9em |
| `size-md` | `<Text size="md">` | `.u-fz-m` | 1.1em |
| `size-lg` | `<Text size="lg">` | `.u-fz-l` | 1.25em |
| `size-xl` | `<Text size="xl">` | `.u-fz-xl` | 1.6em |
| `size-inline` | `<Text size="1.5em">` | `.swl-fz` + `style` | 任意サイズ |
| `color-inline` | `<Text color="#f40540">` | `.swl-inline-color` + `style` | 任意色 |
| `thin` | `<Text thin>` | `.u-thin` | opacity .8 |
| `mark-wrap` | 折り返す長文の `<Mark>` | `.mark_yellow` | 2 行それぞれにマーカーが付く |
| `nest-size-color` | `<Text size="lg">` の中に `<Text color="red">` | `.u-fz-l` + `.font_col_red` | 内側で文字サイズが二重に掛からない |
| `color-link` | `<Text color="red">` の中に `<a>` | `.font_col_red` + `a` | リンクが文字色に追従 |

## 4. マークアップ

```html
<span class="un-mark">…</span>
<span class="un-text" style="--un-text-size:1.1em">…</span>
```

## 5. 計測値（参照の実測）

| 対象 | プロパティ | 値 |
|---|---|---|
| マーカー | background-image | `linear-gradient(transparent 64%, <色> 0%)` |
| マーカー | display / font-weight / color | inline / 継承 / 継承（背景だけで描く）|
| マーカー色 | yellow / blue / green / orange | `--un-color-mark-yellow` #fcf69f / #b7e3ff / #bdf9c3 / #ffddbc |
| 文字色 | red / blue / green / main | `--un-color-deep-1` #e44141 / `-2` #3d79d5 / `-3` #63a84d / `--un-color-main` |
| 文字サイズ | xs / sm / md / lg / xl | 0.75em / 0.9em / 1.1em / 1.25em / 1.6em（= `--un-fz-*`）|
| 薄字 | opacity | 0.8 |
| 色付き | `--color_link` 相当 | `currentColor`（範囲内のリンクが文字色に追従）|
| 入れ子 | 外側の指定 | 内側の `Mark` / `Text` には引き継がない（custom property を要素側で `initial` に戻す）|
| 共通 | box-sizing | border-box（`.un-content` の外でも同じ寸法になるようパーツ側で指定）|

## 6. 受け入れ基準

- [ ] 全 19 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] マーカーが行の下 36% だけを塗る（折り返しても各行に付く）
- [ ] 文字サイズが em 指定で、本文サイズが変わっても比率が保たれる
- [ ] 任意の色・サイズを custom property で渡せる

## 7. 備考

- 参照はマーカーを `linear-gradient` の停止位置 64% で描いており、線の太さは行の高さに追従する。
- 参照の文字色 3 色は `02-design-tokens.md` の濃色セット（deep-1〜3）と同値だったため、そのトークンを使う。
