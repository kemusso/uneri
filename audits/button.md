# audit: button  (2026-09-04, 5 回目)

verdict: **PASS**

対象スナップショット（審査中に他エージェントが同一ツリーを編集していたため、判定はこのハッシュに対してのみ有効）:

| ファイル | md5 |
|---|---|
| `src/components/Button.astro` | `cbf96125884f8c943a816e83a49eb282` |
| `src/styles/parts/button.css` | `7dd815aeaf9ac74c810c6502116a543d` |
| `src/pages/catalog/button.astro` | `c4082f348a9a3e0adf35c980f62b5964` |
| `reference/fixtures/button.html` | `026eee544c26a4455f2bbca0566af620` |
| `scripts/audit/run.mjs` | `215e7cb02c198c41c310b600b7b06211`（mtime 09:19）|
| `dist` の `.un-button*` 規則（抽出して md5）| `2730cd990fbf04bd0205ac2dffc0a428`（審査中の 4 回のリビルドを通じて不変）|

---

## 前回（4 回目）FAIL 項目の再検証

### 1. fixture と `run.mjs` の穴で `margin: 0 auto 2em` が検証できない → **解消**

- `reference/fixtures/button.html` と `src/pages/catalog/button.astro` に `stacked`（段落 → ボタン 2 つ → 段落）を追加。ボタンは `[data-variant]` の**直接の子**になったため、`diffStyles()` のルート margin スキップ（`if (r.path === ref[0].path && /^margin-/.test(p)) continue;`）の影響を受けない。`.un-content > :first-child` / `:last-child` による margin 潰しも起きない。
- **回帰再現テスト（必須確認）**: 審査用の複製ツリー（scratchpad。本体ツリーは未変更）で dist の `margin:0 auto 2em` → `margin:0 auto 2.25em`（＝ 4px 差）だけを変え、現行 `run.mjs` で再審査 → **verdict FAIL**。

  | variant | vw | pixel diff % | box Δ (w/h) | style diffs |
  |---|---|---|---|---|
  | stacked / stacked-hover | 375 | 1.728 | 0 / 7.5 | 3 |
  | stacked / stacked-hover | 768 | 0.989 | 0 / 8 | 3 |
  | stacked / stacked-hover | 1200 | 0.875 | 0 / 8 | 3 |

  style diff の中身: `div>div[1].margin-bottom` `30px→33.75px`（@375）/ `32px→36px`（@768,1200）、`div>div[2].margin-bottom` 同上、`div.height` `236px→243.5px`。
  pixel diff・box Δ・style diff の 3 系統すべてに出るので、前回の「原理的に検出できない」状態は解消している。

### 2. hover 計測のフレーク（`CSS.forcePseudoState` 化）→ **現行版では解消。ただし審査開始時点の版は壊れていた**

審査開始時（08:50 に取得したスナップショット）の `forceHover()` は

```js
  } finally { await cdp.detach().catch(() => {}); }
```

で毎回 CDP セッションを detach していた。**detach すると `CSS.forcePseudoState` の強制状態がクリアされる**ため、hover は screenshot にも computed style にも一切反映されていなかった。

- 実測（`CSS.forcePseudoState` 直後 / detach 後 / セッション維持時の `.un-button__link` を比較）:

  | | background-color | color |
  |---|---|---|
  | idle | `rgba(0,0,0,0)` | `rgb(4,56,76)` |
  | 強制直後（detach 前）| 遷移中 | `rgb(255,255,255)` |
  | **detach 後 700ms** | `rgba(0,0,0,0)` | `rgb(4,56,76)`（= idle に戻る）|
  | セッション維持 | `rgb(4,56,76)` | `rgb(255,255,255)` |

