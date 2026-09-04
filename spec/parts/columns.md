# Columns / Column — リッチカラム（E3）

- 状態: impl
- 参照: SWELL リッチカラムブロック `.swell-block-columns`（`.is-style-clmn-border` / `-shadow`、`[data-valign]`、`[data-scrollable="1"]`）
- 依存トークン: `--un-color-border`, `--un-shadow-box`
- ファイル: `src/components/Columns.astro`, `src/components/Column.astro`, `src/styles/parts/columns.css`, `src/pages/catalog/columns.astro`, `reference/fixtures/columns.html`

## 1. 用途

記事内で要素を横に並べる。列幅を PC / タブレット / スマホで別々に指定でき、折り返しても横スクロールにしてもよい。

## 2. API

```ts
// Columns
interface Props extends HTMLAttributes<'div'> {
  variant?: 'default' | 'border' | 'shadow'; // 既定 'default'
  pcWidth?: string;   // 既定 33.3%（≥960）
  tabWidth?: string;  // 既定 50%（600–959）
  spWidth?: string;   // 既定 100%（<600）
  gap?: string;       // 列間の左右余白。既定 1.5rem
  gapY?: string;      // 折り返したときの行間。既定 1.5rem
  valign?: 'top' | 'center' | 'bottom';
  scroll?: boolean;   // 折り返さず横スクロール
  class?: string;
  id?: string;
}

// Column
interface Props extends HTMLAttributes<'div'> {
  bg?: string;       // 列の背景色
  padding?: string;  // 列の内側余白
  class?: string;
  id?: string;
}
```

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.swell-block-columns` | PC 3 列 / タブ 2 列 / スマホ 1 列 |
| `gap` | `gap="1em" gapY="1em"` | `--swl-clmn-mrgn--x/y` | 列間の余白を変える |
| `width-25` | `pcWidth="25%"…` | `--clmn-w--pc/tab/mobile` | 列幅を変える |
| `border` | `variant="border"` | `.is-style-clmn-border` | 各列に 1px の枠と 1rem の余白 |
| `shadow` | `variant="shadow"` | `.is-style-clmn-shadow` | 各列に影と白背景と 1rem の余白 |
| `valign-*` | `valign="top"｜"center"｜"bottom"` | `[data-valign]` | 列の縦位置 |
| `scrollable` | `scroll` | `[data-scrollable="1"]` | 折り返さず横スクロール |
| `column-bg` | `<Column bg padding>` | `has-background` | 列ごとの背景色 |

## 4. マークアップ

```html
<div class="un-columns un-columns--border" style="--un-columns-width-pc:25%">
  <div class="un-columns__inner">
    <div class="un-columns__item">…</div>
  </div>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| inner | display / flex-wrap / justify-content | flex / wrap / flex-start |
| inner | width / margin-left / row-gap | `calc(100% + 余白)` / `-余白` / 余白（既定 1.5rem）|
| item | width / margin-left | `calc(列幅 - 余白)` / 余白 |
| 列幅の切り替え | <600 / 600–959 / ≥960 | mobile / tab / pc |
| border | item の padding / border | 1rem / 1px solid `--un-color-border` |
| shadow | item の padding / background / box-shadow | 1rem / #fff / `--un-shadow-box` |
| valign | inner の align-items | top→flex-start / center→center / bottom→flex-end |
| scroll | 外側 / inner | overflow hidden / flex-wrap nowrap・width 100%・margin-left 0・padding-bottom 16px・row-gap 0・overflow-x auto |
| scroll | item | flex-shrink 0 / width 列幅（先頭は margin-left 0）|

## 6. 受け入れ基準

- [x] 全 10 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] `.un-content` の外でも成立する

## 7. 備考

- 参照は列幅と余白を `--clmn-w--pc/tab/mobile` と `--swl-clmn-mrgn--x/y` で渡す。uneri は `--un-columns-width-pc/tab/sp` と `--un-columns-gap-x/y` に同じ役割を持たせる。
- 参照の `.c-scrollHint`（横スクロールの案内）は Table と同じくマークアップを観測できないため対象外。
