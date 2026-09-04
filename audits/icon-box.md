# audit: icon-box  (2026-09-03)

verdict: **PASS**

前回 FAIL の 7 項目はすべて解消を確認した（下記「前回 FAIL 項目の検証」）。
加えて審査ツールの穴を疑って独自に再計測したが、**参照との差は 1 件も検出されなかった**。
FAIL 項目なし。残る指摘は将来の改善提案（所見）として記録する。

## 前回 FAIL 項目の検証

| # | 前回の指摘 | 検証方法 | 結果 |
|---|---|---|---|
| 1 | `big-icon-*` に `margin-top: 2.5em`（先頭以外）が無い | `src/styles/parts/icon-box.css:82` に `.un-box--big-icon:not(:first-child){margin-top:2.5em}` を確認。参照 `main.css` の `[class*=is-style-big_icon_]:not(:first-child){margin-top:2.5em}` とセレクタ構造まで一致。DOM を組み立てて 4 シナリオ（先頭 / 2 番目 / 大が連続 / コンテナ外）で computed を実測 | **解消**。先頭 0px / 非先頭 40px / 連続時 40px / `.un-content` 外でも 40px、隙間も 40.00px で参照と完全一致（375 でも 37.5px で一致） |
| 2 | fixture / カタログが `:not(:first-child)` を露出させていない | `reference/fixtures/icon-box.html` と `src/pages/catalog/icon-box.astro`、および `dist/catalog/icon-box/index.html` を確認 | **解消**。14/14 バリアントが `<p>先行する段落テキストです。</p>` + パーツの 2 ブロック構成。ビルド済み HTML でも「先行する段落テキストです。」が 14 回出現 |
| 3 | スクリーンショットが円の上半分を切り落としていた | `scripts/audit/run.mjs` の `capture()` が `SHOT_PAD = 24` の `page.screenshot({fullPage:true, clip})` になっていることを確認し、`-ref.png` / `-impl.png` を実際に目視 | **解消**。円の上半分・リング上側の弧まで写っている。ink box も参照側で w21×h20（小）まで測れており、切られた下半分だけを測っていた前回（h=8 等）から回復 |
| 4 | ink box の閾値が spec と食い違う／`font-size`・`line-height` を除外していた | `spec/04-audit.md` §2.1-2,3 と `run.mjs` の `THRESH` / `ICON_SKIP_PROPS` を突き合わせ。実装 `::before` の `font-size` / `line-height` を参照と実測比較 | **解消**。spec「中心 ±2px・寸法 ±30%（最低 3px）」＝ `THRESH.inkCentrePx:2 / inkSizeRatio:0.3`。`ICON_SKIP_PROPS` は `content` / `font-family` / `background-image` / `mask-image` のみ。実装 `::before` は `font-size:1.25em` / `line-height:1` を持ち、参照と 20px / 20px で一致 |
| 5 | spec §5「大」の表が em の基準を取り違えていた | `spec/parts/icon-box.md` §5 と参照 CSS `[class*=is-style-big_icon_]:before{font-size:1.25em;width:2em;height:2em;left:.5em;padding:0 0 0 .05em}` を突き合わせ | **解消**。`width/height` に「**自身の font-size 基準** = 40px」、`left` に「（自身の font-size 基準）0.5em / 0.75em」と明記され、参照 CSS と 1:1 対応 |
| 6 | `.un-box--icon::after` が `.un-content` の `box-sizing` に依存 | `icon-box.css:37` に `box-sizing: border-box` を確認。`.un-content` の外に置いた状態で縦罫の computed を実測 | **解消**。コンテナ外でも `width 1px` / `border-right 1px` / `box-sizing border-box` で参照（`width:0`+`border-right:1px`）と同じ 1px |
| 7 | big-icon-memo のグリフが吹き出しで意味が対応していない | `icon-box.css:147` の data URI を差し替え確認 + 4 倍拡大で目視 | **解消**。羽根ペン（quill）に描き直され、参照（羽根ペン）と意味・向き・大きさが対応 |

## 自動計測