- 影響: `*-hover-*.png` 102 組すべてが idle 版と**バイト単位で同一**。hover 行 51 件は idle の複製で、無条件 PASS していた。
- サボタージュ対照（旧版）: 複製ツリーで hover 終端値を 4 種すべて壊しても（`normal` の影を `none`、`solid` を `translateY(40px)`、`line` の塗りを `#f0f`＋文字 `#000`）→ **verdict PASS / 失敗行 0**。3 回連続で同じ。つまり「連続実行で安定」していたのは**計測そのものが消えていたから**だった。

**09:19 に他エージェントが `run.mjs` を修正**（`cdpByPage` の WeakMap でページごとに CDP セッションを保持し detach しない ＋ `HOVER_SETTLE_MS` の待ちをやめて `CSSTransition` を `a.finish()` で終端へ飛ばす）。修正後の版で再検証:

- サボタージュ対照（現行版）: 同じ壊し方で → **verdict FAIL / 失敗行 42**。3 回連続で完全に同一（`normal-hover` pixel 2.093% @375、`solid-hover` 31.071%、`line-hover` 26.577%／style diff 9 件 など）。壊していない `shiny-hover` 系 6 行は正しく PASS のまま。
- hover が効いていることの直接確認: `*-hover-*.png` と `*-*.png` のハッシュが **102/102 組で相違**（旧版は 0/102）。

---

## 自動計測（`node scripts/audit/run.mjs button --no-build --port 4404`）

17 バリアント × 3 viewport × {通常, hover} = **102 行すべて PASS**。セル = `pixel diff % / box Δ w/h / style diffs`。

| variant | 375 | 768 | 1200 |
|---|---|---|---|
| normal | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| normal-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| solid | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| solid-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| line | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| line-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| shiny | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| shiny-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| size-s | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| size-s-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| size-l | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| size-l-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| color-red | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| color-red-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| color-blue | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| color-blue-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| color-green | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| color-green-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| align-left | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| align-left-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| align-right | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| align-right-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| solid-red | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| solid-red-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| solid-blue | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| solid-blue-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| solid-green | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| solid-green-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| shiny-l | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| shiny-l-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| shiny-long | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| shiny-long-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| stacked | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |
| stacked-hover | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ | 0 / 0/0 / 0 ✅ |

差分ピクセルは全 102 組で **0 px**（0.000%）。

### 連続実行の安定性

現行 `run.mjs` で **5 回連続**実行（`--no-build --port 4404`）。report.md が **5 回とも 1 バイト差なく同一**、verdict はすべて PASS、hover が効いていることも毎回 102/102 組で確認。旧版で起きていたフレーク（および無音の空振り）は再現しない。

### ハーネスの感度対照（自動判定が空振りしていないことの証明）

複製ツリー（scratchpad）で dist の CSS だけを壊し、現行 `run.mjs` が検出することを確認した。

| 壊した内容 | 期待 | 結果 |
|---|---|---|
| `margin:0 auto 2em` → `2.25em`（4px）| stacked が落ちる | **FAIL / 6 行**（上記）|
| hover 終端値 4 種（normal 影 / solid transform / line 塗り・文字色）| hover 行が落ちる | **FAIL / 42 行**、3 回とも同一 |
| `letter-spacing:1px` → `1.6px`、`--un-radius-btn:80px` → `80.6px`（各 0.6px）| 全行落ちる | **FAIL / 102 行** |
| `::before` の `left:-120px`→`-118px`、`height:200px`→`197px`、`::after` の `animation:3s`→`3.2s` | shiny 系だけ落ちる | **FAIL / 18 行**（shiny・shiny-l・shiny-long × 3vw × 2 のみ。疑似要素の `height` / `left` / `right` / `bottom` / `transform` / `transform-origin` / `animation-duration` が列挙される）|

閾値（長さ 0.5px / 色 ΔE 3 / pixel 0.3%）は素通しになっていない。

---

## 独自検証（自動判定の穴を疑って）

`run.mjs` はカタログにある 17 バリアントしか見ないので、**掛け合わせ 48 通り**を参照ページ・実装ページの双方に注入して独立に比較した（スクリプトは scratchpad。本体ツリーは未変更）。

