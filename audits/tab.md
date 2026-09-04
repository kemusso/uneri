# audit: tab  (2026-09-04)

verdict: **FAIL**

審査者: 審査エージェント（実装者とは別）。コードの修正は行っていない。初回審査。
実行:
- `node scripts/audit/run.mjs tab --no-build --port 4410`
- `node scripts/audit/standalone.mjs` / `node scripts/audit/cleanroom.mjs`
- 独自ハーネス（参照 SWELL マークアップ と uneri マークアップを同条件で並べ、
  ルート以下の全要素・全疑似要素について `getComputedStyle` の全プロパティ（約 340）と
  ルート相対 rect を突き合わせ。375/768/1200 × 非 hover / 2 つめのタブを hover / 1 つめを hover の 9 通り、
  シナリオ 44 件 = 396 比較）

## 自動計測

`audits/tab/report.json` / `report.md` より。24 行すべて閾値内で **自動判定は PASS**。

| variant | vw | pixel diff | box Δ (w/h) | style diffs |
|---|---|---|---|---|
| default / bb / balloon（+ 各 -hover） | 375 | 0 % | 0/0 | 0 |
| **simple / simple-hover** | **375** | 0 % | **0/0.5** | 0 |
| default / simple / balloon（+ 各 -hover） | 768 | 0 % | 0/0 | 0 |
| bb / bb-hover | 768 | 0.002 % | 0/0 | 0 |
| default / simple / balloon（+ 各 -hover） | 1200 | 0 % | 0/0 | 0 |
| bb / bb-hover | 1200 | 0.002 % | 0/0 | 0 |

**この PASS は部品の合格を意味しない。** カタログ／fixture が
「そのスタイルの定義的な性質」を出していない（spec/04-audit.md §2.0）ため、
下記 FAIL 1〜4 はどれも自動計測の網に掛からない。simple @375 の box Δ 0.5px は
FAIL 3 の兆候が閾値ぎりぎりで漏れ出したものである。

## FAIL 項目（実装者への指示）

### 1. `:hover` の見た目が丸ごと無い（全 4 バリアント / 全 viewport）— 最重要

参照は **未選択タブに hover すると選択タブと同じ見た目になる**（`blocks.css`、純粋な CSS で JS 非依存）。
`src/styles/parts/tab.css` には `:hover` 規則が 1 つも無く、hover しても何も変わらない。

2 つめ（未選択）のタブに `CSS.forcePseudoState:hover` を掛けた実測（1200 / 375 / 768 いずれも同じ）:

| variant | 対象 | プロパティ | 参照 | 実装 |
|---|---|---|---|---|
| default | `.un-tab__button`（未選択） | background-color | `rgb(51,51,51)` | `rgba(0,0,0,0)` |
| default | 同上 | color | `rgb(253,253,253)` | `rgb(51,51,51)` |
| default | 同上 | opacity | `1` | `0.5` |
| simple | 同上 | background-color | `rgb(221,221,221)` | `rgba(0,0,0,0)` |
| simple | 同上 | color | `rgb(51,51,51)` | `rgb(102,102,102)` |
| bb | 同上 | color | `rgb(4,56,76)` | `rgb(51,51,51)` |
| bb | 同上 | font-weight | `700` | `400` |
| bb | 同上 | opacity | `1` | `0.7` |
| bb | 同上 `::after`（選択線） | opacity | `1` | `0` |
| balloon | 同上 | background-color | `rgb(4,56,76)` | `rgba(199,199,199,0.15)` |
| balloon | 同上 | color | `rgb(255,255,255)` | `rgb(51,51,51)` |
| balloon | 同上 `::before`（しっぽ） | opacity | `1` | `0` |

目視でも明瞭（balloon: 参照は 2 つのタブが両方とも濃色＋しっぽ付きになる。実装は変化なし。
default: 参照はタブ列全体が黒帯になる。実装は変化なし）。

- 推定原因: 参照の `[aria-selected=true]` 規則はすべて `:hover` とセレクタを共有している
  （`…__button:hover, …__button[aria-selected=true] { … }`）。実装は `[aria-selected="true"]` 側だけを写した。
  `tab.css` の 4 バリアント分の選択規則すべてに `:hover` を並記すれば解消する
  （`:hover` は状態擬似クラスなので spec/01-coding-rules.md §3 の詳細度の数え上げから除かれ、上限に影響しない）。
