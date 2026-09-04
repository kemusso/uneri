# audit: list  (2026-09-03) — 4 回目（再審査）

verdict: **FAIL**

自動計測は 17 バリアント × 3 viewport = 51 行すべて PASS（pixel diff 0 / box Δ 0 / style diff 0）。
参照 CSS のリスト関連 24 ルールを 1 宣言ずつ突き合わせた結果も一致。
**実装の見た目は合格水準に達している。** それでも FAIL とするのは、
前回 FAIL #5（`standalone.mjs` がザル）が **直りきっていない**（FAIL 項目 1）ためと、
参照と食い違う宣言が 1 件残っている（FAIL 項目 2）ため。

---

## 0. 前回 FAIL 6 件の再検証（最優先）

| # | 前回の指摘 | 結果 | 根拠 |
|---|---|---|---|
| 1 | `ol.un-list--note` の入れ子が連番になる | **解消** | `list.css` は `ol.un-list--note > li` / `> li::before`（子結合子）。dist CSS でも `ol.un-list--note>li:before` を確認。`note-ordered-nested` の ref/impl が完全一致（入れ子は番号なしの `※`） |
| 2 | `num-circle` 3 階層でバッジが塗りつぶし | **解消** | `ol li::before`（背景透明・輪郭）と `ul li::before`（`content:""` / `scale(.15)`）に分離。参照と同じ「同詳細度・後勝ち」で 3 階層目が極小リングになる挙動まで一致。`num-circle-deep` は全 vw で pixel diff 0 |
| 3 | `ol.un-list--note[reversed]` 未対応 | **解消** | `ol.un-list--note[reversed] > li::before { counter-increment: un-li -1 }`。`note-reversed` は ref/impl とも `※-1` `※-2` |
| 4 | `num-circle[reversed]` が入れ子まで逆順 | **解消** | `> li::before` に限定。`num-circle-reversed` は外側 `-1`/`-2`、入れ子 `1`/`2` で ref と一致 |
| 5 | `standalone.mjs` がザル | **不十分 → FAIL 項目 1** | ビルド済み CSS を壊す 3 種の実験すべてで false negative |
| 6 | fixture / spec に `[reversed]` や深い入れ子が無い | **解消** | spec §3 / `reference/fixtures/list.html` / `src/pages/catalog/list.astro` の 3 者が 17 バリアントで 1:1（同名・同順・同ダミーテキスト）。dist HTML でも `reversed` 属性の透過を確認 |

## 1. 自動計測

`node scripts/audit/run.mjs list --no-build --port 4403` → verdict PASS（`audits/list/report.json`: 51 行 / fail 0）。

| variant | vw | pixel diff | box Δ (w/h) | ink Δ (cx/cy/w/h) | style diffs |
|---|---|---|---|---|---|
| default, note, num-circle, ordered-default, num-circle-nested, note-ordered, num-circle-ul, note-nested, num-circle-reversed, note-ordered-nested, note-reversed, num-circle-deep | 375 / 768 / 1200 | 0 | 0/0 | —（グリフなし） | 0 |
| check | 375 / 768 / 1200 | 0 | 0/0 | 0.5/1/1/0 · 0.5/0.5/1/1 · 0/0.5/0/1 | 0 |
| good | 375 / 768 / 1200 | 0 | 0/0 | 0/1/0/0 · 0/0/0/0 · 0/0/0/0 | 0 |
| bad | 375 / 768 / 1200 | 0 | 0/0 | 0/1.5/2/1 · 0/0.5/0/1 · 0/0.5/0/1 | 0 |
| triangle | 375 / 768 / 1200 | 0 | 0/0 | 0/1.5/0/1 · 0/0.5/0/1 · 0/0.5/0/1 | 0 |
| check-nested | 375 / 768 / 1200 | 0 | 0/0 | 0.5/1/1/0 · 0.5/0.5/1/1 · 0/0.5/0/1 | 0 |

ink Δ はすべて閾値（中心 ±2px / 寸法 ±30% 以上・最低 3px）内。

