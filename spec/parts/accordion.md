# Accordion — アコーディオン（D3）

- 状態: impl
- 参照: SWELL アコーディオンブロック `.swell-block-accordion`（`.is-style-default` / `-simple` / `-border` / `-main`）と `details` / `summary` の構造
- 依存トークン: `--un-color-gray` `--un-color-border` `--un-color-main`
- ファイル: `src/components/Accordion.astro`, `src/components/AccordionItem.astro`, `src/styles/parts/accordion.css`, `src/pages/catalog/accordion.astro`, `reference/fixtures/accordion.html`

## 1. 用途

クリックで開閉する見出し＋本文の並び。JS は使わず `details` / `summary` の標準動作に任せる。

## 2. API

```ts
// Accordion（親）
interface Props extends HTMLAttributes<'div'> {
  variant?: 'default' | 'simple' | 'border' | 'main'; // 既定 'default'
  class?: string;
  id?: string;
}

// AccordionItem（子）
interface Props extends HTMLAttributes<'details'> {
  title: string;
  open?: boolean;
  class?: string;
  id?: string;
}
```

slot: Accordion は AccordionItem の並び、AccordionItem は本文。

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.is-style-default` | 見出しが灰色の帯、項目間 1em |
| `simple` | `variant="simple"` | `.is-style-simple` | 帯なし、項目の上下に 1px の線 |
| `border` | `variant="border"` | `.is-style-border` | 項目全体を 1px の枠で囲む |
| `main` | `variant="main"` | `.is-style-main` | 見出しがメインカラー・白文字 |
| `long` | 見出しが長い URL | 同上 | `word-break` で枠内に収まる |

## 4. マークアップ

```html
<div class="un-accordion un-accordion--default">
  <details class="un-accordion__item">
    <summary class="un-accordion__title">
      <span class="un-accordion__label">…</span>
      <span class="un-accordion__icon"><i class="un-accordion__icon--closed"></i><i class="un-accordion__icon--opened"></i></span>
    </summary>
    <div class="un-accordion__body">…</div>
  </details>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| item | margin-bottom / margin-top（2 つめ以降）| 1em（最後は 0、`simple` は 0）/ 0.5em |
| label | flex-grow / padding-right / word-break | 1 / 1em / break-all（長い URL でもはみ出さない）|
| item | list-style（`summary` のマーカー消し）| `::marker` を出さない |
| title | display / align-items / justify-content | flex / center / space-between |
| title | padding / cursor / font-weight | 1em / pointer / 400 |
| title（default）| background | `--un-color-gray` |
| title（main）| background / color | `--un-color-main` / #fff |
| body | padding / overflow | 0 1em（閉）→ 1em（開）/ hidden |
| body（閉）| height / opacity / transition | 0 / 0 / `padding, height, opacity, visibility` 0.25s |

| icon | font-size / 寸法 / position / text-align / flex-shrink | 1.25em / 1em × calc(1em + 1px)（自身の font-size 基準）/ relative / right / 0（line-height は継承）|
| icon（閉）| display / opacity / transform / transition | block / 1 / `scale(1)` / `transform .25s, opacity .25s` |
| icon（開）| position / opacity / transform | absolute（top 0 / left 0）/ 0 / `scale(-0.5)` |
| icon（開）| transition | `transform .25s, opacity .25s` |

### バリアント別
| variant | 対象 | プロパティ | 値 |
|---|---|---|---|
| simple | item | margin / border-top / border-bottom | 0 / 1px solid `--un-color-border`（先頭のみ上）/ 1px solid |
| border | item | border | 1px solid `--un-color-border` |
| simple / border | body | margin / padding / border-top | 左右 0.5em / 左右 0.5em / 1px dashed `--un-color-border` |
| main | body | border | 左右下 1px solid `--un-color-main`（上辺は none）|

## 6. 受け入れ基準

- [ ] 全 5 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] `summary` の既定マーカーが出ない
- [ ] 開いたときに本文が出る（`details` の標準動作）
- [ ] `.un-content` の外でも成立する

## 7. 備考

- 参照は JS で開閉する（`details` の `open` 属性では開かず、`[open]` を付けても本文は閉じたまま）。uneri は `details` の標準動作に任せるため、**開いた状態は参照に対応物が無く比較できない**。閉じた状態を審査対象とし、開いた状態は uneri の設計として `padding: 1em` / `height: auto` / `opacity: 1` を戻す。
- アイコンは参照ではアイコンフォント。uneri は data URI の SVG（`caret`）を `mask-image` で `::before` に描く（参照が glyph を疑似要素で描くのと同じ位置。spec/04-audit.md §2.1）。