- **`spec/parts/tab.md` §5 に hover の記載が無い**（spec-suspect）。spec/04-audit.md §2-5 は Tab を
  ホバー審査対象と定めているのに、パーツ spec が hover を計測値として持っていない。
- 「参照は JS でタブを切り替える／uneri は静的な見た目のみ」という §7 の線引きでは免責されない。
  hover は CSS だけで成立する装飾であり、`00-overview.md` §2 の非目標（装飾以外の JS）に当たらない。

### 2. `.un-tab__button` に `height: 100%` が無く、見出しの行数が違うとタブが揃わない（default / simple / bb）

- 参照: `.c-tabList__button { height: 100% }`。`li` は flex の stretch で最も高いタブに揃い、
  ボタンはその中を必ず埋める。
- 実装: `.un-tab__button` に `height` の指定が無いため、短い見出しのタブのボタンだけが低くなる。
- 実測（見出しが「とても長いタブの見出しでここで折り返します」/「短い」の 2 つ）:

| variant | vw | 対象 | 参照 | 実装 |
|---|---|---|---|---|
| default | 1200 | 2 つめの `button` height | 49px | **35px** |
| default | 375 | 同上 | 45.5px | **32.5px** |
| simple | 1200 | 同上 | 58px | **44px** |
| simple | 375 | 同上 | 54px | **41px** |
| bb | 375 | 同上 | 42.25px | **29.25px** |
| bb | 375 | 同上 `::before`（下端の細線）の top | 41.25px | **28.25px** |
| bb | 375 | 同上 `::after`（選択線）の top | 40.25px | **27.25px** |

- 目視: simple では短いほうのタブの枠が 13px 低くなり、隣のタブと下端が揃わない。
  bb では下端の罫線が折れ線状に段差を作る（参照は一直線）。
- 露出しない理由: カタログ・fixture の見出しが「タブ 1」「タブ 2」で長さも行数も同じ（fixture-suspect、spec/04-audit.md §2.0）。
- `spec/parts/tab.md` §5 の button 行に `height` が記載されていない（spec-suspect）。

### 3. `simple` のタブ下マージンが `0.5em`。参照は `8px` 固定（simple / 375）

- 参照: `.is-style-simple>.c-tabList { --the-tab-item-margin: 0 0 8px }` → **8px 固定**。
- 実装: `.un-tab--simple > … > .un-tab__item { margin-bottom: 0.5em }`。
- 実測（375、`.un-content` の font-size が `4vw` = 15px）:
  - `.un-tab__item` margin-bottom: 参照 **8px** → 実装 **7.5px**
  - `.un-tab__list` height: 参照 49px → 実装 48.5px
  - `[data-variant]` height: 参照 76px → 実装 75.5px（3 タブなら 125px → 124px）
- 閾値 1px に収まるため自動判定は通るが、`report.md` の `simple @375` box Δ h=0.5 はこれが原因。
  本文 font-size を上書きした利用者ではそのまま差が拡大する（例: 32px なら 16px vs 8px）。
- spec/01-coding-rules.md §3「参照が px で固定している値は px のまま写す」に違反。
  `spec/parts/tab.md` §5 も `0.5em` と誤記している（spec-suspect）。
  同じ表の balloon `16px` / bb `0.75em` は参照どおりなので、simple だけの取りこぼし。

### 4. `width` / `widthSp` のモデルが参照と別物（全バリアント）

参照は **タブ幅の指定が `flex` と `flex-wrap` と button の padding を同時に決める**。実装は
`flex-basis` だけを custom property で流し、`flex-shrink` / `flex-wrap` / padding はバリアントに固定している。
このため props の組み合わせを変えると参照から外れる。

参照 CSS の実体（`blocks.css`。`--the-tab-flex` の既定は `0 1 auto`、`--the-tab-flex_wrap` の既定は `nowrap`、
`--the-tab-btn-padding` の既定は `1em .5em`）:

| 属性値 | 効果 |
|---|---|
| `[data-width-pc=auto]` (≥960) | `flex-wrap: wrap` / btn padding `1em` |
| `[data-width-pc="25"]` (≥960) | `flex-wrap: wrap` / `flex: 0 0 25%` |
| `[data-width-pc=flex-50]` (≥960) | `flex: 0 1 50%`（wrap は既定の nowrap のまま）|
| `[data-width-pc=flex-auto]` (≥960) | `flex: 1 1 auto` |
| `[data-width-sp=auto]` (<960) | `flex-wrap: wrap` / btn padding `1em` |
| `[data-width-sp="50"]` (<960) | `flex-wrap: wrap` / `flex: 0 0 50%` |
| `[data-width-sp=flex-50]` / `flex-auto` (<960) | `0 1 50%` / `1 1 auto` |

