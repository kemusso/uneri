# Button — ボタン（D1）

- 状態: pass
- 参照: SWELL ボタンブロック `.swell-block-button` + `.is-style-btn_normal` / `btn_solid` / `btn_line` / `btn_shiny`、サイズ `-size-s` / `-size-l`、色 `red_` / `blue_` / `green_`、`data-align`
- 依存トークン: `--un-color-main` `--un-color-main-dark` `--un-color-btn-{red,blue,green}` `--un-color-btn-{red,blue,green}-dark` `--un-shadow-btn` `--un-shadow-btn-hover` `--un-radius-btn`
- ファイル: `src/components/Button.astro`, `src/styles/parts/button.css`, `src/pages/catalog/button.astro`, `reference/fixtures/button.html`

## 1. 用途

記事内の行動導線（アフィリエイトリンク・資料請求など）。中央寄せのブロック要素として置かれ、リンク本体は内容に応じて伸びる。

## 2. API

```ts
interface Props extends HTMLAttributes<'a'> {
  href: string;
  variant?: 'normal' | 'solid' | 'line' | 'shiny'; // 既定 'normal'
  size?: 's' | 'm' | 'l';                        // 既定 'm'
  color?: 'main' | 'red' | 'blue' | 'green' | (string & {}); // 既定 'main'。名前以外は任意の CSS 色
  colorDark?: string;                            // solid の押し込み影の色（任意色を使うとき）
  align?: 'left' | 'center' | 'right';           // 既定 'center'
  /** アフィリエイトリンクとして rel と target を付ける */
  sponsored?: boolean;
  class?: string;
  id?: string;
}
```

slot: default（ラベル）

`sponsored` のとき `rel="nofollow sponsored noopener"` `target="_blank"` を付ける（`00-overview.md` の方針）。

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `normal` | 既定 | `.is-style-btn_normal` | 塗り・角丸・影 |
| `solid` | `variant="solid"` | `.is-style-btn_solid` | 塗り・下に 4px の影（押し込み）|
| `line` | `variant="line"` | `.is-style-btn_line` | 白抜き・1px 枠 |
| `shiny` | `variant="shiny"` | `.is-style-btn_shiny` | 塗り＋光が走るアニメーション |
| `size-s` | `size="s"` | `-size-s` | 0.9em・最小幅が狭い |
| `size-l` | `size="l"` | `-size-l` | 最小幅 80%・上下 padding 1em |
| `color-red` | `color="red"` | `red_` | #f74a4a |
| `color-blue` | `color="blue"` | `blue_` | #338df4 |
| `color-green` | `color="green"` | `green_` | #62d847 |
| `align-left` | `align="left"` | `data-align="left"` | 左寄せ |
| `align-right` | `align="right"` | `data-align="right"` | 右寄せ |
| `solid-red` | `variant="solid" color="red"` | `.is-style-btn_solid red_` | 押し込み影が赤の暗色 |
| `solid-blue` | `variant="solid" color="blue"` | 同上 | 青の暗色 |
| `solid-green` | `variant="solid" color="green"` | 同上 | 緑の暗色 |
| `shiny-l` | `variant="shiny" size="l"` | `.is-style-btn_shiny -size-l` | 光の帯が縦中央のまま |
| `shiny-long` | `variant="shiny"` + 長いラベル | 同上 | 2 行でも光の帯が中央 |
| `stacked` | 段落 → ボタン 2 つ → 段落 | 同上 | ボタン同士・前後の段落との余白（`margin: 0 auto 2em`）|

## 4. マークアップ

```html
<div class="un-button un-button--normal">
  <a class="un-button__link" href="…"><span>ラベル</span></a>
</div>
```

## 5. 計測値（参照の実測）

（`.un-button` 配下は `box-sizing: border-box` をパーツ側で指定する。`.un-content` の外でも同じ寸法になるように。）

### ラッパー
| プロパティ | 値 |
|---|---|
| display / position / text-align | block / relative / center（`align` で left / right）|
| font-size | 1em（`size="s"` は 0.9em）|
| margin | 0 auto 2em |

### リンク
| プロパティ | <600 | ≥600 |
|---|---|---|
| min-width（既定）| 64% | 40% |
| min-width（`size="s"`）| 40% | 20% |
| min-width（`size="l"`）| 100% | 80% |

| プロパティ | 値 |
|---|---|
| display | inline-block |
| padding | .75em 1.5em（`size="l"` は 1em 1.5em）|
| border-radius | `--un-radius-btn`（80px）|
| letter-spacing / line-height | 1px / 1.5 |
| font-weight | 700（`line` のみ 500）|
| background / color | 色トークン / #fff |
| box-shadow | `--un-shadow-btn` |
| transition | style ごとに 0.25s ease（normal: box-shadow / solid: transform・box-shadow / line: background-color / shiny: opacity・transform）|
| text-decoration | none |

### スタイル別

| style | 差分 | hover |
|---|---|---|
| normal | — | box-shadow → `--un-shadow-btn-hover` |
| solid | `z-index: 1`、box-shadow `0 4px 0 --un-color-main-dark`（`red` → `--un-color-btn-red-dark` #b93838、`blue` → #266ab7、`green` → #4aa235）| box-shadow を透明に + `translateY(4px)` |
| line | 背景 transparent・`1px solid` 枠・文字は色トークン・weight 500 | 背景を色トークンで塗り、文字 #fff、枠 transparent |
| shiny（hover で影は変化しない）| `overflow: hidden`・`z-index: 0`、`::before`（80×200px の白いグラデーション帯、`top: 50%` + `translateY(-50%) rotate(25deg)`、left -120px。hover で `left: 110%` へ 0.25s ease-in-out で移動し、離れると即座に戻る＝transition は `:hover::before` 側にだけ置く）と `::after`（幅 50px の帯。3s 周期のうち 84% までは `scale(0)` / `opacity 0` で不可視、85% で `opacity .9` `scale(1) rotate(25deg)` に現れ、100% で `scale(50)` へ広がりながら消える。hover 中は停止）| 影は変化せず `translateY(2px)` |

色: main `--un-color-main` / red `#f74a4a` / blue `#338df4` / green `#62d847`。

## 6. 受け入れ基準

- [ ] 全 17 バリアントが（style × size × color の掛け合わせを含む） 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px（アニメーションは停止して撮影）
- [ ] hover 時の box-shadow / 色 / transform が参照と一致
- [ ] `size` と viewport の組み合わせで min-width が一致（64/40/20/80/100%）
- [ ] `sponsored` で `rel="nofollow sponsored noopener"` が付く

## 7. 備考

- 色は名前付き 4 種をクラスの短縮形として持ちつつ、実体は `--un-button-color` / `--un-button-color-dark` の custom property で受ける（spec/01-coding-rules.md §2.1）。名前以外を `color` に渡すと、その値が custom property としてラッパーの inline style に出る。利用者の `style` もそこへ連結する。

- `shiny` の光の帯はアニメーション。審査では spec/04-audit.md §2.2 に従い両者のアニメーションを止めた静止状態で比較し、動き自体は目視で確認する。
- 参照の値はデモサイトのカスタマイザー設定に依存する（角丸 80px、色 3 種）。uneri ではトークンで差し替えられるようにする。