## 2. 独自検証

### 2.1 参照 CSS との宣言レベル突き合わせ

`reference/swell/build/css/main.css` からリスト関連 24 ルールを抽出し、`src/styles/parts/list.css` と 1 宣言ずつ照合。
**未再現の結合子・条件は無し**（`>` と子孫の使い分け、`li li` の入れ子ドット、`[reversed]`、`ol`/`ul` 分岐すべて一致）。
技法差による書き換えは以下のみで、いずれも computed 値が一致することを確認済み。

- `height:auto` → `height:1.5em`（参照は文字/アイコンフォントなので行ボックス高、実装は mask のため実寸指定）
- `background:none` → `background-color:transparent`（`background-image` は基底ルールの `background:` 短縮形で既に `none`）
- `clip-path:circle(12% at 50%)` → `circle(12% at 50% 50%)`（computed 同値）
- `transform-origin:0 50%` → `left center`（computed 同値）
- 参照の `.is-style-note_list:not(.has-text-color){opacity:.85}` は uneri に相当概念が無いため無条件化

### 2.2 深さ無制限・全プロパティの ref/impl computed style 比較

`run.mjs` の `COLLECT` は `depthMax: 4`。`[data-variant]` ラッパを深さ 0 に数えるため、
`num-circle-deep`（深さ 6）の **3 階層目 `ol` / `li` は computed style 比較の対象外**（pixel diff のみ）。
そこで審査側で深さ無制限・全 CSS プロパティの ref/impl 比較を別途実施した。検出された差は 4 種のみ:

1. `-webkit-mask-position-x/y`（ref `0%` / impl `50%`）… spec/04 §2.1 の除外対象（グリフ描画）。可
2. `counter-reset` / `counter-increment` のカウンタ名（`li` vs `un-li`）… 命名規則どおり。可
3. `note` 系 `li::before` の `height` 21.6094px vs 21.5938px、`transform-origin` の y が 0.0078px 差… 閾値 0.5px 内。可
4. `num-circle` の入れ子 `ul` の `counter-reset`（ref `none` / impl `un-li 0`）… **FAIL 項目 2**

### 2.3 `standalone.mjs` のゲート実験

`dist/_astro/*.css` をスクラッチにコピーして壊し、`CSS_DIR` だけ差し替えた `standalone.mjs` にかけた。
検出できた壊し方（＝ゲートが効いている範囲）:

- ルートの `padding-left` / `list-style` を `.un-content` 配下に移す → NG 検出
- `li` の `margin` / `line-height` を `.un-content` 配下に移す → NG 検出
- `box-sizing` ルール削除 → NG 検出
- `li { position: relative }` 削除 → NG 検出
- バッジの `width` / `height` を `.un-content` 配下に移す → NG 検出（副作用の 29 プロパティ経由）

検出できなかった壊し方は FAIL 項目 1 に記す。

## 3. FAIL 項目（実装者への指示）

### FAIL 1. `scripts/audit/standalone.mjs` が依然ゲートとして機能していない（審査ツールの不備）

以下 3 種の壊し方が **素通り**した。いずれも `.un-content` の外で装飾が明確に破綻するのに `standalone: OK` を返す。

| 壊し方 | 外側での実害（審査側で computed style 実測） | standalone.mjs |
|---|---|---|
| A. `.un-list--num-circle li::before` の `top:-.15em; left:1px` を `.un-content` 配下に移す | バッジ位置が `top:-2.4px / left:1px` → `top:0px / left:32px`。丸が 31px ずれて本文に重なる | **OK（false negative）** |
| B. `.un-list--num-circle ol li::before` / `ul li::before` / `ul li` を `.un-content` 配下に移す | 入れ子バッジが `background transparent / color #04384c / scale(.7)` → `background #04384c / color #fff / scale(.75)`。輪郭バッジが塗りつぶしに戻る（前回 FAIL #2 の症状そのもの） | **OK（false negative）** |
| C. `ol.un-list--note > li` / `> li::before` を `.un-content` 配下に移す | `content` が `"※" counter(un-li)` → `"※"`、`padding-left` が 25.2px → 18px。連番が消える（前回 FAIL #1/#3 の症状） | **OK（false negative）** |

