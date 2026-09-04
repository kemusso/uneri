# Balloon — ふきだし（B5）

- 状態: impl
- 参照: SWELL ふきだしブロック `.c-balloon`（`-bln-left` / `-bln-right`）、`.c-balloon__icon`（`-circle` / `-square`）、`.c-balloon__body`（`-speaking` / `-thinking`、`-border-none` / `-border-on`）、`data-col`（gray / red / blue / green / yellow）
- 依存トークン: `--un-color-balloon-*-bg` `--un-color-balloon-*-line` `--un-color-balloon-icon-border` `--un-color-text` `--un-radius-balloon`
- ファイル: `src/components/Balloon.astro`, `src/styles/parts/balloon.css`, `src/pages/catalog/balloon.astro`, `reference/fixtures/balloon.html`

## 1. 用途

アイコン付きの会話ふきだし。左右どちらから話すか、しっぽの形（会話／思考）、枠線の有無、色を選べる。

## 2. API

```ts
interface Props extends HTMLAttributes<'div'> {
  /** アイコン画像の URL。省略時はアイコン枠ごと出さない */
  icon?: string;
  /** アイコン下の名前 */
  name?: string;
  dir?: 'left' | 'right';            // 既定 'left'
  shape?: 'circle' | 'square';       // アイコンの形。既定 'circle'
  tail?: 'speech' | 'think';         // しっぽ。既定 'speech'
  border?: boolean;                  // 枠線つき。既定 false
  color?: 'gray' | 'red' | 'blue' | 'green' | 'yellow' | (string & {}); // 既定 'gray'
  class?: string;
  id?: string;
}
```

slot: default（ふきだしの中身）

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `left` | 既定 | `.-bln-left` | アイコン左、しっぽ左向き |
| `right` | `dir="right"` | `.-bln-right` | アイコン右（`row-reverse`）、しっぽ右向き |
| `think` | `tail="think"` | `.-thinking` | しっぽが 2 つの丸 |
| `border` | `border` | `.-border-on` | 1px の枠線、しっぽも二重 |
| `square` | `shape="square"` | `.__icon.-square` | アイコンが角丸なし |
| `col-red` | `color="red"` | `data-col="red"` | 背景 #ffebeb / 線 #f48789 |
| `col-blue` | `color="blue"` | `data-col="blue"` | #e2f6ff / #93d2f0 |
| `col-green` | `color="green"` | `data-col="green"` | #d1f8c2 / #9ddd93 |
| `col-yellow` | `color="yellow"` | `data-col="yellow"` | #f9f7d2 / #fbe593 |
| `think-border` | `tail="think" border` | `.-thinking.-border-on` | 丸のしっぽに 1px の輪郭 |
| `rich` | 見出し・段落 2 つ・リストを含む | 同上 | ふきだし内のブロック余白 |

## 4. マークアップ

```html
<div class="un-balloon un-balloon--right">
  <div class="un-balloon__icon"><img class="un-balloon__img" …><span class="un-balloon__name">名前</span></div>
  <div class="un-balloon__body">
    <div class="un-balloon__text">…<span class="un-balloon__tail"><span></span><span></span></span></div>
  </div>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| root | display / flex-direction / align-content | flex / row（`right` は row-reverse）/ flex-start |
| icon | width / text-align / position | 80px（<600 は 60px）/ center / relative |
| icon img | width / height / border-radius / border | 80px 正方（<600 は 60px）/ 50%（square は 0）/ 2px solid #ececec（square は枠なし）|
| icon name | font-size / line-height / padding-top / text-align | 10px / 10px / 4px / center |
| body | flex / padding / display / align-items | `0 1 100%` / 8px 24px（<600 は 4px 24px）/ flex / flex-start |
| body（`think`）| padding-top | 16px（<600 は 8px。丸が上にはみ出す分）|
| text（ふきだし本体）| max-width / border-radius / padding / font-size | 560px / 8px / 1em / 0.95em（<600）・1em（≥600）|
| text | background / color / border-color / font-size / line-height / position | 色セットの背景 / `--un-color-text` / 色セットの線 / 0.95em / 1.6 / relative |
| text の `p` | margin | 0（上下とも）|
| text の最初/最後の子 | margin-top / margin-bottom | 0（参照では記事本文側の `div > :first-child` / `:last-child` 由来。uneri はパーツ側で持つ）|
| icon img | object-fit / vertical-align | cover / baseline |
| icon name | opacity | 0.8 |
| text（`border`）| border-width | 1px（既定は 0）|
| しっぽの入れ物 | 位置 / 寸法 / z-index | absolute（top 16px、left 0。`right` は right 0）/ 0×0 / 1。背景色・線色をここに置き、子が継承する |
| しっぽ speech | before | `border-width: 8px 10px 8px 0`（左辺は 0）・右辺のみ背景色、10×16、top 0 / left -10px（`border` 時は -8px）、z-index 3 |
| しっぽ speech | after | 同形で右辺のみ線色、z-index 2。既定は `display: none`、`border` 時のみ 10×16 で表示 |
| しっぽ think（`border` 併用）| border | 1px・線色（`--_outline-*` を root の修飾子で切り替える。ふきだしごとに `.un-balloon` で初期化し、入れ子に漏らさない）|
| しっぽ think | before / after | 8px（top 0 / left -21px、z-index 3）と 12px（top 8px / left -16px、z-index 2）の円、背景色 |
| 色セット | gray / red / blue / green / yellow | bg `#f7f7f7` `#ffebeb` `#e2f6ff` `#d1f8c2` `#f9f7d2` ／ line `#ccc` `#f48789` `#93d2f0` `#9ddd93` `#fbe593` |

`right` のときはしっぽの入れ物を右辺に置き `transform: rotateY(180deg)` で鏡像にする（形は 1 つだけ定義する）。本文側は `justify-content: flex-end`。

## 6. 受け入れ基準

- [ ] 全 11 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] `right` でアイコンとしっぽの向きが反転する
- [ ] `think` のしっぽが 2 つの丸になる
- [ ] `border` で枠線としっぽの二重線が出る
- [ ] アイコンが <600 で 60px、≥600 で 80px

## 7. 備考

- 参照には <600px で縦積みにする `-sp-vrtcl`（しっぽを 90° 回転）があるが、まだ再現していない。別途 spec 化する。

- 参照サイトのマークアップには `-bln-right` / `-border-on` / `-square` / `-circle` / `data-col`（yellow・gray・red・blue）が実在する。`-thinking` と green は CSS にのみ存在したため、同じ SWELL CSS に対してクラスを与えた fixture を描画して実測した。
- `data-col` の 5 色はトークン `--un-color-balloon-<name>-bg` / `-line` として定義する。名前以外の色を渡した場合は背景だけを差し替え、線色は既定（灰）のままにする。
