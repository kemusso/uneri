# audit: button  (2026-09-04, 4 回目)

verdict: **FAIL**

実装（`src/components/Button.astro` / `src/styles/parts/button.css`）には不適合を検出できなかった。
FAIL の理由は fixture と `scripts/audit/run.mjs` の不備 1 件（spec が定めた値を審査系が原理的に検証できない）。

## 前回 FAIL 項目の再検証

| # | 前回の指摘 | 結果 |
|---|---|---|
| 1 | spec に `83%` が残存（参照の keyframes は 84%）| **解消**。`grep -rn "83%" spec/` は 0 件。`spec/parts/button.md:99` は 84% / 85%、`src/styles/parts/button.css:158-159` も `0%, 84%` / `85%`。参照 `reference/swell/main.css` の `@keyframes shiny_btn` は `0%` / `84%` / `85%` / `to`（`scale(50)`）で完全一致 |
| 2 | `Button.astro` が `--un-button-color` / `--un-button-color-dark` を受け取れない（`style` prop がバリアント名に占有）| **解消**。バリアントは `variant` prop に改名され、`style` は HTML の style 属性としてラッパーに出る。実ビルドで検証済み（下記）|

### 2 の実ビルド検証

審査用の複製ツリー（`/private/tmp/.../uneri-test`、本体ツリーは未変更）にプローブページを置いて `astro build` した結果:

| 入力 | 出力 HTML | 実行時 computed |
|---|---|---|
| `<Button variant="solid" color="#e35" colorDark="#911">` | `<div class="un-button un-button--solid" style="--un-button-color:#e35;--un-button-color-dark:#911">` | link `background-color: rgb(238,51,85)` / `box-shadow: rgb(153,17,17) 0px 4px 0px 0px` |
| `<Button style={{letterSpacing:'0.2em'}}>` | `<div class="un-button un-button--normal" style="letter-spacing:0.2em">` | ラッパー `letter-spacing: 3.2px` |
| `<Button variant="solid" color="#e35" colorDark="#911" style="opacity:.5">` | `style="--un-button-color:#e35;--un-button-color-dark:#911;opacity:.5"` | ラッパー `opacity: 0.5`、色は上と同じ |
| `<Button style="--un-button-color:#0a0">` | `style="--un-button-color:#0a0"` | link `background-color: rgb(0,170,0)` |
| `<Button color="red" size="l" align="left" id="theid" class="mycls">` | `<div id="theid" class="un-button un-button--normal un-button--l un-button--red un-button--left mycls">` | `min-width: 80%`（@1200）、`background-color: rgb(247,74,74)` |
| `<Button sponsored>` | `<a … rel="nofollow sponsored noopener" target="_blank">` | — |

`style` 属性の二重出力なし。`joinStyles` / `styleToString` は文字列・オブジェクト両方を正しく連結する。
他パーツも `variant` へ移行済み（`Box` / `List` / `Step` / `Heading` が `variant?:`、`Balloon` / `Mark` / `Text` は `styleToString` 経由）。カタログ・spec に旧 `style=` バリアント指定の取り残しなし。

## 自動計測（`node scripts/audit/run.mjs button --no-build --port 4404`）

16 バリアント × 3 viewport × {通常, hover} = 96 行すべて pixel diff 0 / box Δ 0 / style diff 0。
`audits/button/shots/*-diff.png` 96 枚を走査し、差分ピクセル（赤）は合計 0 px。

