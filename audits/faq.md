# audit: faq  (2026-09-04)

verdict: **FAIL**

審査者: 審査エージェント（実装者とは別）。コードの修正は行っていない。
実行: `node scripts/audit/run.mjs faq --no-build --port 4408`（2 回実行、いずれも同結果）
      `node scripts/audit/standalone.mjs faq` / `node scripts/audit/cleanroom.mjs`

## 自動計測

`audits/faq/report.json` / `report.md` より。全 24 行（4 バリアント × 3 viewport × 通常/hover）が閾値内。

| variant | vw | pixel diff | box Δ (w/h) | style diffs |
|---|---|---|---|---|
| default / border / box / stripe（+ 各 -hover） | 375 | 0 % | 0/0 | 0 |
| default / border / box / stripe（+ 各 -hover） | 768 | 0 % | 0/0 | 0 |
| default / border / box / stripe（+ 各 -hover） | 1200 | 0 % | 0/0 | 0 |

自動計測は 24/24 PASS。ただし下記のとおり **カタログ／fixture のダミー内容が定義的な性質を露出していない** ため、
この PASS は部品の合格を意味しない（spec/04-audit.md §2.0）。

### 独自検証で行ったこと

1. **全 CSS プロパティ総当たり**: 参照・実装の `[data-variant]` 配下を深さ 8 まで走査し、
   `getComputedStyle` が返す全プロパティ（約 340）＋ `::before` / `::after` ＋ 各要素の相対 rect を突き合わせ。
   カタログと同じ内容では差分 0（ハーネス由来の外側 margin を除く）。
2. **カタログに出ない内容での再計測**: 項目 1 つ / 3 つ、質問が 2 行に折り返す、回答が複数段落、
   回答にリスト、回答に見出し、回答がテキストノードのみ、回答が空、FAQ の入れ子、`.un-content` の外、
   の 9 シナリオ × 4 バリアント × 375/768/1200。→ **回答が複数ブロックの場合と `.un-content` の外で差分**（下記 FAIL 1 / 2）。
3. **参照 CSS の FAQ 関連ルールを 1 宣言ずつ突き合わせ**（`blocks.css` 17 ルール + `main.css` の `.faq_a>*`）。
4. **`standalone.mjs` の変異テスト**（リポジトリの複製上で実施、本体は無改変）。
5. 参照サイト実マークアップ（`reference/swell/demo01-8.html`）と fixture の突き合わせ。

## FAIL 項目（実装者への指示）

### 1. 回答が 2 ブロック以上のとき、ブロック間の 1em が無い（全 4 バリアント / 全 viewport）

- 参照: `main.css` の `.c-tabBody__item>*,.cap_box_content>*,.faq_a>*,…{margin-bottom:1em}` により
  `.faq_a > *` に `margin-bottom: 1em`。最後の子だけ `.post_content dd>:last-child{margin-bottom:0!important}` で 0。
- 実装: `base.css` の `.un-content div :where(p, ul, ol, dl, …) { margin-bottom: 0 }` が全ての子を 0 にし、
  `faq.css` が何も戻していない。
- 実測（1200 / `multip-*`、回答が `<p>` 2 つ）:
  - `dd.un-faq__a` の height: 参照 **96px** → 実装 **80px**
  - 回答 2 段落目の y: 参照 **112px** → 実装 **96px**
  - `.un-faq__a > p:first-child` の margin-bottom: 参照 **16px** → 実装 **0px**
  - 項目 1 つあたり 16px、`[data-variant]` 全体で 320px → 288px
  - 回答にリストを置いた場合（`list-*`）: dd height 参照 **128px** → 実装 **116px**（12px）
  - FAQ を入れ子にした場合（`nest-*`）も同じ原因で 240px → 224px
- 推定原因: `faq.css` に `.un-faq__a > *` の縦リズム規則が無い。
  同じ問題を `step.css` は `.un-step .un-step__body > * { margin-top: 0; margin-bottom: 1em }` +
  `> :last-child { margin-bottom: 0 }` で、`box.css` は `.un-box--group > *` で既に解決している。
  faq も同じ形（`.un-faq__a > *` / `.un-faq__a > :last-child`）で揃えるべき。
- 露出しない理由: カタログ・fixture の回答がどちらも `<p>` 1 つだけ。spec/04-audit.md §2.0 の
  「そのスタイルの定義的な性質が出るダミーテキストを選ぶこと」に反する（fixture-suspect）。

### 2. `.un-content` の外で回答段落が 16px 下がり、A の印と行が揃わない（全 4 バリアント / 全 viewport）