- 生成方法: 各ページの `[data-variant="normal"]` コンテナを `cloneNode` して器の文脈（`.post_content` / `.un-content`、幅・フォント）を完全に一致させ、中身だけ差し替える。
- 組み合わせ: variant 4（normal / solid / line / shiny）× size 3（m / s / l）× color 4（main / red / blue / green）= **48**
- 状態: idle / `:hover` / `:focus`+`:focus-visible` / `:hover`+`:active`（CDP `CSS.forcePseudoState`、**セッションは維持**して 1000ms 待って終端値を読む）
- 比較: ラッパー・リンク・`a::before`・`a::after` の 61 プロパティ（色 ΔE≤3 / 長さ ≤0.5px / それ以外完全一致、`matrix3d` は 2D なら `matrix` に正規化、`transition-property` の `-webkit-` 重複は無視）、ラッパー／リンクの bounding box とラッパー内リンク左端オフセット（≤1px）、周囲 24px を含む pixel diff（≤0.3%）
- viewport: 375 / 768 / 1200

**結果: 89,856 チェック / fails 0。**

このプローブ自身の感度対照: 同じプローブを hover 終端値を壊した複製ビルドに当てると **576 fails**（例 `375 normal-m-main hover link.box-shadow: ref="rgba(0,0,0,0.1) 0px 4px 12px 0px, …" impl="none"` / `pixel 1.997%`、`375 solid-m-main hover link.transform: ref="matrix(1,0,0,1,0,4)" impl="matrix(1,0,0,1,0,40)"` / `pixel 29.648%`）。つまり 0 fails は空振りではない。

補足の検証:

- **`translate3d` vs `translateY`**: 参照 solid hover は `translate3d(0,4px,0)`、実装は `translateY(4px)`。Chromium はどちらも `matrix(1, 0, 0, 1, 0, 4)` を返し実測一致。
- **`:active`**: 参照・実装とも `:active` 固有の宣言はなく hover 状態が維持される。48 通り × 3vw で一致。
- **`:focus-visible`**: 参照・実装とも UA 既定の outline（`outline-width/style/color/offset` を比較項目に含めて一致）。フォーカスリングを消していない（spec/01 §5）。
- **`.un-content` 外**: `node scripts/audit/standalone.mjs button` → **OK (17 variants, 231 rules)**。ツリー全体でも `OK (129 variants, 231 rules)`。
- **WAAPI での光り方の走査**: `shiny` / `shiny-l` / `shiny-long` の `::before` / `::after` を 3s 周期 **41 フレーム**にわたって `getAnimations()` で `currentTime` シークし、18 プロパティ（`opacity` / `transform` / `left` / `top` / `width` / `height` / `background-image` / `background-color` / `animation-duration` / `timing-function` / `iteration-count` / `direction` / `fill-mode` / `border-radius` / `filter` / `mix-blend-mode` / `position` / `z-index`）を参照と比較 → **4,428 チェック / fails 0**。リンクに紐づくアニメーションは参照・実装とも **1 本**（`shiny_btn` / `un-shine`、名前のみ spec/04 §2.2 で比較対象外）。`::after` が可視（opacity>0）なフレームは両者とも **t=0.85 / 0.875 / 0.9 / 0.925 / 0.95 / 0.975** の 6 フレームで完全一致。
- **任意色・任意 style の透過（実ビルドで検証）**: 複製ツリー（`src` のみコピー、本体未変更）にプローブページを置いて `astro build`。

  | 入力 | 出力 HTML |
  |---|---|
  | `variant="solid" color="#e35" colorDark="#911"` | `<div class="un-button un-button--solid" style="--un-button-color:#e35;--un-button-color-dark:#911">` |
  | `style={{letterSpacing:'0.2em'}}` | `<div class="un-button un-button--normal" style="letter-spacing:0.2em">` |
  | `variant="solid" color="#e35" colorDark="#911" style="opacity:.5"` | `style="--un-button-color:#e35;--un-button-color-dark:#911;opacity:.5"`（属性の二重出力なし）|
  | `style="--un-button-color:#0a0"` | `style="--un-button-color:#0a0"` |
  | `color="red" size="l" align="left" id="theid" class="mycls"` | `<div id="theid" class="un-button un-button--normal un-button--l un-button--red un-button--left mycls">` |
  | `sponsored` | `<a … rel="nofollow sponsored noopener" target="_blank">` |
  | `size="s" color="green" align="right" data-testattr="v"` | `un-button--s un-button--green un-button--right` ＋ `<a … data-testattr="v">`（`...rest` はリンクへ）|

  実行時の反映も確認: `--un-button-color:#e35` / `--un-button-color-dark:#911` → link `background-color: rgb(238,51,85)` / `box-shadow: rgb(3,42,57) 0px 4px 0px 0px`、`--un-button-color:rgb(1,2,3)` → `rgb(1,2,3)`。

