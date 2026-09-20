# Table / Cell — 表（E1）

- 状態: impl
- 参照: SWELL の表ブロック `.wp-block-table`（`.is-style-simple` / `.is-style-double` / `td_to_th_` / `sp_block_` / `min_width*_` / `[data-table-scrollable]` / `[data-cell1-fixed]`）とセル装飾 `.swl-cell-bg`
- 依存トークン: `--un-color-main`, `--un-color-bg`, `--un-color-table-border`, `--un-color-table-th-bg`, `--un-color-cell-*`
- ファイル: `src/components/Table.astro`, `src/components/Cell.astro`, `src/styles/parts/table.css`, `src/pages/catalog/table.astro`, `reference/fixtures/table.html`

## 1. 用途

記事内の表。比較表として使うことが多いので、横スクロール・先頭列固定・セルのアイコン/背景色を持つ。

## 2. API

```ts
// Table
interface Props extends HTMLAttributes<'figure'> {
  variant?: 'default' | 'simple' | 'double'; // 既定 'default'
  headColumn?: boolean;      // 先頭列を見出しの見た目にする（`th` にはしない）
  stack?: boolean;           // <960 でセルを縦積みにする
  scroll?: 'sp' | 'pc' | 'both';
  minColWidth?: 10 | 20 | 30; // 横スクロール時の列の最小幅
  fixedColumn?: boolean;      // 先頭列を固定
  class?: string;
  id?: string;
}

// Cell（`td` / `th` を出す。アイコン・背景色・中央寄せが要るセルだけで使う）
interface Props extends HTMLAttributes<'td'> {
  as?: 'td' | 'th';                       // 既定 'td'
  icon?: 'double-circle' | 'circle' | 'triangle' | 'close' | 'hatena' | 'line' | 'check';
  iconType?: 'obj' | 'bg';                // 既定 'obj'（文中に置く / セル背面に敷く）
  iconSize?: 's' | 'm' | 'l';             // 既定 'm'
  bg?: string;                            // セル全体の背景色
  center?: boolean;                       // セル内テキストを中央寄せ
  class?: string;
  id?: string;
}
```

`Table` は `<figure class="un-table"><table>…</table></figure>` を出す。中身（`thead` / `tbody` / `tr`）は利用者が書く。

## 3. バリアント一覧

| data-variant | props | 参照 | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.wp-block-table` | 全セルに 1px 罫線。`thead th` はメインカラー、`tbody th` は薄いグレー |
| `simple` | `variant="simple"` | `.is-style-simple` | 横罫線だけ。`thead th` の下だけ 4px の二重線、塗りなし |
| `double` | `variant="double"` | `.is-style-double` | セルを 2px 離し、表全体を 1px で囲う |
| `head-column` | `headColumn` | `td_to_th_` | 先頭列を太字＋グレーの下敷きで見出しに見せる |
| `stack` | `stack` | `sp_block_` | <960 でセルが全幅ブロックになり縦に積む |
| `scroll` / `scroll-pc` / `scroll-sp` | `scroll="both"｜"pc"｜"sp"` | `[data-table-scrollable]` | 横スクロール。セルは右下の罫線を捨て、表が外枠を引く |
| `min-width-10` / `min-width-30` | `minColWidth={10\|30}` | `min_width10_` / `min_width30_` | 横スクロール時の列の最小幅 |
| `fixed-column` | `fixedColumn` | `[data-cell1-fixed]` | 先頭列が `position: sticky` で残る |
| `simple-scroll` | `variant="simple"` + `scroll="both"` | — | simple と横スクロールの組み合わせ。ヘッダー下の二重線が残る |
| `fixed-column-scrolled` | `fixedColumn` + 8 列 | — | 固定列を実際にスクロールさせた状態（審査は 37% までスクロールして計測）|
| `centered` | `<Cell center>` | `.swl-cell-text-centered` | セル内のテキストを中央寄せ |
| `cell-bg` | `<Cell bg="#fff5f0">` | `--the-cell-bg` | セル全体を塗る |
| `icon-obj-*` / `icon-bg-*` | `<Cell icon="…" iconType="…">` | `.swl-cell-bg[data-icon]` | 7 種のアイコン。`obj` は文中、`bg` はセル背面 |
| `icon-*-size-s` / `-l` | `iconSize="s"｜"l"` | `[data-icon-size]` | 1em（右上）/ 2.5em（`bg` は不透明度 .75）|

## 4. マークアップ

```html
<figure class="un-table un-table--simple" data-scroll="both" data-min-col="20">
  <table>
    <thead><tr><th>…</th></tr></thead>
    <tbody><tr><th>…</th><td><span class="un-cell-icon" data-icon="circle" data-icon-type="obj"></span></td></tr></tbody>
  </table>
