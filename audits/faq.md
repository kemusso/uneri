# audit: faq  (2026-09-04)

verdict: **FAIL**

審査者: 審査エージェント（実装者とは別）。コードの修正は行っていない。**再審査**（前回 FAIL 3 件に対して）。
実行:
- `node scripts/audit/run.mjs faq --no-build --port 4408`
- `node scripts/audit/standalone.mjs` / `node scripts/audit/cleanroom.mjs`
- 独自ハーネス（参照 SWELL マークアップと uneri マークアップを同条件で並べ、
  `dl` 以下の全要素・全疑似要素について `getComputedStyle` の全プロパティ（約 340）と
  ルート相対 rect を突き合わせ。375/768/1200 × `.un-content` の中／素の div の中 = 6 通り、
  シナリオ 41 件 = 246 比較）

## 前回 FAIL 項目の解消状況

| # | 前回の指摘 | 判定 |
|---|---|---|
| 1 | 回答が 2 ブロック以上のときブロック間の 1em が消える | **解消** |
| 2 | `.un-content` の外で A の印と回答行が揃わない | **解消** |
| 3 | fixture が参照サイトの実マークアップ（`data-q="fill-custom"` の塗り四角 Q/A）を再現していない | **未解消（FAIL）** |

### 1 の確認

`faq.css` に `.un-faq .un-faq__a > * { margin-top: 0; margin-bottom: 1em }` と
`.un-faq .un-faq__a > :last-child { margin-bottom: 0 }` が入り、
`rich-answer` バリアント（段落 2 つ＋リスト）がカタログと fixture の双方に追加された。

`.un-content` の中で、回答が段落 2 つ＋リスト / 段落 4 つ / 見出し以外の任意ブロックのいずれでも
**差分 0**（375 / 768 / 1200）。前回の実測値だった `dd` height 96px→80px、
`p:first-child` margin-bottom 16px→0px はいずれも一致に戻っている。
`audits/faq/shots/rich-answer-{375,768,1200}-{ref,impl}.png` も目視で一致。

### 2 の確認

素の div（`.un-content` の外）で `.un-faq__a > p` の margin-top は参照・実装とも **0px**。
`dd::before`（A の印）の `top` も両者 `0.75em`（box / stripe は `1em`）で一致し、
「A の印が 1 行上に浮く」症状は消えている。

### 3 の確認 — **未解消**

`reference/fixtures/faq.html` には今も `data-q` / `data-a` が無い（5 バリアントすべて）。
実装側にも印の塗り／枠を表す API は無い。詳細は下記 FAIL 1。

## 自動計測

`audits/faq/report.json` / `report.md` より。30 行すべて閾値内で **自動判定は PASS**。

| variant | vw | pixel diff | box Δ (w/h) | style diffs |
|---|---|---|---|---|
| default / border / box / stripe / rich-answer（+ 各 -hover） | 375 | 0 % | 0/0 | 0 |
| 同上 | 768 | 0 % | 0/0 | 0 |
| 同上 | 1200 | 0 % | 0/0 | 0 |

**この PASS は部品の合格を意味しない。** 比較対象の fixture が
参照サイトに実在する唯一の FAQ と別物である（FAIL 1）。

## FAIL 項目（実装者への指示）

### 1. Q / A の印のスタイル（`data-q` / `data-a`）が fixture・spec・実装のいずれにも無い — 前回からの持ち越し

**事実確認（`reference/swell/demo01-8.html` を読んだ結果、前任者の指摘が正しい）:**

- 参照サイトに実在する唯一の FAQ ブロックのマークアップ:
  ```html
  <dl class="swell-block-faq is-style-faq-border" data-q="fill-custom" data-a="fill-custom">
  ```
- `blocks.css`:
  `[data-q=fill-custom] .faq_q:before{background-color:var(--color_faq_q);color:#fff}` /
  `[data-a=fill-custom] .faq_a:before{background-color:var(--color_faq_a);color:#fff}`
- `swell_custom.css`（および `demo01-8.html` のインライン）: `--color_faq_q:#d55656` / `--color_faq_a:#6599b7`
- したがって参照サイトの実際の見た目は **32×32px の塗り四角に白抜きの Q / A**
  （Q = 赤 `#d55656`、A = 青 `#6599b7`）。参照 CSS で実際に描画して確認済み。