`node scripts/audit/run.mjs icon-box --no-build --port 4402` → **PASS**（42/42）。
pixel diff は spec/04-audit.md §2.1 によりグリフを透明にした状態で計測。

| variant | vw | pixel diff % | box Δ (w/h) | ink Δ (中心x/中心y/w/h) | style diffs | pass |
|---|---|---|---|---|---|---|
| icon-good | 375 | 0 | 0/0 | 0.5/0.5/1/1 | 0 | ✅ |
| icon-bad | 375 | 0 | 0/0 | 0/2/0/0 | 0 | ✅ |
| icon-info | 375 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-announce | 375 | 0 | 0/0 | 0/1/0/0 | 0 | ✅ |
| icon-pen | 375 | 0 | 0/0 | 1/1.5/2/1 | 0 | ✅ |
| icon-book | 375 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| big-icon-point | 375 | 0 | 0/0 | 0/1/0/0 | 0 | ✅ |
| big-icon-good | 375 | 0 | 0/0 | 0.5/0.5/1/1 | 0 | ✅ |
| big-icon-bad | 375 | 0 | 0/0 | 0/1.5/0/1 | 0 | ✅ |
| big-icon-check | 375 | 0 | 0/0 | 0.5/0.5/1/1 | 0 | ✅ |
| big-icon-batsu | 375 | 0 | 0/0 | 0/1.5/0/1 | 0 | ✅ |
| big-icon-hatena | 375 | 0 | 0/0 | 0.5/1/1/0 | 0 | ✅ |
| big-icon-caution | 375 | 0 | 0/0 | 0/2/0/0 | 0 | ✅ |
| big-icon-memo | 375 | 0 | 0/0 | 0.5/1/1/2 | 0 | ✅ |
| icon-good | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bad | 768 | 0 | 0/0 | 0.5/1/1/0 | 0 | ✅ |
| icon-info | 768 | 0 | 0/0 | 0/1/0/0 | 0 | ✅ |
| icon-announce | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-pen | 768 | 0 | 0/0 | 0.5/1/1/0 | 0 | ✅ |
| icon-book | 768 | 0 | 0/0 | 0/1/0/0 | 0 | ✅ |
| big-icon-point | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| big-icon-good | 768 | 0 | 0/0 | 0.5/0.5/1/1 | 0 | ✅ |
| big-icon-bad | 768 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| big-icon-check | 768 | 0 | 0/0 | 0.5/0.5/1/1 | 0 | ✅ |
| big-icon-batsu | 768 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| big-icon-hatena | 768 | 0 | 0/0 | 0.5/0/1/0 | 0 | ✅ |
| big-icon-caution | 768 | 0 | 0/0 | 0.5/1/1/0 | 0 | ✅ |
| big-icon-memo | 768 | 0 | 0/0 | 0.5/1/1/2 | 0 | ✅ |
| icon-good | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bad | 1200 | 0 | 0/0 | 0.5/1/1/0 | 0 | ✅ |
| icon-info | 1200 | 0 | 0/0 | 0/1/0/0 | 0 | ✅ |
| icon-announce | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-pen | 1200 | 0 | 0/0 | 0.5/1/1/0 | 0 | ✅ |
| icon-book | 1200 | 0 | 0/0 | 0/1/0/0 | 0 | ✅ |
| big-icon-point | 1200 | 0 | 0/0 | 0.5/0/1/0 | 0 | ✅ |
| big-icon-good | 1200 | 0 | 0/0 | 0.5/0.5/1/1 | 0 | ✅ |
| big-icon-bad | 1200 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| big-icon-check | 1200 | 0 | 0/0 | 0.5/0.5/1/1 | 0 | ✅ |
| big-icon-batsu | 1200 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| big-icon-hatena | 1200 | 0 | 0/0 | 0.5/0/1/0 | 0 | ✅ |
| big-icon-caution | 1200 | 0 | 0/0 | 0.5/1/1/0 | 0 | ✅ |
| big-icon-memo | 1200 | 0 | 0/0 | 0.5/1/1/2 | 0 | ✅ |