原因は 2 つ。

1. **`IGNORE` が広すぎる。** `top` / `left` / `bottom` / `right` / `width` / `height`（および論理プロパティ）を
   無条件に比較から外しているため、疑似要素の位置・寸法という「装飾そのもの」の `.un-content` 依存を
   構造的に検出できない（A）。これらはラッパ幅の違いによる差ではなく、パーツ CSS が決めるべき値。
   少なくとも `position: absolute` な疑似要素については比較対象に戻すこと。
2. **サンプルが 17 バリアント中 3 個（`check` / `num-circle` / `note`）しかない。**
   `num-circle` サンプルは入れ子なし、`note` サンプルは `ul` のみ。
   結果として **今回修正した `ol.un-list--note` 系・`num-circle` の入れ子系・`[reversed]` 系は 1 つもゲートを通っていない**（B, C）。
   さらに `SAMPLES` のセレクタが `'li'` 固定で `document.querySelector` の先頭要素しか見ないため、
   入れ子の `li` とルート要素（`ul` / `ol` 自身）は一切測定されていない。

**指示**: `SAMPLES` を spec/parts/list.md §3 の 17 バリアント全部（他パーツも同様に全バリアント）に広げ、
測定対象をルート要素を含む部分木全体（`querySelectorAll('*')` 相当）に変え、
`top` / `left` / `width` / `height` を無条件 IGNORE から外す。
修正後、上記 A / B / C の 3 実験で `standalone: FAIL` が出ることを実装者自身が確認してから再提出すること。

補足: 審査側で「部分木全体 × 全プロパティ × 17 バリアント」版を書いて現行実装を検査したところ、
**装飾つき 6 スタイルには `.un-content` 依存は 1 件も無かった**（＝実装は正しい。ゲートだけが穴だらけ）。
なお `default` / `ordered-default` は `padding-left` / `li` の `position` / `line-height` が `.un-content` 依存だが、
これは spec §3 で「A1 の既定」と定義されたバリアントであり、
spec/01 §3 の「素の要素の既定は `.un-content` の中に閉じる」に沿った意図的な設計。可とする。

### FAIL 2. `num-circle` の入れ子 `ul` に余計な `counter-reset` が付く

- 対象: `num-circle-ul` @375/768/1200 の `ol > li > ul`、`num-circle-deep` @375/768/1200 の `ol > li > ul`
- プロパティ: `counter-reset`
- 参照値 `none` → 実装値 `un-li 0`
- 原因: `src/styles/parts/list.css`

  ```css
  .un-list--num-circle :where(ul, ol) {
    counter-reset: un-li;
  }
  ```

  参照は `.is-style-num_circle ol { counter-reset: li }` で **`ol` のみ**。`ul` は含まない。
  `:where(ul, ol)` にしたため、参照がリセットしない入れ子 `ul` にもカウンタスコープが生まれている。
- 修正: `counter-reset` は `.un-list--num-circle ol { counter-reset: un-li }` に分離すること
  （直前の `padding-left: 0; list-style: none` のほうは参照も `ol, ul` 両方なので `:where(ul, ol)` のままでよい）。
- 影響: 17 バリアントの範囲では描画差は出ない（`ul li::before` が `counter-increment: none` / `content: ""` のため）。
  ただし参照と異なる宣言であり computed style に差として現れる。
- 検出漏れの理由: `run.mjs` の `STYLE_PROPS` に `counter-reset` / `counter-increment` が無く
  （疑似要素側の採取リストにだけ追加されている）、要素の `counter-reset` は比較されていない。

## 4. 目視所見

`audits/list/shots/` を全 17 バリアント × 3 viewport で確認（ref / impl / diff）。

