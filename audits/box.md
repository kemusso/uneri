# audit: box  (2026-09-03 / 4 回目)

verdict: **FAIL**

再審査（4 回目）。spec/04-audit.md §7 に従い、前回 FAIL 項目の解消確認を先頭に置く。

---

## 0. 前回 FAIL 5 件の再検証（最優先）

| # | 前回の FAIL | 判定 | 検証方法・根拠 |
|---|---|---|---|
| 1 | group の中の Box の padding が継承されない | **解消** | `.un-box--group` が `--un-box-padding` を 1.5em / (≥600) 2em に書き換える方式に変更済み（box.css:12-28）。参照 SWELL も `:root{--swl-box_padding:1.5em}` + `@media(min-width:600px){.wp-block-group{--swl-box_padding:2em}}` と同じ機構であることを reference CSS で確認。`group-nested` バリアントは 375/768/1200 すべてで pixel diff 0 / box Δ 0 / 全 computed style 一致。独自に組んだ「group の中の group」「group の中に stripe / emboss / balloon2 / border-left / kakko / note / balloon / sticky / bg-main」も全一致（§4-B）。 |
| 2 | `.un-box--note::before` に `border-radius: inherit` が無い | **解消** | box.css:141 に `border-radius: inherit;` を確認。`<p class="un-box un-box--note" style="border-radius:12px">` を参照 `<p class="is-style-note_box" style="border-radius:12px">` と比較 → 全プロパティ・全矩形一致。 |
| 3 | `.un-box--balloon2::before` の背景が `#fff` 固定 | **解消** | box.css:207 `background: inherit;`。参照 `.is-style-balloon_box2:before{background:inherit}` と同じ。`bg-main` group の中／`bg-gray` group の中に balloon2 を置いた独自ケースで尾の背景・境界とも参照一致。 |
| 4 | run.mjs の STYLE_PROPS 不足 | **解消（box の範囲では）** | 追加された 25 プロパティを確認。さらに審査側で **`getComputedStyle` の全列挙プロパティ（≈340）× 深さ 6 × 3 viewport × 25 バリアント** の総当たり比較を独自実施し、run.mjs が見落としている差分が 0 件であることを確認（唯一検出されたのは `-webkit-mask-position-x/y` = アイコングリフの描き方で、spec/04-audit.md §2.1 の除外対象）。ただし §5 に残存する穴を記す。 |
| 5 | `has-text-align-center` 時の吹き出しの尾 | **解消** | `align="center"` prop → `.un-box--center`。`balloon-center` を実測し、375/768/1200 のいずれでもラッパ左右余白が完全一致（例 @768: ref left 239.2 / right 239.2、impl 同値 = 実際に中央寄せされている）、尾は `left: 102.078px`（balloon）、`left: 119.484px` + `matrix(0.707107,0.707107,-0.707107,0.707107,-6,0)`（balloon2）で参照と 1:1。参照 CSS も `.is-style-balloon_box.has-text-align-center:before{left:calc(50% - 12px)}` / `.is-style-balloon_box2.has-text-align-center:before{left:50%;transform:translateX(-50%) rotate(45deg)}` と同じ。 |

**前回の 5 件はすべて実際に修正されている。** ただし今回、group の子要素まわりで参照と一致しない挙動を新たに検出したため verdict は FAIL。

---

## 1. 自動計測

`node scripts/audit/run.mjs box --no-build --port 4401` → `audits/box/report.md` / `report.json`

- 25 バリアント × 3 viewport = **75 ケース、全て ✅**（report.json verdict: PASS / fails: 0）
- pixel diff: 全ケース **0.000 %**（閾値 0.3 %）
- bounding box Δ: 全ケース **0 / 0 px**（閾値 1 px）
- computed style diffs: 全ケース **0 件**
- ink Δ（アイコンを含む `group-nested`）: 375 `0/0/0/0`、768 `0/0/0/0`、1200 `0.5/0/1/0` — 中心 ±2px・寸法 ±30% の基準内

自動計測だけを見れば PASS。以下は自動計測の穴を突いた独自検証の結果である。

---

## 2. FAIL 項目（実装者への指示）

### FAIL-1 [box.css] group の子が見出し（h2 / h3 / h4）のとき `.un-box--group > *` の margin が効かない

`.un-box--group > *`（詳細度 (0,1,0)）が heading.css の `.un-content h2 / h3 / h4`（詳細度 (0,1,1)）に負けるため、
spec/parts/box.md §5 が要求する「group の子は `margin-bottom:1em` / `margin-top:0`、最後 0」が見出しに対して成立しない。
参照 SWELL は `div[class*=is-style-]>*{margin-bottom:1em}`（(0,1,1)）と `.post_content div>:first-child{margin-top:0!important}` で見出しにも効かせている。

