# BoxMenu / BoxMenuItem — ボックスメニュー（F3）

- 状態: impl
- 参照: SWELL ボックスメニューブロック `.swell-block-box-menu`（`.is-style-default` / `.is-style-fill`、`data-direction`、`data-has-gap`、`data-has-gradient`）
- 依存トークン: `--un-color-main`, `--un-color-hover-gray`, `--un-color-box-menu-border`
- ファイル: `src/components/BoxMenu.astro`, `src/components/BoxMenuItem.astro`, `src/styles/parts/box-menu.css`, `src/pages/catalog/box-menu.astro`, `reference/fixtures/box-menu.html`

## 1. 用途

アイコンとラベルの箱を 2 列に並べたリンク集。

## 2. API

```ts
// BoxMenu
interface Props extends HTMLAttributes<'div'> {
  variant?: 'default' | 'fill';          // 既定 'default'
  direction?: 'vertical' | 'horizontal'; // アイコンを上に置くか左に置くか
  gap?: string;      // 箱の間隔。省略すると隙間なしで罫線が重なる
  iconSize?: string; // 既定 2em
  gradient?: string; // マスクアイコンを塗る（fill では箱を塗る）グラデーション
  class?: string;
  id?: string;
}

// BoxMenuItem
interface Props extends HTMLAttributes<'div'> {
  href?: string;
  label: string;
  icon?: string;      // マスクとして塗る画像の URL（グラデーションで塗られる）
  sponsored?: boolean;
  class?: string;
  id?: string;
}
```

インライン SVG をアイコンにするときは `icon` を渡さず `slot="icon"` に置く。`default` では `--un-color-main`、`fill` では白で塗られる。

## 3. バリアント一覧

| data-variant | props | 参照 | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.is-style-default` | 枠線の箱。アイコンはグラデーションで塗ったマスク |
| `horizontal` | `direction="horizontal"` | `data-direction="horizontal"` | アイコンがラベルの左に並ぶ |
| `fill` | `variant="fill"` | `.is-style-fill` | 箱をメインカラーで塗り、文字は白 |
| `fill-gradient` | `variant="fill" gradient="…"` | `.is-style-fill [data-has-gradient="1"]` | 箱をグラデーションで塗る |
| `flush` | `gap` なし | `data-has-gap="0"` | 隙間なしで隣り合う枠線が重なる |
| `icon-svg` | `slot="icon"` にインライン SVG | `data-has-gradient="0"` | アイコンをメインカラーで塗る |
| `icon-size` | `iconSize="3em"` | `--the-icon-size` | アイコンの大きさ |
| `gap-large` | `gap="16px"` | `--the-gap` | 箱の間隔 |

## 4. マークアップ

```html
<div class="un-box-menu un-box-menu--default" style="--un-box-menu-gap:4px">
  <div class="un-box-menu__inner">
    <div class="un-box-menu__item">
      <a class="un-box-menu__link" href="…">
        <div class="un-box-menu__figure"><span class="un-box-menu__mask" style="--_glyph:url(…)"></span></div>
        <span class="un-box-menu__text">…</span>
      </a>
    </div>
  </div>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| inner | display / flex-wrap / justify-content | flex / wrap / flex-start |
| inner | width / margin-left / row-gap | `calc(100% + 間隔)` / `-間隔` / 間隔 |
| item | width / margin-left / text-align / transition | `calc(50% - 間隔)` / 間隔 / center / opacity .25s, box-shadow .25s |
| link | display / position / flex-direction / justify-content / padding / transition | flex / relative / column / center / 1em / background-color .25s |
| figure | display / position / inset / align-items / justify-content / height / margin-bottom | flex / relative / 0 / center / center / アイコン寸法 / 1em |
| mask | 寸法 / background-image / mask | アイコン寸法 / グラデーション / contain・no-repeat・50% 50% |
| figure > svg | 寸法 / fill / color | アイコン寸法 / currentColor / `--un-color-main`（fill では継承した白）|
| text | display / flex / line-height | block / 1 / 1 |
| default | item の border / link の hover | 1px solid `--un-color-box-menu-border` / `--un-color-hover-gray` |
| fill | item の color / link の padding・背景 | #fff / 1em 1.25em・`--un-color-main`（グラデーション指定時はそれ）|
| fill | item の hover | opacity .8 / box-shadow `0 1px 8px 1px rgba(0,0,0,.15)` |
| flush | inner / item | width `calc(100% - 1px)`・margin-left 1px・row-gap normal / margin `-1px 0 0 -1px` |
| horizontal | item / link / figure | text-align start / flex-direction row・align-items center / width アイコン寸法・margin 0 1em 0 0 |

## 6. 受け入れ基準

- [x] 全 8 バリアント（＋ hover）が 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] `.un-content` の外でも成立する

## 7. 備考

- 箱は常に 2 列。参照の CSS には列数を切り替える手掛かり（クラス・属性・カスタムプロパティ）が無く、描画も 375〜1200 で 2 列のままだった。
- 参照は `fill` でマスクアイコンに寸法を与えない（アイコンが消える）。`fill` ではインライン SVG を使う。
- `.un-content` 内の「箱の中の先頭要素は上マージンを持たない」という既定は `:where()` で弱めてあり、パーツ側が上書きできる（本パーツの `flush` が -1px を要求するため）。記事本文の上端に対する既定はそのまま強い。
