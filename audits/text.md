# audit: text  (2026-09-04) — 再審査（4 回目 / 最終確認）

verdict: **FAIL**

参照 = `reference/fixtures/text.html`（SWELL）/ 実装 = `dist/catalog/text/index.html`。
`node scripts/audit/run.mjs text --no-build --port 4405` は **57 セル（19 バリアント × 375/768/1200）すべてで
pixel diff 0.000 % / box Δ 0px / style diff 0**。`cleanroom.mjs` OK、`standalone.mjs` OK。
前回の FAIL 項目（`style` prop のオブジェクト形式）は **完全に解消**していることを実レンダリングで確認した。

**実装（`Mark.astro` / `Text.astro` / `text.css` / `lib/style.ts`）に不備は 1 件も見つからなかった。**
それでも FAIL とするのは、**参照 fixture と spec §3 の記述が食い違っており、その食い違いが
`color-link` / `color-*` バリアントの比較を成立させている**（＝自動判定がすり抜ける穴になっている）ためである。
修正はすべて `spec/parts/text.md` と `reference/fixtures/text.html` 側で、コンポーネントの変更は不要。

---

## 1. 前回 FAIL 項目の解消確認（最優先）

| # | 前回の FAIL | 状態 | 根拠（審査側で実施） |
|---|---|---|---|
| 1 | `style` prop にオブジェクトを渡すと破棄され `style="…;[object Object]"` が出力される | **解消** | `src/lib/style.ts` の `styleToString` / `joinStyles` を両コンポーネントが使用。隔離コピーに検証ページを追加してビルドし、出力 HTML と computed style の両方を実測（下表）|
| 2 | 所見 4: `color-link` の pixel diff の余裕が薄い（0.197〜0.272 %）| **解消** | fixture / カタログとも「その中に置いたリンクのテキストで、色が文字色に追従することを確認します」に伸長済み。`color-link` は 1200 で 1 行の大半を占め、リンクが赤で描画されていることを目視確認 |

### `style` prop 透過の実測

隔離コピー（`scratchpad/probe`、`src` は本体と `diff` 一致）に検証ページを置いてビルドし、出力 HTML を確認した。

| 入力 | 出力 `style` 属性 | 判定 |
|---|---|---|
| `<Text color="red" style="text-decoration:underline;letter-spacing:2px">` | `--un-text-color:var(--un-color-deep-1);--un-color-link:currentColor;text-decoration:underline;letter-spacing:2px` | OK |
| `<Text size="lg" style={{ textDecoration:'underline', letterSpacing:'2px' }}>` | `--un-text-size:var(--un-fz-lg);text-decoration:underline;letter-spacing:2px` | OK（camelCase → kebab-case 変換あり）|
| `<Mark style={{ fontWeight: 900, paddingLeft:'10px' }}>` | `--un-mark-color:var(--un-color-mark-yellow);font-weight:900;padding-left:10px` | OK（数値も可）|
| `<Text color="red" style="--un-text-color:green">` | 後勝ちで computed `color: rgb(0,128,0)` | OK（利用者の上書きが効く）|

computed 実測（vw375 / vw900 とも）: `text-decoration-line: underline`、`letter-spacing: 2px`、`font-weight: 900`、
`padding-left: 10px`、かつ `background-image` / `color` / `font-size` はパーツ側の値を保持。
`style` 属性は 1 個だけ（要素の属性は `class,style` の 2 個のみ）で二重出力なし。`[object Object]` は消滅。

---

## 2. 自動計測（run.mjs / 公式 fixture）

19 バリアント × 3 viewport = 57 セル。**全セルが同値**のため viewport を横に畳んで記載する（値は 375 / 768 / 1200）。

| variant | vw | pixel diff % | box Δ (w/h) | style diffs | pass |
|---|---|---|---|---|---|
| mark-yellow | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| mark-blue | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| mark-green | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| mark-orange | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| color-red | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| color-blue | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| color-green | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| color-main | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| size-xs | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| size-sm | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| size-md | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| size-lg | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| size-xl | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| size-inline | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| color-inline | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| thin | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| mark-wrap | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| nest-size-color | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| color-link | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |

本体リポジトリは他エージェントが `dist` を再ビルドし続けているため、**`src` と `dist` を隔離コピーに固定して再実行**し
（`scratchpad/probe`、port 4451）、同じ 57/57 PASS を再現した。

### 感度確認（審査側で dist の CSS を意図的に破壊）

| 壊し方 | 結果 |
|---|---|
| マーカーの停止位置 `transparent 64%` → `62%` | **検出**。`mark-yellow` / `mark-wrap` など 15 セルが FAIL。ただし pixel diff は 375 で 0.329 % / 0.907 %、**768・1200 では 0.000 %** にとどまり、検出は style diff（`background-image`）に依存した |
| `standalone.mjs`: `.un-mark` → `.un-content .un-mark` | **検出**。19/19 バリアントで `text.css: rule ".un-content .un-mark" depends on .un-content` と `background-image: in=linear-gradient(...) out=none` を報告し `standalone: FAIL (19/19)` |

`run.mjs` / `standalone.mjs` はこのパーツに対して実効性がある。

---

## 3. 審査側で独自に組んだ検証（fixture の穴を疑って）

隔離コピーに SWELL 参照ページと uneri ページを新規に作り、同一 ID を振って computed style と bounding box を突き合わせた。
**12 ケース × 375/1200 = 24 セル、比較プロパティ 14 種 + box、全て一致（差分 0）。**

| ケース | 参照マークアップ | 実装 | 結果 |
|---|---|---|---|
| 色付きの中のマーカー | `.font_col_red.swl-inline-color > .mark_yellow` | `<Text color="red"><Mark>` | 一致 |
| サイズの入れ子 | `.u-fz-l > .u-fz-s` | `<Text size="lg"><Text size="sm">` | 一致（二重 em なし）|
| マーカーの中のテキスト | `.mark_orange > .u-fz-l.font_col_red` | `<Mark color="orange"><Text size="lg" color="red">` | 一致（内側に背景が漏れない: `background-image: none`）|
| 全部盛り | `.u-fz-l.u-thin.font_col_blue.swl-inline-color` | `<Text size="lg" color="blue" thin>` | 一致 |
| 任意色マーカー | `.mark_yellow` + inline gradient `#abcdef` | `<Mark color="#abcdef">` | 一致 |
| 薄字の入れ子 | `.u-thin > .u-thin` | `<Text thin><Text thin>` | 一致（参照と同じ合成結果）|
| サイズの中の色 | `.u-fz-xl > .font_col_green` | `<Text size="xl"><Text color="green">` | 一致 |
| 素の `<Text>` を色付き `<Text>` の中に | 素の `span` | `<Text size="xl" color="blue"><Text>` | 一致（`--un-text-*: initial` のリセットが効き、font-size 25.6px / color が外側と同値）|

さらに `.un-content` の外（`color/font-family/font-size/font-weight/line-height` だけを与えた素の div）でも実測。

| 項目 | 値 | 判定 |
|---|---|---|
| `.un-mark` background-image | `linear-gradient(rgba(0,0,0,0) 64%, rgb(252,246,159) 0%)`（container 内と同値）| OK |
| `.un-mark` box-sizing | `border-box` | OK（spec §5「`.un-content` の外でも同じ寸法」を満たす）|
| `.un-text` font-size / color | vw375 `16.875px` / `rgb(228,65,65)`、vw900 `20px` / 同（container 内と同値）| OK |
| `.un-text--thin` opacity | `0.8` | OK |
| 色付き `Text` の中の `a` の color | **`rgb(0,0,238)`（UA 既定）**。container 内は `rgb(228,65,65)` | **NG → FAIL 3** |

---

## 4. FAIL 項目（実装者への指示）

> いずれも **spec / fixture の修正**であり、`Mark.astro` / `Text.astro` / `text.css` の変更は不要。