- 参照: SWELL は `p` の既定 margin をグローバルに 0 にしているため、`.post_content` の外でも
  `.faq_a > p` の margin-top は **0px**。
- 実装: `p` の margin リセットが `base.css` の `.un-content …` にしか無いため、`.un-content` の外では
  UA 既定の `margin-top: 16px` が残る。
- 実測（1200 / `bare-*`）:
  - `.un-faq__a > p` の margin-top: 参照 **0px** → 実装 **16px**
  - `dd.un-faq__a` の height: 参照 **72px** → 実装 **88px**
  - `dd::before`（A の印）の bottom: 参照 **28px** → 実装 **44px**
  - 目視: A の印が回答テキストの 1 行上に浮き、行頭が揃わない（スクリーンショットで明瞭）
- spec/parts/faq.md §6「`.un-content` の外でも成立する」および
  spec/01-coding-rules.md §2.4「単体で置いたときも崩れないよう、margin 以外の見た目は `.un-content` に依存しない」に違反。
- 推定原因: FAIL 1 と同根。`.un-faq__a > *` に `margin-top: 0` を含めれば同時に解消する
  （`step.css` の「the step owns the rhythm inside itself, container or not」と同じ考え方）。

### 3. fixture が参照サイトの実マークアップを再現していない（fixture-suspect / spec-suspect）

- 参照サイトに実在する唯一の FAQ（`reference/swell/demo01-8.html`）は
  `<dl class="swell-block-faq is-style-faq-border" data-q="fill-custom" data-a="fill-custom">`。
- `blocks.css` の `[data-q=fill-custom] .faq_q:before{background-color:var(--color_faq_q);color:#fff}` /
  `[data-a=fill-custom] .faq_a:before{background-color:var(--color_faq_a);color:#fff}` と
  `swell_custom.css` の `--color_faq_q:#d55656` / `--color_faq_a:#6599b7` により、
  実際の見た目は **32×32px の塗りつぶし四角に白抜きの Q / A**。
- `reference/fixtures/faq.html` は `data-q` / `data-a` を落としているため、
  審査は「参照サイトに存在しない、色も地も無い素の Q/A」同士の比較になっている。
- spec/parts/faq.md §5 の注記「参照サイトは Q/A の色を設定していないため、実測は本文色（#333）」は
  参照マークアップと矛盾する（spec-suspect）。
- 実装の `--un-color-faq-q` / `--un-color-faq-a` は文字色しか変えられず、
  参照サイトの見た目（塗り・白抜き・`box-shadow` による枠線版）は **どの API でも再現できない**。
- 判定: 参照の唯一の実例を再現できないため FAIL。fixture に `data-q`/`data-a` 相当を足すか、
  spec §3 に印のスタイル（`fill` / `col` × text/main/custom）を追加するかを実装者・仕様側で決める必要がある。

## 目視所見

- `audits/faq/shots/` の `-ref` / `-impl` / `-diff` を 4 バリアント × 3 viewport 分確認。
  diff は全て空（pixelmatch の残像のみ）。
- Q / A の印: 位置（left 0 / top 0.75em、box・stripe は left 1em / top 1em）、書体（Arial）、
  太さ（Q=400 / A=500）、字送り（2em 幅・行高 2em で中央揃え）いずれも参照と一致。
- 区切り: border = 2 項目目以降に 1px 実線 + 左右 0.5em、box = 1px 実線の枠 + 質問下に 1px 破線、
  stripe = 質問に `--un-color-gray` の帯 + 項目間 24px（1.5em と 1em の相殺）。いずれも参照どおり。
- 質問が 2 行に折り返す場合の折り返し位置・ぶら下がりは参照と一致（`wrapq-*` で差分 0）。
- 項目 1 つ / 3 つ、回答が見出し・テキストノードのみ・空、のいずれも差分 0。
- hover: 参照・実装とも FAQ に hover 規則は無く、`forcePseudoState` の対象要素も存在しない。
  `HOVER_PARTS` に `faq` が入っているが実質的に無検査（tool-suspect、軽微）。
- **FAIL 1 / 2 は目視で明確に判別できる差**（回答の段落が詰まる／A の印が行から外れる）。

## 仕様適合

