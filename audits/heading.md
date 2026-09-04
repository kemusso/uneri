# audit: heading  (2026-09-03)

verdict: PASS

## 前回 FAIL 項目の解消確認（spec/04-audit.md §7）

| 前回の指摘 | 状態 |
|---|---|
| クリーンルーム NG: `.un-content h3::before` の連続 3 宣言 `content:""; position:absolute; right:0;` が参照 CSS の `.is-style-crease:before` と一致 | **解消**。`inset: auto 0 0 0;` に置き換わり、`node scripts/audit/cleanroom.mjs` → `cleanroom: OK (1900 reference runs indexed)`（exit 0） |
| fixture-note: `h3-long` の文言が 1200 幅で 1 行に収まり「複数行でも下線が最下部」を検証できていない | **解消**。文言が延長され、1200 幅で 2 行に折り返す（h3-long@1200 の高さ 139px = 2 行 ×1.4×20.8 + padding-bottom 10.4 + margin-bottom 41.6 + 後続 p 28.8）。ref / impl とも同じ位置で折り返し、下線は最終行の下 |

上記 2 件以外に前回の FAIL はなく、新たな FAIL 項目も検出されなかった。

## 自動計測

`node scripts/audit/run.mjs heading --no-build --port 4400` → verdict PASS（21 ケース = 7 variant × 3 viewport）。

| variant | vw | pixel diff | box Δ (w/h) | style diffs |
|---|---|---|---|---|
| h2 | 375 | 0 % | 0 / 0 | 0 |
| h3 | 375 | 0 % | 0 / 0 | 0 |
| h4 | 375 | 0 % | 0 / 0 | 0 |
| h2-long | 375 | 0 % | 0 / 0 | 0 |
| h3-long | 375 | 0 % | 0 / 0 | 0 |
| sequence | 375 | 0 % | 0 / 0 | 0 |
| section-title | 375 | 0 % | 0 / 0 | 0 |
| h2 | 768 | 0 % | 0 / 0 | 0 |
| h3 | 768 | 0 % | 0 / 0 | 0 |
| h4 | 768 | 0 % | 0 / 0 | 0 |
| h2-long | 768 | 0 % | 0 / 0 | 0 |
| h3-long | 768 | 0 % | 0 / 0 | 0 |
| sequence | 768 | 0 % | 0 / 0 | 0 |
| section-title | 768 | 0 % | 0 / 0 | 0 |
| h2 | 1200 | 0 % | 0 / 0 | 0 |
| h3 | 1200 | 0 % | 0 / 0 | 0 |
| h4 | 1200 | 0 % | 0 / 0 | 0 |
| h2-long | 1200 | 0 % | 0 / 0 | 0 |
| h3-long | 1200 | 0 % | 0 / 0 | 0 |
| sequence | 1200 | 0 % | 0 / 0 | 0 |
| section-title | 1200 | 0 % | 0 / 0 | 0 |

bounding box は全ケースで参照 = 実装（375: 345px / 768: 706.5625px / 1200: 900px、高さも一致）。

### 監査ツールに依存しない再検証

`run.mjs` の PASS を鵜呑みにせず、以下を独立に確認した。

1. **参照が本物の SWELL であること**: `reference/fixtures/heading.html` は `reference/swell/build/css/{main,blocks,single,footer,swell-icons,swell_custom}.css`（計 186KB、実ファイル）を読み込む。実装ページ `dist/catalog/heading/index.html` が読むのは `/_astro/Catalog.D1NTW16_.css` のみで、SWELL CSS は混入していない（`grep -ril swell src/ dist/` → 0 件）。両者は別 CSS で描画されている。
2. **dist の鮮度**: `dist/_astro/Catalog.D1NTW16_.css`（09-03 19:40）に今回の修正後の `.un-content h3:before{…inset:auto 0 0}` / `.un-content h2:before{…inset:-4px 0}` が含まれることを確認。`src/styles/parts/heading.css` は 09-02 23:10 で dist が新しい。
3. **生ピクセル全比較**（pixelmatch のしきい値 0.1 / includeAA を通さない素の RGB 比較）: 21 組すべてでサイズ一致。差分ピクセルは h3 下線の 1〜2 行のみ（下表）で、最大チャンネル差は **1/255**。それ以外は完全に 0。