| variant | vw | pixel diff % | box Δ (w/h) | style diffs | pass |
|---|---|---|---|---|---|
| normal | 375 | 0 | 0/0 | 0 | ✅ |
| normal-hover | 375 | 0 | 0/0 | 0 | ✅ |
| solid | 375 | 0 | 0/0 | 0 | ✅ |
| solid-hover | 375 | 0 | 0/0 | 0 | ✅ |
| line | 375 | 0 | 0/0 | 0 | ✅ |
| line-hover | 375 | 0 | 0/0 | 0 | ✅ |
| shiny | 375 | 0 | 0/0 | 0 | ✅ |
| shiny-hover | 375 | 0 | 0/0 | 0 | ✅ |
| size-s | 375 | 0 | 0/0 | 0 | ✅ |
| size-s-hover | 375 | 0 | 0/0 | 0 | ✅ |
| size-l | 375 | 0 | 0/0 | 0 | ✅ |
| size-l-hover | 375 | 0 | 0/0 | 0 | ✅ |
| color-red | 375 | 0 | 0/0 | 0 | ✅ |
| color-red-hover | 375 | 0 | 0/0 | 0 | ✅ |
| color-blue | 375 | 0 | 0/0 | 0 | ✅ |
| color-blue-hover | 375 | 0 | 0/0 | 0 | ✅ |
| color-green | 375 | 0 | 0/0 | 0 | ✅ |
| color-green-hover | 375 | 0 | 0/0 | 0 | ✅ |
| align-left | 375 | 0 | 0/0 | 0 | ✅ |
| align-left-hover | 375 | 0 | 0/0 | 0 | ✅ |
| align-right | 375 | 0 | 0/0 | 0 | ✅ |
| align-right-hover | 375 | 0 | 0/0 | 0 | ✅ |
| solid-red | 375 | 0 | 0/0 | 0 | ✅ |
| solid-red-hover | 375 | 0 | 0/0 | 0 | ✅ |
| solid-blue | 375 | 0 | 0/0 | 0 | ✅ |
| solid-blue-hover | 375 | 0 | 0/0 | 0 | ✅ |
| solid-green | 375 | 0 | 0/0 | 0 | ✅ |
| solid-green-hover | 375 | 0 | 0/0 | 0 | ✅ |
| shiny-l | 375 | 0 | 0/0 | 0 | ✅ |
| shiny-l-hover | 375 | 0 | 0/0 | 0 | ✅ |
| shiny-long | 375 | 0 | 0/0 | 0 | ✅ |
| shiny-long-hover | 375 | 0 | 0/0 | 0 | ✅ |
| normal | 768 | 0 | 0/0 | 0 | ✅ |
| normal-hover | 768 | 0 | 0/0 | 0 | ✅ |
| solid | 768 | 0 | 0/0 | 0 | ✅ |
| solid-hover | 768 | 0 | 0/0 | 0 | ✅ |
| line | 768 | 0 | 0/0 | 0 | ✅ |
| line-hover | 768 | 0 | 0/0 | 0 | ✅ |
| shiny | 768 | 0 | 0/0 | 0 | ✅ |
| shiny-hover | 768 | 0 | 0/0 | 0 | ✅ |
| size-s | 768 | 0 | 0/0 | 0 | ✅ |
| size-s-hover | 768 | 0 | 0/0 | 0 | ✅ |
| size-l | 768 | 0 | 0/0 | 0 | ✅ |
| size-l-hover | 768 | 0 | 0/0 | 0 | ✅ |
| color-red | 768 | 0 | 0/0 | 0 | ✅ |
| color-red-hover | 768 | 0 | 0/0 | 0 | ✅ |
| color-blue | 768 | 0 | 0/0 | 0 | ✅ |
| color-blue-hover | 768 | 0 | 0/0 | 0 | ✅ |
| color-green | 768 | 0 | 0/0 | 0 | ✅ |
| color-green-hover | 768 | 0 | 0/0 | 0 | ✅ |
| align-left | 768 | 0 | 0/0 | 0 | ✅ |
| align-left-hover | 768 | 0 | 0/0 | 0 | ✅ |
| align-right | 768 | 0 | 0/0 | 0 | ✅ |
| align-right-hover | 768 | 0 | 0/0 | 0 | ✅ |
| solid-red | 768 | 0 | 0/0 | 0 | ✅ |
| solid-red-hover | 768 | 0 | 0/0 | 0 | ✅ |
| solid-blue | 768 | 0 | 0/0 | 0 | ✅ |
| solid-blue-hover | 768 | 0 | 0/0 | 0 | ✅ |
| solid-green | 768 | 0 | 0/0 | 0 | ✅ |
| solid-green-hover | 768 | 0 | 0/0 | 0 | ✅ |
| shiny-l | 768 | 0 | 0/0 | 0 | ✅ |
| shiny-l-hover | 768 | 0 | 0/0 | 0 | ✅ |
| shiny-long | 768 | 0 | 0/0 | 0 | ✅ |
| shiny-long-hover | 768 | 0 | 0/0 | 0 | ✅ |
| normal | 1200 | 0 | 0/0 | 0 | ✅ |
| normal-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| solid | 1200 | 0 | 0/0 | 0 | ✅ |
| solid-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| line | 1200 | 0 | 0/0 | 0 | ✅ |
| line-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| shiny | 1200 | 0 | 0/0 | 0 | ✅ |
| shiny-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| size-s | 1200 | 0 | 0/0 | 0 | ✅ |
| size-s-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| size-l | 1200 | 0 | 0/0 | 0 | ✅ |
| size-l-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| color-red | 1200 | 0 | 0/0 | 0 | ✅ |
| color-red-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| color-blue | 1200 | 0 | 0/0 | 0 | ✅ |
| color-blue-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| color-green | 1200 | 0 | 0/0 | 0 | ✅ |
| color-green-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| align-left | 1200 | 0 | 0/0 | 0 | ✅ |
| align-left-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| align-right | 1200 | 0 | 0/0 | 0 | ✅ |
| align-right-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| solid-red | 1200 | 0 | 0/0 | 0 | ✅ |
| solid-red-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| solid-blue | 1200 | 0 | 0/0 | 0 | ✅ |
| solid-blue-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| solid-green | 1200 | 0 | 0/0 | 0 | ✅ |
| solid-green-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| shiny-l | 1200 | 0 | 0/0 | 0 | ✅ |
| shiny-l-hover | 1200 | 0 | 0/0 | 0 | ✅ |
| shiny-long | 1200 | 0 | 0/0 | 0 | ✅ |
| shiny-long-hover | 1200 | 0 | 0/0 | 0 | ✅ |
## 独自検証（自動判定の穴を疑って）

