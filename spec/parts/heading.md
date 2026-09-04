# Heading — 見出し（A2）

- 状態: pass
- 参照: SWELL `.post_content h2 / h3 / h4`（参照サイトのカスタマイザー設定: h2 = 背景色＋上下二重線、h3 = 2 色の下線、h4 = 左線）、`.is-style-section_ttl`
- 依存トークン: `--un-color-main` `--un-color-text` `--un-color-heading-rule` `--un-content-pad`
- ファイル: `src/components/Heading.astro`, `src/styles/parts/heading.css`, `src/pages/catalog/heading.astro`, `reference/fixtures/heading.html`

## 1. 用途

記事本文の h2 / h3 / h4。`.un-content` 内の素の `h2` `h3` `h4` にも同じ見た目が付く（Markdown 由来の本文でも装飾されるため）。`Heading` コンポーネントは class 付与用の薄いラッパで、`.un-content` 内で使う（外では装飾されない）。

## 2. API

```ts
interface Props extends HTMLAttributes<'h2'> {
  level: 2 | 3 | 4;
  variant?: 'default' | 'section'; // 既定: 'default'。section = 装飾なしのセクションタイトル
  align?: 'left' | 'center' | 'right'; // 既定: 未指定（継承）
  class?: string;
  id?: string;
}
```

slot: default（見出しテキスト）

上記以外の属性（data-* など）はルート要素にそのまま透過する。

## 3. バリアント一覧

| data-variant | 内容 | 参照マークアップ | 見た目の要点 |
|---|---|---|---|
| `h2` | p + h2 + p | `h2.wp-block-heading` | メインカラー背景・白文字、上下 4px 外側に 2px 線、本文より左右 16px はみ出す |
| `h3` | p + h3 + p | `h3.wp-block-heading` | 2px の下線（左 29.3% メインカラー、残り薄灰）|
| `h4` | p + h4 + p | `h4.wp-block-heading` | 左に 2px のメインカラー線 |
| `h2-long` | 折り返す h2 | 同上 | 複数行でも背景・線が崩れない |
| `h3-long` | 折り返す h3 | 同上 | 複数行でも下線が最下部 |
| `sequence` | h2 → h3 → h4 → p | 同上 | 連続時のマージン（先頭は margin-top 0）|
| `section-title` | h2(center) + h3(left) `variant="section"` | `.is-style-section_ttl` | 装飾なし、letter-spacing .2px、文字色は本文色 |

## 4. マークアップ

```html
<h2 class="un-heading">…</h2>
<h2 class="un-heading un-heading--section un-heading--center">…</h2>
<!-- .un-content 内の素の h2/h3/h4 も同じ見た目 -->
```

## 5. 計測値（参照の実測）

共通: font-weight 700、line-height 1.4、position relative。`em` は各見出し自身の font-size 基準。

| 要素 | プロパティ | <600 | ≥600 |
|---|---|---|---|
| h2 | font-size | 1.2em（18px @15）| 1.4em（22.4px）|
| h3 | font-size | 1.1em（16.5px）| 1.3em（20.8px）|
| h4 | font-size | 1.05em（15.75px）| 1.2em（19.2px）|
| h2 | margin-left / right | -2vw | -16px（固定。<960 で `.un-content` の padding が 0 でも -16px）|

| 要素 | プロパティ | 値 |
|---|---|---|
| h2 | margin | 4em 0 2em（左右の食い出しは `.un-content` 直下のときだけ）|
| h2 | padding | .75em 1em |
| h2 | color / background | #fff / `--un-color-main` |
| h2 | z-index | 1 |
| h2::before | position / inset | absolute / top -4px, bottom -4px, left 0, right 0 |
| h2::before | border / pointer-events | top・bottom 2px solid `--un-color-main`、左右なし / none |
| h3 | margin | 3em 0 2em |
| h3 | padding | 0 .5em .5em |
| h3 | color | `--un-color-text` |
| h3::before | position / inset | absolute / left 0, right 0, bottom 0, height 2px |
| h3::before | background | `repeating-linear-gradient(90deg, main 0 29.3%, --un-color-heading-rule 29.3% 100%)` |
| h3::before | z-index | 0 |
| h4 | margin | 3em 0 1.5em |
| h4 | padding-left | 16px（固定）|
| h4 | border-left | 2px solid `--un-color-main` |
| h4 | color | `--un-color-text` |
| 先頭の見出し | margin-top | 0（`.un-content > :first-child`）|
| `.is-style-section_ttl` | background / border / padding | none / none / 0 |
| `.is-style-section_ttl` | letter-spacing / color | .2px / `--un-color-text` |
| `.is-style-section_ttl` | ::before | なし |
| `.is-style-section_ttl` h2 | margin-left / right | 通常 h2 と同じ（-16px）|

## 6. 受け入れ基準

- [ ] 全 7 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] h2 の上下 2px 線が本体の 4px 外側にある（::before）
- [ ] h3 の下線が 2 色（左 29.3% がメインカラー）
- [ ] h2 が本文の左右にはみ出す幅が <600 で 2vw、≥600 で 16px
- [ ] 素の `.un-content h2/h3/h4` と `.un-heading` で見た目が同一

## 7. 備考

- SWELL の見出しデザインはカスタマイザーで多数選べるが、参照サイトで実際に描画された 1 セット（上記）のみを再現する。他デザインは参照が得られたら `style` を追加する。
- h3 下線の `29.3%` は参照の実測値をそのまま採用（`--_accent-width` として heading.css 内に閉じる）。
- h3 下線の薄灰 rgba(150,150,150,.2) は `--un-color-heading-rule` としてトークン化（02-design-tokens.md）。