| shot | 差分px | % | 位置 | 最大Δ |
|---|---|---|---|---|
| h3-375 | 428 | 0.738 | y=106,107（下線）x=101–344 | 1 |
| h3-long-375 | 426 | 0.767 | y=99,100（下線）x=101–344 | 1 |
| h3-long-768 | 187 | 0.156 | y=96（下線）x=208–706 | 1 |
| sequence-375 | 396 | 0.454 | y=131,132（下線）x=101–344 | 1 |
| sequence-1200 | 229 | 0.082 | y=165（下線）x=272–882 | 1 |
| 上記以外 16 組 | 0 | 0 | — | 0 |

  差の実体は h3 下線の薄灰部のみ（ref `rgb(233,233,233)` / impl `rgb(232,232,232)`）。メインカラー部（`rgb(4,56,76)`）は 1 ピクセルの差もなく、境界も同位置（375 幅で x=100 が濃色最終・x=101 から薄灰 → 101/345 = 29.28% ≒ 29.3%）。参照は 4 停止点の `repeating-linear-gradient(90deg, var(--color_htag) 0%, var(--color_htag) 29.3%, rgba(150,150,150,.2) 29.3%, rgba(150,150,150,.2) 100%)`、実装は 2 停止点のダブルポジション記法で、同じ結果に対する量子化の丸めが 1/255 ずれるだけ。合否基準の色 ΔE ≤ 3 に対し ΔE = 1 で PASS。

4. **ブレークポイント境界の追加計測**: 375 / 599 / 600 / 767 / 959 / 960 / 1199 / 1200 の 8 幅で h2 / h3 / h4 / section-title h2 の computed style（font-size・margin・padding・color・background・letter-spacing・はみ出し量・::before の content/inset/width/height/border/background-image/z-index）を参照と突き合わせ、**heading 由来のプロパティは全幅で完全一致**。960 での相違は harness 側の器の幅（下記「目視所見」参照）で、見出し自身の値ではない。

## FAIL 項目（実装者への指示）

なし。

## 目視所見

`audits/heading/shots/` の **63 枚全て**（21 組 × ref / impl / diff）を Read で開いて確認。diff 画像はすべて差分マーク（赤／黄）が 1 点もなく、ref と impl は目視で区別できない。

- **h2 の上下 2px 線の位置**: 本体（メインカラーの帯）の上下 4px 外側に 2px の線が入り、帯と線の間に地の色の 4px の隙間ができる。375 / 768 / 1200 とも ref・impl で線の位置・太さ・色が一致。`::before` は `position:absolute; inset:-4px 0; box-sizing:content-box; border-top/bottom:2px solid var(--un-color-main)` で、computed の top/bottom = -4px、border 2px solid rgb(4,56,76) が参照と一致（spec §5 の「top -4px, bottom -4px, left 0, right 0」に適合）。
  - なお `h2-long` と `sequence` は h2 が `[data-variant]` の先頭要素（margin-top 0）のため、上側の線がスクリーンショットの外に出て写らない。これは ref も impl も全く同じ切れ方で、computed style で一致を確認済み。撮影範囲の制約であって欠落ではない。
- **h3 の 2 色下線の境界**: 左から 29.3% がメインカラー、残りが薄灰。境界の絶対位置は 375 で x=101、768 で x≈207、1200 で x≈264、いずれも ref / impl 同一ピクセル。線の高さ 2px、要素の最下部（`inset:auto 0 0 0`）。`h3-long` は 375 で 4 行・768 で 3 行・1200 で 2 行に折り返し、いずれも下線は最終行の下に 1 本だけ引かれる。
- **h2 のはみ出し幅**: 375 で左右 7.5px（= 2vw）、599 で 11.97px（2vw）、600〜959 で 16px、960 以上は `.un-content` の padding 16px と相殺して本文外枠と面一。全幅で参照と同値（spec §6「<600 で 2vw、≥600 で 16px」に適合）。1200 の shot では帯が 900px の撮影枠の左右端まで届いて切れており、ref も同様。
- **長い見出しの折り返し位置**: h2-long は 375 で 4 行 / 768 で 3 行 / 1200 で 2 行、h3-long は 375 で 4 行 / 768 で 3 行 / 1200 で 2 行。行ごとの改行位置（「…折り返した／ときの見た目を…」等）が ref と 1 文字も違わない。複数行でも h2 の背景・上下線、h3 の下線は崩れない。
- **h4**: 2px solid メインカラーの左線 + padding-left 16px。3 幅とも一致。
- **sequence**: h2 → h3 → h4 → p の連続で、先頭 h2 の margin-top が 0（`.un-content > :first-child`）、h2 下 2em → h3 上 3em の相殺後の間隔まで ref と一致。
- **section-title**: 背景・枠・padding なし、letter-spacing .2px、文字色 rgb(51,51,51)。h2 は center、h3 は left。`::before` の computed content は ref / impl とも `none` で疑似要素自体が生成されない（spec §5「::before なし」に適合）。h2 の左右マージンは通常 h2 と同じ -16px で、中央揃えの見え方も一致。
- **グラデーション・影・アイコン**: このパーツに影・アイコンはなく、icon-shape 所見なし。グラデーションは h3 下線のみで向き（90deg）・停止位置とも一致。
- **harness-note（FAIL ではない）**: viewport 960 のみ、参照ページの記事コンテナ幅が 896px、カタログ側が 883.22px（`.cat-container` の `padding: 0 4vw` に由来）と異なる。ただしこれは器の幅の差であって、その中で h2 は両者とも器いっぱい（h2 の rect = wrapper の rect）、h4 のインデントも両者 16px で、**見出し側の挙動は同一**。審査対象の 375 / 768 / 1200 では器の幅も完全一致（345 / 706.5625 / 900）し、1100 でも一致するため、判定には影響しない。fixture の不備とは判断しない。

