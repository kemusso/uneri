# CapBox — キャプションボックス（B4）

- 状態: impl
- 参照: SWELL キャプション付きブロック `.swell-block-capbox.cap_box`（`.is-style-small_ttl` / `-onborder_ttl` / `-onborder_ttl2` / `-inner` / `-intext` / `-shadow`）と `data-colset`（col1 / col2 / col3）
- 依存トークン: `--un-color-main` `--un-color-bg` `--un-color-colset-1/2/3` `--un-color-colset-1/2/3-bg` `--un-shadow-box`
- ファイル: `src/components/CapBox.astro`, `src/styles/parts/capbox.css`, `src/pages/catalog/capbox.astro`, `reference/fixtures/capbox.html`

## 1. 用途

見出し（キャプション）付きの囲みボックス。見出しの置き方（帯・枠上・枠内・本文内）と色セットを選べる。

## 2. API

```ts
interface Props extends HTMLAttributes<'div'> {
  title: string;
  variant?: 'default' | 'small-title' | 'onborder' | 'onborder2' | 'inner' | 'intext' | 'shadow';
  /** 色セット。名前以外の CSS 色も可（`--un-capbox-color` / `--un-capbox-bg` に流す）*/
  color?: 'main' | 'col1' | 'col2' | 'col3' | (string & {});
  class?: string;
  id?: string;
}
```

slot: default（本文）

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.cap_box` | 見出しが幅いっぱいの帯 |
| `small-title` | `variant="small-title"` | `.is-style-small_ttl` | 見出しが小さい札 |
| `onborder` | `variant="onborder"` | `.is-style-onborder_ttl` | 札が枠線の上に乗る（白地・色文字）|
| `onborder2` | `variant="onborder2"` | `.is-style-onborder_ttl2` | 同じ位置で塗りの札 |
| `inner` | `variant="inner"` | `.is-style-inner` | 札が枠の内側左上に重なる |
| `intext` | `variant="intext"` | `.is-style-intext` | 見出しも本文も枠の中（帯なし）|
| `shadow` | `variant="shadow"` | `.is-style-shadow` | 枠線なし・影付き |
| `colset1` | `variant="inner" color="col1"` | `data-colset="col1"` | 橙（#f59b5f / 背景 #fff8eb）|
| `colset2` | `variant="inner" color="col2"` | `data-colset="col2"` | 青（#5fb9f5 / #edf5ff）|
| `colset3` | `variant="inner" color="col3"` | `data-colset="col3"` | 緑（#2fcd90 / #eafaf2）|

## 4. マークアップ

```html
<div class="un-capbox un-capbox--inner">
  <div class="un-capbox__title"><span>…</span></div>
  <div class="un-capbox__content">…</div>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| root | position | relative |
| title | display / align-items / justify-content / gap / z-index | flex / center / center / 0.5em / 1 |
| title | padding / background / color | 0.5em / 色セットの主色 / #fff |
| title | line-height / text-align | 1.5 / center |
| content | padding / border / clear / z-index | 1.25em（≥600 は 1.5em）/ 1px solid 主色 / both / 0 |
| content | margin-top | -2px（帯と枠線を重ねる）|

### バリアント別
| variant | 対象 | プロパティ | 値 |
|---|---|---|---|
| small-title | title | font-size / padding / width / float / top | 0.85em / 0.25em 0.75em / 内容幅 / left / 1px |
| onborder | title | display / font-size / line-height / padding / left / top / background / color | inline-flex / 0.85em / 1 / 0.5em 0.75em / 1em / 1em / `--un-color-bg` / 主色|
| onborder | content | background | `--un-color-bg` |
| onborder2 | title | 同上（背景は主色・文字 #fff）| |
| onborder / onborder2 | content | padding-top | 1.5em（≥600 は 2em）|
| inner | title | position / padding / z-index / min-width / max-width / line-height / overflow | absolute / 0.25em 1em / 1 / 2em / 100% / 1.5 / hidden |
| inner | content | padding-top | 本文と同じ（1.25em / 1.5em）|
| inner | content::before | 札の分の高さを空ける | 幅 100% / 高さ 1em / `visibility: hidden` |

| intext | root | padding / border | 1.5em（固定）/ 1px solid 主色 |
| intext | title | font-size / text-align | 1em / left |
| intext | content | margin-top / padding / border | 1em / 0 / なし |
| shadow | root | box-shadow / overflow | `--un-shadow-box` / hidden |
| shadow | content | border / background | なし / #fff |

色セット: main = `--un-color-main`（本文背景なし）、col1 `#f59b5f` / 背景 `#fff8eb`、col2 `#5fb9f5` / `#edf5ff`、col3 `#2fcd90` / `#eafaf2`。

## 6. 受け入れ基準

- [ ] 全 10 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] 見出しの位置（帯・札・枠上・枠内・本文内）が参照と一致
- [ ] 色セットで主色と本文背景が変わる
- [ ] `.un-content` の外でも成立する

## 7. 備考

- 色セットの 3 色は `02-design-tokens.md` にトークンとして追加する（参照サイトのカスタマイザー値）。
