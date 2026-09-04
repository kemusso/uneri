# Content — 本文基礎（A1）

- 状態: pass
- 参照: SWELL `.post_content` 直下の WordPress コアブロック（段落・画像・引用・コード・区切り・リスト・表）
- 依存トークン: `--un-color-text` `--un-color-link` `--un-color-main` `--un-color-gray` `--un-color-border` `--un-font-*` `--un-fz-*` `--un-line-height` `--un-block-margin` `--un-radius-sm`
- ファイル: `src/components/Content.astro`, `src/styles/base.css`, `src/pages/catalog/content.astro`, `reference/fixtures/content.html`

## 1. 用途

記事本文を包むコンテナ。素の HTML（p / a / strong / img / blockquote / code / hr / ul / ol / table）に既定の見た目と、直下ブロック間の余白を与える。他のすべてのパーツはこの中に置かれる前提。

## 2. API

```ts
interface Props extends HTMLAttributes<'div'> {
  class?: string;
  id?: string;
}
// class / id 以外の属性（data-* など）はルート div にそのまま透過する
```

slot: default（本文 HTML）

## 3. バリアント一覧

| data-variant | 内容 | 参照マークアップ | 見た目の要点 |
|---|---|---|---|
| `paragraph` | `p` × 2 | `<p>` | 16px / 行間 1.8 / 段落間 2em |
| `link` | 本文中の `a` | `<a>` | リンク色、下線なし（hover でも下線なし）|
| `strong` | 本文中の `strong` | `<strong>` | weight 700 |
| `image` | `figure > img + figcaption` | `.wp-block-image` | 画像は幅いっぱい・中央寄せ、キャプション 0.8em・上 0.75em・opacity .8 |
| `blockquote` | `blockquote > p + cite` | `.wp-block-quote` | 灰背景・左に縦線 |
| `code-inline` | 本文中の `code` | `<code>` | 灰背景・角丸 2px・0.9em |
| `code-block` | `pre > code` | `.wp-block-code` | 枠線 1px・角丸 2px・0.875em |
| `separator` | `hr` | `.wp-block-separator` | 幅 100px 中央、1px 線 |
| `ul` | 入れ子つき `ul` | `<ul>` | disc / circle、li 上下 4px |
| `ol` | `ol` | `<ol>` | decimal |
| `table-default` | `figure > table (thead + tbody)` | `.wp-block-table` | th はメインカラー背景・白文字、罫線 #dcdcdc |

## 4. マークアップ

```html
<div class="un-content">
  <p>…</p>
  <figure class="un-image"><img …><figcaption>…</figcaption></figure>
  <blockquote>…<cite>…</cite></blockquote>
  <pre><code>…</code></pre>
  <hr>
  <figure class="un-table"><table>…</table></figure>
</div>
```

- 画像・表は WP と同様 `figure` で包む。クラスは `un-image` / `un-table`（`.un-content > figure` だけでも同じ見た目になること）。

## 5. 計測値（参照の実測）

### コンテナ
| viewport | `.un-content` padding | 本文幅 | font-size | line-height |
|---|---|---|---|---|
| 375 | 0 | 345px（4vw 余白）| 15px (4vw) | 1.8 |
| 768 | 0 | 706.56px | 16px | 1.8 |
| ≥960 | 0 16px | 868px（記事幅 900px）| 16px | 1.8 |

- 直下ブロック: `margin-bottom: 2em`、最後の子は 0、先頭の子は `margin-top: 0`（見出しが先頭に来た場合の上余白を消す）。
- 文字色 `#333`、weight 500、font-family = トークン。
- `max-width: 100%`（親をはみ出さない）、`text-size-adjust: 100%`。
- 直下ブロックは `clear: both`、`li` は `position: relative`（リストのマーカー描画の基準）。
- `.un-content` 直下と、その中の任意の `div` の最初の子は `margin-top: 0`（ボックスの内側で見出しが上に余白を作らない）。
- `p` / `ul` / `ol` / `blockquote` / `pre` / `figure` / `table` / `hr` は `margin-top: 0`（入れ子でも上余白を持たない。見出しは自前の上余白を持つ）。

### 要素
| 要素 | プロパティ | 値 |
|---|---|---|
| a | color | `--un-color-link` (#1176d4)、text-decoration none |
| strong | font-weight | 700 |
| figure | display / clear / text-align | block / both / center（::after で clearfix）|
| figcaption | font-size / margin-top / line-height / opacity | 0.8em / 0.75em / 1.4 / 0.8 |
| blockquote | padding | 1.5em 2em 1.5em 3em |
| blockquote | background | rgba(199,199,199,.15) = `--un-color-gray` |
| blockquote::before | 縦線 | left 1.5em, top/bottom 1.5em, width 5px, `border-left:1px solid rgba(180,180,180,.75)`（左右に線: border-width 0 1px = 二重線）|
| blockquote p | margin-bottom | 0.5em |
| blockquote cite | font-size / margin-top / style / opacity | 0.8em / 1em / italic, display block, line-height 1.8 / 0.8 |
| blockquote p, cite | position / z-index | relative / 1（::before の線より前面）|
| figure::after | visibility | hidden（clearfix）|
| code (inline) | font | mono, 0.9em, line-height 1 |
| code (inline) | padding / margin | 0.25em 0.5em / 0 0.5em |
| code (inline) | bg / border / radius | #f7f7f7 / 1px solid rgba(0,0,0,.1) / 2px |
| code (inline) | display / align-items | inline-flex / center（`pre` の中では `inline` に戻す）|
| pre | font | mono, 0.85em（<600）/ 0.875em（≥600, 14px @16）, line-height 1.8 |
| pre | padding / border / radius | 0.5em (7px @14px) / 1px solid `--un-color-border` / 2px |
| hr | width / max-width / height / margin | 100px / 100px / 1px (border-box) / auto (中央) |
| hr | border-bottom | 1px solid rgba(0,0,0,.1) |
| ul, ol | padding-left | 1.5em |
| li | margin / line-height | 0.25em 0（4px @16）/ 1.5 |
| ul ul | list-style | circle |
| th | bg / color / weight | `--un-color-main` / #fff / 700 |
| th, td | padding / border | 0.5em 0.75em / 1px solid #dcdcdc |
| th, td | position / z-index / background-clip / vertical-align | relative / 0 / padding-box / top |
| img | vertical-align | bottom |
| table | line-height / width / max-width / text-align | 1.6 / 100% / 100% / left |
| 全要素 | box-sizing | border-box（`.un-content` 配下すべて）|

## 6. 受け入れ基準

- [ ] 全 11 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] `.un-content` 直下の余白が 2em、最後の子で 0
- [ ] blockquote の二重縦線（::before の左右 border）が再現されている
- [ ] inline code が `inline-flex` で行間を広げない

## 7. 備考

- 参照 `.post_content` は `≥960px` で左右 16px の padding を持つ（SWELL の記事幅設定由来）。uneri でも同値を既定にし、`--un-content-pad` で上書き可能にする。
- 参照 `.l-container` の左右余白は `<960` で 4vw、`960–1199` で 32px、`≥1200` で 48px（実測）。`02-design-tokens.md` の `--un-container-pad` はこの 3 段階。
