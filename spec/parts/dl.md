# Dl — 説明リスト（C2）

- 状態: impl
- 参照: SWELL 説明リストブロック `.swell-block-dl`（`.is-style-default` / `-border` / `-float`）
- 依存トークン: `--un-color-main`
- ファイル: `src/components/Dl.astro`, `src/components/DlItem.astro`, `src/styles/parts/dl.css`, `src/pages/catalog/dl.astro`, `reference/fixtures/dl.html`

## 1. 用途

項目名と説明の対。縦積み・枠線つき・横並びの 3 種。

## 2. API

```ts
// Dl（親）
interface Props extends HTMLAttributes<'dl'> {
  variant?: 'default' | 'border' | 'float'; // 既定 'default'
  /** `float` のときの項目名の幅 */
  dtWidth?: string;                          // 既定 '5.5em'
  class?: string;
  id?: string;
}

// DlItem（子）
interface Props extends HTMLAttributes<'div'> {
  term: string;
  class?: string;
  id?: string;
}
```

`DlItem` は `<dt>` と `<dd>` を並べて出す（`dl` の直下に置くため要素は包まない）。

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.is-style-default` | 項目名は太字、説明は左に 1em の余白 |
| `border` | `variant="border"` | `.is-style-border` | 項目名の左にメインカラーの線 |
| `float` | `variant="float"` | `.is-style-float` | 項目名と説明が横並び（`--un-dl-dt-width`）|

## 4. マークアップ

```html
<dl class="un-dl un-dl--border">
  <dt class="un-dl__dt">…</dt>
  <dd class="un-dl__dd">…</dd>
</dl>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| dt | font-weight / margin-top | 700 / 1em（2 組目以降）|
| dd の子 | margin | 0（上下とも）|
| dd | margin-left / padding | 1em / 1em |
| float | dl の display / flex-wrap | flex / wrap |
| float | dl の font-size / line-height | 0.95em（≥960 は 1em。参照の実測）/ 1.5 |
| float | dt の position / width / padding / margin-top | relative / `--un-dl-dt-width`（既定 5.5em）/ 0.25em 2.5em 0.25em 0 / 0 |
| float | dt::after | 区切りのダッシュ | 0.5em×2px、top 0.9375em / right 1em、色 `--un-color-border` |
| float | dd の width / flex / padding / margin-left | `calc(100% - dt 幅)` / `0 1 auto`（display: block）/ 0.25em 0 / 0 |
| float | dd の子 | width / min-width | 100% / 0 |
| border | dt の border-left / padding-left | 1px solid `--un-color-main` / 0.75em |

## 6. 受け入れ基準

- [ ] 全 3 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] `float` で項目名の幅が prop で変わる
- [ ] `.un-content` の外でも成立する

## 7. 備考

- 参照は `--swl-dt-width` を inline style で渡している。uneri は `--un-dl-dt-width` に同じ役割を持たせる。
