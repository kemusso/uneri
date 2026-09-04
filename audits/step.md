# audit: step  (2026-09-04)

verdict: **FAIL**

`node scripts/audit/run.mjs step --no-build --port 4407` は 18/18 で PASS（pixel 0 / box 0 / style 0）。
しかし fixture の 6 バリアントは props の組み合わせ空間の一部しか描画しておらず、独自検証で **参照と一致しない箇所を 7 件** 検出した。

## 自動計測（scripts/audit/run.mjs）

| variant | vw | pixel diff | box Δ (w/h) | style diffs |
|---|---|---|---|---|
| default | 375 / 768 / 1200 | 0 % | 0 / 0 | 0 |
| big | 375 / 768 / 1200 | 0 % | 0 / 0 | 0 |
| small | 375 / 768 / 1200 | 0 % | 0 / 0 | 0 |
| num | 375 / 768 / 1200 | 0 % | 0 / 0 | 0 |
| horizontal | 375 / 768 / 1200 | 0 % | 0 / 0 | 0 |
| vertical | 375 / 768 / 1200 | 0 % | 0 / 0 | 0 |

## 独自検証（自動判定の穴）

参照 (`reference/swell/build/css/{main,blocks}.css` + SWELL マークアップ) と実装 (`dist/_astro/*.css` + uneri マークアップ) を
同一シェルに並べ、fixture が出さない条件を 31 シナリオ × 375/768/1200 で総当たりした
（項目 1/3/11 個、本文の複数段落・リスト・図、2 行タイトル、`variant`×`numStyle` 全掛け合わせ、
`.un-content` の内外、入れ子）。root/item/number/label/title/body と `::before` / `::after` の
computed style（深さ 6）+ 各要素の bounding rect + pixel diff を比較。

| シナリオ | pixel | 高さ Δ | style diffs |
|---|---|---|---|
| `small` × `num` / `horizontal` / `vertical` | 0.039–0.104 % | 0 | 16 |
| `big` × `horizontal` | 0.035–0.113 % | 0 | 6 |
| 本文が 2 段落（default / big / small） | 0.92–2.94 % | −30〜−32 px | 15–17 |
| 本文が `<p>`+`<ul>` / `<ul>`+`<p>` / `<ul>`×2 | 0.026–0.048 % | −12 px | 9–10 |
| 本文が 3 段落 | 0.044 % | −32 px | 11 |

上記以外（項目 1 個 / 3 個 / 11 個＝2 桁番号、空本文、2 行タイトル、`big`×`circle`/`num`、
`small` × shape 無し、`horizontal` の 2 行タイトル）は全て一致。

## FAIL 項目（実装者への指示）

1. `small` × `num` / `horizontal` / `vertical` @375/768/1200: **番号の丸が角にならない**。
   `src/styles/parts/step.css:172` `.un-step--small .un-step__number { border-radius: 50% }` と
   `:181` `.un-step--small .un-step__shape { border-radius: 50% }` が無条件。
   参照は `[data-num-style=circle] .swell-block-step__number, [data-num-style=circle] … .__shape { border-radius:50% }`
   で **circle のときだけ** 丸にする（blocks.css）。
   実測: `border-*-radius` 参照 `0px` → 実装 `50%`（number と `__shape` の 4 隅すべて）。
   16×16 のドットが参照では四角、実装では丸で描かれる。
   修正: `.un-step--small.un-step--circle .un-step__number` / `… .un-step__shape` に限定する
   （spec/01 §3 の (0,2,0) 上限に触れるため、`--circle` を親側に持つなど詳細度に注意）。

2. `big` × `horizontal` @375/768/1200: **ラベルが数字のベースラインに揃わない**。
   `step.css:105` `.un-step--horizontal .un-step__number { align-items: flex-end }` が、
   同詳細度 (0,2,0) で後ろにある `:135` `.un-step--big .un-step__number { align-items: normal }` に負けている。
   実測: number の `align-items` 参照 `flex-end` → 実装 `normal`、`.un-step__label` の高さ 参照 `16px` → 実装 `24px`。
   参照 (blocks.css) は big に `align-items` を書かないので `[data-num-style=horizontal]` の `flex-end` がそのまま効く。
   修正: `.un-step--big .un-step__number` の `align-items: normal`（初期値と同じで冗長）を削除するか、
   `--big` ブロックを number layout ブロックより前に置く。

