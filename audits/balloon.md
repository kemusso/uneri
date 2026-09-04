# audit: balloon  (2026-09-04) — 再審査（4 回目 / 最終確認）

verdict: **FAIL**

参照 = `reference/fixtures/balloon.html`（SWELL）/ 実装 = `dist/catalog/balloon/index.html`。
`node scripts/audit/run.mjs balloon --no-build --port 4406` は **33 セル（11 バリアント × 375/768/1200）すべてで
pixel diff 0.000 % / box Δ 0px / style diff 0**。`cleanroom.mjs` OK、`standalone.mjs` OK。
前回 FAIL の 2 件（spec の依存トークン誤記 / `--_outline-*` の入れ子リセット）は **どちらも解消**を確認した。

しかし **`--_outline-*` で塞いだのと同じ「修飾子が子孫セレクタで入れ子のふきだしに漏れる」欠陥が、
`--square` / `--think` / `--border` の 3 か所に残っている**。参照 SWELL は同じ箇所を子結合子または複合セレクタで
書いており漏れないため、これは参照との実挙動差である。カタログに入れ子バリアントがないため
自動計測（`run.mjs` / `standalone.mjs`）はこの 3 件を一切検出できない。よって FAIL とする。

---

## 1. 前回 FAIL 項目の解消確認（最優先）

| # | 前回の FAIL | 状態 | 根拠 |
|---|---|---|---|
| 1 | `spec/parts/balloon.md` L5 の依存トークン `--un-color-border-thin` が存在しない | **解消** | 現行 spec の依存トークンは `--un-color-balloon-*-bg` / `--un-color-balloon-*-line` / `--un-color-balloon-icon-border` / `--un-color-text` / `--un-radius-balloon` の 5 種で、**全て `src/styles/tokens.css` に実在**（L30-40, L107, L7）。`--un-color-border-thin` の文字列はプロジェクト内に無し |
| 2 | `--_outline-*` が `.un-balloon` でリセットされず、入れ子で外側の `border` が内側の `think` に漏れる | **解消** | 隔離コピーで「`border` のふきだしの中に `think` のふきだし」を実際に組んで computed 実測。内側の丸 2 個とも `border-top-width: 0px`（`border-radius: 50%` は維持）。`.un-content` の外に置いた素の `think` でも `0px` |
| 3 | 詳細度 `(0,3,0)` | **解消（前回確認済み・再確認）** | `balloon.css` の全 31 ルール・全セレクタを数え直し、**最大 `(0,2,0)`**（一覧は §6）|

---

## 2. 自動計測（run.mjs / 公式 fixture）

11 バリアント × 3 viewport = 33 セル。**全セルが同値**のため viewport を横に畳んで記載する（値は 375 / 768 / 1200）。

| variant | vw | pixel diff % | box Δ (w/h) | style diffs | pass |
|---|---|---|---|---|---|
| left | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| right | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| think | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| border | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| square | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| col-red | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| col-blue | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| col-green | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| col-yellow | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| think-border | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |
| rich | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 | OK |

本体リポジトリは他エージェントが `dist` を再ビルドし続けているため、**`src` と `dist` を隔離コピーに固定して再実行**し
（`scratchpad/probe`、port 4452）、同じ 33/33 PASS を再現した。

### 感度確認（審査側で dist の CSS を意図的に破壊）

| 壊し方 | 結果 |
|---|---|
| `.un-balloon__tail` の `top:16px` → `15px` | **検出**。33/33 セルが FAIL（style diff 各 2 件）。ただし **pixel diff は `left` @375/768/1200 で 0.000 %**、`border` でも 0.011〜0.026 % にとどまった。しっぽが `#f7f7f7` on 白でコントラストが低く、pixel だけでは形状の 1px ずれを拾えない |
| `standalone.mjs`: `.un-balloon__text` → `.un-content .un-balloon__text` | **検出**。全バリアントで `balloon.css: rule ".un-content .un-balloon__text" depends on .un-content` に加え、CRITICAL 経由でも `position: in=relative out=static` / `background-color: in=rgb(247,247,247) out=rgba(0,0,0,0)` / `border-radius: in=8px out=0px` / `padding-top: in=15.2px out=0px` を報告し `standalone: FAIL` |

---

## 3. 審査側で独自に組んだ検証

### 3.1 掛け合わせ・style prop・container 外（すべて合格）

隔離コピーに検証ページを置いてビルドし、computed で実測（vw375 / vw900）。

