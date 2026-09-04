# BannerLink — バナーリンク（F2）

- 状態: impl
- 参照: SWELL バナーリンクブロック `.swell-block-bannerLink` / `.c-bannerLink`（`-shadow-on` / `-radius-on` / `-blur-on`）
- 依存トークン: `--un-color-link`, `--un-shadow-img`
- ファイル: `src/components/BannerLink.astro`, `src/styles/parts/banner-link.css`, `src/pages/catalog/banner-link.astro`, `reference/fixtures/banner-link.html`

## 1. 用途

画像の上に見出しと説明を重ねた、リンク 1 枚のバナー。

## 2. API

```ts
interface Props extends HTMLAttributes<'a'> {
  href: string;
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  heading?: string;      // バナーの見出し
  description?: string;  // 説明
  shadow?: boolean;
  radius?: boolean | string; // true で 8px、文字列でその値
  blur?: boolean;            // 画像をぼかす
  overlay?: string;          // 画像に重ねる色
  bannerHeight?: string;     // バナーの高さ
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'center' | 'bottom';
  sponsored?: boolean;       // rel="nofollow sponsored noopener"
  class?: string;
  id?: string;
}
```

## 3. バリアント一覧

| data-variant | props | 参照 | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.c-bannerLink` | 画像の上に白文字を中央寄せで重ねる |
| `shadow` | `shadow` | `-shadow-on` | `--un-shadow-img` の影 |
| `radius` | `radius` | `-radius-on` | 角丸 8px（リンク・画像・重ね色すべて）|
| `blur` | `blur` | `-blur-on` | 画像を blur(4px) + scale(1.08) |
| `overlay` | `overlay="rgba(30,29,26,.6)"` | インライン `background-color` | 画像の上に色を敷く |
| `height` | `bannerHeight="100px"` | `figure` のインライン `height` | バナーの高さを決める |
| `align-center` | `align="center"` | `has-text-align-center` | 文字の左右位置（既定が中央）|
| `valign-top` / `valign-bottom` | `valign="top"｜"bottom"` | `is-vertically-aligned-*` | 文字の縦位置 |

## 4. マークアップ

```html
<div class="un-banner-link">
  <a class="un-banner-link__a un-banner-link__a--shadow" href="…">
    <figure class="un-banner-link__figure"><img class="un-banner-link__img" src="…" alt=""></figure>
    <div class="un-banner-link__text" data-valign="top">
      <div class="un-banner-link__title">…</div>
      <div class="un-banner-link__description">…</div>
    </div>
  </a>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| a | display / position / overflow / text-align / color | block / relative / hidden / center / `--un-color-link` |
| a::before | position / inset / z-index / background | absolute / 0 / 1 / `inherit`（重ね色）|
| figure | position / z-index / margin / overflow / transition | relative / 0 / 0 / hidden / opacity .25s |
| img | display / width / height / object-fit / transition | block / 100% / 100% / cover / transform .25s |
| text | position / inset / z-index / display / flex-direction / align-items / justify-content / padding / color | absolute / 0 / 2 / flex / column / center / center / 1.5em / #fff |
| title | width / font-size / line-height | 100% / 1.4em / 1.25 |
| description | width / margin-top / font-size | 100% / 0.5em / 0.95em |
| shadow | box-shadow | `--un-shadow-img` |
| radius | border-radius | 8px |
| blur | img の filter / transform | blur(4px) / scale(1.08) |
| valign | text の justify-content | top→flex-start / bottom→flex-end |
| hover | figure の opacity / img の transform | 0.8 / scale(1.04)（blur 時は 1.12）|

## 6. 受け入れ基準

- [x] 全 9 バリアント（＋ hover）が 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] `.un-content` の外でも成立する

## 7. 備考

- 参照の文字位置クラス `has-text-align-left/right` は WordPress 本体の CSS で定義されており、テーマ CSS だけを読み込む fixture では効かない（描画は中央のまま）。`align` prop は uneri 側の `text-align` として持ち、審査対象からは外している。
- 参照の `.c-bannerLink__label`（`-cap-*`）はトップページのピックアップバナー用でマークアップを観測できないため対象外。
- アフィリエイトリンクには `sponsored` を付けて `rel="nofollow sponsored noopener"` を出す。