**よって `spec/parts/faq.md` §5 の**
「参照サイトは Q/A の色を設定していないため、実測は本文色（#333）」
**および `spec/02-design-tokens.md` §2.4 の同趣旨の記述は事実と異なる（spec-suspect）。**
参照サイトは `--color_faq_q` / `--color_faq_a` を明示的に設定している。

**参照が持つ印のスタイル（`blocks.css` の全 8 規則）:**

| 属性値 | `::before` の効果 |
|---|---|
| `col-text` | `box-shadow: 0 0 0 1px currentcolor`（本文色の枠） |
| `fill-text` | `background-color: var(--color_text); color: #fff` |
| `col-main` | `box-shadow: 0 0 0 1px currentcolor; color: var(--color_main)` |
| `fill-main` | `background-color: var(--color_main); color: #fff` |
| `col-custom` | `box-shadow: 0 0 0 1px currentcolor; color: var(--color_faq_q / _a)` |
| `fill-custom` | `background-color: var(--color_faq_q / _a); color: #fff` |
| （加えて）`--swl-faq_icon_radius` | 既定 `0` / `.-icon-rounded` = `10%` / `.-icon-circle` = `50%` |

**実装の状態:**

`--un-color-faq-q` / `--un-color-faq-a` は `.un-faq__q::before { color: … }` にしか流れず、
**文字色しか変えられない**。参照側には「枠も塗りも無く文字色だけ変える」状態は存在しないため、
uneri の API は参照のどの状態にも対応していない。塗り（`background-color` + 白抜き）も
枠（`box-shadow` 1px）も角丸オプションも、どの props でも再現できない。

**必要な対応（実装者・仕様側の判断が要る）:**
1. `reference/fixtures/faq.html` に参照サイトの実マークアップ（`data-q="fill-custom" data-a="fill-custom"`
   と `--color_faq_q` / `--color_faq_a` の実値）を含むバリアントを追加する。
2. `spec/parts/faq.md` §3 に印のスタイル（`fill` / `col` × text / main / custom、および角丸）を
   バリアントまたは props として定義し、§5 の誤った注記と
   `spec/02-design-tokens.md` §2.4 の注記を訂正する。
3. `faq.css` に `background-color` / `color: #fff` / `box-shadow` / `border-radius` の分岐を足す。

判定: 参照サイトの唯一の実例が再現できないため FAIL。

### 2. 回答の中に見出しを置くと縦の余白が参照と大きく違う（全 4 バリアント / 全 viewport、`.un-content` の中）

- 参照: `.faq_a > * { margin-bottom: 1em }` は **(0,1,0)**。
  `.post_content h3 { margin: 3em 0 2em }` は **(0,1,1)** で勝つため、
  FAQ の回答の中でも見出しは記事本文どおりの余白を保つ。
- 実装: `.un-faq .un-faq__a > * { margin-top: 0; margin-bottom: 1em }` が **(0,2,0)** で、
  `heading.css` の `.un-content h3 { margin: 3em 0 2em }`（(0,1,1)）に勝ってしまう。
- 実測（1200、回答が `<h3>見出しです</h3><p>本文です。</p>`、border バリアント）:

| 対象 | プロパティ | 参照 | 実装 |
|---|---|---|---|
| `.un-faq__a > h3` | margin-top | **62.4px** | **0px** |
| `.un-faq__a > h3` | margin-bottom | **41.6px** | **20.8px** |
| `dd.un-faq__a` | height | 199.48px | **116.30px** |
| `.un-faq__item`（1 つめ）| height | 255.48px | **172.30px** |
| `[data-variant]` 全体 | height | 400.48px | **317.30px** |

- 375 / 768 でも同じ比率でずれる（375: dd height 166.34px → 100.34px）。
- 目視: 参照は見出しの上に大きな余白があり、A の印は見出しよりずっと上に浮く。
  実装は A の印と見出しが同じ行から始まる。まったく違う見え方になる。
- 露出しない理由: fixture / カタログの回答が段落とリストだけ（`rich-answer` にも見出しが無い）。
  `standalone.mjs` の `CONTENT_AREA` の子リスト（`p, ul, ol, dl, blockquote, figure, table`）にも
  見出しが入っていないため、こちらでも拾えない。
- `spec/parts/faq.md` §5 の「a の子 | margin | 上 0 / 下 1em（最後の子は 0）」は
  参照の実体（`margin-bottom: 1em` のみ、しかも弱い詳細度）を写し違えている（spec-suspect）。
  「上 0」を残すなら詳細度を (0,1,0) 相当に落とす（例: `.un-faq__a > *`）か、
  見出しを対象外にするかを spec で決める必要がある。

