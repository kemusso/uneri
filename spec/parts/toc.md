# Toc — 目次（A4）

- 状態: spec
- 参照: SWELL 目次 `.p-toc`（`-double`）と `.p-toc__ttl` / `__list` / `__item` / `__link` / `__childList`
- 依存トークン: `--un-color-border` `--un-color-text`
- ファイル: `src/components/Toc.astro`, `src/components/TocItem.astro`, `src/styles/parts/toc.css`, `src/pages/catalog/toc.astro`, `reference/fixtures/toc.html`

## 1. 用途

記事内の見出しへのリンク一覧。見出しの収集は行わず、渡された項目を並べるだけ（`00-overview.md` の非目標「装飾以外の JS」）。

## 2. API

```ts
// Toc（親）
interface Props extends HTMLAttributes<'div'> {
  variant?: 'default' | 'double'; // 既定 'default'
  title?: string;                  // 既定 '目次'
  class?: string;
  id?: string;
}

// TocItem（子）
interface Props extends HTMLAttributes<'li'> {
  href: string;
  label: string;
  class?: string;
  id?: string;
}
```

slot: Toc は TocItem の並び、TocItem は入れ子の `Toc` 用リスト（省略可）。

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.p-toc` | 枠なし。見出し＋番号付きリスト |
| `double` | `variant="double"` | `.p-toc.-double` | 上下に 4px の二重線、内側 2em の余白 |

## 4. マークアップ

```html
<div class="un-toc un-toc--double">
  <span class="un-toc__title">目次</span>
  <ol class="un-toc__list">
    <li class="un-toc__item"><a class="un-toc__link" href="#…">…</a>
      <ol class="un-toc__childList"><li class="un-toc__item">…</li></ol>
    </li>
  </ol>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| title | display / position / font-size / line-height / text-align / margin-bottom | block / relative / 1.2em / 1 / center |
| title::before | アイコン | 1em 角のリスト記号（参照はアイコンフォント。uneri は SVG マスク）、右に 0.5em |
| root | max-width / width / margin | 800px / ≥960 で 92% / 左右 auto（中央寄せ）|
| list | list-style / padding-left | decimal / 1.5em（参照は 0。意図的乖離）|
| item | display / margin / line-height / position | list-item / 0.25em 0（2 つめ以降は上 0.5em）/ 1.6 / relative |
| link | display / color | inline / `--un-color-text` |
| childList | padding-left | 1.5em（参照は 0.5em。意図的乖離）|
| `double` | 枠 | 上下 `4px double --un-color-border` |
| `double` | title の margin-bottom | 0.75em |
| `double` | padding / background | 1.5em 1em（≥600 は 2em）/ 4px の斜めストライプ（`--un-color-gray`、`background-clip: padding-box`）|

## 6. 受け入れ基準

- [ ] 全 2 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] 入れ子の項目が字下げされる
- [ ] `.un-content` の外でも成立する

## 7. 意図的乖離（spec/04-audit.md §3.1）

| 対象 | 参照 | uneri | 理由 |
|---|---|---|---|
| `.un-toc__list` の padding-left | `0` | `1.5em` | issue #3。マーカーは `list-style-position: outside` で箱の外に描かれるため、目次が親の左端に接する幅では 2 桁の項番（`10.` 以降）の先頭桁が切れる。`10.` の描画には約 1.4em 要る |
| `.un-toc__childList` の padding-left | `0.5em` | `1.5em` | 同上。`decimal` のマーカー幅（約 1.3em）より狭いと、子のマーカーが親とほぼ同じ x に並び階層が読めない |

## 8. 備考

- 参照の目次本体は JS で生成されるため、静的 HTML に項目が出ない。fixture は SWELL のクラス名に項目を流し込んで描画し、その結果を実測した。
- 見出しの自動収集は非目標。Astro 側で見出しを集めて `TocItem` に渡す使い方を想定する。