実測（`<div class="un-box un-box--bg-gray un-box--group">…</div>` vs `<div class="wp-block-group is-style-bg_gray">…</div>`、子ノードは同一）:

| ケース | vw | プロパティ | 参照 | 実装 |
|---|---|---|---|---|
| `<h3>見出し</h3><p>あ</p>` | 375 | h3 `margin-top` | `0px` | **`49.5px`** |
| 〃 | 375 | h3 `margin-bottom` | `16.5px` | **`33px`** |
| 〃 | 375 | ボックス `height` | `119.844px` | **`185.844px`**（+66px） |
| 〃 | 1200 | h3 `margin-top` / `margin-bottom` | `0px` / `20.8px` | **`62.4px`** / **`41.6px`** |
| 〃 | 1200 | ボックス `height` | `153.094px` | **`236.281px`**（+83.2px） |
| `<p>あ</p><h3>見出し</h3><p>い</p>` | 375 | h3 `margin-bottom` | `16.5px` | **`33px`** |
| 〃 | 1200 | h3 `margin-bottom` | `20.8px` | **`41.6px`** |
| `<p>あ</p><h4>見出し</h4><p>い</p>` | 375 | h4 `margin-bottom` | `15.75px` | **`23.625px`** |
| `<h2>見出し</h2><p>あ</p>` | 375 | h2 `margin-top` / `margin-bottom` | `0px` / `18px` | **`72px`** / **`36px`** |
| 〃 | 375 | ボックス `height` | `142.188px` | **`232.188px`**（+90px） |

いずれも「bounding box の幅・高さ 差 ≤ 1px」「長さの computed style 差 ≤ 0.5px」を大幅に超える。

- `.un-box--group > :last-child`（(0,2,0)）は見出しにも効いており、**末尾**の見出しの `margin-bottom:0` は参照と一致する。壊れているのは「末尾以外の子の `margin-bottom:1em`」と「全子の `margin-top:0`」の 2 つ。
- 参考: `.un-content` 直下（group の外）に置いた h3 は ref/impl とも `margin: 49.5px 0 33px`（@375）で一致する。つまりこれは heading 部品固有の差ではなく **group ボックスの中でだけ発生する box 部品の欠陥**。

想定原因: `.un-box--group > *` の詳細度が (0,1,0) しかない。box 側で直すなら `.un-box.un-box--group > *`（(0,2,0)、規則の上限内）に上げる。heading 側で直すなら coding-rules §3 の「素の要素に既定を与える規則は `:where()` で包んで詳細度 0 にする」に従い `.un-content :where(h2,h3,h4)` にする（base.css の `ul` / `li` は既にこの形だが heading.css は守っていない）。

### FAIL-2 [heading.css / box の group で露見] group ボックスの中の `<h2>` が左右にはみ出す

`.un-content h2 { margin: 4em calc(var(--_bleed) * -1) 2em; }`（heading.css:17）の負の左右マージンが `.un-content` 直下に限定されていないため、group ボックスの内側に置いた h2 がボックスの padding を突き抜ける。参照は `.post_content h2{margin:4em 0 2em}` + `.post_content>h2{margin-left:var(--swl-h2-margin--x,0);margin-right:…}` と **直下の h2 だけ**にはみ出しを当てているのでボックス内では 0。

| vw | プロパティ | 参照 | 実装 |
|---|---|---|---|
| 375 | h2 `margin-left` / `margin-right` | `0px` / `0px` | **`-7.5px`** / **`-7.5px`** |
| 375 | h2 の x（group ボックス左端基準） / width | `22.5` / `300` | **`15`** / **`315`** |
| 1200 | h2 `margin-left` / `margin-right` | `0px` / `0px` | **`-16px`** / **`-16px`** |
| 1200 | h2 の x / width | `48` / `804` | **`32`** / **`836`** |

（`.un-content` 直下の h2 は ref/impl とも `-7.5px`（@375）/ `-16px`（@1200）で一致しており、差が出るのはボックス内だけ。）
根本原因は heading.css だが、box の `group` は「複数ブロックを囲む」ためのもので、囲んだ見出しが枠外に出るのは spec §3 `group-*` の要件を満たさない。box の再審査ブロッカーとして挙げる。修正はセレクタを `.un-content > h2` に限定するのが参照と同じ挙動。

### FAIL-3 [fixture / カタログの不備] group バリアントに見出しを含むケースが無い