## 目視所見

- `audits/faq/shots/` の `-ref` / `-impl` / `-diff` を 5 バリアント × 3 viewport × 通常/hover の 30 組すべて確認。
  diff は全て空。
- Q / A の印: 位置（left 0 / top 0.75em、box・stripe は left 1em / top 1em）、書体（Arial）、
  太さ（Q=400 / A=500）、2em 角・行高 2em の中央揃え、いずれも fixture との比較では一致。
  ただし参照サイトの実物は塗り四角である（FAIL 1）。
- 区切り: border = 2 項目目以降に 1px 実線 + 左右 0.5em、box = 1px 実線の枠 + 質問下に 1px 破線、
  stripe = 質問に `--un-color-gray` の帯 + 項目間 24px。いずれも参照どおり。
- `rich-answer`: 段落間 1em、リスト前 1em、最後の子の下 0 まで参照と一致（前回 FAIL 1 の解消を目視でも確認）。
- 独自検証で差分 0 だったシナリオ（各 4 バリアント × 375/768/1200、`.un-content` の中）:
  項目 1 つ / 3 つ、質問が 2 行に折り返す、回答が段落 4 つ、回答がテキストノードのみ、回答が空、
  回答に `<blockquote>`、回答に `<table>`、FAQ の入れ子。
- hover: 参照 CSS に `.faq_q` / `.faq_a` の `:hover` 規則は存在しない（`blocks.css` / `main.css` を全走査）。
  実装にも無い。`HOVER_PARTS` に `faq` が入っているが実質無検査（tool-suspect、軽微）。

## 仕様適合

- **バリアント網羅**: OK。spec §3 の 5 件（default / border / box / stripe / rich-answer）が
  `src/pages/catalog/faq.astro` と `reference/fixtures/faq.html` の双方にあり、順序・ダミーテキストも一致。
  `rich-answer` は `variant` の値ではなく「border バリアント + 回答が段落 2 つ＋リスト」という
  内容シナリオであり、spec §3 の表記どおり。
- **props**: OK。`Faq`（`variant?: 'default'|'border'|'box'|'stripe'` 既定 `'default'`、`class`、`id`、
  `HTMLAttributes<'dl'>` 拡張）、`FaqItem`（`q: string`、`class`、`id`、`HTMLAttributes<'div'>` 拡張）は
  spec §2 と完全一致。マークアップも spec §4 の `dl > div > dt + dd` どおり。
  （FAIL 1 の印スタイルを spec に入れるなら props も増える。現行 spec §2 との一致という意味では OK。）
- **コーディング規則**: OK。`src/styles/parts/faq.css` の全規則を確認。
  - `!important` なし。`swell` の文字列なし。リテラル hex なし（色は全て `--un-color-*` 経由）。
  - 詳細度を数え直した結果、最大は **(0,2,0)**:
    `.un-faq__item + .un-faq__item`、`.un-faq .un-faq__a > *`、`.un-faq .un-faq__a > :last-child`
    （`:last-child` は状態擬似クラスなので数え上げ対象外）。
    `.un-faq--box > :where(.un-faq__item) > :where(.un-faq__q)::before` などは `:where()` が 0 で (0,1,0)。
    上限 (0,2,0) を超える規則は無い。
    ※ 規則違反ではないが、この (0,2,0) が FAIL 2 の原因になっている。
  - `.un-content` の前置なし、`@media` なし、`em` / `px` の使い分けも規則どおり。
    疑似要素に `content` と用途コメントあり。
  - 軽微: `.un-faq--box > … + … { margin-top: 1em }` は基底の `.un-faq__item + .un-faq__item` と重複。
- **クリーンルーム**: OK（`cleanroom: OK (1900 reference runs indexed)`）。
- **standalone**: OK（`standalone: OK (148 variants, 326 rules)`。faq の 5 バリアントも個別に OK）。
  前回指摘した盲点は塞がっている（下記）。

## ツール／fixture の不備

### 前回の tool-suspect は解消

