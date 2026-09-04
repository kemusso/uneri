# 01 — コーディング規則

## 1. ファイル構成

```
src/
  components/<Part>.astro      # 1 パーツ 1 ファイル。PascalCase
  styles/
    tokens.css                 # デザイントークン（:root の custom properties）
    base.css                   # 記事本文の基礎（.un-content 配下の p/h2/h3/ul/table 等）
    parts/<part>.css           # 1 パーツ 1 ファイル。kebab-case
    index.css                  # 上記を全部 import する集約ファイル
  icons/<name>.svg             # MIT/ISC アイコンの SVG（出典を icons/LICENSES.md に記録）
  index.ts                     # コンポーネントの re-export
  pages/catalog/<part>.astro   # カタログ（配布物には含めない）
spec/                          # 仕様
scripts/audit/                 # 審査ツール
reference/                     # 参照資料（git 管理外）
audits/                        # 審査結果
```

## 2. 命名

### 2.1 CSS クラス

- 接頭辞 `un-`。BEM 風。
  - ブロック: `.un-box`
  - 要素: `.un-box__title`
  - 修飾: `.un-box--stripe`（バリアント）、`.un-box--sm`（サイズ）
- 状態は `data-*` または `aria-*` で表し、クラスにしない。
  - `data-open="true"`、`aria-expanded="true"`
- 色などユーザーが指定する値は **custom property** で受ける。クラスを増やさない。
  - `style="--un-box-color:#e35"`
- ユーティリティは `.un-u-*`。原則作らない（必要なら spec に理由を書く）。

### 2.2 custom property

- 公開トークン: `--un-<category>-<name>`。例 `--un-color-main`, `--un-radius-md`。
- パーツ内部専用: `--_<name>`（先頭アンダースコア）。外部から触らない。
- パーツが受け取る調整値: `--un-<part>-<name>`。例 `--un-button-color`。

### 2.3 コンポーネント / props

- コンポーネント名は PascalCase。SWELL の呼称に近い英語名。
  `Box, List, CapBox, Balloon, Button, Faq, Accordion, Step, Tab, Dl, Table, Review, BlogCard, BannerLink, BoxMenu, LinkList, Columns, Column, PostList, Toc, FullWide, Mark`
- props は camelCase。
- バリアントは `variant` prop、値は kebab-case の文字列リテラル型で列挙する（`style` は HTML の style 属性として利用者に残す）。
  ```ts
  style?: 'border' | 'stripe' | 'grid' | ...
  ```
- 色は `color` prop（CSS の色文字列）で受け、custom property に流す。
- 常に `class` prop を受け取り、ルート要素に付ける。
- `id` prop を受け取れること（目次・アンカー用）。
- 本文は `<slot />`。タイトル等の短い文字列は prop、長い HTML は named slot。
- boolean は肯定形（`open`、`border`）。`noBorder` のような否定形は禁止。

### 2.4 記事本文コンテナ

- 本文を `.un-content` で包む。パーツの余白（margin）は `.un-content > .un-*` の文脈で決める。
- 単体で置いたときも崩れないよう、margin 以外の見た目は `.un-content` に依存しない。

## 3. CSS の書き方

- 素の CSS。プリプロセッサ・Tailwind・PostCSS プラグイン禁止（Astro 標準のバンドルのみ）。
- 1 パーツ 1 ファイル。他パーツのクラスを参照しない（組み合わせは `.un-content` 側で扱う）。
- セレクタの詳細度は最大 `(0,2,0)`。状態擬似クラス（`:hover` `:focus-visible` `:active` `:first-child` 等）と属性セレクタは数え上げから除く（状態を書くために避けられないため）。`!important` 禁止。
- 単位: フォント・余白は `em`/`rem`、境界線は `px`。ブレークポイントは `02-design-tokens.md` の値のみ。
- モバイルファースト。`@media (min-width: …)` のみ使う。
- ベンダープレフィックス手書き禁止。
- パーツ CSS は `.un-content` を前置しない（`.un-content` の外でも成立させる）。ただし素の要素（`h2` / `li` など）に既定を与える規則だけは `.un-content` の中に閉じる。
- 色は必ずトークン経由。リテラルの hex はトークン定義と、白/黒/透明以外では使わない。
- 素の要素に既定を与える規則（`base.css` の `ul` / `li` など）は `:where()` で包み、詳細度を 0 にする。こうするとパーツ側はクラス 1 つ（`.un-list--check`）で上書きでき、パーツ CSS が `.un-content` に依存せずに済む。
- アイコンは inline SVG（`currentColor`）か `mask-image` + data URI。アイコンフォント禁止。
- 疑似要素で描画する装飾には `content:""` とコメントで「何を描いているか」を書く。

```css
/* 良い例 */
.un-box--stripe {
  background: repeating-linear-gradient(
    -45deg,
    var(--_stripe-a) 0 4px,
    var(--_stripe-b) 4px 8px
  );
}
```

## 4. Astro コンポーネントの書き方

- frontmatter 先頭に 1 行コメントで「何のパーツか」と参照する spec ファイル名。
- `interface Props` を必ず定義。`Astro.props` の分割代入でデフォルトを与える。
- `class:list` でクラスを組み立てる。文字列連結禁止。
- パーツが inline の custom property を組み立てるときは、利用者の `style`（文字列でもオブジェクトでも渡せる）を `src/lib/style.ts` の `styleToString` / `joinStyles` で必ず取り込む。属性を二重に出さない。
- ルート要素は 1 つ。
- JS が必要なパーツ（Accordion, Tab, Toc のスクロール等）は `<script>` をコンポーネント内に置き、`data-un-*` 属性で要素を特定する。グローバル変数禁止。JS 無効でも内容が読めること（progressive enhancement）。
- `set:html` は「HTML 文字列を受け取る」と spec に明記した prop にのみ使う。

```astro
---
/** Box — 段落/グループのボックス装飾. spec: spec/parts/box.md */
interface Props {
  style?: 'border' | 'stripe';
  color?: string;
  class?: string;
  id?: string;
}
const { style = 'border', color, class: cls, id } = Astro.props;
---
<div id={id} class:list={['un-box', `un-box--${style}`, cls]} style={color && `--un-box-color:${color}`}>
  <slot />
</div>
```

## 5. アクセシビリティ

- 開閉するもの: `button` 要素 + `aria-expanded` + `aria-controls`。
- タブ: `role="tablist" / "tab" / "tabpanel"`、矢印キー移動。
- 装飾目的の疑似要素・SVG は `aria-hidden="true"`。
- 色だけで意味を伝えない（メリット/デメリットはアイコンも出す）。
- フォーカスリングを消さない。

## 6. ドキュメント

- 各パーツの spec (`spec/parts/<part>.md`) が唯一の仕様。コンポーネントの JSDoc は spec へのポインタ + 1 行説明に留める。
- カタログページは spec の「バリアント一覧」と 1:1。spec にないものをカタログに置かない。

## 7. コミット

- Conventional Commits。scope はパーツ名。
  `feat(box): add stripe variant` / `fix(step): number circle size` / `spec(button): define affiliate variant`
- 1 パーツの spec → 実装 → 審査 PASS を 1 コミット単位の目安にする。