1. **`spec/parts/text.md` §3 の `color-link` 行の「参照クラス」が実 fixture と食い違う（spec 不備）。**
   - spec §3: `color-link` の参照クラスは **`.font_col_red` + `a`**。
   - 実 fixture `reference/fixtures/text.html`（`color-link` の行）: `<span class="font_col_red swl-inline-color">` と、
     **`.swl-inline-color` が追加で付いている**。
   - この差は装飾ではなく**判定結果を左右する**。審査側で SWELL CSS に直接あてて実測した値:

     | 参照マークアップ | span の color | 中の `a` の color |
     |---|---|---|
     | `.font_col_red` 単独 | `rgb(228,65,65)` | **`rgb(17,118,212)`（青のまま）** |
     | `.font_col_red.swl-inline-color` | `rgb(228,65,65)` | `rgb(228,65,65)` |

     根拠 CSS: `reference/swell/build/css/main.css` は `.font_col_red{color:var(--color_deep01)!important}` だけで
     `--color_link` を触らず、`--color_link:currentcolor` を設定するのは `.swl-inline-color{--color_link:currentcolor}` のみ。
   - つまり **spec §3 に書かれたとおりの参照マークアップ（`.font_col_red` 単独）だと、
     参照はリンクが青・実装は赤になり `color-link` は FAIL する**。現状は fixture が spec より広い
     クラスを黙って足しているため PASS しているだけで、比較の根拠が spec 上に存在しない。
   - 指示: 次のどちらかに統一し、spec §3 の表・§2 の記述・fixture を一致させること。
     - (a) uneri の「`color` 指定時は常にリンクが追従する」を仕様として維持するなら、
       spec §3 の `color-link` 行の参照クラスを `.font_col_red` + `.swl-inline-color` + `a` に直し、
       さらに `color-red` / `color-blue` / `color-green` / `color-main` の fixture にも `.swl-inline-color` を併記して
       「uneri の named color = SWELL の `.font_col_*` + `.swl-inline-color`」という対応を spec に明記する。
     - (b) SWELL の `.font_col_*` 単独に厳密に合わせるなら、`Text.astro` の `--un-color-link:currentColor` を
       named color（red/blue/green/main）では出さず、任意色（`.swl-inline-color` 相当）のときだけ出す。

2. **`color-red` / `color-blue` / `color-green` / `color-main` バリアントがリンクを含まないため、
   上記 1 の挙動差が自動判定を素通りする（fixture 不備）。**
   - 現在の 4 バリアントは `<span>色付きのテキスト</span>` のみで `a` を含まない。そのため
     「uneri の named color はリンクを赤にする / SWELL の `.font_col_red` はしない」という
     **実在する挙動差が pixel にも style diff にも一切現れない**。
   - 指示: 1 の (a)(b) いずれを選ぶ場合でも、`color-*` のうち最低 1 つ（または新規バリアント）に
     `a` を含め、選んだ仕様どおりの参照クラスを fixture に書くこと。
     spec/04-audit.md §2.0 の「そのスタイルの定義的な性質が出るダミーテキストを選ぶこと」が
     この 4 バリアントで満たされていない。

3. **`spec/parts/text.md` §2 の「`color` 指定時にリンク色が追従」が `.un-content` 外では成立しない（spec 不備）。**
   - `Text` は `--un-color-link:currentColor` を出すが、それを消費するのは
     `src/styles/base.css:49` の `.un-content :where(a) { color: var(--un-color-link) }` だけ。
   - 審査側の実測（`.un-content` の外に置いた `<Text color="red"><a href="#">…</a></Text>`）:
     リンクの computed color は **`rgb(0,0,238)`（UA 既定）**。container 内は `rgb(228,65,65)`。
   - spec/01-coding-rules.md §2.4「margin 以外の見た目は `.un-content` に依存しない」に対し、
     spec/parts/text.md §2 が API 契約として書いた挙動が container 依存になっている。
   - `standalone.mjs` はこの依存を検出できない（消費側の規則が `src/styles/parts/*.css` ではなく `base.css` にあり、
     検査対象外のため）。前回審査でも所見 2 として記録されたが未処置。
   - 指示: spec §2 に「`.un-content` の中でのみ」と明記して契約を実装に合わせるか、
     `text.css` 側で `.un-text a` の色も引き受けるかを決めること。

