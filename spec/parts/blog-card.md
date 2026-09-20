# BlogCard — ブログカード（F1）

- 状態: impl
- 参照: SWELL 関連記事ブロック `.swell-block-postLink` / `.p-blogCard`（`data-type="type1|type2|type3"`、`-external`、`-noimg`）
- 依存トークン: `--un-color-main`, `--un-color-bg`, `--un-color-text`, `--un-radius-sm`, `--un-ratio-card`
- ファイル: `src/components/BlogCard.astro`, `src/styles/parts/blog-card.css`, `src/pages/catalog/blog-card.astro`, `reference/fixtures/blog-card.html`

## 1. 用途

記事へのリンクを、サムネイル・タイトル・抜粋つきのカードで見せる。

## 2. API

```ts
interface Props extends HTMLAttributes<'div'> {
  href: string;
  heading: string;       // カードのタイトル
  excerpt?: string;
  caption?: string;      // ラベル。既定 '関連記事'
  src?: string;          // サムネイル。無ければ画像なしの形になる
  alt?: string;
  width?: number | string;
  height?: number | string;
  type?: 'type1' | 'type2' | 'type3'; // 既定 'type1'
  external?: boolean;    // 外部リンク（ラベルの記号が変わる）
  sponsored?: boolean;   // rel="nofollow sponsored noopener"
  class?: string;
  id?: string;
}
```

## 3. バリアント一覧

| data-variant | props | 参照 | 見た目の要点 |
|---|---|---|---|
| `type1` | 既定 | `data-type="type1"` | 細い枠を疑似要素で描き、左上に地色のラベル |
| `type2` | `type="type2"` | `data-type="type2"` | 枠とラベルがメインカラー |
| `type3` | `type="type3"` | `data-type="type3"` | 影のついた白いカード。ラベルは右下に小さく |
| `external` | `external` | `-external` | ラベルの記号が外部リンクのものになる |
| `noimg` | `src` なし | `-noimg` | サムネイルなし。カードは最低 5em の高さを保つ |

## 4. マークアップ

```html
<div class="un-blog-card">
  <div class="un-blog-card__card" data-type="type1">
    <div class="un-blog-card__inner">
      <span class="un-blog-card__caption">関連記事</span>
      <div class="un-blog-card__thumb">
        <figure class="un-blog-card__figure"><img class="un-blog-card__img" src="…" alt=""></figure>
      </div>
      <div class="un-blog-card__body">
        <a class="un-blog-card__title" href="…">…</a>
        <span class="un-blog-card__excerpt">…</span>
      </div>
    </div>
  </div>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| card | max-width / transition | 880px / box-shadow .25s |
| inner | display / position / align-items / justify-content / transition | flex / relative / center / space-between / box-shadow .25s |
| inner | padding（<600 / ≥600）| 21px 16px 16px / 25px 24px 24px（type2 は上 24 / 28、type3 は 16 / 24 の四辺）|
| caption | position / top / left / height / padding / radius / font-size | absolute / -1em / 16px（≥600 は 24px）/ 2em / 0 0.5em / `--un-radius-sm` / 11px（≥600 は 12px）|
| caption | 背景 / 文字 | type1 `--un-color-bg` / 本文色、type2 `--un-color-main` / #fff |
| type3 caption | 位置 / transform / opacity / font-size | 右下（right 4px・bottom 2px、≥600 は 8px / 8px）/ scale(.8) 起点 right bottom / .8 / 10px |
| type1 inner::before | inset / z-index / border | 0 / 0 / 1px solid currentColor |
| thumb | width（<600 / ≥600）/ margin-right / flex-shrink | 30% / 21% / 1em / 0 |
| figure::before | padding-top | `--un-ratio-card`（56.25%）|
| img | position / 寸法 / object-fit / transition | absolute 左上 / 100%×100% / cover / transform .25s |
| body | flex-grow | 1 |
| title | font-size / font-weight / line-height / color | 1rem / 400 / 1.4 / 本文色 |
| excerpt | display / margin-top / font-size / line-height / opacity | <960 は none / 0.5em / 0.8em / 1.4 / .8 |
| noimg | inner の min-height | 5em |
| hover | card の box-shadow | `0 4px 16px rgba(0,0,0,.1), 0 12px 28px -12px rgba(0,0,0,.05)` |

| excerpt | word-break | break-word（長い URL が列幅を押し広げないように）|

## 6. 受け入れ基準

- [x] 全 5 バリアント（＋ hover）が 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] ラベルの記号（既定＝チェック、外部リンク＝別記号）の ink box が参照と一致
- [x] `.un-content` の外でも成立する

## 7. 備考

- ラベルの記号は参照がアイコンフォント、uneri が SVG マスク。字形は描画を見て起こした（既定はチェックマーク）。判定は ink box で行う（spec/04-audit.md §2.1）。
- 参照のアイコンフォント字形はインラインのテキストで、マスクは塗られた箱。両者は `vertical-align` が原理的に揃わないため、審査では他のグリフ専用プロパティと同じく比較から外している。