`scripts/audit/standalone.mjs` に
`CONTENT_AREA = :is(.un-box--group, [class$="__body"], [class$="__text"], [class$="__a"], [class$="__panel"])`
に対する `> :where(p, ul, ol, dl, blockquote, figure, table)` の margin 検査が追加され、
前回「構造的に検出不能」とした形の不具合を拾えるようになった。変異テスト
（リポジトリの複製上で実施。本体は無改変）:

| 変異 | 期待 | 結果 |
|---|---|---|
| `.un-faq .un-faq__a > *` から `margin-top: 0` を削除（= 前回 FAIL 2 と同じ形） | 検出 | **FAIL (5/9)** 検出 |
| `.un-tab .un-tab__panel > *` から `margin-top: 0` を削除 | 検出 | **FAIL (4/9)** 検出 |
| `faq.css` / `tab.css` に `.un-content` 前置の規則を追加 | 検出 | **FAIL (9/9)** 検出 |

**残る穴**: `CONTENT_AREA` の子リストに見出し（`h2`〜`h4`）が入っていないため、FAIL 2 の形は拾えない。

### fixture-suspect（FAIL 1 と同根）

`reference/fixtures/faq.html` の 5 バリアントはいずれも `data-q` / `data-a` を持たない。
参照サイトに実在する FAQ は `data-q="fill-custom" data-a="fill-custom"` であり、
現状の審査は「参照サイトに存在しない、地も枠も無い素の Q/A」同士を比べている。

### 素の div（`.un-content` の外）で残る差（FAIL には数えない）

| 対象 | 参照 | 実装 | 扱い |
|---|---|---|---|
| ルート `dl` の margin-top / bottom | 0px | 16px | spec/01-coding-rules.md §2.4 が「パーツの余白（margin）は `.un-content` の文脈で決める」としているので想定内 |
| `.un-faq__a > :last-child` の margin-bottom | 16px | 0px | 参照は `.post_content dd>:last-child{margin-bottom:0!important}` で container 依存に 0 にしている。実装は container 非依存に 0 にしており、`.un-content` の中では両者一致（0px）。uneri の方針（§2.4「margin 以外の見た目は `.un-content` に依存しない」）に沿った差なので許容 |
| `overflow-wrap` / `text-size-adjust` | `break-word` / `100%` | `normal` / `auto` | 参照側 `body` の継承値。パーツの責任外 |

### faq 以外のパーツに帰属する観測（記録のみ）

回答の中に `<blockquote>` / `<table>` を置いた場合、参照との差が出るが原因は
`base.css` / Content パーツ側にある（faq.css は無関係）。faq の FAIL には数えない。

- `blockquote::after`: 参照は `position: absolute` の閉じ引用符、実装は無し（`display: inline` / `position: static`）
- `blockquote`: 参照は `quotes: none`（グローバル）、実装は `auto`
- `table` セル: 参照は `background-clip: border-box`、実装は `padding-box`

## 参照 CSS との宣言レベル突き合わせ（差異のみ）

| 参照（SWELL） | 実装 | 判定 |
|---|---|---|
| `[data-q=fill-custom] .faq_q:before{background-color:var(--color_faq_q);color:#fff}` ほか 8 規則 | 無し | **FAIL 1** |
| `.swell-block-faq{--swl-faq_icon_radius:0}` / `.-icon-rounded`(10%) / `.-icon-circle`(50%) | 無し | **FAIL 1**（同じく印のオプション）|
| `.faq_a > * { margin-bottom: 1em }` が (0,1,0) | `.un-faq .un-faq__a > *` が (0,2,0) | **FAIL 2** |
| `.faq_a > * { margin-bottom: 1em }`（margin-top の指定なし） | `margin-top: 0` を追加 | container 非依存化のための追加。`.un-content` の中では一致。許容（FAIL 2 の一因） |
| `.post_content dd>:last-child{margin-bottom:0!important}` | `.un-faq .un-faq__a > :last-child{margin-bottom:0}` | `.un-content` の中では一致。許容 |
| `.faq_q { font-size: inherit; margin: 0 }` | `margin-left: 0` のみ | `dt` に既定 margin が無いため計測値は一致。許容 |
| `.faq_q:before { line-height: 2; width: 2em }`（height 指定なし） | `line-height: 2em; width: 2em; height: 2em` | 計算値 32px で一致。許容 |
| `.faq_a:before`（font-weight 未指定 → 本文の 500 を継承） | `font-weight: 500` を直値で指定 | 既定では一致。`--un-font-weight` を変えた利用者では挙動が分かれる（軽微、前回から未変更）|