---

## 5. 目視所見

- `audits/text/shots/` を確認（`mark-yellow` `mark-orange` `mark-wrap` `size-xl` `nest-size-color` `color-link` を
  375 / 768 / 1200 で ref / impl / diff とも）。マーカーの位置（行の下 36 %）・太さ・折り返し 2 行目への追従、
  テキストの折り返し位置、色、薄字の濃度いずれも参照と区別がつかない。diff は全面黒。
- `mark-wrap` @375: 参照・実装とも 2 行それぞれの下端にマーカーが付き、行末での途切れ方も一致。
- `nest-size-color` @768: 内側の赤いテキストが外側の 1.25em を二重に受けず、字面幅が一致。
- `color-link` @1200: リンクが `#e44141`・下線なしで参照と一致。伸長後は 1 行の大半を占め pixel でも十分に効く。
- `mark-orange` @1200: グラデーションの向き（下方向）と停止位置、色ともに一致。
- 疑似要素による装飾はこのパーツにないため、形状・影の観点は該当なし。

## 6. 仕様適合

- **バリアント網羅**: OK。spec §3 の 19 バリアントが過不足なくカタログにあり、fixture と
  バリアント名・順序・ダミーテキストが完全一致。spec にないバリアントもなし。
- **props**: OK。`Mark { color = 'yellow', class?, id? }` / `Text { size?, color?, thin = false, class?, id? }` が
  spec §2 と型・既定値とも一致。`(string & {})` による任意値、`extends HTMLAttributes<'span'>` の rest spread、
  トークン写像（`--un-color-mark-*` / `--un-color-deep-1..3` / `--un-color-main` / `--un-fz-*`）も §5 と一致。
  `style` はオブジェクト・文字列とも透過（§1 参照）。依存トークンは全て `tokens.css` に実在。
- **コーディング規則**: OK。`text.css` の全セレクタを数え直し、**最大 `(0,1,0)`**
  （`.un-mark` / `.un-text` / `.un-text--thin` と `::before` / `::after` の box-sizing 群のみ。`(0,2,0)` 超はゼロ）。
  `!important` なし、`un-` 接頭辞 + BEM、`swell` 文字列なし、リテラル hex なし（色は全てトークン経由）、
  単位は `em`、`.un-content` 前置なし、ベンダープレフィックスなし、`class:list` 使用、
  `interface Props` あり、frontmatter に spec ポインタ、ルート要素 1 つ、`id` prop あり、
  `src/index.ts` に `Mark` / `Text` の re-export あり。
- **クリーンルーム**: OK（`cleanroom: OK (1900 reference runs indexed)`）。
- **standalone**: OK（`standalone: OK (133 variants, 231 rules)`）。感度確認済み（§2）。

## 7. 所見（FAIL 理由にはしない）

1. `.un-mark` は `background-image` 単独指定、参照は `background` ショートハンド。参照は `background-color` /
   `-position` / `-size` / `-repeat` も同時にリセットするが uneri はしない。公式・独自 fixture のいずれでも差は出ず
   （span に他の背景がないため）、副作用は uneri の方が小さいので現状で可。
2. `run.mjs` の pixel diff 閾値 0.3 % は、マーカーのような低コントラスト装飾の退行に対して単独では不十分
   （停止位置を 2 % ずらす退行で 768/1200 の pixel diff は 0.000 %）。実効的な検出は computed style 差分が担っている。
   閾値そのものは spec どおりなので指摘に留める。

## 8. 審査中の後始末

破壊テストと独自 fixture は **すべて隔離コピー（`scratchpad/probe`、`node_modules` と `reference` は symlink）** で行い、
本体リポジトリの `src` / `reference` / `spec` は一切変更していない
（`src/styles/parts/text.css` ほか 8 ファイルを `diff` で一致確認済み）。
本体で実行したのは `run.mjs`（`audits/text/` の出力更新のみ）、`cleanroom.mjs`、`standalone.mjs` の読み取り系だけ。
