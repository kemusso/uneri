# Faq — よくある質問（D2）

- 状態: impl
- 参照: SWELL FAQ ブロック `.swell-block-faq`（`.is-style-faq-default` / `-border` / `-box` / `-stripe`）と `.faq_q` / `.faq_a`
- 依存トークン: `--un-color-border` `--un-color-gray` `--un-color-faq-q` `--un-color-faq-a`
- ファイル: `src/components/Faq.astro`, `src/components/FaqItem.astro`, `src/styles/parts/faq.css`, `src/pages/catalog/faq.astro`, `reference/fixtures/faq.html`

## 1. 用途

質問と回答の並び。行頭に Q / A の印を置く。

## 2. API

```ts
// Faq（親）
interface Props extends HTMLAttributes<'dl'> {
  variant?: 'default' | 'border' | 'box' | 'stripe'; // 既定 'default'
  class?: string;
  id?: string;
}

// FaqItem（子）
interface Props extends HTMLAttributes<'div'> {
  q: string;
  class?: string;
  id?: string;
}
```

slot: Faq は FaqItem の並び、FaqItem は回答。

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.is-style-faq-default` | 区切りなし、Q/A の印だけ |
| `border` | `variant="border"` | `.is-style-faq-border` | 項目の間に 1px の実線、左右に 8px の余白 |
| `box` | `variant="box"` | `.is-style-faq-box` | 項目を 1px の枠で囲み、質問の下に破線 |
| `stripe` | `variant="stripe"` | `.is-style-faq-stripe` | 質問に灰色の帯、項目間 24px |
| `rich-answer` | 回答が段落 2 つ＋リスト | `.is-style-faq-border` | 回答内ブロックの余白 |

## 4. マークアップ

```html
<dl class="un-faq un-faq--border">
  <div class="un-faq__item">
    <dt class="un-faq__q">…</dt>
    <dd class="un-faq__a">…</dd>
  </div>
</dl>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

### 共通
| 対象 | プロパティ | 値 |
|---|---|---|
| q / a | position / line-height | relative / 1.5 |
| item（2 つめ以降）| margin-top | 1em |
| q | padding / font-weight | 1em 1em 1em 3em / 700 |
| a | padding / margin-left | 1em 1em 1em 3em / 0（dd の既定を打ち消す）|
| a の子 | margin | 上 0 / 下 1em（最後の子は 0）|
| q::before / a::before | content | `"Q"` / `"A"` |
| q::before / a::before | 位置 / 寸法 | absolute（left 0 / top 0.75em）/ 2em 角 |
| q::before / a::before | line-height / font-family / font-weight / text-align | 2em / `Arial, sans-serif` / 400 / center |
| q::before | color | `--un-color-faq-q` |
| a::before | color / font-weight | `--un-color-faq-a` / 500（本文と同じ）|

### バリアント別
| variant | 対象 | プロパティ | 値 |
|---|---|---|---|
| border | item | padding-left / padding-right | 0.5em / 0.5em |
| border | item（2 つめ以降）| padding-top / border-top | 1em / 1px solid `--un-color-border` |
| box | item | border / padding | 1px solid `--un-color-border` / 0 |

| box | q | padding / border-bottom | 1.25em 1em 1.25em 4em / 1px dashed `--un-color-border` |
| box | a | padding | 1.25em 1em 1.25em 4em |
| box | q::before / a::before | left / top | 1em / 1em |
| stripe | item | margin-bottom | 1.5em（最後は 0）|
| stripe | q | padding / background | 1.25em 1em 1.25em 4em / `--un-color-gray` |
| stripe | a | padding | 1.25em 1em 1.25em 4em |
| stripe | q::before / a::before | left / top | 1em / 1em |

参照サイトは Q/A の色を設定していないため、実測は本文色（#333）。トークンの既定値もそれに合わせ、色を付けたい利用者が上書きする。

## 6. 受け入れ基準

- [ ] 全 5 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] Q/A の印が行頭に揃い、回答が複数行でもぶら下がる
- [ ] 項目の区切り（線・枠・帯）がバリアントごとに正しい
- [ ] `.un-content` の外でも成立する

## 7. 備考

- 参照は `dl > div > dt + dd` の構造。uneri も同じにして、`dt`/`dd` の意味を保つ。
