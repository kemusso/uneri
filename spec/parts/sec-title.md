# SecTitle — セクション見出し（G2）

- 状態: impl
- 参照: SWELL の `.c-secTitle`
- 依存トークン: `--un-color-main`
- ファイル: `src/components/SecTitle.astro`, `src/styles/parts/sec-title.css`, `src/pages/catalog/sec-title.astro`, `reference/fixtures/sec-title.html`

## 1. 用途

記事本文の外（一覧ページやウィジェット）で使う小さな見出し。左に細い線が立つ。

## 2. API

```ts
interface Props extends HTMLAttributes<'div'> {
  as?: 'div' | 'h2' | 'h3' | 'h4' | 'p' | 'span'; // 既定 'div'
  class?: string;
  id?: string;
}
```

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.c-secTitle` | 左に 2px の線、左右 0.75em の余白、1.25rem |

## 4. マークアップ

```html
<div class="un-sec-title">セクションの見出し</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| root | position / padding / border-left / font-size | relative / 0 0.75em / 2px solid `--un-color-main` / 1.25rem |
| root::before | z-index | 0 |

## 6. 受け入れ基準

- [x] 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] `.un-content` の外でも成立する

## 7. 備考

- 記事本文の中で `as="h2"` を使うと、参照と同じく見出しの装飾（`.un-content h2`）が優先されて `.un-sec-title` の見た目は出ない。参照でも `.c-secTitle` を `post_content` の h2 に付けた描画は素の h2 と一致した（`::before` の z-index だけが残る）。この確認はカタログには置いていない（コンテナ依存の描画になり、独立性チェックの対象外にするため）。
- 参照の `.c-secTitle::before` / `::after` は観測できた文脈では `z-index` 以外に何も出さなかったため、それ以上は実装していない。
