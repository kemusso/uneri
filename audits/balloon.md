# audit: balloon  (2026-09-04) — 再審査（3 回目）

verdict: **FAIL**

描画は参照と完全一致。自動計測 33/33（11 バリアント × 3 viewport）で pixel diff 0.000 % / box Δ 0px / style diff 0、
審査側で独自に組んだ 15 の掛け合わせケース × 3 viewport（45 件）も全て一致。
前回の FAIL（詳細度 (0,3,0)）と spec 2 件の指摘は **全て解消**を確認した。

ただし以下 2 件により FAIL とする。

1. `spec/parts/balloon.md` L5 の依存トークン `--un-color-border-thin` が **プロジェクトのどこにも存在しない**（spec 不備）。
2. 今回導入した `--_outline-*` が `.un-balloon` でリセットされておらず、**入れ子時に外側の `border` が内側の `think` に漏れる**（実装不備）。

---

## 前回 FAIL 項目 / spec 指摘の解消確認（最優先）

| # | 前回の指摘 | 状態 | 根拠 |
|---|---|---|---|
| 1 | `.un-balloon--think.un-balloon--border .un-balloon__tail > *` が (0,3,0) | **解消** | 当該セレクタは削除済み。`src/styles/parts/balloon.css` の全 37 セレクタを機械的に数え直し、最大 **(0,2,0)**。(0,3,0) 以上は 0 本（下表参照）|
| 1b | `think` 単体で `0 none currentColor` に戻ること | **解消** | computed style 実測。`think` 単体: 参照 `0px none rgb(51,51,51)` / 実装 `0px none rgb(51,51,51)` で完全一致。4 通り全て一致（下表参照）|
| 2 | spec の「`right` は `scaleX(-1)`」の誤記 | **解消** | `spec/parts/balloon.md` §5 末尾が `transform: rotateY(180deg)` に修正済み。実装 CSS も `rotateY(180deg)`、computed で参照と一致（`matrix3d(...)`）|
| 3 | 「最初/最後の子の margin 0」の出所 | **解消** | spec §5 の表に「参照では記事本文側の `div > :first-child` / `:last-child` 由来。uneri はパーツ側で持つ」と明記済み。実装も `.un-balloon__text > :first-child` / `> :last-child` でパーツ側に持っている |
| 4 | `standalone.mjs` の比較対象に `color` を追加 | **解消** | `scripts/audit/standalone.mjs` の `CRITICAL` に `color` が入っていることをコードで確認。感度確認も実施（後述）|

### `--_outline-*` 方式の 4 通り検証（最重要・computed style 実測）

`.un-balloon__tail > *`（しっぽの丸／三角）の `border-top-*` を参照 fixture と実装 dist で直接読み出して突き合わせた。

| 組み合わせ | 参照 | 実装 | 判定 |
|---|---|---|---|
| 通常（`left`, speech） | `8px solid rgba(0,0,0,0)` / 2 番目 `display:none` | 同一 | ✅ |
| `border` 単体（speech） | `8px solid rgba(0,0,0,0)` / 2 番目 `display:block` `10×16px` | 同一 | ✅ |
| `think` 単体 | **`0px none rgb(51,51,51)`** | **`0px none rgb(51,51,51)`** | ✅ fallback `0 none currentColor` が正しく効いている |
| `think` + `border` | `1px solid rgb(204,204,204)` | `1px solid rgb(204,204,204)` | ✅ |

`--_outline-width` / `-style` / `-color` を一切定義していない `think` 単体で、`var(--_outline-color, currentColor)` が
`currentColor`（= `.un-balloon__text` の `--un-color-text` = `#333`）に解決され、参照の「border 未宣言」状態と
`border-top-width` / `-style` / `-color` の 3 プロパティすべてで一致することを確認した。前回の取り違えは発生していない。

---

## 自動計測

```
node scripts/audit/run.mjs balloon --no-build --port 4406
```
（dist: `dist/_astro/Catalog.CRCIQ-z-.css`。`--_outline-width:1px` / `var(--_outline-color,currentColor)` が入った最新ビルドであることを確認済み）

