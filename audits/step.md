# audit: step  (2026-09-04)

verdict: **FAIL**

再審査。実行コマンド: `node scripts/audit/run.mjs step --no-build --port 4407`
併せて審査側で独自の検証ハーネス（12 通りの掛け合わせ・項目数・複数ブロック本文・2 行タイトル・入れ子・`.un-content` 外）を組み、参照 CSS（`reference/swell/build/css/blocks.css`）と実装を突き合わせた。

## 0. 前回 FAIL 7 件の再検証

| # | 前回の指摘 | 今回 |
|---|---|---|
| 1 | `small` × 非 circle が丸のまま | **解消**。`x-small-{num,horizontal,vertical}` が 375/768/1200 すべてで pixel diff ≤ 0.01% / box Δ 0 / style diff 0。`num-375-impl.png` でも角の四角を確認 |
| 2 | `big` × `horizontal` のラベル揃えの競合 | **解消**。`x-big-horizontal` が 3 viewport とも style diff 0 |
| 3 | 本文が 2 ブロック以上のとき余白が消える | **未解消**（F-1）。`.un-content` の中では依然 0px |
| 4 | `.un-content` の外で本文余白が変わる | **未解消・悪化**（F-2）。中 0px / 外 16px と逆向きにズレた |
| 5 | 詳細度 (0,3,0) | **未解消**（F-3）。`--_round` 側は直ったが `.un-step--big.un-step--horizontal .un-step__number` が (0,3,0) のまま |
| 6 | props と spec の不一致 | **解消**。`label?: string \| null`（既定 `'STEP'`）/ `shape?: boolean`（既定 `false`）が spec §2 と一致 |
| 7 | 入れ子で default の装飾が漏れる | **一部のみ解消**（F-4）。`__number` の一部だけ塞がれ、`__title` / `big` の番号 / `big` の item / `small` の連結線は今も漏れる |
| — | fixture の `num` が `vertical` とバイト同一 | **解消**。`num` は `__label` を出さない形になり、カタログも `label={null}` で揃った |

## 自動計測（`scripts/audit/run.mjs step`）

| variant | vw | pixel diff | box Δ (w/h) | style diffs | pass |
|---|---|---|---|---|---|
| default | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| big | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| small | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| num | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| horizontal | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| vertical | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |

18/18 セル PASS。ただし **fixture が薄いことによる見逃し**（§ツール・fixture・spec の不備 参照）。

## 独自検証（審査側ハーネス, 90 セル中 21 セル FAIL）

参照は `reference/fixtures/step.html` と同じ SWELL CSS / SWELL マークアップ、実装は `dist/_astro/Catalog.CRCIQ-z-.css` を同じ体裁のページに載せて 375/768/1200 で比較（閾値は spec/04 §3 と同じ）。

**PASS したもの（前回 FAIL の再発なし）**
- 掛け合わせ全 12 通り `x-{default,big,small}-{circle,num,horizontal,vertical}` × 3 viewport = 36 セル 全 PASS
- 項目数 1 / 12（連番 10 以上・2 桁）: `n1-*`, `n12-*` 全 PASS
- タイトル 2 行: `t2-*` 全 PASS
- 本文空: `eb-default-circle` PASS
- 同じ variant 同士の入れ子: `nest-default-num` PASS

**FAIL したもの**

| case | @375 | @768 | @1200 |
|---|---|---|---|
| `mb-default-circle`（本文 p+ul+p） | 3.959 % / hΔ67.5 | 2.012 % / hΔ72 | 1.611 % / hΔ72 |
| `mb-big-vertical` | 2.18 % / hΔ67.5 | 1.237 % / hΔ72 | 1.138 % / hΔ72 |
| `mb-small-circle` | 2.415 % / hΔ67.5 | 1.247 % / hΔ72 | 0.995 % / hΔ72 |
| `nest-default-small` | 3.751 % / hΔ36.6 | 1.898 % / hΔ32.7 | 1.508 % / hΔ32.7 |
| `nest-default-big` | 4.32 % / hΔ20.5 | 2.203 % / hΔ14 | 1.792 % / hΔ14 |
| `nest-big-small` | 2.713 % / hΔ24.8 | 1.585 % / hΔ26.2 | 1.437 % / hΔ26.2 |
| `nest-small-default` | 5.396 % / hΔ1.1 | 4.786 % / hΔ1.2 | 4.619 % / hΔ1.2 |

いずれも閾値（pixel ≤ 0.3 % / box Δ ≤ 1px / style diff 0）を大きく超過。

## FAIL 項目（実装者への指示）

### F-1. 本文が 2 ブロック以上のとき `.un-content` の中でブロック間余白が消える（前回 #3 未解消）
- 対象: 全 variant の `.un-step__body > *`（最後の子以外）
- `margin-bottom`: @1200 参照 `16px` → 実装 `0px` / @375 参照 `15px` → 実装 `0px`
- item 高さが 1 ブロックあたり 24px（@375 は 22.5px）縮み、3 項目で全体が 72px 足りない
- 原因: 追加された `.un-step__body > *`（詳細度 (0,1,0)）が `src/styles/base.css:29`
  `.un-content div :where(p, ul, ol, dl, blockquote, pre, figure, table, hr) { margin-bottom: 0 }`（詳細度 (0,1,1)）に負けている。CDP の matched rules で両方マッチした上で後者が勝つことを確認