- pixel diff: 42/42 が 0.000%。全 `-diff.png`（42 枚）の非グレースケール画素を独自に数えて **0** を確認。
- box Δ: 42/42 が 0/0。
- style diffs: 0（`STYLE_PROPS` の網羅性は下記「独自検証」で別途確認）。
- ink Δ: 最大でも中心 2.0px / 寸法 2px。閾値（中心 ±2px、寸法 ±30% かつ最低 3px）内。
  前回 11/42 あった「spec の ±1px 超過」は、spec 側が実際の閾値（±2px / ±30%）に統一されたため解消。

## 独自検証（自動判定の穴を疑う）

1. **全 computed style 総当たり**（Playwright、`[data-variant]` 直下のパーツ要素と `::before` / `::after` の
   非カスタムプロパティ約 340 種 × 14 バリアント × 3 viewport = 約 14,000 件を参照と突き合わせ）
   - `run.mjs` の `STYLE_PROPS`（44 種）に入っていないプロパティも含めて全数比較した。
   - **root と `::after` は不一致 0 件**。`::before` の不一致は
     `mask-position` / `mask-repeat` / `mask-size` / `background-position` / `background-repeat` / `background-size` と、
     参照が透明な `background-color` のみ。いずれも「参照＝アイコンフォントの文字、実装＝画像/マスク」という
     描画機構そのものの差で、原理的に一致し得ない（spec/04-audit.md §2 が定める比較プロパティ集合にも含まれない）。
   - **`font-size` / `line-height` は一致**（大 `::before` = 参照 20px / 20px、実装 20px / 20px）。前回の除外が外れた状態でも通る。
   - 大の円: `width/height 40px`（375 では 37.5px）、`top -1px`、`transform matrix(1,0,0,1,0,-20)`、
     `border 2px rgb(253,253,253)`、`border-radius 50%`、`background-color` すべて 1:1。
   - 小の縦罫: `left 52px`、`top/bottom 14.39px`、`border-right 1px`、`opacity 0.4` 一致。
     `height` のみ 28.7969px（参照 `height:50%`）対 28.8125px（実装 `top:25%/bottom:25%`）で **0.0156px** 差。閾値 0.5px の 1/32 で無視可。
2. **独自 clip での pixel diff**（`run.mjs` とは別実装で、要素の周囲 **40px** を含む fullPage clip を撮り直して pixelmatch）
   - 41/42 が 0px（0.0000%）。残る `icon-good@375` は参照の 1 個目のバリアントが y=27px にあり
     clip が上端でクランプされて ref/impl の相対位置がずれた自分のスクリプト側の問題で、
     pad を 20px に下げると **0px（0.0000%）**。結局 **42/42 が完全一致**。
3. **バリアントで露出していない規則の洗い出し**
   参照 CSS（`main.css` / `swell_custom.css` / `blocks.css` / `single.css` / `footer.css`）から
   `is-style-icon_*` / `is-style-big_icon_*` にマッチする**全ルール・全宣言**を抽出し、1 件ずつ実装と突き合わせた。
   - `:hover` / `:focus` / `:active` の規則は参照側に存在しない（このパーツにホバー状態は無い）。
   - `@media (min-width:600px)` の 2 規則（root `padding:2.5em 2em 2em`、`::before left:.75em`）も一致。
     ブレークポイントは spec/02-design-tokens.md の `sm = 600px`。
   - 未実装の宣言は `swell_custom.css` の `[class*="is-style-icon_"]{border-width:0}` **1 件のみ**（下記 所見 A）。
4. **単体設置時（`.un-content` の外）の挙動**
   `.un-content` / `.post_content` の外に置いた状態で参照と実装の computed を比較（大 19 項目・小 17 項目）。
   `margin-top` / `padding` / `border` / 円の寸法・位置・transform・リング色、縦罫の幅・`box-sizing` まですべて一致。
   前回の `::after` box-sizing 依存は解消済み。
5. **グリフ非表示 CSS の妥当性**
   `-ref-noglyph.png` / `-impl-noglyph.png` を目視。参照・実装とも**グリフだけ**が消え、
   背景・角丸・縦罫・円・リング・枠線は残る。ink box は両側で非 null。抜け道になっていない。

## FAIL 項目（実装者への指示）