3. 全バリアント @375/768/1200: **本文が 2 ブロック以上のとき、ブロック間の 1em が消える**。
   `step.css:70` `.un-step__body > p { margin-top:0; margin-bottom:0 }` が全ての余白を殺している。
   参照は `.swell-block-step__body > * { margin-bottom: 1em }`（main.css）＋
   `.post_content div > :last-child { margin-bottom: 0 !important }`（main.css）で
   **ブロック間だけ 1em、最後の 1 つは 0**。
   実測 @1200 `default` 2 段落: item 高さ 参照 `185.59px` → 実装 `169.59px`、`p` の `margin-bottom` `16px` → `0px`、pixel 1.25 %。
   @375 では `15px` → `0px`、pixel 2.94 %、box 高さ Δ −30px。`big` / `small` も同様。
   `<ul>` / `<figure>` / `<h4>` でも同じ（−12px）。
   修正: `src/styles/parts/box.css:19-27` の group と同じ形にする —
   `.un-step__body > * { margin-top: 0; margin-bottom: 1em }` ＋ `.un-step__body > :last-child { margin-bottom: 0 }`。

4. 全バリアント: **`.un-content` の外で本文の余白が変わる**（spec/parts/step.md §6・spec/01 §2.4/§3 違反）。
   `step.css` は `> p` しか余白を持たないため、`ul` / `figure` / `h4` はコンテナ内では
   `base.css:29` `.un-content div :where(p, ul, …) { margin-bottom: 0 }` に頼っており、外では UA 既定が残る。
   実測（同一マークアップ、幅 800px）:
   本文 `<p>+<ul>` の item 高さ `.un-content` 内 `120.8px` / 素の div `137.59px`（`ul` の margin `0px` → `16px`）、
   本文 `<ul>` のみ `88px` / `92.8px`、`<figure>+<p>` `132.8px` / `157.59px`、`<h4>+<p>` `148.47px` / `148.13px`。
   修正: 3 と同じ（`.un-step__body > *` でパーツ側が余白を持てば内外で一致する）。

5. `src/styles/parts/step.css:93` `.un-step--default.un-step--circle .un-step__number` は詳細度 **(0,3,0)**。
   spec/01 §3 の上限 (0,2,0) 違反。step.css 内で上限を超えるのはこの 1 本のみ。

6. props が spec/parts/step.md §2 と不一致。
   - spec は `label?: string`（既定 `'STEP'`）を **Step（親）** の prop と定めているが、
     `src/components/Step.astro` に `label` が無い。`<Step label="手順">` は `...rest` 経由で
     `<div label="手順">` という無意味な属性として出力され、表示は変わらない。
   - spec の StepItem は `title` / `class` / `id` のみだが、`src/components/StepItem.astro` は
     `label?: string`（既定 `'STEP'`）と `shape?: boolean`（既定 `false`）を追加で受けている。
   どちらかに寄せて spec と実装を一致させること（spec/04 §5）。

7. 入れ子（`small` の Step を `default` の Step 本文に置く）で `default` の装飾が内側に漏れる。
   参照は `.is-style-small .swell-block-step__number { width:auto; height:auto; color:inherit }` で
   基底の 48×48 を打ち消すため、内側の number は `804×16px` / 背景 `rgba(0,0,0,0)`。
   実装は `.un-step--default .un-step__number`（`step.css:84`、子孫結合子・(0,2,0)・先に定義）が
   `.un-step--small .un-step__number`（`:165`、`width`/`height`/`background` を戻していない）に勝ち、
   内側の number が **48×48 の `--un-color-main` 塗りつぶし円**になる（実測 `48px×48px` / `rgb(4,56,76)`）。
   修正: `.un-step--small` / `.un-step--big` の number で `width` / `height` / `background` を明示的に戻す
   （参照と同じ考え方）。

## 目視所見

- `audits/step/shots/` 54 枚（6 バリアント × 3 vw × ref/impl/diff）を確認。fixture が描く範囲では diff は全面白。
- 番号の丸: `default`（circle）のみ丸、`num` / `horizontal` / `vertical` は角 — 参照と一致。
- 連結線: `default` 系は ≥600 でのみ縦破線が出て、375 では出ない。`small` は 375 でも 2px の実線が出る。
  いずれも最後の項目には出ない。参照と一致。