## 仕様適合

- **バリアント網羅**: OK。spec/parts/heading.md §3 の 7 種（`h2` `h3` `h4` `h2-long` `h3-long` `sequence` `section-title`）が `reference/fixtures/heading.html` と `src/pages/catalog/heading.astro` の双方に、同じ順序・同じダミーテキスト・同じ `data-variant` 名で存在。spec にないバリアントの追加もなし（§6 の 1:1 対応）。
- **props**: OK。`src/components/Heading.astro` の `interface Props extends HTMLAttributes<'h2'>` は spec §2 と完全一致（`level: 2|3|4` / `style?: 'default'|'section'` / `align?: 'left'|'center'|'right'` / `class?: string` / `id?: string`）。既定値も `style = 'default'`、`align` は未指定（継承）で spec どおり。`...rest` をルート要素へ展開しており「上記以外の属性はルート要素に透過」を満たす。slot は default のみ。`src/index.ts` から re-export 済み。
- **コーディング規則（spec/01-coding-rules.md）**: OK。`src/styles/parts/heading.css` を全行確認。
  - `!important`: 0 件。
  - 詳細度: 最大が `.un-content .un-heading--section::before` = (0,2,1)、次点 `.un-content h2::before` = (0,1,2)。クラス列は最大 2 で、審査基準の (0,3,0) 以上には該当しない。
  - `swell` の文字列: `src/` `dist/` ともに 0 件（`grep -ril swell`）。
  - リテラル色: `#fff` のみ（白は §3 で明示的に許容）。それ以外はすべて `var(--un-color-main)` `var(--un-color-text)` `var(--un-color-heading-rule)` 経由。`--un-color-heading-rule: rgba(150,150,150,0.2)` は `src/styles/tokens.css` L19 に定義済み。
  - アイコンフォント: 不使用（アイコン自体なし）。
  - 命名: `.un-heading--section` / `--left` / `--center` / `--right`（BEM 風・`un-` 接頭辞）、内部変数は `--_bleed` / `--_accent-width`（先頭アンダースコア）で spec §2.2 に適合。
  - 単位・BP: 余白は em、境界線は px、h4 の padding-left と h2 のはみ出しは仕様どおり固定 px。メディアクエリは `@media (min-width: 600px)` のみ（モバイルファースト、02-design-tokens.md の `sm` 値）。
  - 疑似要素: `::before` 2 箇所とも `content: ""` と「何を描いているか」のコメントあり（§3 末尾の要求）。
  - 他パーツのクラス参照なし（`.un-content` は §2.4 が認める本文コンテナ）。
- **クリーンルーム**: OK。`node scripts/audit/cleanroom.mjs` → `cleanroom: OK (1900 reference runs indexed)`（exit 0）。前回ヒットしていた h3::before の 3 宣言列は `inset` 記法に置き換わり解消。h3 下線のグラデーションも参照の 4 停止点記法に対し 2 停止点のダブルポジション記法で、宣言列の一致なし。
- **spec §6 受け入れ基準**:
  - [x] 全 7 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%（実測 0%）、box Δ ≤ 1px（実測 0）
  - [x] h2 の上下 2px 線が本体の 4px 外側（`::before` の inset -4px + content-box）
  - [x] h3 の下線が 2 色、左 29.3% がメインカラー
  - [x] h2 のはみ出しが <600 で 2vw、≥600 で 16px
  - [x] 素の `.un-content h2/h3/h4`（`sequence` バリアント）と `.un-heading`（他バリアント）で見た目が同一 — スタイルは要素セレクタ側に置かれ、`.un-heading` は修飾子のみを担う実装