**`[data-width-pc="33"]` / `[data-width-pc="50"]` / `[data-width-sp="25"]` / `[data-width-sp="33"]` は参照 CSS に存在しない。**

実測差分（同じ値を uneri の props と SWELL の data 属性に与えて比較）:

| 組み合わせ | 対象 | 参照 | 実装 |
|---|---|---|---|
| `width="50"` @1200（default）| `.un-tab__item` flex | `0 1 auto` / nowrap（幅は内容なり = 49.9px）| `0 0 50%` / wrap（434px）|
| `width="33"` @1200（default）| 同上 | `0 1 auto` / nowrap（49.9px）| `0 0 33.3333%` / wrap（289.3px）|
| `widthSp="25"` @375（default）| 同上 | `0 1 auto` / nowrap（49.9px）| `0 0 25%` / wrap（86.25px）|
| `width="auto"` @1200（default）| `.un-tab__button` padding-left/right | `13px`（1em）| **`6.5px`（0.5em）** |
| `width="auto"` @1200（default）| `.un-tab__item` flex-shrink | `1` | **`0`** |
| `width="auto"` @1200（simple / bb）| button padding-left/right | `13px` | **`6.5px`** |
| `width="25"` @1200（balloon）| button padding-left/right | `6.5px` | **`13px`** |
| `width="25"` @1200（bb）| `.un-tab__item` flex-shrink / list flex-wrap | `0` / `wrap` | **`1` / `nowrap`** |

- 目視（1200）: `width="50"` は参照が内容幅の小さなタブ 2 つ、実装が画面半分ずつの大きなタブ 2 つで完全に別物。
  `width="auto"` は参照のほうがタブが左右に 1em ずつ広い。
- カタログが通っているのは、`bb` に対して fixture が `data-width-pc="flex-50"`、
  カタログが `width="50"` を与えており、実装が `un-tab--bb` に `flex-shrink: 1` と `flex-wrap: nowrap` を
  ハードコードしているため **たまたま数値が一致するから**。裏を返すと
  uneri には参照の `flex-50` / `flex-auto` を表す手段が無く、`width="50"`（PC）は参照に対応値が無い。
- `spec/parts/tab.md` §2 の `width?: '25' | '33' | '50' | 'auto'` は
  PC 側に存在しない `'33'` `'50'` を含み、参照にある `flex-50` `flex-auto` を欠く（spec-suspect）。
  §5 の「button padding 0.75em 0.5em」「item flex-basis」も、
  幅指定に連動する部分を落として写している（spec-suspect）。

### 5. `#666` のリテラル hex（コーディング規則違反）

- `src/styles/parts/tab.css:93` `.un-tab--simple … .un-tab__button { color: #666 }`。
- spec/01-coding-rules.md §3「色は必ずトークン経由。リテラルの hex はトークン定義と、白/黒/透明以外では使わない」に違反。
  `#fff`（balloon 選択時）は白なので可。`src/styles/tokens.css` に対応トークンは無い。
- `spec/02-design-tokens.md` にも `#666` のトークンが無く、`spec/parts/tab.md` §5 が `#666` を直接書いている（spec-suspect）。

### 6. `Tab.astro` が `styleToString` / `joinStyles` を使っていない（コーディング規則違反）

```
style={[`--_tab-width-pc:…;--_tab-width-sp:…`, userStyle].filter(Boolean).join(';')}
```

- spec/01-coding-rules.md §4「パーツが inline の custom property を組み立てるときは、
  利用者の `style`（文字列でもオブジェクトでも渡せる）を `src/lib/style.ts` の
  `styleToString` / `joinStyles` で必ず取り込む」に違反。
- 実害: `<Tab style={{ marginTop: '2em' }} …>` のようにオブジェクトを渡すと
  `…;[object Object]` が出力される。`Button.astro` / `Balloon.astro` / `Mark.astro` / `Text.astro` は
  規則どおり `joinStyles(styleToString(userStyle), …)` を使っており、Tab だけが外れている。

## 目視所見

- `audits/tab/shots/` の `-ref` / `-impl` / `-diff` を 4 バリアント × 3 viewport × 通常/hover の 24 組すべて確認。
  カタログと同じ内容では差は無い（`bb` の 0.002% は 1px 罫線のアンチエイリアス）。