- 参照側: `.swell-block-step__body > * { margin-bottom: 1em }` ＋ `.post_content div > :last-child { margin-bottom: 0 !important }`

### F-2. `.un-content` の中と外で本文余白が変わる（前回 #4 未解消・向きが逆転）
- 同一マークアップ（`<p>` + `<ul>` + `<p>`）の 1 つ目の `<p>` の `margin-bottom`
  - `.un-content` の中: **0px**
  - 素の div（`color:#333; font-size:1rem; line-height:1.8` のみ）: **16px**
- spec/parts/step.md §5「body の子 … コンテナの外でも同じになるようパーツ側で持つ」、spec/01-coding-rules.md §2.4 に反する
- F-1 と同じ原因

### F-3. 詳細度が (0,2,0) を超える規則が残っている（前回 #5 未解消）
- `src/styles/parts/step.css`:
  ```css
  .un-step--big.un-step--horizontal .un-step__number { align-items: flex-end; }
  ```
  クラス 3 個 = **(0,3,0)**。spec/01-coding-rules.md §3 違反、spec/04 §5 は 1 件でも FAIL
- 他 45 セレクタは (0,2,0) 以下。`!important` なし / `swell` 文字列なし / リテラル色は `#fff` のみ（白は許容）

### F-4. 入れ子で親 variant の装飾が内側の Step に漏れる（前回 #7 一部のみ解消）
参照 CSS は `>`（子結合子）で item / number / title をスコープしている（`.is-style-big>.swell-block-step__item>.swell-block-step__number` 等）が、実装は子孫結合子なので内側の Step まで届く。`__number` の `width/height/background` だけ `.un-step--small .un-step__number` で戻したが残りが未処理。

- `nest-default-big`（`default` の body に `big`）@1200
  - 内側 `big` の `.un-step__number`: `background-color` 参照 `rgba(0,0,0,0)` → 実装 `rgb(4,56,76)` / `border-radius` 参照 `0px` → 実装 `50%` / `width` 参照 `740px` → 実装 `48px` / `height` 参照 `37px` → 実装 `48px`
  - 見た目は「STEP / 1 が中央」のはずが「48px の塗り潰し円」になり数字が読めない
  - 原因: `.un-step--default .un-step__number`（子孫）が届き、`.un-step--big .un-step__number` が `width/height/background/border-radius` を戻していない
- `nest-default-small`（`default` の body に `small`）@1200
  - 内側 `small` の `.un-step__title`: `display` 参照 `block` → 実装 `flex` / `min-height` 参照 `0px` → 実装 `48px` / `flex-direction` 参照 `row` → 実装 `column` / `justify-content` 参照 `normal` → 実装 `center` / `height` 参照 `31.66px` → 実装 `48px`
  - 原因: `.un-step--default .un-step__title`（子孫）。参照は `.swell-block-step:not(.is-style-big):not(.is-style-small)>.swell-block-step__item>.swell-block-step__title`
  - @375 では加えて内側 body の `margin-left` 参照 `0px` → 実装 `-48px`（`.un-step--default .un-step__body`）
- `nest-big-small`（`big` の body に `small`）@1200
  - 内側 `small` の `.un-step__item`: `border-top-width`/`border-bottom-width` 参照 `0px`（`none`）→ 実装 `1px dashed rgb(222,222,222)` / `padding-left` 参照 `24px` → 実装 `32px` / `padding-right` 参照 `0px` → 実装 `32px`
  - 内側 `small` の `.un-step__item::before`: 参照は 2px の縦線（`width:2px`）→ 実装は `border:12px solid` の三角（`width:14px`）
  - 原因: `.un-step--big .un-step__item` / `.un-step--big .un-step__item::before`（子孫）
- `nest-small-default`（`small` の body に `default`）@375/1200
  - 内側 `default` の `.un-step__number`: `color` 参照 `rgb(255,255,255)` → 実装 `rgb(4,56,76)` / `background-color` 参照 `rgb(4,56,76)` → 実装 `rgba(0,0,0,0)`
  - 内側 `default` の `.un-step__item::before` @375: `display` 参照 `none` → 実装 `block` / `width` 参照 `0px` → 実装 `2px`
  - 原因: `.un-step--small .un-step__number` / `.un-step--small .un-step__item::before`（子孫、かつファイル後方で後勝ち）

## 目視所見