| 検証 | 結果 |
|---|---|
| `dir=right` × `tail=think` × `border` × `shape=square` × `color=green` の全部盛り | `flex-direction: row-reverse` / `img border-radius 0px, border 0px` / `text bg rgb(209,248,194)`, `border 1px rgb(157,221,147)` / tail `transform: matrix3d(-1,0,0,0, 0,1,0,0, 0,0,-1,0, 0,0,0,1)`（= `rotateY(180deg)`）・`right:0` / 丸 `1px solid rgb(157,221,147)`・8×8 と 12×12 / body `padding-top` 8px(<600)・16px(>=600)。すべて spec §5 どおり |
| `style` prop（文字列）| `--un-balloon-bg` / `-line` の後ろに連結。属性は 1 個 |
| `style` prop（オブジェクト）| `margin-top:30px` / `opacity:0.5` が適用され、パーツの custom property も保持。属性は `class,style` の 2 個のみ |
| `style` で `--un-balloon-bg:lime` を上書き | 利用者の値が後勝ち（computed `rgb(0,255,0)`）。線色は `color="red"` の `rgb(244,135,137)` のまま |
| 任意色 `color="#ffeeaa"` | `bg rgb(255,238,170)` / `line rgb(204,204,204)`（既定の灰）。spec §7 どおり |
| `icon` 省略 | アイコン枠ごと出力されない。本体のレイアウトは崩れない |
| `.un-content` の外（素の div）| icon 60/80px、img 60/80px、body padding `4px 24px` / `8px 24px`、text padding `12.825px` / `16px`、radius 8px、bg `rgb(247,247,247)`、max-width 560px、`__text > p` の margin 0/0、name font-size 10px、think の body padding-top 8/16px、think の丸の border 0px。**container 内と完全一致** |

### 3.2 入れ子の参照突き合わせ（**ここで 3 件の差分**）

`reference/fixtures/balloon.html` と同じ SWELL クラスで「ふきだしの中にふきだし」を組んだ参照ページと、
`<Balloon>` の slot に `<Balloon>` を入れた実装ページを作り、内側の要素の computed style を 1:1 で突き合わせた（vw1200）。

| 対象 | 参照 | 実装 | 判定 |
|---|---|---|---|
| `inner speech: __text`（border の中の非 border）| border-top-width 1px | 1px | 一致（参照も漏れる）|
| `inner speech: tail wrapper` | 一致 | 一致 | OK |
| `inner speech: tail before` | left -8px | -8px | 一致（参照も漏れる）|
| **`inner speech: tail after`** | **display none / 0×0 / right auto** | **display block / 10×16px / right 0px** | **NG（FAIL 3）** |
| `inner speech: body` | 一致 | 一致 | OK |
| **`inner circle: icon img`**（square の中の circle）| **2px solid rgb(236,236,236) / radius 50%** | **0px none rgb(51,51,51) / radius 0px** | **NG（FAIL 1）** |
| **`inner plain: body`**（think の中の speech）| **padding-top 8px / height 80px** | **padding-top 16px / height 81.59px** | **NG（FAIL 2）** |
| `inner plain: tail before` | 一致 | 一致 | OK |
| `inner plain: tail after` | display none | display block | NG（FAIL 3 と同一原因の派生）|

スクリーンショットでも確認済み（`scratchpad/nested/{ref,impl}{,-sq,-th}.png`）:
`square` の中の `circle` アイコンが参照では丸+2px リング、実装では角の四角。
`border` の中の非 border ふきだしに、実装だけ灰色の輪郭しっぽが生える。

---

## 4. FAIL 項目（実装者への指示）

いずれも **修飾子クラスを子孫セレクタ（スペース）で下ろしているため、slot に入れた内側のふきだしにも当たる**のが原因。
参照 SWELL は同じ箇所を子結合子または「同じ要素上の複合セレクタ」で書いており漏れない。
前回導入した `--_outline-*`（`.un-balloon` で初期化 → 修飾子で切り替え）と同じ方式で塞げる。

1. **`square` のふきだしの中に入れたふきだしのアイコンが四角になる。**
   - 該当: `src/styles/parts/balloon.css` の `.un-balloon--square .un-balloon__img { border: 0; border-radius: 0; }`
   - 参照: `blocks.css` の `.-circle>.c-balloon__iconImg{border:2px solid #ececec;border-radius:50%}`
     — **子結合子**で自分のアイコン枠にだけ適用するため、入れ子の内側は自分の `-circle` で丸のまま。
   - 実測（vw1200・`square` の中に既定の `circle`）:
     border-top-width 参照 `2px` → 実装 `0px` / border-top-style `solid` → `none` /
     border-top-color `rgb(236,236,236)` → `rgb(51,51,51)` / border-top-left-radius `50%` → `0px`。
   - 修正方針: `.un-balloon--square > .un-balloon__icon > .un-balloon__img` にする（詳細度 (0,2,0) のまま）、
     または `--_img-radius` / `--_img-border-width` を `.un-balloon` で初期化して `.un-balloon--square` で切り替える。

