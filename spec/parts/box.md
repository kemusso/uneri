# Box — ボックス装飾（B1）

- 状態: pass
- 参照: SWELL 段落ブロック／グループブロックのスタイル `.is-style-border_sm` `.is-style-border_sg` `.is-style-border_dm` `.is-style-border_dg`（+`.is-style-border_dashed`）`.is-style-border_left` `.is-style-bg_gray` `.is-style-bg_main_thin` `.is-style-bg_main` `.is-style-bg_stripe` `.is-style-bg_grid` `.is-style-dent_box` `.is-style-emboss_box` `.is-style-kakko_box` `.is-style-big_kakko_box` `.is-style-note_box` `.is-style-sticky_box` `.is-style-balloon_box` `.is-style-balloon_box2`
- 依存トークン: `--un-color-main` `--un-color-main-thin` `--un-color-border` `--un-color-gray` `--un-color-note-text` `--un-color-note-bg` `--un-color-note-rule` `--un-shadow-box` `--un-box-padding` `--un-radius-sm`
- ファイル: `src/components/Box.astro`, `src/styles/parts/box.css`, `src/pages/catalog/box.astro`, `reference/fixtures/box.html`

## 1. 用途

本文中の 1 段落、または複数ブロックを囲む装飾ボックス。18 種の見た目を `style` で切り替える（カタログ上のバリアントは短文版・入れ子版を含め 26）。アイコン付き（B2/B3）は同じ `Box` の別 prop で後続 spec に分ける。

## 2. API

`Box` は B1（装飾）と B2/B3（アイコン付き）を兼ねる。`icon` / `bigIcon` は `spec/parts/icon-box.md` §2 を参照。

```ts
interface Props extends HTMLAttributes<'div'> {
  variant?:
    | 'border-sm' | 'border-sg' | 'border-dm' | 'border-dg' | 'border-left'
    | 'bg-gray' | 'bg-main-thin' | 'bg-main' | 'stripe' | 'grid'
    | 'dent' | 'emboss' | 'kakko' | 'big-kakko' | 'note' | 'sticky' | 'balloon' | 'balloon2';
  align?: 'center';      // balloon / balloon2 を中央に置く
  icon?: IconName;       // spec/parts/icon-box.md
  bigIcon?: BigIconName; // spec/parts/icon-box.md
  group?: boolean; // true = 複数ブロック用（padding 2em @≥600、子ブロック間 1em）。既定 false = 1 段落用（padding 1.5em）
  as?: 'div' | 'p'; // 既定 'div'
  class?: string;
  id?: string;
}
```

slot: default

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `border-sm` | `variant="border-sm"` | `.is-style-border_sm` | 1px 実線 メイン色 |
| `border-sg` | `variant="border-sg"` | `.is-style-border_sg` | 1px 実線 灰（`--un-color-border`）|
| `border-dm` | `variant="border-dm"` | `.is-style-border_dm` | 1px 破線 メイン色 |
| `border-dg` | `variant="border-dg"` | `.is-style-border_dashed.is-style-border_dg` | 1px 破線 灰 |
| `border-left` | `variant="border-left"` | `.is-style-border_left` | 左 2px 実線（文字色）、padding-left 10px のみ |
| `bg-gray` | `variant="bg-gray"` | `.is-style-bg_gray` | 背景 `--un-color-gray` |
| `bg-main-thin` | `variant="bg-main-thin"` | `.is-style-bg_main_thin` | 背景 `--un-color-main-thin` |
| `bg-main` | `variant="bg-main"` | `.is-style-bg_main` | 背景メイン色・白文字 |
| `stripe` | `variant="stripe"` | `.is-style-bg_stripe` | -45deg 6px ストライプ（灰）|
| `grid` | `variant="grid"` | `.is-style-bg_grid` | 16px 方眼（灰）|
| `dent` | `variant="dent"` | `.is-style-dent_box` | 黒 5% 背景 + 内側影 |
| `emboss` | `variant="emboss"` | `.is-style-emboss_box` | 白背景・上 2px メイン線・外側影 |
| `kakko` | `variant="kakko"` | `.is-style-kakko_box` | 左上・右下に 36×32 のカギ線 |
| `big-kakko` | `variant="big-kakko"` | `.is-style-big_kakko_box` | 左右に幅 12px の大かっこ |
| `note` | `variant="note"` | `.is-style-note_box` | 灰背景・6px 内側に破線枠・文字色 #5f5a59 |
| `sticky` | `variant="sticky"` + 後続 p | `.is-style-sticky_box` | 白背景・左 8px メイン線・影、padding .75em 1em、lh 1.4 |
| `balloon` | `variant="balloon"` + 後続 p | `.is-style-balloon_box` | メイン色背景・白文字・下に三角の尾 |
| `balloon2` | `variant="balloon2"` + 後続 p | `.is-style-balloon_box2` | 白背景・1px 線（文字色）・下に線付きの尾 |
| `group-border-sm` | `variant="border-sm" group` + p×2 | `.wp-block-group.is-style-border_sm` | padding 2em（≥600）、子ブロック間 1em |
| `sticky-short` | `variant="sticky"` + 短文 | 同上 | 内容幅（min 6em）に縮む |
| `balloon-short` | `variant="balloon"` + 短文 | 同上 | 内容幅（min 2em）に縮む |
| `balloon2-short` | `variant="balloon2"` + 短文 | 同上 | 内容幅に縮む |
| `group-heading` | `variant="bg-gray" group` + 見出し + p | `.wp-block-group` + `h3` | group の中では見出しの余白が 1em になり、h2 の食い出しも起きない |
| `group-nested` | `variant="bg-gray" group` の中に Box 3 種 | `.wp-block-group` の入れ子 | 入れ子のボックスの padding が group の値を継ぐ |
| `balloon-center` | `variant="balloon"/"balloon2"` + `align="center"` | `.has-text-align-center` | 吹き出しと尾が中央 |
| `group-bg-gray` | `variant="bg-gray" group` + p + ul | `.wp-block-group.is-style-bg_gray` | 同上 |