verdict(auto): **PASS** — 33/33

| variant | vw | pixel diff | box Δ (w/h) | style diffs |
|---|---|---|---|---|
| left | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| right | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| think | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| border | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| square | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| col-red | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| col-blue | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| col-green | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| col-yellow | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| think-border | 375 / 768 / 1200 | 0 % | 0/0 | 0 |
| rich | 375 / 768 / 1200 | 0 % | 0/0 | 0 |

### 計測ツールの感度確認（0 % を鵜呑みにしないための検証）

dist の CSS を一時的に壊して、ツールが本当に差を検出することを確認した（確認後にバイト単位で復元し、再実行して 33/33 一致を再確認済み）。

| 仕込んだ欠陥 | 検出結果 |
|---|---|
| `--_outline-width:1px` → `2px` | `think-border` @375/768/1200 が ❌（pixel 0.052/0.022/0.018 %、style diff 各 8）|
| `var(--_outline-color,currentColor)` → `var(--_outline-color,red)` | `think` @375/768/1200 が ❌（pixel 0 % だが style diff 各 8 = **fallback の取り違えは computed style で必ず捕まる**）|
| dist に `.un-content .un-balloon__text{background:#f00}` を追加 | `standalone.mjs` が `FAIL (11/11)`。`color` 追加後の `CRITICAL` も効いている |

`think` 単体の fallback 誤りは pixel diff 0 % のまま（border-width が 0 なので見た目に出ない）であり、
**目視・pixel diff では絶対に検出できない**。今回は computed style 側で確実に捕捉できることを実証した。

---

## 審査側の独自検証（自動判定の穴を疑う）

`spec/parts/balloon.md` §3 に無い掛け合わせ・欠損入力について、参照 SWELL CSS と実装 dist CSS の両方で
同じ内容のページを組み、要素ツリー（深さ 6）の computed style 65 プロパティ・bounding box・pixel diff を突き合わせた。
375 / 768 / 1200 の 3 viewport、計 45 件。

| ケース | 内容 | 結果 |
|---|---|---|
| `x-right-think` | `dir=right` × `think` | ✅ 一致 |
| `x-right-think-border` | `dir=right` × `think` × `border`（3 重掛け） | ✅ 一致 |
| `x-right-border` | `dir=right` × `border` | ✅ 一致 |
| `x-square-think-border` | `square` × `think` × `border` × `col-red` | ✅ 一致 |
| `x-square-border` | `square` × `border` × `col-blue` | ✅ 一致 |
| `x-noicon` | **アイコンなし**（`.un-balloon__icon` ごと欠落） | ✅ 一致 |
| `x-noicon-right-think` | アイコンなし × `right` × `think` × `border` × `col-green` | ✅ 一致 |
| `x-noname` | **名前なし**（`.un-balloon__name` 欠落） | ✅ 一致 |
| `x-noname-right` | 名前なし × `right` × `border` × `col-yellow` | ✅ 一致 |
| `x-long` | 3 行に折り返す長文（`max-width:560px` の効きとしっぽの縦位置） | ✅ 一致 |
| `x-long-right-border` | 長文 × `right` × `border` | ✅ 一致 |
| `x-short` | 1 文字（`fit-content` 方向の幅差が出るケース） | ✅ 一致 |
| `x-short-right` | 1 文字 × `right` | ✅ 一致 |
| `x-empty` | **中身が空** | ✅ 一致 |
| `x-think-long` | `think` × `border` × 長文（丸が上にはみ出す分の padding-top） | ✅ 一致 |

全 45 件で computed style 差 0 / box Δ ≤ 1px / pixel diff ≤ 0.3 %（実測は全て 0 %）。

### `.un-content` の外での挙動

全 11 バリアントを `.un-content` の中と、同じ文字設定だけを与えた素の div の中で描画して比較した。

- `left` / `right` / `think` / `border` / `square` / `col-*` / `think-border` の 10 件：balloon 全体の高さ・`__text` の幅高さ・
  子要素の margin まで **完全一致**。しっぽの丸も素の div で `0px none rgb(51,51,51)` を維持（container 非依存）。