- **`*-hover-*-ref.png` は `*-ref.png` と完全に同一画像**。ハーネスが「選択済みの 1 つめのタブ」を
  hover しているため、参照側でも見た目が変わらない（下記 tool-suspect）。ホバー審査は実質未実施。
- balloon のしっぽ（`border-width: 8px 8px 0` の三角、下端中央）、
  bb の 1px 細線（opacity .4）と 2px 選択線、default のタブ帯と本文枠の -1px 重ね、
  simple の枠線 1px 重ね（`margin-left: -1px`）はいずれも参照と一致。
- 3 タブ、`aria-selected` を 2 つめに移した状態、パネル内に段落 2 つ＋リストを置いた場合は
  いずれも差分 0（`.un-tab .un-tab__panel > *` の縦リズムは参照 `.c-tabBody__item>*` と一致）。
- 非選択パネルの隠し方は参照が `aria-hidden="true"` + `display:none`、実装が `hidden` 属性。
  どちらも `display:none` で描画上は等価。

## 「最初のタブ以外に検証すべき静止状態」への回答（spec/parts/tab.md §1・§7 の線引き）

- **線引き自体は妥当**（切り替えの JS を持たないのは `00-overview.md` §2 の非目標どおり）。
  ただし **hover を静止状態から落としたのは誤り**（FAIL 1）。参照の hover は CSS のみで実現され、
  JS 挙動ではない。spec/04-audit.md §2-5 も Tab を hover 審査の対象に挙げている。
- 検証すべき静止状態として、本審査では次を確認した:
  1. 未選択タブの hover → **不一致（FAIL 1）**
  2. 2 つめのタブが選択された状態（`aria-selected` を付け替え）→ 一致
  3. 見出しの行数が揃わない状態 → **不一致（FAIL 2）**
  4. タブ数の増減（1〜3）→ 一致
  5. `width` / `widthSp` の各値 → **不一致（FAIL 4）**
  6. パネル内が複数ブロックの状態 → 一致
  7. `:focus-visible` → 参照・実装とも独自規則なし。実装はフォーカスリングを消していない（規則どおり）
- **A11y の線引きが未解決（spec-suspect）**: 実装は `role="tablist" / "tab" / "tabpanel"` を出力するが、
  `aria-controls` も panel の `id` / `aria-labelledby` も出さず、矢印キー移動も無い。
  spec/01-coding-rules.md §5「タブ: `role=…`、矢印キー移動」と
  `spec/parts/tab.md` §1「切り替えの動作は持たない」が正面から矛盾している。
  参照 fixture は `aria-controls="t-default-1"` を持つ。
  ロールを出す以上は id と `aria-controls` の生成方法（あるいはロールを出さない方針）を spec に書くべき。

## 仕様適合

- **バリアント網羅**: OK。spec §3 の 4 バリアント（default / simple / bb / balloon）が
  `src/pages/catalog/tab.astro` と `reference/fixtures/tab.html` の双方にあり、順序・ダミーテキストも一致。
- **props**: **NG**。
  - `Tab`: `variant` / `labels` / `class` / `id` / `HTMLAttributes<'div'>` は spec §2 と一致。
    `width` / `widthSp` の値域が参照に対応しない（FAIL 4）。
  - JSDoc の誤り: `width` に「≥600px」、`widthSp` に「<600px」と書かれているが、
    spec §2・§7 も `tab.css` の `@media` も **960px**。
  - `TabPanel`: `index` / `class` / `id` / `HTMLAttributes<'div'>` は spec §2 と一致。
- **コーディング規則**: **NG 2 件**（FAIL 5 のリテラル `#666`、FAIL 6 の `styleToString` 未使用）。
  それ以外は良好:
  - `!important` なし。`swell` の文字列なし。`.un-content` の前置なし。`@media` は `min-width` のみ。
  - 詳細度を数え直した結果、最大は `.un-tab .un-tab__panel > *` と `.un-tab__panel > :last-child` の **(0,2,0)**。
    `.un-tab--bb > :where(.un-tab__list) > :where(.un-tab__item) > :where(.un-tab__button)[aria-selected="true"]::after`
    は `:where()` が 0・属性セレクタが数え上げ対象外なので (0,1,0)。上限 (0,2,0) 超えは無い。
  - 疑似要素（bb の 2 本の線、balloon のしっぽ）に `content: ""` と用途コメントあり。
  - 内部専用 custom property は `--_tab-width-pc` / `--_tab-width-sp` で `--_` 接頭辞どおり。