`run.mjs` はカタログにある 16 バリアントしか見ない。そこで参照ページ・実装ページの双方に
**variant 4 × size 3 × color 4 = 48 通り**を注入し、独立に比較した（スクリプトは scratchpad、本体ツリーは未変更）。

- 状態: 通常 / `:hover` / `:focus`+`:focus-visible` / `:hover`+`:active`（CDP `CSS.forcePseudoState` で強制、遷移を 900ms 待って終端値を読む）
- 比較: ラッパー・リンク・`::before`・`::after` の 51 プロパティ（色 ΔE≤3 / 長さ ≤0.5px / それ以外完全一致、`matrix3d` は 2D なら `matrix` に正規化）、リンクとラッパーの bounding box、ラッパー内でのリンク左端オフセット、周囲 24px を含む pixel diff
- viewport: 375 / 768 / 1200

結果: **48 × 3 × 4 = 576 組すべて一致（fails=0）**。

補足の検証:

- **`translate3d` vs `translateY`**: 参照 solid hover は `translate3d(0,4px,0)`、実装は `translateY(4px)`。Chromium はいずれも `matrix(1, 0, 0, 1, 0, 4)` を返し、実測でも一致。
- **`active`**: 参照・実装とも `:active` 固有の宣言はなく、hover 状態がそのまま維持される。48 通りで一致。
- **`focus-visible`**: 参照・実装とも UA 既定の `1px auto rgb(0,95,204) offset=1px`。フォーカスリングは消していない（spec/01 §5）。
- **`.un-content` 外**: `node scripts/audit/standalone.mjs button` → `OK (16 variants, 224 rules)`。
- **WAAPI での光り方の走査**: `shiny` / `shiny-l` / `shiny-long` の `::after` を 3s 周期で 41 フレーム走査し、`opacity` / `transform` / `left` / `width` / `height` / `background-image` を参照と比較 → **全フレーム一致**。可視フレーム（opacity>0）は両者とも t=0.85〜0.975 の 6 フレームで完全に同じ。`animation-duration` 3s / `iteration-count` infinite / `timing-function` ease-in-out も一致（`animation-name` のみ spec/04 §2.2 により比較対象外）。
- **hover が本当に効いているか**: `*-hover-*-ref.png` と `*-*-ref.png` のハッシュが全て異なることを確認（hover が無視されて hover 行が空振りしている、という穴はない）。

## 目視所見

`audits/button/shots/` を確認（`-diff.png` 96 枚は全走査、`-ref/-impl` は 375/768/1200 から代表 12 枚を目視、`-motion.png` は shiny 3 種）。

- `solid-hover-1200`: 影が消えて 4px 沈む挙動・角丸・文字位置とも一致。
- `line-768` / `line-hover-375`: 1px 枠 → 塗りつぶし＋白文字への反転が一致。枠の色・太さ・角丸に差なし。
- `shiny-long-375`: 2 行折り返しの改行位置（「…二行に折り」／「返したときの…」）が参照と同一。
- `size-l-375` / `align-right-768` / `solid-red-1200`: 寸法・寄せ・押し込み影の暗色とも差なし。
- `shiny-1200-{ref,impl}-motion.png`（16 フレーム）: 光の帯は 15 フレーム目に左端から現れ、16 フレーム目に全体へ広がって消える。出るタイミング・向き（rotate 25deg）・広がり方・消え方が参照と同一。`::before` の静的なシーンは overflow で隠れており、両者とも同じく不可視。
- icon-shape 相当の所見なし（このパーツはアイコンを持たない）。

## 仕様適合（spec/04-audit.md §5）