- `rich` のみ 6.85px 差（中 237.88px / 外 231.03px）。内訳は素の `h3` の `margin-bottom`（41.6px → 18.72px）と
  素の `ul` の margin（0 → 16px）で、いずれも **`heading.css` と `base.css` の記事本文既定**由来。
  `spec/04-audit.md` §5 が明示的に比較対象外としている範囲（container スコープと決めている見出し・記事本文の要素既定）なので、
  **パーツの不備ではない**。パーツ自身が装飾するプロパティには差が無い。

---

## FAIL 項目（実装者への指示）

### 1. spec 不備 — `spec/parts/balloon.md` L5 の依存トークン `--un-color-border-thin` が存在しない

- 根拠:
  - `spec/parts/balloon.md:5` — 「依存トークン: `--un-color-balloon-*-bg` `--un-color-balloon-*-line` **`--un-color-border-thin`** `--un-radius-balloon`」
  - `grep -rn "border-thin" src/ spec/` のヒットは **この 1 行のみ**。`src/styles/tokens.css` にも `spec/02-design-tokens.md` にも定義が無い。
- 実装が実際に使っているのは `--un-color-balloon-icon-border`（`src/styles/parts/balloon.css` の `.un-balloon__img` の `border`）。
  こちらは `src/styles/tokens.css:40` と `spec/02-design-tokens.md:49` の両方に `#ececec` で定義されており、
  spec §5 計測値「icon img border 2px solid #ececec」とも一致する。
- したがって **spec 側の記述が誤り**。`spec/parts/balloon.md:5` の `--un-color-border-thin` を
  `--un-color-balloon-icon-border` に修正すること。`spec/01-coding-rules.md` §6「spec/parts/<part>.md が唯一の仕様」に反する状態。

### 2. 実装不備 — `--_outline-*` が `.un-balloon` でリセットされず、入れ子で外側の `border` が内側に漏れる

- 現象（1200px / dist CSS で computed 実測）:
  - 外側 `.un-balloon.un-balloon--border`（gray、`--_line: #ccc`）の `__text` の中に
    内側 `.un-balloon.un-balloon--think`（blue、`--_line: #93d2f0`、**`border` は付けていない**）を置くと、
  - 内側の `.un-balloon__tail > *`（思考の丸 2 つ）が `border-top-width: 1px` / `-style: solid` / `-color: rgb(204,204,204)` になる。
  - 期待値は `think` 単体と同じ **`0px` / `none` / `rgb(51,51,51)`**。
- さらに色も誤る: 内側の `--_outline-color` は `#ccc`（= **外側**の `--_line`）に解決される。
  `--_outline-color: var(--_line)` の `var()` 置換は宣言元（外側ルート）で行われるため、内側の `--_line: #93d2f0` は反映されない。
  内側で `getComputedStyle(inner).getPropertyValue('--_outline-color')` = `#ccc`、`--_line` = `#93d2f0` を実測。
- 原因: `.un-balloon` ブロックは `--_bg` / `--_line` を毎インスタンスでリセットしているのに、
  今回追加した `--_outline-width` / `-style` / `-color` だけリセットが無い（`src/styles/parts/balloon.css` の
  `.un-balloon { --_bg: …; --_line: …; }` と `.un-balloon--border { --_outline-width: 1px; … }`）。
  `spec/01-coding-rules.md` §2.2 の `--_<name>`＝パーツ内部専用という前提が、入れ子で崩れている。
- 修正案: `.un-balloon` に `--_outline-width: 0; --_outline-style: none; --_outline-color: currentColor;` を追加する。
  `.un-balloon`（0,1,0）より `.un-balloon--border`（0,1,0）が後段にあるので `border` 時の上書きは効き、詳細度も (0,2,0) を超えない。
  併せて `.un-balloon--think .un-balloon__tail > *` の `var()` fallback は残しておいてよい。

---

## 目視所見

`audits/balloon/shots/` の `-ref.png` / `-impl.png` / `-diff.png` を確認（全 99 枚のうち各バリアントを抽出して目視）。