## 4. マークアップ

```html
<div class="un-box un-box--border-sm">…</div>
<div class="un-box un-box--bg-gray un-box--group"><p>…</p><ul>…</ul></div>
```

## 5. 計測値（参照の実測）

共通（特記なきスタイル）: padding `1.5em`（= `--un-box-padding`）、font-size / line-height は本文継承、`margin-bottom` は本文既定 2em。

| style | プロパティ | 値 |
|---|---|---|
| border-sm | border | 1px solid `--un-color-main` |
| border-sg | border | 1px solid `--un-color-border` |
| border-dm | border | 1px dashed `--un-color-main` |
| border-dg | border | 1px dashed `--un-color-border` |
| border-left | border-left / padding | 2px solid currentColor / 0 0 0 10px |
| bg-gray | background | `--un-color-gray` |
| bg-main-thin | background | `--un-color-main-thin` |
| bg-main | background / color | `--un-color-main` / #fff |
| stripe | background-clip | padding-box |
| stripe | background | `linear-gradient(-45deg, transparent 25%, gray 25% 50%, transparent 50% 75%, gray 75%)` size 6px 6px、position relative |
| grid | background | `linear-gradient(transparent calc(100% - 1px), gray 50%, gray), linear-gradient(90deg, 同)` size 16px 16px |
| dent | background / box-shadow | rgba(0,0,0,.05) / inset 0 2px 4px rgba(0,0,0,.1) |
| emboss | background / color / border-top / box-shadow | #fff / `--un-color-text` / 2px solid main / `--un-shadow-box` |
| kakko | position | relative |
| kakko::before | 位置 / サイズ / border | top 0 left 0 / 2.25em×2em（36×32 @16）/ top・left 1px solid main（border-color は 4 辺とも main）|
| kakko::after | 位置 / サイズ / border | bottom 0 right 0 / 2.25em×2em / bottom・right 1px solid main |
| big-kakko::before | 位置 / サイズ / border | top 0 bottom 0 left 0 / width 0.75em（12px @16）/ top・bottom・left 1px solid main |
| big-kakko::after | 同上（右）| right 0 / top・bottom・right |
| note | color / background / position | `--un-color-note-text` / `--un-color-note-bg` / relative |
| note::before | inset / border / pointer-events | 6px / 1px dashed `--un-color-note-rule` / none |
| sticky | background / color / border-left / box-shadow / padding / line-height | #fff / `--un-color-text` / 8px solid main / `--un-shadow-box` / .75em 1em / 1.4 |
| sticky | width / min-width | fit-content / 6em（内容幅に縮む）|
| balloon | background / color / radius / padding / line-height | main / #fff / 2px / .5em 1.25em / 1.4 |
| balloon, balloon2 | width / min-width | fit-content / 2em（内容幅に縮む）|
| balloon::before | 尾 | absolute, top 100% - 2px… 実測 top = 高さ-2px, left 1.25em, 24×24 の透明 border 12px、上辺のみ main |
| balloon2 | background / color / border / radius / padding / line-height | #fff / `--un-color-text` / 1px solid currentColor / 2px / .5em 1.25em / 1.4 |
| balloon2::before | 尾 | absolute, bottom -7px, left 1.25em, 12×12, bg #fff, border-right/bottom 1px currentColor, rotate(45deg) |
| group | padding / 子 margin | 1.5em（<600）/ 2em（≥600）、子 `margin-bottom:1em`（最初の子は `margin-top:0`、最後の子は `margin-bottom:0`）。見出しの `margin-top` は見出し側の値が残る |
| group | padding の配り方 | `--un-box-padding` を書き換えて**子孫のボックスにも継承**させる（入れ子の Box も 2em になる。アイコンボックスは独自の padding なので影響しない）|
| note::before | border-radius | `inherit`（本体に角丸を付けると内側枠も追従）|
| balloon2::before | background | `inherit`（本体の背景色に追従）|
| balloon/balloon2 `align="center"` | 位置 | `margin-inline: auto`、尾は `left: calc(50% - 12px)` / `left: 50%` + `translateX(-50%)` |

375px（本文 15px）でも同じ em 値で一致すること（padding 22.5px など）。

## 6. 受け入れ基準

- [ ] sticky / balloon / balloon2 が短文で内容幅に縮む（`fit-content`）
- [ ] 全 26 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] kakko / big-kakko / note の疑似要素の位置・寸法が一致
- [ ] balloon / balloon2 の尾の形と位置が一致（balloon2 は 45° 回転の正方形）
- [ ] stripe / grid の背景パターンが一致（背景 size・角度）
- [ ] group 時の子ブロック間隔 1em
- [ ] 白背景系（emboss / sticky / balloon2）が `color` を自前で固定し、`bg-main` の中に置いても文字が読める
- [ ] note の破線枠がクリックを遮らない（`pointer-events: none`）

## 7. 備考

- 参照では段落スタイル（`p.is-style-*`）とグループスタイル（`.wp-block-group.is-style-*`）で padding が異なる（1.5em / ≥600 で 2em）。uneri は `group` prop で切り替える。
- 参照の WP グループブロックは内側に `.wp-block-group__inner-container` を持つが、この div にはスタイルが無く、外しても寸法が変わらないことを実測で確認したため fixture では省略している（uneri 側もラッパを作らない）。
- note の文字色 #5f5a59・背景 #f7f7f7・破線 rgba(199,199,199,.6) は `--un-color-note-*` としてトークン化。