- **バリアント網羅**: OK。spec §3 の 16 件（normal / solid / line / shiny / size-s / size-l / color-red / color-blue / color-green / align-left / align-right / solid-red / solid-blue / solid-green / shiny-l / shiny-long）がカタログ・fixture の双方に同名・同順・同ダミーテキストで存在。spec にないバリアントはカタログにない。
- **props**: OK。`Button.astro` の `interface Props extends HTMLAttributes<'a'>` が spec §2 と型・既定値とも一致（`variant='normal'` / `size='m'` / `color='main'` / `align='center'` / `sponsored=false`、`colorDark?: string`、`class` / `id`）。`sponsored` で `rel="nofollow sponsored noopener"` `target="_blank"` を確認。
- **コーディング規則**: OK。`!important` なし。セレクタ詳細度は最大 `(0,2,0)`（`.un-button--shiny .un-button__link:hover::before` 等、状態擬似クラスは数え上げ外）。クラスは `un-` 接頭辞の BEM 風、状態はクラス化していない。内部変数は `--_color` / `--_color-dark` / `--_min-width`、受け取り値は `--un-button-color` / `--un-button-color-dark`。リテラル色は `#fff` と `rgba(255,255,255,…)` / `rgb(255,255,255)`（白）と `transparent` のみ、他はトークン経由。`.un-content` の前置なし、`@media (min-width: 600px)` のみ、ベンダープレフィックスなし、疑似要素に `content:""` と用途コメントあり。`swell` の文字列なし。依存トークン（`--un-color-btn-{red,blue,green}{,-dark}` / `--un-shadow-btn{,-hover}` / `--un-radius-btn: 80px`）は `tokens.css` に定義済み。
- **standalone**: button は OK。ただしツリー全体では `node scripts/audit/standalone.mjs` が step で 6 件 NG（`.un-step__item::before` の height/top が `.un-content` 内外で 16〜24px 相違）。**button 起因ではない**。
- **クリーンルーム**: `node scripts/audit/cleanroom.mjs` が FAIL 2 件。いずれも `src/styles/parts/step.css`（`display:flex;flex-direction:column;justify-content:center` 等の 3 連続宣言）で、**button 起因ではない**。`src/styles/parts/button.css` / `src/components/Button.astro` に指摘なし。

## FAIL 項目（実装者への指示）

1. **fixture + `run.mjs` の不備 — spec §5 の `margin: 0 auto 2em` が審査系で検証できない**

   - 根拠 A: `reference/fixtures/button.html` は 16 バリアントすべてが `<div class="post_content" data-variant="…">` の**単独の子**として 1 つのボタンを持つ。したがって参照側は `.post_content > :first-child/:last-child`、実装側は `src/styles/base.css:39-45` の `.un-content > :first-child` / `.un-content > :last-child` により上下 margin が 0 に潰れる。実測でも 375 / 1200 の normal / size-s / size-l / shiny-long すべてでラッパーの computed margin は参照・実装とも `0px 0px 0px 0px`。
   - 根拠 B: `scripts/audit/run.mjs` の `diffStyles()` はルート要素の `margin-*` を明示的にスキップする（`if (r.path === ref[0].path && /^margin-/.test(p)) continue;`）。
   - 根拠 C（再現）: 審査用の複製ツリーで `src/styles/parts/button.css` の `margin: 0 auto 2em` を `margin: 0 auto 5em` に変えて再ビルドし `node scripts/audit/run.mjs button --no-build` を実行 → **verdict PASS（96 行すべて ✅）**。spec/parts/button.md §5「ラッパー / margin / `0 auto 2em`」が回帰しても検出できない。なお対照として `letter-spacing: 1px → 1.4px` の変更は同じ手順で FAIL になるため、ハーネス全体が壊れているわけではなくこの穴は margin 固有。
   - 直し方の案: fixture とカタログに、1 つの `[data-variant]` の中にボタンを 2 つ（または段落 → ボタン → 段落）並べたバリアントを追加し、ブロック間の余白が pixel diff と box に現れるようにする。あわせて `run.mjs` のルート margin スキップを「兄弟がいる場合は比較する」に緩めるか、隣接要素間の実測ギャップを比較項目に加える。

## 補足（FAIL ではない所見）

- 利用者の `style` はラッパー（`.un-button`）に出るため、`.un-button__link` 自身が宣言するプロパティ（`letter-spacing` / `font-weight` / `color` 等）は `style` からは上書きできない。これは spec §4 のマークアップ契約と spec/01 §2.1 の例に沿った挙動であり、仕様違反ではない。任意色は `color` / `colorDark`（= `--un-button-color` / `--un-button-color-dark`）で受ける設計で意図どおり動く。
- 本体ツリーは一切変更していない。検証用の複製・スクリプトはすべて scratchpad 内。