- しっぽの三角（`left` / `right` / `border` @375/768/1200）: 頂点の位置・高さ 16px・向き・`border` 時の二重線の見え方まで一致。
  `right` は `rotateY(180deg)` の鏡像で参照と同一に見える（`right-375-{ref,impl}.png`）。
- しっぽの 2 つの丸（`think` @375/768/1200）: 8px と 12px、位置（`-21px` / `-16px`）、輪郭なしの塗りのみ、いずれも一致。
- `think-border`（`think-border-1200-{ref,impl}.png`）: 丸 2 つに 1px の輪郭が出ており、参照と区別がつかない。
- アイコン: `square` で角丸と 2px の枠が両方消えること（`square-375-{ref,impl}.png`）、`circle` で `border-radius:50%` + 2px `#ececec` を確認。
- `rich`（`rich-768-*.png`）: 見出しの下線・段落の折り返し位置・リストのマーカー位置まで完全一致。
- `-diff.png` は全て赤画素なし（pixelmatch の未変化グレースケールのみ）。
- 影・グラデーション・ストライプは本パーツに無し。アイコンパーツでもアニメーションパーツでもない（`ICON_PARTS` / `ANIM_PARTS` に不在で妥当）。

---

## 仕様適合

### バリアント網羅: **OK**

`spec/parts/balloon.md` §3 の 11 件（`left` `right` `think` `border` `square` `col-red` `col-blue` `col-green` `col-yellow`
`think-border` `rich`）が `src/pages/catalog/balloon.astro` に 1:1 で存在。spec に無いバリアントの追加も無し。
`reference/fixtures/balloon.html` も同じ 11 件・同じ順序・同じダミーテキスト。

### props: **OK**

`src/components/Balloon.astro` の `interface Props` と分割代入の既定値は spec §2 と完全一致。

| prop | spec | 実装 |
|---|---|---|
| `icon` | `string?` | 同（省略時 `.un-balloon__icon` ごと出さない — 実装確認済み）|
| `name` | `string?` | 同（`icon &&` の内側なので icon 無しでは出ない）|
| `dir` | `'left' \| 'right'` 既定 `'left'` | 同 |
| `shape` | `'circle' \| 'square'` 既定 `'circle'` | 同 |
| `tail` | `'speech' \| 'think'` 既定 `'speech'` | 同 |
| `border` | `boolean` 既定 `false` | 同（肯定形、§2.3 準拠）|
| `color` | 5 色 \| `(string & {})` 既定 `'gray'` | 同 |
| `class` / `id` | あり | 同（`class:list` でルートに付与、`id` はルートに付与）|
| — | `extends HTMLAttributes<'div'>` | `...rest` をルートに展開。`style` は `joinStyles`/`styleToString` で取り込み、属性の二重出力なし（§4 準拠）|

slot: default のみ。しっぽには `aria-hidden="true"`（§5 準拠）。

### コーディング規則: **OK**（詳細度・`!important`・命名・`swell`・リテラル色）

`src/styles/parts/balloon.css` の全セレクタを数え直した（状態擬似クラスと属性セレクタは `spec/01-coding-rules.md` §3 に従い除外）。

| 詳細度 | 本数 | セレクタ |
|---|---|---|
| (0,1,0) | 26 | `.un-balloon` `.un-balloon *` `.un-balloon--right` `.un-balloon__icon` `.un-balloon__img` `.un-balloon__name` `.un-balloon__body` `.un-balloon__text` `.un-balloon--border` `.un-balloon__tail` `.un-balloon__tail > *` `…> :first-child` `…> :last-child` ほか（@media 内を含む）|
| (0,1,1) | 5 | `.un-balloon::before` `.un-balloon::after` `.un-balloon ::before` `.un-balloon ::after` `.un-balloon__text > p` |
| **(0,2,0)** | 9 | `.un-balloon--square .un-balloon__img` / `.un-balloon--border .un-balloon__text` / `.un-balloon--think .un-balloon__body`（×2、@media 含む）/ `.un-balloon--right .un-balloon__tail` / `.un-balloon--right .un-balloon__body` / `.un-balloon--border .un-balloon__tail > :first-child` / `…> :last-child` / `.un-balloon--think .un-balloon__tail > *` / `.un-balloon--think .un-balloon__tail > :first-child` / `…> :last-child` |
| (0,3,0) 以上 | **0** | — |