- `big`: 先頭の上と各項目の下に破線、項目境界の中央に下向きの灰色三角。三角は参照 `translateX(-50%)`、
  実装 `translateX(-12px)` だが要素幅 24px なので computed の `matrix` は同値。
- `small`: 16px の輪郭だけの丸 + 8px の右マージン + 2px の縦線、1 行ヘッダ。ラベルと数字は `opacity:.8`。参照と一致。
- ラベルと数字の配置: `horizontal` は横並び・ラベル右 4px/下 4px、`vertical` / `num` は縦積み。参照と一致
  （ただし FAIL-2 の通り `big` × `horizontal` だけ崩れる）。
- 2 桁番号（11 項目）でも丸の中に収まり、連番は途切れない。

## 仕様適合

- **バリアント網羅: OK（6/6）**。ただし `num` は実質的に未審査 — 下記 fixture-suspect 参照。
- **props: NG**。上記 FAIL-6。
- **コーディング規則: NG**。上記 FAIL-5（詳細度 (0,3,0)）。
  `!important` なし / ベンダープレフィックスなし / `@media` は `min-width` のみ /
  リテラル色は `#fff` のみ（規則上許容）/ `swell` 文字列なし / `content:""` にコメントあり。
- **`node scripts/audit/standalone.mjs step`: OK**（6 variants, 233 rules）— ただし FAIL-4 を見逃している（tool-suspect）。
- **`node scripts/audit/cleanroom.mjs`: OK**（1900 reference runs indexed）。

## fixture / spec / tool の不備

- **fixture-suspect**: `reference/fixtures/step.html` の `num` バリアントが `vertical` と完全に同一。
  `audits/step/shots/num-{375,768,1200}-{ref,impl}.png` は `vertical-*` と **バイト単位で一致**する。
  SWELL には `[data-num-style=num]` の CSS が 1 本も無く（`blocks.css` の `data-num-style` ルールは
  `circle` と `horizontal` のみ）、`num` の違いは「`__label` の span を出力しない」というマークアップ差である。
  spec/parts/step.md §3 の「丸の中が数字だけ」も fixture では再現されていない（`STEP` が出ている）。
  spec/04 §2.0「そのスタイルの定義的な性質が出るダミーテキストを選ぶこと」に反し、
  `num` バリアントは事実上未検証。加えて uneri の API には label の span 自体を省く手段が無い。
- **fixture-suspect**: fixture の `small` は number 側にも `shape u-col-main` を付けているが、
  実際の SWELL 出力（`reference/swell/ext-step.html`）は `<div class="swell-block-step__number">` で、
  `u-col-main` は `__shape` にしか付かない。`.is-style-small .swell-block-step__number{color:inherit}` があるため
  本来の SWELL では小さな丸だけがメインカラーで、`STEP` と数字は本文色になる。
  fixture・spec・実装は互いに一致しているが、SWELL 既定の見た目とはずれている。
- **spec-suspect**: spec/parts/step.md §5 の big 表「label / padding / 右 2px（下は 0）」は参照に存在しない。
  参照の big は `font-size:12px` しか指定せず、label は基底の `padding-bottom:1px` / `padding-right:0` のまま。
  実装は参照どおりで、spec 側の記述（small 表からの写し間違いと思われる）が誤り。
- **spec-suspect**: spec §2 の API と §4 のマークアップに `__shape`（small の丸）と項目ごとの label が無く、
  §5 の small 表にだけ「shape（丸）」が現れる。実装が `shape` prop を足さざるを得ない状態になっている。
- **tool-suspect**: `scripts/audit/standalone.mjs` は `[class*="un-"]` の要素とその疑似要素しか見ないため、
  パーツの slot に入った素の `ul` / `figure` / `h4` の余白差（FAIL-4）を検出できない。
  実際 FAIL-4 が存在する状態で `standalone: OK (6 variants, 233 rules)` を返す。
- **tool 感度の確認（参考）**: リポジトリのコピーで `.un-step--small .un-step__shape` の
  `border-radius: 50%` を削除して再ビルドすると `run.mjs` は `small` を FAIL（style diffs 8）にした。
  ツール自体は敏感で、上記の見逃しは fixture のカバレッジ不足に起因する。
  なおその破壊時の pixel diff は 0.039–0.104 % で閾値 0.3 % を大きく下回り、
  **16px 級の装飾の形状差は pixel diff では拾えず computed style 比較だけが検出している**。