</figure>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| table | width / border-collapse / border-spacing / line-height | 100% / collapse / 0 / 1.6 |
| table（`[data-scroll]`）| border-collapse | separate。セルが右下の罫線を捨てて表が外枠を引く方式は、罫線が 2 セルの間ではなく各セルに属していて初めて成立する |
| th, td | padding / border / vertical-align / word-break | 0.5em 0.75em / 1px solid `--un-color-table-border` / top / break-all |
| thead th | 背景 / 文字 / 太さ | `--un-color-main` / #fff / 700 |
| tbody th | 背景 | `rgba(150,150,150,.05)`（= `--un-color-table-th-bg`）|
| thead | border-color | currentColor（表の枠色を継がない）|
| simple | th, td / thead th | 左右の罫線なし / 下だけ 4px double、塗りなし |
| double | table | border 1px solid / border-collapse separate / border-spacing 2px |
| head-column | 先頭セル | font-weight 700、`::before` が inset 0・z-index -1 でグレーを敷く |
| stack（<960）| table〜td / th, td | display block / padding 1em、margin-top -1px（`tbody` の先頭セルだけ 0）|
| scroll | figure / table | overflow-x scroll・padding-bottom 16px・max-width 100%（`both`）/ min-width 100% |
| scroll | th, td | 右下の罫線を落とし、表が border-right / border-bottom を引く |
| min-width | <960 / ≥960 | 10 → 10vw / 80px、20 → 20vw / 160px、30 → 28vw / 240px |
| fixed-column | 先頭セル | position sticky / top 0 / left 0 / z-index 3、背景は `--un-color-bg`（`thead` はメインカラー）|
| cell icon | span（obj）| inline-flex / row-reverse / 1.5em 角 / vertical-align middle / text-indent -0.28em |
| cell icon | ::after（bg）| absolute / 上下 0 / left calc(50% - 幅/2) / 幅 1.5em / z-index -1 / mask-size auto 1.5em |
| cell icon | サイズ | s = 1em（右上 0.25em）、m = 1.5em、l = 2.5em（`bg` は opacity .75）|
| cell icon 色 | double-circle / circle / triangle / close / hatena / line / check | #ffc977 / #94e29c / #eeda2f / #ec9191 / #93c9da / #9b9b9b / #94e29c |

## 6. 受け入れ基準

- [x] 全 31 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] アイコン 7 種 × obj / bg の ink box が参照と一致（中心 ±2px / 寸法 ±30%）
- [x] `.un-content` の外でも成立する

## 7. 意図的乖離（spec/04-audit.md §3.1）

| 対象 | 参照 | uneri | 理由 |
|---|---|---|---|
| `fixed-column` の先頭セル右端 | 境界なし | `::after` で 1px の罫線 | issue #1。参照は collapsed border を置き去りにするため、横スクロールすると固定列と次の列の境界が消え、`thead` は同色で塗られているので文字がぶつ切りにしか見えない |
| `simple` + `scroll` の `thead th` | `border-bottom: 0` | `4px double` | issue #2。参照はスクロール用の罫線リセットが simple のヘッダー二重線まで巻き込み、default と区別できなくなる。表は 3px 高くなり各行が 1.5px 下がる |

## 8. 備考

- アイコンは参照も uneri も SVG マスクだが、字形は uneri の自作。判定は ink box で行う（spec/04-audit.md §2.1）。
- 参照の `.c-scrollHint`（「横にスクロールできます」の案内）は生成する PHP/JS が手元になくマークアップを観測できないため対象外。
- 参照の `[data-has-cell-icon]`（アイコンの有無に応じたセルの余白調整）は 375 / 768 / 1200 のいずれでも計測値に差が出なかったため実装しない。
- `.un-content` 内の素の `<table>` には base.css が同じ見た目を与える。`Table` は `.un-content` の外でも同じになるよう自前で持つ。