- **最大 (0,2,0)。前回の FAIL は解消。**
- `!important`: 0 件。
- `swell` の文字列: `balloon.css` / `Balloon.astro` / `catalog/balloon.astro` いずれにも無し。
- リテラル hex 色: `balloon.css` に 0 件（全てトークン経由。`--un-color-balloon-*` / `--un-color-balloon-icon-border` / `--un-color-text` / `--un-radius-balloon`）。
- 命名: `un-` 接頭辞の BEM（`__icon` `__img` `__name` `__body` `__text` `__tail`、修飾子 `--right` `--square` `--think` `--border`）。
  内部変数は `--_bg` `--_line` `--_outline-*`（§2.2 の `--_<name>`）、受け取り値は `--un-balloon-bg` / `-line`（§2.2 の `--un-<part>-<name>`）。
- 単位: 余白は `em`、境界線・しっぽ寸法は `px`。ブレークポイントは `min-width: 600px` のみ（`spec/02-design-tokens.md` §1 の `sm`）。モバイルファースト。
- ベンダープレフィックス手書き: 無し。`.un-content` 前置: 無し。他パーツのクラス参照: 無し。
- 疑似要素での描画は使わず実 span。装飾意図はコメントで明記されている（§3 の趣旨を満たす）。
- 状態のクラス化: 無し（`data-*` 相当の状態を持たないパーツ）。

### クリーンルーム: **OK**

`node scripts/audit/cleanroom.mjs` → `cleanroom: OK (1900 reference runs indexed)`。
参照 CSS の同一ルール内の連続 3 宣言と一致する並びは `src/styles` / `src/components` に無し。`swell` の文字列も無し。

### standalone: **OK**（ツールとして）

`node scripts/audit/standalone.mjs` → `standalone: OK (128 variants, 234 rules)`。
`CRITICAL` に `color` が追加されていることをコードで確認し、故意の `.un-content` 依存を仕込んで `FAIL (11/11)` になることも確認した。

---

## FAIL ではないが記録しておく所見

1. **`color` に 5 色以外の文字列を渡すと線色が gray のまま**
   `Balloon.astro` は名前付き以外の `color` について `--un-balloon-bg:${color}` しか流さず、`--un-balloon-line` を設定しない。
   実測（`color="#fee"` + `border` + `think`）: `__text` の背景 `rgb(255,238,238)` に対し、枠線と丸の輪郭は `rgb(204,204,204)`（gray の線色）。
   参照 SWELL の `data-col` は 5 色固定なので比較対象が無く、`spec/parts/balloon.md` §2 も挙動を定義していない。
   仕様として「線色は追随しない」のか「背景から導出する」のかを spec に明記すべき。
2. **`color` prop が style 文字列に素通しで補間される**
   `--un-balloon-bg:${color}` の形で連結しているため、`color` に `;` を含む文字列を渡すと任意の宣言を注入できる。
   spec の合否基準の対象外だが、`(string & {})` を受ける以上は記録しておく。
3. `img` に `width="80" height="80"` 属性が付いており <600px では CSS が 60px に上書きするが、
   これは参照 fixture の SWELL マークアップと同一。差異なし。

---

## 再審査に必要な作業（まとめ）

1. `spec/parts/balloon.md:5` の `--un-color-border-thin` → `--un-color-balloon-icon-border` に修正。
2. `src/styles/parts/balloon.css` の `.un-balloon` に `--_outline-width: 0; --_outline-style: none; --_outline-color: currentColor;` を追加し、
   入れ子の内側 `think` が外側の `border` を継承しないようにする。修正後、`think` 単体が `0px none rgb(51,51,51)` のままであることと、
   `think-border` が `1px solid rgb(204,204,204)` のままであることを computed style で再確認すること。
3. 上記 2 点以外に描画上の指摘は無い。1 と 2 を直せば PASS 見込み。