なし。

## 目視所見

`audits/icon-box/shots/` の 210 枚（`-ref` / `-impl` / `-diff` / `-ref-noglyph` / `-impl-noglyph`）を確認。
さらに ink box 中心を基準にアイコン部を **4 倍拡大**して 14 バリアント × ref/impl を並べて比較した。

- **大の円**: 上辺にちょうど半分かかり、円の上半分とリング（`border 2px var(--un-color-bg)`）の上側の弧が
  スクリーンショットに写っている（前回はここが切れていた）。枠線が円の左右で途切れる位置・幅も一致。
- **大のパディング切り替え**: 375 で `2em 1.5em 1.5em`、768/1200 で `2.5em 2em 2em`。参照と一致。
- **大の上マージン**: 直前段落との隙間が 375 で 37.5px、768/1200 で 40px。参照と一致（前回は 30/32px で詰まっていた）。
- **小の縦罫**: 位置（left 3.25em）・高さ（上下 25%）・不透明度 0.4・色とも見分けがつかない。
- **小の背景・角丸・パディング**: 6 色すべて一致。テキストの折り返し位置も完全一致
  （375 で 4 行、768/1200 で 2 行、折り返し文字も同じ）。
- **影・グラデーション・ストライプ**: 本パーツには無し。
- **icon-shape（形の違い。FAIL 理由にしない）**:
  - `big-icon-memo`: **前回の指摘が解消**。参照＝羽根ペン、実装＝羽根ペン。意味が対応した。
    実装の羽根はやや葉に近く軸（ペン先）が細いが、大きさ・位置・傾きは揃っている。
  - `icon-announce`: 参照はメガホン＋放射線、実装はスピーカー（音量）。モチーフが別物だが「知らせる」の意味は保たれている。
  - `icon-pen`: 参照は細線のペン＋下の一本線、実装は塗りつぶしの鉛筆。**線が実装のほうが明らかに太い**
    （spec/04-audit.md §4 の「太さ」は厳密には揃っていない）。ink Δ も `icon-pen@375` の w=1 程度で寸法自体は許容内。
  - `icon-book`: 参照は斜めに開いた本、実装は正面の閉じた本。
  - `big-icon-point`: 参照は輪郭線の電球（中が空）、実装は塗りつぶしの電球。**太さが違う**。
  - `big-icon-hatena`: 実装の「?」がやや太く、下の点が丸ではなく角。
  - `icon-good` / `icon-bad`（サムズ）、`icon-info`（丸に i）、`big-icon-good/check`（チェック）、
    `big-icon-bad/batsu`（バツ）、`big-icon-caution`（三角＋！）は 4 倍拡大でもほぼ見分けがつかない。

### 所見（FAIL ではない。将来の改善提案）

- **A. 小 root の `border-width: 0` が実装に無い**（前回も範囲外として記録した項目。未対応）
  参照 `swell_custom.css` は `[class*="is-style-icon_"]{color:#333;border-width:0}`。
  実装は `border-color` だけを持ち `border-width` を宣言しないため、既定の `border-style:none` で computed は 0px となり
  spec §5 の「幅 0」と一致する（審査の全 42 組で差は出ない）。
  ただし利用者が `style="border-style:solid"` だけを足すと **参照 0px / 実装 3px（medium）** に分岐する（実測確認済み）。
  `.un-box--icon { border-width: 0 }` を明示すれば参照と完全に同じ挙動になる。
- **B. `margin-top` を `.un-content` 文脈の外で定義している**
  実装は `.un-box--big-icon:not(:first-child)`（詳細度 (0,2,0)、上限ちょうど）で、参照の
  `[class*=is-style-big_icon_]:not(:first-child)` と構造まで同型であり、挙動も完全一致する。
  一方 `spec/01-coding-rules.md` §2.4 は「パーツの余白（margin）は `.un-content > .un-*` の文脈で決める」と書いている。
  `heading.css` / `list.css` も同様にパーツ側で margin を持っており、プロジェクト全体で §2.4 の文言と運用が乖離している。
  icon-box 単体の欠陥ではないので FAIL にはしないが、**§2.4 の文言を運用に合わせて改訂する**のが望ましい。