---

## 目視所見

`audits/button/shots/` を確認（`-diff.png` 102 枚は全走査、`-ref` / `-impl` は 3 viewport から代表を目視、`-motion.png` は shiny 3 種 × ref/impl）。

- `-diff.png` 102 枚に赤ピクセルは **1 px も無い**。
- `stacked-375`: 段落 →（塗りボタン）→（白抜きボタン）→ 段落。ボタン同士の間隔、段落との間隔、2 つのボタンの min-width（64%）が参照と一致。
- `stacked-hover-768`: 1 つめ（normal）だけが hover 状態、2 つめ（line）は idle。参照・実装とも同じ状態で一致（後述の申し送り 2 も参照）。
- `solid-hover-1200`: 影が消えて 4px 沈む挙動・角丸・文字位置とも一致。
- `line-1200` → `line-hover-1200`: 1px 枠＋色文字 → 塗りつぶし＋白文字への反転が一致。枠の色・太さ・角丸に差なし。
- `shiny-long-375`: 2 行折り返しの改行位置（「…二行に折り」／「返したときの…」）が参照と同一。
- `solid-red-768`: 押し込み影の暗色（#b93838）・角丸・寸法に差なし。
- `shiny-1200-{ref,impl}-motion.png`（16 フレーム）: 光の帯は 15 フレーム目に左端から `rotate(25deg)` の角度で現れ、16 フレーム目に全体へ広がりながら消える。出るタイミング・向き・広がり方・消え方が参照と同一。`::before` の静的な帯は `overflow: hidden` で隠れており、両者とも同じく不可視。
- 影のぼかし幅（`--un-shadow-btn` / `-hover`）は pixel diff 0 のとおり一致。
- icon-shape 相当の所見なし（このパーツはアイコンを持たない）。

---

## 仕様適合（spec/04-audit.md §5）

- **バリアント網羅**: **OK**。spec §3 の **17 件**（normal / solid / line / shiny / size-s / size-l / color-red / color-blue / color-green / align-left / align-right / solid-red / solid-blue / solid-green / shiny-l / shiny-long / **stacked**）が fixture・カタログの双方に同名・同順・同ダミーテキストで存在。spec にないバリアントはカタログにない（spec/01 §6）。
- **props**: **OK**。`Button.astro` の `interface Props extends HTMLAttributes<'a'>` が spec §2 と型・既定値とも一致（`href: string` / `variant='normal'` / `size='m'` / `color='main'` / `colorDark?: string` / `align='center'` / `sponsored=false` / `class` / `id`）。`sponsored` で `rel="nofollow sponsored noopener"` `target="_blank"`。上表のとおり実ビルドで確認済み。
- **コーディング規則**: **OK**。
  - `!important` なし（`grep -rn "!important" src/` 0 件）、`swell` の文字列なし（`grep -rni swell src/` 0 件）。
  - セレクタ詳細度は最大 `(0,2,0)`（`.un-button--shiny .un-button__link:hover::before` 等。状態擬似クラスは数え上げ外、spec/01 §3）。
  - クラスは `un-` 接頭辞の BEM 風、状態はクラス化していない。内部変数 `--_color` / `--_color-dark` / `--_min-width`、受け取り値 `--un-button-color` / `--un-button-color-dark`（spec/01 §2.2）。
  - リテラル hex は `#fff`（2 箇所）と白/透明の `rgba(255,255,255,…)` のみ。色はすべてトークン経由で、依存トークン（`--un-color-main{,-dark}` / `--un-color-btn-{red,blue,green}{,-dark}` / `--un-shadow-btn{,-hover}` / `--un-radius-btn: 80px`）は `tokens.css` に定義済み。
  - `.un-content` の前置なし、`@media (min-width: 600px)` のみ（モバイルファースト）、ベンダープレフィックスの手書きなし、疑似要素に `content:""` と「何を描いているか」のコメントあり。
  - Astro 側: frontmatter 先頭に 1 行 JSDoc ＋ spec ポインタ、`interface Props`、`class:list`、`joinStyles` / `styleToString` 経由の style 連結、ルート要素 1 つ。
