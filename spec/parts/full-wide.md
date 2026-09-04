# FullWide — フルワイド（G1）

- 状態: impl
- 参照: SWELL フルワイドブロック `.swell-block-fullWide`（`pc-py-*` / `sp-py-*`、`__inner.l-container` / `.l-article`）
- 依存トークン: `--un-container-width`, `--un-container-pad`, `--un-article-width`
- ファイル: `src/components/FullWide.astro`, `src/styles/parts/full-wide.css`, `src/pages/catalog/full-wide.astro`, `reference/fixtures/full-wide.html`

## 1. 用途

記事の幅を飛び出して、画面の端から端まで色を敷く帯。

## 2. API

```ts
interface Props extends HTMLAttributes<'div'> {
  py?: 0 | 20 | 40 | 60 | 80;             // 上下の余白（20 → 2em）。既定 20
  inner?: 'full' | 'container' | 'article'; // 中身の幅。既定 'full'
  bg?: string;                              // 帯の背景色
  class?: string;
  id?: string;
}
```

## 3. バリアント一覧

| data-variant | props | 参照 | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.swell-block-fullWide` | 上下 2em、中身は画面幅いっぱい |
| `py-0` … `py-80` | `py={0…80}` | `pc-py-*` / `sp-py-*` | 上下の余白（N/10 em）|
| `inner-container` | `inner="container"` | `__inner.l-container` | 中身をサイト幅に収める |
| `inner-article` | `inner="article"` | `__inner.l-article` | 中身を本文幅に収める |

## 4. マークアップ

```html
<div class="un-full-wide un-full-wide--article" style="--un-full-wide-py:4em;background-color:#f7f7f7">
  <div class="un-full-wide__inner">…</div>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| root | position / left / width / max-width | relative / `calc(50% - 50vw)` / 100vw / 100vw |
| root | padding-block | N/10 em（既定 2em、`py-0` は 0）|
| inner | position / z-index | relative / 1 |
| inner（container）| max-width / margin / padding | `サイト幅 + 左右余白 × 2` / auto / `--un-container-pad` |
| inner（article）| max-width / margin / padding | `--un-article-width` / auto / `--un-container-pad`（≥960 は 16px）|

## 6. 受け入れ基準

- [x] 全 8 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] `.un-content` の外でも成立する

## 7. 備考

- 参照の区切り形状（wave / circle / line / tilt）は SVG をテーマの PHP が出力しており、手元のマークアップからは観測できないため対象外。
- 参照の背景画像・パララックス（`.has-bg-img` / `-parallax` / `-fixbg`）も同様に観測できるマークアップが無いため対象外。
