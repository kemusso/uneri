# Review — レビュー（E2）

- 状態: impl
- 参照: SWELL レビューブロック `.swell-block-review`（`__image` / `__inner` / `__title` / `__rating` / `__merits` / `__demerits`、星は `.c-reviewStars`）
- 依存トークン: `--un-radius-md`, `--un-shadow-box`, `--un-color-review-label`, `--un-color-review-star`, `--un-color-review-merit`, `--un-color-review-demerit`
- ファイル: `src/components/Review.astro`, `src/styles/parts/review.css`, `src/pages/catalog/review.astro`, `reference/fixtures/review.html`

## 1. 用途

商品やサービスの評価。画像・見出し・星つきの評価・メリット・デメリットを 1 枚にまとめる。

## 2. API

```ts
interface Props extends HTMLAttributes<'div'> {
  heading: string;
  rating?: number;        // 0〜5。0.5 刻みで星になる
  ratingLabel?: string;   // 既定 '総合評価'
  ratingText?: string;    // 評価に添える言葉
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  merits?: string[];
  demerits?: string[];
  meritsLabel?: string;   // 既定 'メリット'
  demeritsLabel?: string; // 既定 'デメリット'
  class?: string;
  id?: string;
}
```

## 3. バリアント一覧

| data-variant | props | 見た目の要点 |
|---|---|---|
| `default` | 画像・評価・メリット・デメリット | 画像の下に白いパネル。上辺だけ 2px の線 |
| `no-image` | `src` なし | パネルだけ |
| `merits-only` | `demerits` なし | 最後のブロックの下マージンは落ちる |

## 4. マークアップ

```html
<div class="un-review">
  <div class="un-review__image"><img class="un-review__img" src="…" alt=""></div>
  <div class="un-review__inner">
    <div class="un-review__title">…</div>
    <div class="un-review__rating">
      <span class="un-review__label">総合評価</span>
      <span class="un-review__stars"><i class="un-review__star un-review__star--full"></i>…</span>
      <span class="un-review__value">4.5</span>
      <span class="un-review__str">とても良い</span>
    </div>
    <div class="un-review__merits">
      <span class="un-review__label">メリット</span>
      <ul class="un-review__list"><li>…</li></ul>
    </div>
    <div class="un-review__demerits">…</div>
  </div>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| image | max-width / margin | 72% / 左右 auto・下 1.5rem |
| img | display / margin | block / 左右 auto |
| inner | max-width / margin / padding | 720px / 左右 auto / 1.5rem（<600 は 1.5rem 1rem）|
| inner | border-top / radius / 背景 / 影 / 文字 | 2px solid currentColor / 下だけ 4px / #fff / `--un-shadow-box` / #000 |
| inner > :last-child | margin-bottom | 0 |
| title | display / justify-content / font-size / font-weight / margin-bottom | flex / center / 1.1em / 700 / 1.5rem |
| rating | text-align / margin-bottom | center / 1.5rem |
| rating の label | display / padding / radius / 背景 / 文字 / line-height | inline-flex / 0.5em / 1px / `--un-color-review-label` ＋ 6px の斜めストライプ / #fff / 1 |
| stars | display / font-size / letter-spacing / line-height | inline / 1.4em / 0.1em / 1.25 |
| star | color | `--un-color-review-star` |
| value | display / align-items / justify-content | flex / center / center |
| str | margin / color / font-size | 0 -6px 0 6px / #454545 / 0.75em |
| merits | margin-bottom | 2rem |
| merits / demerits の label | width / padding / radius / font-size / line-height / 背景 | fit-content / 0.5em 1em / 5em / 0.9em / 1 / `--un-color-review-merit`・`-demerit`（斜めストライプつき）|
| list | margin-left / padding-left / li の margin | 1.5rem（<600 は 1.25rem）/ 0 / 0.4em 0 |

## 6. 受け入れ基準

- [x] 全 3 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] 星（満・半・空）の ink box が参照と一致
- [x] `.un-content` の外でも成立する

## 7. 備考

- 参照のブロックは手元のデモページに出力例が無く、マークアップは CSS のセレクタ構造（`__image` / `__inner` の中に `__title` `__rating` `__merits` `__demerits`、`__rating` の中に `.__label` `.__stars` `.__value` `.__str`）から組み立てて描画で確かめた。
- 星は参照がアイコンフォント（`star-full` / `-half` / `-empty`）、uneri が SVG マスク。字形は自作で、判定は ink box で行う。参照の字はグリフなので `letter-spacing` が字の後ろに入る。uneri はマスクの箱にその分を含めて同じ歩幅にしてある。