- **standalone**: **OK**。`node scripts/audit/standalone.mjs` → `standalone: OK (129 variants, 231 rules)`、`… button` → `OK (17 variants, 231 rules)`。前回 NG だった step の 6 件も解消済み（button 起因ではない）。
- **クリーンルーム**: **OK**。`node scripts/audit/cleanroom.mjs` → `cleanroom: OK (1900 reference runs indexed)`。前回 FAIL だった step.css の 2 件も解消済み。

---

## FAIL 項目（実装者への指示）

なし。

---

## 補足（FAIL ではない所見。次に触るときの申し送り）

1. **審査中にツリーが書き換わった**。`scripts/audit/run.mjs` が審査開始後の **09:19** に他エージェントによって差し替えられ、`dist` も 09:00 / 09:03 / 09:11 / 09:30 の 4 回リビルドされた。判定は冒頭のハッシュのスナップショットに対するもの。`dist` 中の `.un-button*` 規則はリビルドを通じて同一（`2730cd99…`）であることを毎回確認している。**再審査時は `run.mjs` の md5 が `215e7cb0…` 以降であることを先に確認すること**（それ以前の版では hover 行が無条件 PASS になる）。
2. `forceHover()` の `DOM.querySelector` は最初の 1 要素しか返さないため、`stacked` では **1 つめのボタンにしか hover が掛からない**（2 つめの line ボタンは idle のまま）。参照・実装の双方が同じ扱いなので比較の妥当性は保たれ、line の hover は `line-hover` バリアントが別途カバーしているが、「並置したときに隣のボタンが hover でずれないか」はこのハーネスでは見ていない。`querySelectorAll` 相当に広げると網羅性が上がる。
3. `run.mjs` の filmstrip 出力条件（`animates`）は**参照ページのアニメーション有無だけ**を見る。実装側にだけ余計なアニメーションがある場合は `-motion.png` が出ないが、`animation-duration` / `timing-function` / `iteration-count` / `direction` / `fill-mode` は style diff で比較されるため数値では検出できる（実測でも一致）。
4. `diffStyles()` のルート要素 margin スキップは残っている。`stacked` が `.un-button` を非ルート位置に置くことで実質カバーされている（上の回帰再現テストで確認）が、この一点に依存している構造なので `stacked` を消すと再び穴になる。
5. 利用者の `style` はラッパー（`.un-button`）に出るため、`.un-button__link` 自身が宣言するプロパティ（`letter-spacing` / `font-weight` / `color` 等）は `style` からは上書きできない。spec §4 のマークアップ契約と spec/01 §2.1 の設計どおりで、仕様違反ではない。任意色は `color` / `colorDark`（= `--un-button-color` / `--un-button-color-dark`）で受ける。
6. 本体ツリーは一切変更していない。複製ツリー・プローブスクリプト・サボタージュ用ビルドはすべて scratchpad 内。
