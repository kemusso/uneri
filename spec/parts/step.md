# Step — ステップ（D5）

- 状態: impl
- 参照: SWELL ステップブロック `.swell-block-step`（`.is-style-default` / `-big` / `-small`）、`data-num-style`（`circle` / `num` / `horizontal` / `vertical`）
- 依存トークン: `--un-color-main` `--un-color-border` `--un-color-text` `--un-color-step-arrow`
- ファイル: `src/components/Step.astro`, `src/components/StepItem.astro`, `src/styles/parts/step.css`, `src/pages/catalog/step.astro`, `reference/fixtures/step.html`

## 1. 用途

手順の並び。番号を自動で振り、項目同士を線でつなぐ。

## 2. API

```ts
// Step（親）
interface Props extends HTMLAttributes<'div'> {
  variant?: 'default' | 'big' | 'small';                    // 既定 'default'
  numStyle?: 'circle' | 'num' | 'horizontal' | 'vertical';  // 番号の並べ方。既定 'circle'
  class?: string;
  id?: string;
}

// StepItem（子）
interface Props extends HTMLAttributes<'div'> {
  title: string;
  /** 番号に添える短いラベル。既定 'STEP'、`null` で出さない（`numStyle="num"` 相当）*/
  label?: string | null;
  /** 数字の前に丸を出す（small 用）*/
  shape?: boolean;
  class?: string;
  id?: string;
}
```

slot: Step は StepItem の並び、StepItem は本文。

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.is-style-default` + `circle` | 左に丸番号、縦の破線でつなぐ |
| `big` | `variant="big"` | `.is-style-big` + `vertical` | 番号とタイトルが中央、項目下に三角の矢印 |
| `small` | `variant="small"` + `StepItem` に `shape` | `.is-style-small` + `circle` | 小さな丸と 2px の縦線、1 行ヘッダ |
| `num` | `numStyle="num"` + `label={null}` | `data-num-style="num"` | ラベルを出さず数字だけ |
| `horizontal` | `numStyle="horizontal"` | `data-num-style="horizontal"` | ラベルと数字を横並び |
| `vertical` | `numStyle="vertical"` | `data-num-style="vertical"` | ラベルと数字を縦並び |
| `rich-body` | 本文が段落 2 つ＋リスト | 同上 | 本文内ブロックの余白（1em、最後は 0）|

## 4. マークアップ

```html
<div class="un-step un-step--default un-step--circle">
  <div class="un-step__item">
    <div class="un-step__number"><span class="un-step__label">STEP</span></div>
    <div class="un-step__title">…</div>
    <div class="un-step__body">…</div>
  </div>
</div>
```

番号は CSS カウンタ（`--un-step` / `counter(un-step)`）で振る。

## 5. 計測値（参照の実測。@1200 / 本文 16px）

### 共通
| 対象 | プロパティ | 値 |
|---|---|---|
| root | counter-reset | ステップ用カウンタ |
| item | position | relative |
| item::before | 連結線 | `border-left: 1px dashed --un-color-border`、top 0 / left 23px / 幅 1px / 高さ 100%。**<600 では出さない** |
| number | display / flex-direction / justify-content / line-height / text-align / box-sizing | flex / column / center / 1em / center / content-box |
| label | padding-bottom | 1px |
| 最後の item | ::before | なし（連結線は最後に出さない）|
| 最後の item（default / small）| padding-bottom | 0（big は下線があるので余白を残す）|
| label | font-size / line-height / text-align | 10px / 10px / center |
| number::after | content / font-size / line-height | `counter(un-step)` / 20px / 20px |
| title | font-weight | 700 |
| body | margin-top | 1em |
| body の子 | margin | 上 0 / 下 1em（最後の子は 0）。コンテナの外でも同じになるようパーツ側で持つ |

### default / num / horizontal / vertical
| 対象 | プロパティ | 値 |
|---|---|---|
| item | padding | 0 0 3em 64px |
| body（<600）| margin-left | -48px（丸の列を使わず全幅に広げる）|
| number | 位置 / 寸法 | absolute（left 0 / top 0）/ 48×48 |
| number / shape（`circle` のみ）| border-radius | 50%（`num` / `horizontal` / `vertical` は角のまま。`--_round` を numStyle 側で切り替え、詳細度を (0,2,0) に収める）|
| number | background / color | `--un-color-main` / #fff |
| title | display / justify-content / min-height / font-size | flex（column）/ center / 48px / 1.25em |
| `horizontal` | number の flex-direction / align-items | row（ラベルと数字が横並び）/ flex-end |
| `horizontal` | label の padding | 右 4px / 下 4px |
| `big` × `horizontal` | number の align-items | flex-end（big 単体は normal）|
| `vertical` / `num` | number の flex-direction | column |

### big
| 対象 | プロパティ | 値 |
|---|---|---|
| item | padding / border | 2em 1em（≥600 は左右 2em）/ 下 1px dashed `--un-color-step-arrow`（先頭だけ上にも）|
| number | 位置 / display / align-items / color / margin-bottom | relative（中央揃え）/ flex column / normal（子は全幅）/ `--un-color-main` / 1em |
| label | font-size / line-height / padding / opacity | 12px / 12px / 右 2px（下は 0）/ 0.8 |
| number::after | font-size / line-height | 24px / 24px |
| title | text-align / font-size / line-height | center / 1.25em / 1.8 |
| item::before | 矢印 | `border: 12px solid transparent` の上辺だけ `--un-color-step-arrow`(#dedede)、下端中央に `translateX(-12px)` |

### small
| 対象 | プロパティ | 値 |
|---|---|---|
| item | padding | 0 0 2em 24px |
| number | display / position / flex-direction / align-items / justify-content / color | flex / relative / row / center / flex-start / `--un-color-main` |
| shape（丸）| 寸法 / 形 / margin-right / 色 | 16×16 / `circle` のときだけ円（2px の枠、中は背景色）/ 8px / `--un-color-main` |
| label | font-size / line-height / padding / opacity | 12px / 12px / 右 2px（下は 0）/ 0.8 |
| number::after | font-size / line-height / opacity | 14px / 14px / 0.8 |
| number | align-items | center |
| title | font-size / margin-top / text-align | 1.1em / 0.25em（4.4px @16）/ left |
| body | margin-top | 0.5em（8px @16）|
| item::before | 連結線 | left 7px / top 18px / 幅 2px の実線（`--un-color-border`）/ 高さ `calc(100% - 20px)`。<600 でも出す |
| number | margin-left / border-radius | -24px / 50% |

## 6. 受け入れ基準

- [ ] 全 7 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] 番号が 1 から連番になる（項目を増やしても続く）
- [ ] 最後の項目でも連結線・矢印が参照と同じ扱いになる
- [ ] `.un-content` の外でも成立する

## 7. 備考

- 参照は `data-num-style` を属性セレクタで見ているが、uneri は修飾クラス（`un-step--circle` 等）にする。