`reference/fixtures/box.html` と `src/pages/catalog/box.astro` の group 系 3 バリアントは
`group-border-sm` = `<p>×2`、`group-bg-gray` = `<p>` + `<ul>`、`group-nested` = Box×3 で、**見出しを 1 つも含まない**。
spec §5 の「group / 子 margin / 子 `margin-bottom:1em`、最後 0」は見出しを含む全ブロックに掛かる要求なのに、それを露出するバリアントが存在せず、FAIL-1 / FAIL-2 が 75 ケースすべて ✅ のまま素通りした。
spec §3 / fixture / カタログに `group-heading`（`<h2>` + `<p>` + `<h3>` + `<p>` を含む group）バリアントを追加すること。fixture 側は `<div class="wp-block-group is-style-bg_gray"><h2>…</h2><p>…</p><h3>…</h3><p>…</p></div>`。

### FAIL-4 [spec の不備] `spec/parts/box.md` §1 のバリアント数が §3 / §6 と矛盾

- §1（10 行目）: 「カタログ上のバリアントは短文版を含め **23**」
- §3 の表: **25** 行（`border-sm` 〜 `group-bg-gray`）
- §6: 「全 **25** バリアントが 375 / 768 / 1200 で…」

前回 `group-nested` / `balloon-center` を追加した際に §1 を更新し忘れている。spec は「唯一の仕様」（coding-rules §6）であり数値の矛盾は不可。25 に直すこと。

---

## 3. 目視所見（spec/04-audit.md §4）

`audits/box/shots/` を viewport 別に確認（kakko / big-kakko / note / balloon / balloon2 / balloon-center / stripe / grid / sticky-short / group-nested を ref・impl・diff の 3 枚組で照合）。

- **kakko**: 左上・右下の 36×32 カギ線の長さ・太さ・角の位置が完全一致。
- **big-kakko**: 幅 12px の縦ブラケット、上下の返しの長さとも一致。
- **note**: 6px 内側の破線枠。ダッシュ周期・位相・角の折り返しまで一致。`document.elementFromPoint()` でボックス中央を叩くと ref・impl とも `P` が返り（`P.is-style-note_box` / `P.un-box un-box--note`）、`pointer-events:none` が効いてクリックを遮らないことを 375/768/1200 で確認。
- **balloon**: 下向き三角の尾。24×12 の見え、左 1.25em、本体との 2px の重なりまで一致。
- **balloon2**: 45° 回転の 12×12 正方形の尾。右下 2 辺だけが見える形、本体下辺との継ぎ目まで一致。
- **balloon-center**: 吹き出し本体・尾とも中央。ref/impl のスクリーンショットはピクセル単位で同一。
- **stripe**: -45deg・周期 6px、`background-clip: padding-box` により枠内で切れる挙動まで一致。
- **grid**: 16px 方眼、罫線位置（左上原点）一致。
- **sticky-short / balloon-short / balloon2-short**: `fit-content` で内容幅に縮み、幅が参照と一致。
- **group-nested**: 入れ子の border-sm / icon / bigIcon が group の padding を継いでいる。アイコンは別セットのため形が異なる（icon-shape として記録、FAIL 理由にしない）が、大きさ・太さ・位置は一致。
- 影のぼかし幅（emboss / sticky / dent）に目視差なし。テキストの折り返し位置も全バリアントで一致。

---

## 4. 独自検証（自動判定の穴を疑って）

### A. 全 computed style の総当たり
`getComputedStyle` が列挙する全プロパティ（`--*` を除く ≈340 個）＋ `::before` / `::after`、深さ 6、375/768/1200、25 バリアント全部、さらに variant ルート基準の矩形（x/y/w/h、0.5px 許容）を比較。
→ **差分 0 件**（アイコングリフの `-webkit-mask-position-x/y` のみ検出。§2.1 の除外対象）。run.mjs の STYLE_PROPS は box に関しては十分に足りている。

### B. カタログに露出していない組み合わせ（参照 SWELL マークアップと 1:1 で比較、375 / 1200）
| ケース | 結果 |
|---|---|
| group + kakko / note / balloon / sticky / border-left / bg-main | OK（全プロパティ・矩形一致） |
| group の中に group | OK |
| group の中に stripe / emboss / balloon2 / border-left | OK |
| `border-radius:12px` を付けた note（`::before` の `inherit` 追従） | OK |
| bg-main group の中の balloon2（`background: inherit` の追従） | OK |
| sticky + 後続 p（`fit-content` の回り込み） | OK |
| group の先頭が `<ul>` | OK |
| **group の中の h2 / h3 / h4** | **NG → FAIL-1 / FAIL-2** |

### C. `.un-content` の外・単体配置
`src/styles/parts/box.css` に `.un-content` の前置が 1 つも無いことを確認。margin を持たないため、単体配置でも枠・背景・padding・疑似要素は成立する（coding-rules §2.4 準拠）。