- `num-circle-deep`: ol→ul→ol の 3 階層が ref/impl とも「塗りバッジ → 中黒 → 極小リング」で完全一致。
  spec §3 の「ol→ul→ol でそれぞれの見た目になる」という記述は、実際の参照挙動
  （3 階層目は `ul li::before` が後勝ちして番号が出ない極小リング）とややズレた表現。実装は参照に忠実。
- `num-circle-reversed`: 外側が `-1` `-2`（SWELL の `counter-increment: li -1` に由来する挙動）、入れ子は `1` `2`。ref/impl 一致。
- `note-reversed`: `※-1` `※-2` で一致。`note-ordered-nested`: 入れ子の `※` に番号が付かない点まで一致。
- check / good / bad / triangle のグリフ: 実装（SVG）が参照（icomoon）よりわずかに太い。
  spec/04 §4 の "icon-shape" に該当し FAIL 理由にしない。ink Δ は全 viewport で閾値内。
- `check-nested` の入れ子ドット、`num-circle-ul` の中黒、折り返し 2 行目のぶら下げ位置、いずれも一致。
- ※ と連番は文字描画のため pixel diff からグリフ除外されておらず、それでも diff 0。位置・字送りとも完全一致。
- 影・グラデーション・吹き出し三角等はこのパーツに無し。

## 5. 仕様適合

- **バリアント網羅**: OK。spec §3 の 17 バリアントが `src/pages/catalog/list.astro` と
  `reference/fixtures/list.html` に同名・同順・同ダミーテキストで存在。spec 外のものは無し。
- **props**: OK。`src/components/List.astro` の `interface Props` は spec §2 と一致
  （`style?: 'default'|'note'|'check'|'good'|'bad'|'triangle'|'num-circle'` 既定 `'default'`、
  `ordered?: boolean` 既定 `false`、`class`、`id`、`extends HTMLAttributes<'ul'>`）。
  `num-circle` は常に `ol`（`ordered || style === 'num-circle'`）。`reversed` は `...rest` で透過（dist HTML で確認）。
- **コーディング規則**: OK。`!important` 0 件、`swell` 文字列 0 件、リテラル色は `#fff` と
  mask 用 data URI 内の `%23000` のみ（白/黒の例外）。命名（`un-list--*` / `--_marker` / `--_glyph`）適合。
  詳細度はクラス+属性の列が最大 2（`.un-list--num-circle[reversed] > li::before` 等）で上限内。
  `.un-content` の前置なし。素の要素への無条件既定なし。手書きベンダープレフィックスなし。
  疑似要素の `content` にはすべて「何を描いているか」のコメントあり。
- **クリーンルーム**: OK。`node scripts/audit/cleanroom.mjs` → `cleanroom: OK (1900 reference runs indexed)`。
- **standalone**: 実行結果は `standalone: OK` だが **ゲートとして無効**（FAIL 項目 1）。

## 6. 審査ツールへの申し送り（FAIL 理由に数えないが要修正）

- `run.mjs` の `COLLECT` が `depthMax: 4`。`[data-variant]` ラッパを深さ 0 に数えるため
  `num-circle-deep` の 3 階層目（深さ 5〜6）は computed style 比較の対象外。
  spec/04 §2-4 の「最大深さ 4」がパーツ要素ツリーの深さを指すなら、
  `depthMax` を 6 程度に上げるか `[data-variant]` の子を深さ 0 に数えること。
- `run.mjs` の `STYLE_PROPS` に要素の `counter-reset` / `counter-increment` が無い（FAIL 項目 2 の検出漏れ）。
- `.un-content` 自身の `::before` / `::after` が `box-sizing: content-box`
  （`.un-content ::before` が子孫結合子のため自分自身には効かない）。参照 `.post_content` は `border-box`。
  描画への影響はなく List の責任範囲外だが、Content(A1) 側のセレクタリストに
  `.un-content::before, .un-content::after` を足すのが正確。
  同じ理屈で `list.css` の `.un-list ::before` も `.un-list` 自身の疑似要素には効いていない
  （spec §5 の「`.un-list` 配下」＝子孫の意なので現状で可）。
