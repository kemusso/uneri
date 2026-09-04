# <Part> — <日本語名>

- 状態: todo | spec | impl | pass
- 参照: SWELL `<クラス名>`／解説 URL
- 依存トークン: `--un-…`
- ファイル: `src/components/<Part>.astro`, `src/styles/parts/<part>.css`, `src/pages/catalog/<part>.astro`, `reference/fixtures/<part>.html`

## 1. 用途

（1〜2 行。記事のどこで何のために使うか）

## 2. API

```ts
interface Props {
  variant?: '...' | '...';   // 既定: '...'
  ...
  class?: string;
  id?: string;
}
```

slot: default（本文）／named（あれば）

## 3. バリアント一覧（= カタログ・参照 fixture の `data-variant` と 1:1）

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `border-sm` | `variant="border-sm"` | `.is-style-border_sm` | 1px 実線、メインカラー |

## 4. マークアップ

```html
<div class="un-box un-box--border-sm">…</div>
```

## 5. 計測値（参照の実測。実装はこれに合わせる）

| 要素 | プロパティ | 値 |
|---|---|---|
| root | padding | 1.5em |
| root | border | 1px solid var(--un-color-main) |

## 6. 受け入れ基準（審査で確認する具体項目）

- [ ] 全バリアントが 3 viewport で pixel diff ≤ 0.3%
- [ ] （このパーツ特有の項目）

## 7. 備考

（判断した設計上の理由、参照との意図的な差分など）