2. **`think` のふきだしの中に入れたふきだしの body に、余分な上余白が付く。**
   - 該当: `.un-balloon--think .un-balloon__body { padding-top: 8px; }` と
     `@media (min-width:600px) { .un-balloon--think .un-balloon__body { padding-top: 16px; } }`
   - 参照: `.c-balloon__body.-thinking{padding-top:8px}` / `@media(min-width:600px){.c-balloon__body.-thinking{padding-top:16px}}`
     — **同じ要素上の複合セレクタ**なので入れ子には掛からない。
   - 実測（vw1200・`think` の中に既定の speech）:
     内側 `__body` の padding-top 参照 `8px` → 実装 `16px`、要素高さ 参照 `80px` → 実装 `81.5938px`（box Δ 1.59px）。
   - 修正方針: `.un-balloon--think > .un-balloon__body`（子結合子）にする。

3. **`border` のふきだしの中に入れた非 border のふきだしに、線色の輪郭しっぽが出る。**
   - 該当: `.un-balloon--border .un-balloon__tail > :last-child { display: block; width: 10px; height: 16px; }`
   - 参照: 内側は自分の `__body` に `-border-none` を持ち、`.-speaking.-border-none .c-balloon__after{display:none}`
     が勝つため **`display:none` / 0×0** のまま。
   - 実測（vw1200）: display 参照 `none` → 実装 `block`、width `0px` → `10px`、height `0px` → `16px`、right `auto` → `0px`。
   - 修正方針: `.un-balloon--border > .un-balloon__body > .un-balloon__text > .un-balloon__tail > :last-child` は
     詳細度が (0,5,0) になって規則違反なので不可。`--_outline-*` と同じく
     `--_tail-outline-display` / `--_tail-shift` のような内部 custom property を `.un-balloon` で初期化し、
     `.un-balloon--border` で切り替えて `.un-balloon__tail > :last-child` 側で読む形にすること。
   - 併せて `.un-balloon--border .un-balloon__text{border:1px …}` と
     `.un-balloon--border .un-balloon__tail > :first-child{left:-8px}` も入れ子に漏れるが、
     **参照 SWELL も同じ漏れ方をする**（`.-border-on .c-balloon__text` / `.-speaking.-border-on .c-balloon__before` はいずれも
     祖先マッチ）ため、参照との差はゼロ。上と同じ方式に揃えるかは任意（FAIL 理由には含めない）。

4. **カタログ / spec §3 に入れ子バリアントが無く、上記 1〜3 が自動判定を素通りする（spec・fixture 不備）。**
   - `run.mjs` は `[data-variant]` 単位で 11 バリアントを比較するだけで、`standalone.mjs` も
     カタログの `innerHTML` を使うため、入れ子は一度も描画されない。
     上記 3 件はいずれも pixel 0.000 % / box Δ 0 / style diff 0 のまま通過した。
   - 一方 spec §5 は think のしっぽについて「ふきだしごとに `.un-balloon` で初期化し、**入れ子に漏らさない**」と
     明記しており、入れ子の非漏洩はこのパーツの要件になっている。要件があるのに測る場所がない。
   - 指示: spec §3 に入れ子バリアントを追加し（例: `nest-in-border` = `border` の中に既定のふきだし、
     `nest-in-square` = `square` の中に `circle`、`nest-in-think` = `think` の中に speech）、
     `reference/fixtures/balloon.html` にも対応する SWELL マークアップ
     （内側は `-speaking -border-none` / `-circle` を自分で持つ）を追加すること。

---

## 5. 目視所見

- `audits/balloon/shots/` を確認（`left` `right` `think` `border` `square` `col-yellow` `think-border` `rich` を
  375 / 768 / 1200 で ref / impl / diff とも）。diff は全面ほぼ黒。
- しっぽの形: `speech` は 10×16 の三角で頂点位置・角度とも一致。`border` では線色の三角が 1px 分だけ外側にはみ出す
  二重線になり、参照と同じ。
- `think` のしっぽ: 8px と 12px の丸 2 つ、位置（左 -21px / -16px、上 0 / 8px）とも一致。
  `think-border` では両方の丸に 1px の輪郭が付き、参照と区別がつかない。
- `right`: アイコンが右、しっぽが右向きに鏡像化され、本文が右寄せ。参照と一致。
- `square`: アイコンの角丸と 2px リングが消え、参照と一致。
- `rich`: 見出し・段落 2 つ・リストの縦位置、段落間の詰まり（`__text > p` の margin 0）、
  折り返し位置が参照と一致。ふきだしの高さも一致。