- **C. グリフの出自が記録されていない**
  `spec/01-coding-rules.md` §1 は第三者アイコンを使う場合 `src/icons/<name>.svg` と `icons/LICENSES.md` に出典を残すことを求めるが、
  `src/icons/` は存在せず、グリフは `icon-box.css` の data URI に直接埋め込まれている。
  `spec/parts/icon-box.md` §7 が「意味が同じ図形を**自作する**」と宣言しているため規則違反とは判断しないが、
  既存アイコンセットから起こした形が含まれるなら出典の記録が必要。
- **D. tool-note: clip の上端クランプ**
  `run.mjs` の clip は `Math.max(0, b.y - SHOT_PAD)` で上端をクランプする。
  参照 fixture の 1 個目のバリアントは 375 で y=27px しかなく、`SHOT_PAD=24` に対して余裕が 3px しかない。
  クランプが片側だけで起きると全体がずれて **偽 FAIL** になる（偽 PASS にはならないので合否には影響しない）。
  fixture の先頭に余白を足すか、クランプ時に両ページで同じ量だけ clip を詰める処理を入れておくと堅い。
- **E. spec §5 小の `::after` 表記**
  spec §5 は `left / top / bottom / width` = `3.25em / 25% / 25% / 1px`（実装の書き方）で書かれているが、
  参照は `top:25%; height:50%; width:0`。computed の差は 0.0156px で実害ゼロ。
  spec が「参照の実測」を謳う表である以上、参照側の書き方（`height:50%` / `width:0`）を併記しておくと誤解が無い。

## 仕様適合

- **バリアント網羅**: OK。spec/parts/icon-box.md §3 の 14 バリアント（小 6 + 大 8）が
  `src/pages/catalog/icon-box.astro`・`dist/catalog/icon-box/index.html`・`reference/fixtures/icon-box.html` の 3 者に、
  同じ順序・同じダミーテキスト・同じ `data-variant` 名で揃っている。欠落なし・余分なし。
  spec §3 の「各バリアントは先頭に段落を 1 つ置く」も 14/14 で満たしている。
- **props**: OK。`src/components/Box.astro` の `interface Props` は
  `icon?: 'good'|'bad'|'info'|'announce'|'pen'|'book'`、
  `bigIcon?: 'point'|'good'|'bad'|'check'|'batsu'|'hatena'|'caution'|'memo'`、
  `as?: 'div'|'p'`（既定 `'div'`）、`class?`、`id?`、`extends HTMLAttributes<'div'>` で spec §2 と完全一致。
  併存する `style?` / `group?` は spec/parts/box.md の定義どおり（同じ `Box` が B1/B2/B3 を兼ねる設計）。
  `class:list` 使用・ルート要素 1 つ・`<slot />`・否定形 boolean なし・frontmatter 先頭の spec ポインタも規則どおり。
- **コーディング規則**: OK。
  - `!important` なし / `swell` 文字列なし（`src/` 全体を grep して 0 件）。
  - セレクタ最大詳細度は `.un-box--big-icon:not(:first-child)` の **(0,2,0)** で上限ちょうど。
  - リテラル色は `color:#fff`（白）と data URI 内の `%23fff` / `%23000` のみ。他は全て `--un-color-icon-*` / `--un-color-bg` 経由。
  - 単位は `em`（余白・寸法）と `px`（境界線）。ブレークポイントは `@media (min-width: 600px)` のみ（モバイルファースト、
    spec/02-design-tokens.md の `sm`）。
  - ベンダープレフィックスの手書きなし。アイコンフォントなし（小 = `mask-image`、大 = `background-image` の data URI SVG）。
  - `content:""` の 3 箇所すべてに「何を描いているか」のコメントあり。
  - 命名は `un-box--icon-*` / `un-box--big-icon-*`、内部変数は `--_ink` / `--_bg` / `--_glyph`。
  - （§2.4 の margin 文脈については 所見 B）
- **クリーンルーム**: OK。`node scripts/audit/cleanroom.mjs` → `cleanroom: OK (1900 reference runs indexed)`（exit 0）。
