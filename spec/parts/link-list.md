# LinkList / LinkListItem — リンクリスト（C3）

- 状態: impl
- 参照: SWELL リンクリストブロック `.swell-block-linkList`（`.is-style-default` / `.is-style-button`、`-border` / `-fill` / `-flex`）
- 依存トークン: `--un-color-main`, `--un-color-text`, `--un-color-border`
- ファイル: `src/components/LinkList.astro`, `src/components/LinkListItem.astro`, `src/styles/parts/link-list.css`, `src/pages/catalog/link-list.astro`, `reference/fixtures/link-list.html`

## 1. 用途

関連ページへのリンクを並べる。行のまま・罫線つき・塗り・横並び・ボタン型の 5 通り。

## 2. API

```ts
// LinkList
interface Props extends HTMLAttributes<'ul'> {
  variant?: 'default' | 'button'; // 既定 'default'
  border?: boolean;  // 行の間に罫線
  fill?: boolean;    // 行をメインカラーで塗る
  inline?: boolean;  // 横に並べる
  class?: string;
  id?: string;
}

// LinkListItem
interface Props extends HTMLAttributes<'li'> {
  href: string;
  label: string;
  icon?: 'left' | 'right' | 'none'; // 既定 'right'
  sponsored?: boolean;
  class?: string;
  id?: string;
}
```

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.is-style-default` | 1 行 1 リンク。右端に山形の記号 |
| `border` | `border` | `-border` | 各行の上下に罫線、行に余白 |
| `fill` | `fill` | `-fill` | 行をメインカラーで塗り、hover で反転 |
| `flex` | `inline` | `-flex` | 横に並ぶ。hover は下線だけ |
| `button` | `variant="button"` | `.is-style-button` | 角丸の枠、文字は中央。hover で反転 |
| `icon-left` | `icon="left"` | `.-left` | 記号を左に置く（hover で文字が動く）|

## 4. マークアップ

```html
<ul class="un-link-list un-link-list--border">
  <li class="un-link-list__item">
    <a class="un-link-list__link" href="…">
      <span class="un-link-list__text">…</span>
      <span class="un-link-list__icon un-link-list__icon--right" aria-hidden="true"><i class="un-link-list__glyph"></i></span>
    </a>
  </li>
</ul>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| ul | display / flex-wrap / align-items / gap | flex / wrap / center / 0.75em（`-border` は 0、`button` は 0.5em、`-flex` は 0.5em 0.75em）|
| item | width / margin / position | 100%（`-flex` は auto）/ 0 / relative |
| link | display / align-items / gap / line-height | flex / center / 0.25em / 1.4 |
| text | margin-right / transition | auto / transform .25s |
| icon | display / flex / 寸法 / color / font-size / line-height | block / 0 0 auto / 1em × 1.4em / `--un-color-main` / 1.25em / 1.4 |
| border | item / link | 下罫線（先頭は上罫線も）/ padding 0.6em 0.5em |
| fill | link | 背景 `--un-color-main` / 文字 #fff（hover で透明・メインカラー）|
| button | link | padding 0.6em 1.5em / border 1px solid `--un-color-text` / radius 100px / 中央寄せ |
| button | icon / text | margin-right -0.75em・色は継承 / 左右 auto |
| button | hover | 背景 `--un-color-text` / 文字 #fff（枠の色はそのまま）|
| hover（default 系）| icon / text | 右の記号が translateX(0.4em)、左の記号のときは文字が translateX(0.4em) |
| hover（`-flex`）| link | 下線 |

## 6. 受け入れ基準

- [x] 全 6 バリアント（＋ hover）が 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] 記号の ink box が参照と一致
- [x] `.un-content` の外でも成立する

## 7. 備考

- 参照のブロックは手元のデモページに出力例が無く、マークアップは CSS のセレクタ構造（`__item` > `__link` > `__icon`／`__text`、`__icon` の中の `i`）から組み立てて描画で確かめた。描画は参照の規則がすべて当たった状態で計測している。
- 記号は参照がアイコンフォント（既定は山形）、uneri が SVG マスク。判定は ink box で行う（spec/04-audit.md §2.1）。