- **バリアント網羅**: OK。spec/parts/faq.md §3 の 4 バリアント（default / border / box / stripe）が
  すべて `src/pages/catalog/faq.astro` と fixture にあり、`box` / `stripe` は SWELL 側にも実ルールがあり
  既定へのフォールバックではないことを computed style で確認済み
  （box: item border 1px solid + q border-bottom 1px dashed + padding 20/16/20/64、
   stripe: q background `rgba(199,199,199,.15)` + item margin-bottom 24px）。
  `is-style-faq-default` だけは SWELL に対応ルールが無い純粋な no-op クラスだが、
  SWELL の既定 FAQ が追加 CSS を持たないこと自体が事実なので、fixture の書き方として妥当。
- **props**: OK。`Faq`（`variant?: 'default'|'border'|'box'|'stripe'` 既定 `'default'`、`class`、`id`、
  `HTMLAttributes<'dl'>` 拡張）、`FaqItem`（`q: string`、`class`、`id`、`HTMLAttributes<'div'>` 拡張）は
  spec §2 と完全一致。マークアップも spec §4 の `dl > div > dt + dd` どおり。
- **コーディング規則**: OK。`src/styles/parts/faq.css` を全 17 ルール確認。
  - `!important` なし。`swell` の文字列なし。リテラル色なし（全て `--un-color-*` 経由）。
  - 詳細度を数え直した結果、最大は `.un-faq__item + .un-faq__item` の **(0,2,0)**。
    `.un-faq--border > :where(.un-faq__item) + :where(.un-faq__item)` などは `:where()` が 0 なので (0,1,0)、
    `:last-child` は数え上げ対象外。上限 (0,2,0) を超える規則は無い。
  - `.un-content` 前置なし、`@media` なし、`em`/`px` の使い分けも規則どおり。疑似要素にコメントあり。
  - 軽微（規則違反ではない）: `.un-faq--box > … + … { margin-top: 1em }` は基底規則と重複。
- **クリーンルーム**: OK（`cleanroom: OK (1900 reference runs indexed)`）。
- **standalone**: `standalone: OK (4 variants, 280 rules)` と出るが、**この OK は信用できない**（下記）。

## ツールの穴（tool-suspect）

`scripts/audit/standalone.mjs` は FAIL 2 を検出できない。リポジトリの複製上で変異テストを実施した:

| 変異 | 期待 | 結果 |
|---|---|---|
| M1: `.un-content .un-faq__q { padding-left: 5em }` を `faq.css` に追加（クラス付き要素） | 検出 | **FAIL (4/4)** 検出できた |
| M2: `.un-content .un-faq__a > p { margin-left: 3em }` を `faq.css` に追加 | 検出 | **FAIL (4/4)**（`.un-content` 前置の文字列検査で検出） |
| M3: 同じ宣言を `base.css` 側に置く（＝実際の不具合と同じ形） | 検出 | **OK と表示（見逃し）** |

原因: `standalone.mjs` の走査対象が `[class*="un-"]`（＋ `li` の疑似要素）に限られ、
パーツ内部のクラス無し子要素（`.un-faq__a > p` など）を一切見ない。
さらに `CRITICAL` プロパティ一覧に `margin-*` が含まれていない。
このため「`base.css` 経由でコンテナ依存になっているクラス無し子要素の margin」は構造的に検出不能で、
本審査の FAIL 1・FAIL 2 はどちらもこの穴に落ちている。`DECORATED` にパーツ配下の全子孫を含めるか、
`CRITICAL` に `margin-top` / `margin-bottom` を足す修正が必要。

## 参照 CSS との宣言レベル突き合わせ（差異のみ）

| 参照（SWELL） | 実装 | 判定 |
|---|---|---|
| `.faq_a > * { margin-bottom: 1em }`（`main.css`） | 無し | **FAIL 1** |
| `[data-q=fill-custom] .faq_q:before { background-color: var(--color_faq_q); color:#fff }` ほか 6 種 | 無し | **FAIL 3** |
| `.swell-block-faq { --swl-faq_icon_radius: 0 }` / `.-icon-rounded` / `.-icon-circle` | 無し（角丸・円の印オプション） | spec §3 に無いので対象外（要記録） |
| `.faq_q { font-size: inherit; margin: 0 }` | `margin-left: 0` のみ | 計測値は一致（dt に既定 margin が無いため）。許容 |
| `.faq_q:before { line-height: 2; width: 2em }`（height 指定なし） | `line-height: 2em; width: 2em; height: 2em` | 計算値 32px で一致。許容 |
| `.faq_a:before`（font-weight 未指定 → 本文の 500 を継承） | `font-weight: 500` を直値で指定 | 既定では一致。`--un-font-weight` を変えた利用者では参照と挙動が分かれる（軽微） |