- 375 でアイコン 60px、768/1200 で 80px に切り替わることを画像上でも確認。
- **入れ子（§3.2）だけは目視でも明確に異なる**（§4 参照）。

## 6. 仕様適合

- **バリアント網羅**: OK。spec §3 の 11 バリアントが過不足なくカタログにあり、fixture と
  バリアント名・順序・ダミーテキストが完全一致。spec にないバリアントもなし。
- **props**: OK。`icon?` / `name?` / `dir='left'` / `shape='circle'` / `tail='speech'` / `border=false` /
  `color='gray'` / `class?` / `id?` と `extends HTMLAttributes<'div'>` が spec §2 と完全一致。
  boolean は肯定形（`border`）、状態はクラスでなく修飾子、色は custom property 経由、`style` は透過。
  依存トークン 5 種すべて `tokens.css` に実在。
- **コーディング規則**: OK。`balloon.css` の全 31 ルールのセレクタを数え直し、**最大 `(0,2,0)`**
  （`.un-balloon--square .un-balloon__img` / `.un-balloon--border .un-balloon__text` /
  `.un-balloon--right .un-balloon__tail` / `.un-balloon--think .un-balloon__tail > *` 等。
  `:first-child` / `:last-child` は spec/01 §3 により数え上げから除外。`.un-balloon__text > p` は (0,1,1)）。
  `!important` なし、`un-` 接頭辞 + BEM、`swell` 文字列なし、リテラル hex なし（色は全てトークン／`currentColor`）、
  境界線は px・余白は em/px（参照が px 固定の値のみ px）、`@media` は `min-width` のみ（モバイルファースト）、
  ベンダープレフィックス手書きなし、疑似的な装飾要素に説明コメントあり、`class:list` 使用、
  `interface Props` あり、frontmatter に spec ポインタ、ルート要素 1 つ、`id` prop あり、
  装飾用の `.un-balloon__tail` に `aria-hidden="true"`、`img alt=""`。
  `src/index.ts` に `Balloon` の re-export、`src/styles/index.css` に `parts/balloon.css` の import あり。
  ただし**上記 (0,2,0) の子孫セレクタが FAIL 1〜3 の原因**であり、規則違反ではないが設計としては要修正。
- **クリーンルーム**: OK（`cleanroom: OK (1900 reference runs indexed)`）。
- **standalone**: OK（`standalone: OK (133 variants, 231 rules)`）。感度確認済み（§2）。ただし入れ子は検査対象外（FAIL 4）。

## 7. 所見（FAIL 理由にはしない）

1. **`--un-balloon-line` は custom property なので子孫に継承する。**
   名前付き色のふきだし（例 `color="red"`）の中に任意色のふきだし（例 `color="#ffeeaa"`）を入れると、
   内側は `--un-balloon-line` を出さないため外側の赤い線色を継承し、
   spec §7 の「名前以外の色を渡した場合は…線色は既定（灰）のまま」と厳密には食い違う。
   単体で置いた場合は灰（`rgb(204,204,204)`）で正しいことを実測済み。
   `--un-<part>-<name>` は spec/01 §2.2 で「パーツが受け取る調整値」＝公開の調整口なので、
   継承すること自体は設計どおりとも読める。仕様として明記するかを決めておくのが望ましい。
2. **`run.mjs` の pixel diff 閾値 0.3 % はしっぽの退行に対して無力。**
   しっぽを 1px 上にずらす退行で `left` の pixel diff は 375/768/1200 とも 0.000 %。
   `#f7f7f7` on 白のコントラストが `pixelmatch` の `threshold: 0.1` を下回るため。
   実効的な検出は computed style 差分だけが担っている。閾値は spec どおりなので指摘に留める。
3. `.un-balloon *` が slot に入った任意の内容にまで `box-sizing: border-box` を強制する。
   参照 SWELL も全体リセットで border-box なので差はないが、他パーツを slot に入れたときに効く点は把握しておくとよい。

## 8. 審査中の後始末

破壊テストと独自 fixture は **すべて隔離コピー（`scratchpad/probe`、`node_modules` と `reference` は symlink）** で行い、
本体リポジトリの `src` / `reference` / `spec` は一切変更していない
（`src/styles/parts/balloon.css` ほか 8 ファイルを `diff` で一致確認済み）。
本体で実行したのは `run.mjs`（`audits/balloon/` の出力更新のみ）、`cleanroom.mjs`、`standalone.mjs` の読み取り系だけ。