- **クリーンルーム**: OK（`cleanroom: OK (1900 reference runs indexed)`）。
- **standalone**: OK（`standalone: OK (148 variants, 326 rules)`。tab の 4 バリアントも個別に OK）。
  変異テストで感度も確認済み（下記）。

## ツール／fixture の不備

### tool-suspect: `run.mjs` の hover が「選択済みタブ」を掴む（FAIL 1 を構造的に検出できない）

`scripts/audit/run.mjs` の `forceHover()`:

```js
const { nodeId } = await cdp.send('DOM.querySelector', {
  nodeId: root.nodeId, selector: `[data-variant="${variant}"] :is(a,button,summary,[role=tab])` });
```

`DOM.querySelector` は最初の 1 件しか返さないため、Tab では常に **1 つめ（= 既に `aria-selected="true"`）**
のボタンが対象になる。参照では hover の見た目と選択の見た目が同一なので、参照側にも変化が出ない。
結果、`*-hover-*-{ref,impl}.png` は非 hover と同一画像になり、
「実装に hover 規則が 1 つも無い」という事実が pixel diff にも style diff にも現れない。
未選択の要素（`[aria-selected="false"]` や 2 つめの子）にも hover を掛けるか、
対象を全件（`DOM.querySelectorAll`）にする修正が必要。

### fixture-suspect

1. 見出しが「タブ 1」「タブ 2」で長さも行数も同じ。`height: 100%` の欠落（FAIL 2）が出ない。
   spec/04-audit.md §2.0 の「定義的な性質が出るダミーテキストを選ぶ」に反する。
2. `bb` だけ fixture が `data-width-pc="flex-50" data-width-sp="flex-50"`、
   カタログが `width="50" widthSp="50"` と、**同名 variant で別の幅指定を比べている**。
   spec/04-audit.md §1 の「同じダミーテキスト・同じ順序・同じ `data-variant` 名」で
   差はスタイル差だけになる、という前提が崩れている。
   `width` 別のバリアント（`width="auto"` / `"50"` など）がカタログに 1 つも無いため、
   受け入れ基準 §6「`width` でタブ幅が変わる」が実質未検証。

### standalone.mjs の感度（変異テスト、リポジトリの複製上で実施。本体は無改変）

| 変異 | 期待 | 結果 |
|---|---|---|
| `.un-tab .un-tab__panel > *` から `margin-top: 0` を削除 | 検出 | **FAIL (4/9)** 検出 |
| `.un-faq .un-faq__a > *` から `margin-top: 0` を削除 | 検出 | **FAIL (5/9)** 検出 |
| `tab.css` に `.un-content .un-tab__button { border-radius: 9px }` を追加 | 検出 | **FAIL (9/9)** 検出 |

前回の faq 審査で指摘されていた盲点（`CONTENT_AREA > :where(p, ul, …)` の margin 未検査）は
`DECORATED` / `CONTENT_AREA` の追加で塞がっている。tab についても有効。

## 参照 CSS との宣言レベル突き合わせ（差異のみ）

| 参照（SWELL） | 実装 | 判定 |
|---|---|---|
| `.c-tabList__button:hover` を `[aria-selected=true]` と並記（4 バリアント分） | 無し | **FAIL 1** |
| `.c-tabList__button { height: 100% }` | 無し | **FAIL 2** |
| `--the-tab-item-margin: 0 0 8px`（simple） | `margin-bottom: 0.5em` | **FAIL 3** |
| `--the-tab-flex` / `--the-tab-flex_wrap` / `--the-tab-btn-padding` を幅属性で切り替え | バリアントに固定 | **FAIL 4** |
| `.is-style-simple … { color: #666 }` | `color: #666`（リテラル） | **FAIL 5**（規則違反。値自体は一致）|
| `.c-tabList { justify-content: center }` を既定にし `is-style-default` で `flex-start` | 既定 `flex-start`、他 3 つで `center` | 結果は同値。許容 |
| `.c-tabList__button:hover { outline: none }` | 無し | 実装のほうがフォーカスリングを残す。規則 §5 どおりで許容 |
| balloon `:before` の `width: 0; height: 0; display: block` | 未指定（絶対配置の空疑似要素で 0 になる） | 計算値一致。許容 |
| `[data-scroll-pc]` / `[data-scroll-sp]`（横スクロールタブ） | 無し | spec §3 に無いので対象外（要記録）|
