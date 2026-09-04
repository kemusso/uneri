# PostList / PostListItem — 投稿リスト（F4）

- 状態: impl
- 参照: SWELL の記事一覧 `.p-postList`（`-type-card` / `-list` / `-list2` / `-thumb` / `-big` / `-simple`、`-pc-col*` / `-sp-col*`、`-w-ranking`、`is-first-big`）
- 依存トークン: `--un-color-main`, `--un-color-text`, `--un-color-border`, `--un-ratio-card`, `--un-ratio-list`, `--un-color-rank-*`, `--un-gradient-rank-*`
- ファイル: `src/components/PostList.astro`, `src/components/PostListItem.astro`, `src/styles/parts/post-list.css`, `src/pages/catalog/post-list.astro`, `reference/fixtures/post-list.html`

## 1. 用途

記事へのリンクを並べる一覧。カード・横並び・サムネイル・大判・テキストのみの 6 種。

## 2. API

```ts
// PostList
interface Props extends HTMLAttributes<'ul'> {
  variant?: 'card' | 'list' | 'list2' | 'thumb' | 'big' | 'simple'; // 既定 'card'
  pcColumns?: 1 | 2 | 3;  // ≥600 の列数
  spColumns?: 1;          // <600 の列数
  ranking?: boolean;      // 順位バッジを振る
  firstBig?: boolean;     // 先頭だけ全幅
  class?: string;
  id?: string;
}

// PostListItem
interface Props extends HTMLAttributes<'li'> {
  href: string;
  heading: string;
  excerpt?: string;
  src?: string;      // サムネイル。無ければサムネイルごと出さない
  alt?: string;
  width?: number | string;
  height?: number | string;
  cat?: string;      // サムネイルに重ねるカテゴリ名
  date?: string;     // 表示する日付
  datetime?: string; // `<time datetime>` の値
  sponsored?: boolean;
  class?: string;
  id?: string;
}
```

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `card` | 既定 | `-type-card` | 2 列。画像の下にタイトルと日付 |
| `list` | `variant="list"` | `-type-list` | 画像が左、テキストが右。カテゴリは左上 |
| `list2` | `variant="list2"` | `-type-list2` | `list` を罫線で区切り、偶数行は左右反転。READ MORE つき |
| `thumb` | `variant="thumb"` | `-type-thumb` | 画像の上に白文字を重ねる |
| `big` | `variant="big"` | `-type-big` | 1 件 1 行の大判。下に READ MORE |
| `simple` | `variant="simple"` | `-type-simple` | 画像なし。上下の罫線だけ |
| `card-col2` / `card-col1` | `pcColumns` / `spColumns` | `-pc-col*` / `-sp-col*` | 列数（`pc` は ≥600、`sp` は <600）|
| `ranking` | `ranking` | `-w-ranking` | 金銀銅のバッジで順位を振る |
| `first-big` | `firstBig` | `is-first-big` | 先頭だけ全幅 |

## 4. マークアップ

```html
<ul class="un-post-list un-post-list--card">
  <li class="un-post-list__item">
    <a class="un-post-list__link" href="…">
      <div class="un-post-list__thumb">
        <figure class="un-post-list__figure"><img class="un-post-list__img" src="…" alt=""></figure>
        <span class="un-post-list__cat">カテゴリ</span>
      </div>
      <div class="un-post-list__body">
        <h2 class="un-post-list__title">…</h2>
        <div class="un-post-list__excerpt">…</div>
        <div class="un-post-list__meta">
          <div class="un-post-list__times"><time class="un-post-list__posted" datetime="…">…</time></div>
        </div>
      </div>
    </a>
  </li>
</ul>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px。<600 の値は括弧内）

| 対象 | プロパティ | 値 |
|---|---|---|
| ul | display / flex-wrap / margin / list-style | flex / wrap / 0 -0.5em / none |
| item | width / margin-bottom / padding / position | 50% / 2.5em / 0 0.5em / relative |
| link | display / position / z-index / color | block / relative / 0 / 本文色 |
| thumb | position / overflow / box-shadow | relative / hidden / `0 2px 8px rgba(0,0,0,.1), 0 4px 4px -4px rgba(0,0,0,.1)` |
| thumb::before | inset / z-index / background / opacity | 0 / 1 / `linear-gradient(45deg, グラデ1, グラデ2)` / 0（hover で出る）|
| figure::before | padding-top | `--un-ratio-card`（list 系と thumb は `--un-ratio-list`）|
| img | position / 寸法 / object-fit / transition | absolute 左上 / 100%×100% / cover / transform .25s |
| cat | position / 寸法 / 背景 / 文字 | 右上 0（list 系は左上）/ 高さ 2em・padding 0 0.75em / メインカラー＋45° の細ストライプ / #fff・11px（10px）|
| cat | transform | <600 で scale(.9)（list 系は起点 left top）|
| body | padding-top / transition | 1em / opacity .25s |
| title | font-size / line-height / margin | 1rem / 1.5 / 0 |
| excerpt | font-size | card 13px（0.8em）/ list・list2 14px（0.85em）|
| meta | display / margin-top / font-size | flex・中央揃え / 0.75em / 11px（10px）|
| times | gap / padding / margin-right / opacity | 0.5em / 4px 0 / 0.5em / .8 |
| list | link / thumb / body | flex・wrap・flex-start・space-between / 36% / 60% |
| list2 | ul / item / 偶数行 | 上罫線・padding-top 2em（1.5em）/ 下罫線・padding-bottom 2em（1.5em）/ `row-reverse` |
| list2 | body::after | ≥600 でのみ READ MORE のピル（枠 1px・padding 6px 36px・12px・letter-spacing .5px・opacity .75）|
| thumb | body | 画像の下端に重ねる（absolute・padding 0.75em・`rgba(0,0,0,.5)`・白文字）|
| thumb | title / excerpt | 14px（1.2em）/ 非表示 |
| big | item | margin 0.25em 0、最後以外は下罫線と padding-bottom 3em |
| big | title / excerpt / meta | 1.4em（1.2em）/ 1em・padding-bottom 0.5em / 12px |
| big | body::after | READ MORE（枠 1px・margin-top 24px・padding 1em 0・≥600 は左右 10%）|
| simple | ul / link / title | 上罫線 / padding 1em 0.25em・下罫線・transition background-color .25s / 1em |
| ranking | ul / item::before | `counter-reset: number` / 24×30（≥600 は 28×35）・左上・金銀銅のグラデ・白文字・影 |
| columns | pc / sp | ≥600 で `-pc-col*`、<600 で `-sp-col*`（`-sp-col1` はタイトル 0.95em）|

## 6. 受け入れ基準

- [x] 全 10 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px、style diff 0
- [x] カテゴリの記号（フォルダ）の ink box が参照と一致
- [x] `.un-content` の外でも成立する

## 7. 備考

- カテゴリ名の前の記号は参照がアイコンフォント、uneri が SVG マスク。判定は ink box で行う（spec/04-audit.md §2.1）。
- 参照の一覧はサイドバー・ウィジェット・フッターなど、uneri が持たない文脈ごとの上書きを多く持つ。ここで実装したのは記事本文と同じ文脈で観測できる範囲。
- 順位バッジの金銀銅は参照の描画から採った値をトークン（`--un-gradient-rank-*`）に置いてある。