- 6 バリアントは 375/768/1200 とも参照と見分けがつかない（`audits/step/shots/*-{ref,impl}.png`）。`num-375-impl.png` で番号バッジが角の四角、`small-1200-impl.png` で 16px の丸＋2px の縦線を確認
- `big` の下向き三角（`::before` の 12px ボーダー三角）、破線の連結線、最終項目で線・矢印を出さない扱いはいずれも参照と一致
- 連番は 12 項目まで 1〜12 で続き、2 桁でもバッジからはみ出さない
- 本文複数ブロックは目視でも明確に差が出る。参照は段落・リスト・段落が 1em ずつ空くが、実装は詰まって 1 つの塊に見える
- 入れ子は目視で崩れが明白。内側 `big` の番号が塗り潰しの丸になり、STEP ラベルと数字が読めない

## 仕様適合

- **バリアント網羅**: OK。spec §3 の 6 バリアントがすべて `src/pages/catalog/step.astro` にあり、`reference/fixtures/step.html` と 1:1
- **props**: OK。`Step { variant?: 'default'|'big'|'small' = 'default'; numStyle?: 'circle'|'num'|'horizontal'|'vertical' = 'circle'; class?; id? }`、`StepItem { title: string; label?: string|null = 'STEP'; shape?: boolean = false; class?; id? }` が spec §2 と一致
- **コーディング規則**: **NG**。`.un-step--big.un-step--horizontal .un-step__number` が (0,3,0)（F-3）。`!important` なし / `swell` 文字列なし / リテラル色は `#fff` のみ
- **クリーンルーム**: OK（`cleanroom: OK (1900 reference runs indexed)`）
- **standalone**: `standalone: OK (128 variants, 234 rules)` と出るが **見逃し**。実測では `.un-step__body > *` が中 0px / 外 16px（F-2）

## ツール・fixture・spec の不備

1. **fixture が薄すぎて欠陥を通す**（spec/04-audit.md §2.0 の趣旨に反する）
   `reference/fixtures/step.html` は 6 バリアントとも **項目 2 個・本文 `<p>` 1 つだけ**。本文 1 ブロックだと `.un-step__body > :last-child { margin-bottom: 0 }` が効いて参照・実装とも 0px になり、F-1 / F-2 が pixel diff にも style diff にも出ない。実際 `run.mjs` は 18/18 セルで 0.000 % を返すのに、本文を p+ul+p にすると 1.0〜4.0 % の差が出る。本文複数ブロックのバリアントを fixture に足すこと
2. **`scripts/audit/standalone.mjs` の穴**
   カタログの `[data-variant]` の innerHTML をそのまま中／外で描き比べる作りなので、カタログ本文が `<p>` 1 つである限り `.un-step__body > *` の非最終子が 1 度も評価されない。結果 container 依存があるのに OK と出る。パーツ CSS のセレクタに実際に 2 つ以上マッチする合成マークアップを併用しないと検出できない
3. **fixture の `small` のマークアップが実際の SWELL 出力と違う**
   fixture は `<div class="swell-block-step__number shape u-col-main">`。実際の SWELL 出力（`reference/swell/ext-step.html`・`reference/swell/fn-step.html` の 2 例とも）は `<div class="swell-block-step__number">` で、色クラスは `<span class="__shape u-col-main">` 側にしか付かない。`shape` というクラスは SWELL の CSS にも存在しない。
   `.is-style-small .swell-block-step__number { color: inherit }` があるため、本来 `small` の「STEP」と数字は本文色（#333）で丸だけがメインカラー。fixture が number 側に `u-col-main`（`!important`）を足しているためラベルと数字までメインカラーになっており、spec §5「small / number / color = `--un-color-main`」と実装もそれに追従している。参照として不正確
4. **spec/parts/step.md の記述が実装より古い**
   - §5 small の表: 「shape（丸）… 形: 円」「number … border-radius: 50%」と無条件に書いてあるが、実際は `circle` のときだけ丸（非 circle は角）。`--_round` 方式に合わせて条件を書くこと
   - §3 の `small` 行の props 欄が `variant="small"` だけだが、参照の丸を出すにはカタログどおり StepItem に `shape` が要る（`num` 行は `label={null}` を明記しているので体裁が不揃い）

## FAIL 項目一覧

1. F-1: 本文 2 ブロック以上で `.un-content` 内のブロック間余白が 0（参照 16px @1200 / 15px @375）
2. F-2: 同一マークアップで `.un-content` の中 0px / 外 16px と container 依存が残る
3. F-3: `.un-step--big.un-step--horizontal .un-step__number` の詳細度 (0,3,0)
4. F-4: 入れ子で `.un-step--default .un-step__title` / `.un-step--default .un-step__number` / `.un-step--default .un-step__body` / `.un-step--big .un-step__item(::before)` / `.un-step--small .un-step__number` / `.un-step--small .un-step__item::before` が内側の Step に漏れる
5. F-5（ツール）: fixture の本文が 1 ブロックしかなく `standalone.mjs` も同じ穴を持つため、F-1 / F-2 を自動検出できない
6. F-6（fixture）: `small` の number に実 SWELL には無い `u-col-main` が付いており参照色が不正確
7. F-7（spec）: §5 small の border-radius 記述と §3 `small` 行の props 欄が実装と不一致