### D. 参考（FAIL にしない差分）
- group の子が `<pre>` / `<hr>` / `<figure>` / `<table>` / `<blockquote>` の場合に参照と差が出るが、いずれも group の外でも同じ差が出る **base.css（content 部品）由来**で box の責任範囲外。content 部品の審査で扱うべき。
- `<Box group>` を `style` 無しで使うと padding 1.5em が付く（`.un-box` が常に `padding: var(--un-box-padding)` を持つため）。参照の素の `.wp-block-group` は padding 0。spec §2/§3 に「style 無しの group」の定義が無く、SWELL 側に対応するマークアップも無いので差分としない。
- fixture の `has-text-align-center` は SWELL CSS の margin 指定しか効かない（WordPress コアの block-library CSS を読み込んでいないため `text-align:center` は掛からない）。参照・実装とも `text-align: start` で一致しているので今回の審査は成立しているが、実サイトではテキストも中央揃えになる点は spec に注記があると良い。

---

## 5. 仕様適合審査（spec/04-audit.md §5）

- **バリアント網羅**: spec §3 の 25 個と `src/pages/catalog/box.astro` の `data-variant` 25 個が完全一致（欠落 0）。`reference/fixtures/box.html` も同じ 25 個・同じダミーテキスト。ただし spec 表の並び（`group-bg-gray` が最後）と fixture/カタログの並び（`group-bg-gray` が 20 番目）はずれている（順序は規定されていないので指摘のみ）。**「25 個網羅」自体は満たすが、group に見出しを含むケースが仕様表に存在しない点が FAIL-3。**
- **props**: `src/components/Box.astro` の `interface Props` は spec §2 と一致。`style`（18 値の union）/ `align?: 'center'` / `icon` / `bigIcon` / `group = false` / `as = 'div'` / `class` / `id` / `extends HTMLAttributes<'div'>` / default slot、型・既定値とも一致。`class:list` 使用、ルート要素 1 つ、否定形 boolean なし。**OK**
- **コーディング規則**: `!important` 0 件、`swell` 文字列 0 件、`un-` + BEM 風命名で統一、状態クラスなし、色は全てトークン経由（リテラルは `#fff` と `rgba(0,0,0,.05)` / `rgba(0,0,0,.1)` = 白・黒のみで許容範囲）、`@media` は `min-width` のみ、ベンダープレフィックス手書きなし、疑似要素に「何を描いているか」のコメントあり、`.un-content` の前置なし。`.un-box--balloon.un-box--center::before` はクラス 2 個 + 疑似要素で、他の PASS 済みパーツと同じ書き方のため詳細度違反とはしない。**OK**
- **クリーンルーム**: `node scripts/audit/cleanroom.mjs` → `cleanroom: OK (1900 reference runs indexed)`。**OK**

### ツール（`scripts/audit/run.mjs`）の残存する穴 — box の判定には影響しないが要修正
- `STYLE_PROPS` に `flex-*` / `grid-*` / `align-*` / `justify-*` / `text-decoration*` / `font-style` / `white-space` / `list-style*` / `outline*` / `aspect-ratio` / `border-collapse` / `vertical-align` / `filter` が無い。box では総当たり検証で差が出ないことを確認済みだが、Columns・Table・Step・Tab では確実に穴になる。
- `diffStyles()` は参照側に存在する要素しか走査しないため、実装側にだけ余分な要素があっても検出されない。
- `COLLECT` の `depthMax: 4` は variant ラッパ起点。group の入れ子が深いケースでは足りなくなる。
- **バリアントの中身が仕様のすべてを露出していないと自動計測は無力**（今回の FAIL-1 がその実例）。§2.0 の「定義的な性質が出るダミーテキストを選ぶ」は、テキストだけでなく **子要素の種類**にも適用する必要がある。

---

## 6. まとめ

| 区分 | 結果 |
|---|---|
| 前回 FAIL 5 件 | 5/5 解消 |
| 自動計測 75 ケース | 全 PASS（pixel 0.000% / box Δ 0 / style diff 0） |
| 目視 | 差分なし（icon-shape のみ） |
| 独自検証（全プロパティ総当たり・未露出の組み合わせ） | **group + 見出しで NG** |
| 仕様適合 | props / 規則 / クリーンルーム OK、fixture と spec に不備 |

**verdict: FAIL** — FAIL-1（group の子の見出しに margin 規則が効かない）、FAIL-2（group 内の h2 がはみ出す）、FAIL-3（見出しを含む group バリアントが fixture／カタログに無い）、FAIL-4（spec §1 のバリアント数が 23 のまま）。
