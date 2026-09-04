# audit: content  (2026-09-03)

verdict: **PASS**

## 前回 FAIL 項目の解消確認（spec/04-audit.md §7）

| # | 前回 FAIL | 状態 | 根拠 |
|---|---|---|---|
| 1 | `link` @375/768/1200 `a:hover` の `text-decoration`: 参照 `none` → 実装 `underline` | **解消** | `src/styles/base.css` L33-36 は `.un-content a { color; text-decoration: none }` のみで `a:hover` ルールが存在しない。ビルド済み `dist/_astro/Catalog.D1NTW16_.css` も `.un-content a{color:var(--un-color-link);text-decoration:none}` の 1 ルールのみ。Playwright で実際に `[data-variant="link"] a` を hover させた computed style は 375 / 768 / 1200 の全てで `text-decoration-line` = 参照 `none` / 実装 `none`（併せて color, text-decoration-color/style/thickness, border-bottom-*, background-color, opacity, font-weight, text-underline-offset, `::before`/`::after` の content も全て一致）。spec/parts/content.md §3 の `link` 行も「下線なし（hover でも下線なし）」に修正済みで、参照・spec・実装の 3 者が一致。 |
| 2 | `Content.astro` の `interface Props` が spec §2 と不一致（`extends HTMLAttributes<'div'>` が未記載） | **解消** | spec/parts/content.md §2 が `interface Props extends HTMLAttributes<'div'> { class?: string; id?: string }` ＋「class / id 以外の属性（data-* など）はルート div にそのまま透過する」に更新済み。`src/components/Content.astro` の宣言と 1 文字単位で一致し、`{...rest}` のルート展開も spec の注記どおり。 |

## 自動計測

`node scripts/audit/run.mjs content --no-build --port 4399` → 33 ケース（11 variant × 3 viewport）すべて PASS。

| variant | vw | pixel diff | box Δ (w/h) | style diffs |
|---|---|---|---|---|
| paragraph | 375 | 0 % | 0 / 0 | 0 |
| link | 375 | 0 % | 0 / 0 | 0 |
| strong | 375 | 0 % | 0 / 0 | 0 |
| image | 375 | 0 % | 0 / 0 | 0 |
| blockquote | 375 | 0 % | 0 / 0 | 0 |
| code-inline | 375 | 0 % | 0 / 0 | 0 |
| code-block | 375 | 0 % | 0 / 0 | 0 |
| separator | 375 | 0 % | 0 / 0 | 0 |
| ul | 375 | 0 % | 0 / 0 | 0 |
| ol | 375 | 0 % | 0 / 0 | 0 |
| table-default | 375 | 0 % | 0 / 0 | 0 |
| paragraph | 768 | 0 % | 0 / 0 | 0 |
| link | 768 | 0 % | 0 / 0 | 0 |
| strong | 768 | 0 % | 0 / 0 | 0 |
| image | 768 | 0 % | 0 / 0 | 0 |
| blockquote | 768 | 0 % | 0 / 0 | 0 |
| code-inline | 768 | 0 % | 0 / 0 | 0 |
| code-block | 768 | 0 % | 0 / 0 | 0 |
| separator | 768 | 0 % | 0 / 0 | 0 |
| ul | 768 | 0 % | 0 / 0 | 0 |
| ol | 768 | 0 % | 0 / 0 | 0 |
| table-default | 768 | 0 % | 0 / 0 | 0 |
| paragraph | 1200 | 0 % | 0 / 0 | 0 |
| link | 1200 | 0 % | 0 / 0 | 0 |
| strong | 1200 | 0 % | 0 / 0 | 0 |
| image | 1200 | 0 % | 0 / 0 | 0 |
| blockquote | 1200 | 0 % | 0 / 0 | 0 |
| code-inline | 1200 | 0 % | 0 / 0 | 0 |
| code-block | 1200 | 0 % | 0 / 0 | 0 |
| separator | 1200 | 0 % | 0 / 0 | 0 |
| ul | 1200 | 0 % | 0 / 0 | 0 |
| ol | 1200 | 0 % | 0 / 0 | 0 |
| table-default | 1200 | 0 % | 0 / 0 | 0 |

閾値（pixel ≤ 0.3 % / box Δ ≤ 1px / 色 ΔE ≤ 3 / 長さ ≤ 0.5px / その他完全一致）に対し、全項目が余裕をもって内側。

bounding box 実測（ref = impl、`refBox` と `implBox` が全ケースで同値）: 375 → 幅 345px、768 → 幅 706.5625px、1200 → 幅 900px。spec §5 のコンテナ表と一致。

### 「0 %」の妥当性検証（数値が良すぎる場合の自己点検）

「両ページとも空だから 0 %」という偽 PASS を排除するため、審査官が追加で確認した。

- 参照 fixture (`reference/fixtures/content.html`) は SWELL の 6 CSS（main / blocks / single / footer / swell-icons / swell_custom、`reference/swell/build/css/` に実体あり）のみを読み込み、uneri の CSS は一切読んでいない。実装カタログは `src/styles/index.css`（tokens + base + parts）のみ。両者は独立。
- 各 shot は非空（例: paragraph@375 = 345×165px、table-default@1200 = 900×129px）。目視でも本文が描画されている。
- ref/impl の md5 比較: 33 ペア中 30 ペアがバイト単位で完全一致。残り 3 ペアも生ピクセル差は極小 — `code-block-375` 4px / `image-1200` 297px / `image-768` 590px、いずれも最大チャンネル差 5（SVG ラスタライズの丸め差）。
- 全 33 枚の `-diff.png` を走査し、pixelmatch が差分に着ける赤/黄ピクセルは **合計 0 個**。

## FAIL 項目（実装者への指示）

なし。

## 目視所見

全 99 枚（11 variant × 3 viewport × ref/impl/diff）を Read で確認。加えて前回審査時に生成された `link-{375,768,1200}-hover-{ref,impl}.png` 6 枚も確認（content は `HOVER_PARTS` に含まれないため今回の run では再生成されない。hover は上記の Playwright 実測で代替検証済み）。

- spec/04-audit.md §4 の観点別:
  - **疑似要素の形**: `blockquote::before` の二重縦線（5px 幅ボックスの左右 1px border）が 375/768/1200 で位置・上下端（top/bottom 1.5em）・線の濃さとも一致。`figure::after` の clearfix は不可視で差なし。
  - **グラデーション・ストライプ**: 本パーツには存在しない。
  - **アイコン**: 本パーツには存在しない（icon-shape 該当なし）。
  - **テキストの折り返し位置**: paragraph@375 は ref/impl とも「…組 / まれます。二行目に折り返すくらいの長さにしてお / きます。」で改行位置が一致。code-inline@375 も「…その周囲の文章で / す。」で一致。768/1200 も同一。
  - **影のぼかし幅**: 本パーツに box-shadow は無い（ref/impl とも `box-shadow: none`）。
- variant 別:
  - `paragraph`: 段落間 2em、行間 1.8、文字色・weight 500 一致。
  - `link`: リンク色 rgb(17,118,212)、非 hover / hover とも下線なしで一致。
  - `strong`: weight 700 の太さ・字面幅一致。
  - `image`: 375/768 は幅いっぱい、1200 は 800px 自然幅で中央寄せ。figcaption の位置・サイズ・opacity 一致。ラスタライズ由来の最大 5/255 の階調差のみ（不可視）。
  - `blockquote`: 灰背景の範囲、padding（左 3em）、cite の italic・上余白・opacity 一致。
  - `code-inline`: `inline-flex` により行の高さが広がっていない（wrapper 高さ 29px = 通常行と同一）。枠線・角丸 2px・左右 0.5em マージン一致。
  - `code-block`: 枠線 1px / 角丸 2px / padding 0.5em、375 での 0.85em → 600px 以上で 0.875em の段階も一致。
  - `separator`: 幅 100px・中央・1px・濃さ一致（wrapper 高さ 1px）。
  - `ul` / `ol`: disc / 入れ子 circle / decimal のマーカー位置、li 行間 1.5、padding-left 1.5em 一致。
  - `table-default`: th 背景 #04384c・白文字・weight 700、罫線 #dcdcdc、セル padding 0.5em 0.75em、列幅の配分まで一致。
- fixture の妥当性: 参照側マークアップは `.post_content` 直下に WP コアブロックのクラス（`wp-block-image` / `wp-block-quote` / `wp-block-code` / `wp-block-separator` / `wp-block-list` / `wp-block-table`）を正しく付けており、SWELL のカスタマイザー変数（`--color_main` #04384c / `--color_link` #1176d4 / `--color_text` #333）も有効。**fixture-suspect は今回なし**（前回 FAIL 1 で疑った hover 挙動は、参照 CSS に `.post_content a:hover` の下線ルールが存在しないことが確定し、spec 側の記述誤りだったと結論。修正済み）。

## 仕様適合

- **バリアント網羅: OK**。spec §3 の 11 個（paragraph, link, strong, image, blockquote, code-inline, code-block, separator, ul, ol, table-default）が `src/pages/catalog/content.astro` → `dist/catalog/content/index.html` に `[data-variant]` として同順で存在。参照 fixture と順序・ダミーテキストも一致。spec にないバリアントの混入なし（§6 の 1:1 要件を満たす）。
- **props: OK**。`src/components/Content.astro`:
  ```ts
  interface Props extends HTMLAttributes<'div'> {
    class?: string;
    id?: string;
  }
  const { class: cls, id, ...rest } = Astro.props;
  ```
  spec §2 と完全一致。`class:list` 使用、ルート要素 1 つ、`<slot />` あり、frontmatter 先頭に 1 行 JSDoc + spec ポインタあり（01-coding-rules §4 準拠）。`src/index.ts` から re-export 済み。
- **コーディング規則（`src/styles/base.css` / `src/styles/tokens.css` / `src/components/Content.astro`）: OK**。
  - `!important`: 0 件。
  - 詳細度: 最大 (0,2,1)（`.un-content .un-image::after`、`.un-content blockquote > :last-child`）。(0,3,0) 以上は 0 件。※ 01-coding-rules §3 の字面「最大 (0,2,0)」を厳密に取ると疑似要素/型セレクタ 1 個分だけ上回るが、これは `.un-content <要素>` という本パーツ必然の書き方に由来し、クラス数は 2 以下。前回審査と同じく (0,3,0) 基準で OK 判定とする（規則側の表記を「クラス 2 個まで」と明確化するのが望ましい・任意）。
  - `swell` 文字列: `src/` 配下に 0 件。
  - トークンを経由しないリテラル色: `#fff`（th 文字色）、`rgba(0,0,0,0.1)`（inline code の border、hr の border-bottom）のみ。規則 §3 が明示的に許容する「白/黒/透明」の範囲内で違反なし。※ 同値が 2 箇所あるので `--un-color-rule-thin` 等へトークン化する余地あり（任意・非 FAIL）。
  - アイコンフォント: 不使用（そもそもアイコンなし）。
  - その他: プリプロセッサ/Tailwind なし、ベンダープレフィックス手書きなし、メディアクエリは `@media (min-width: 600px)` のみ（モバイルファースト）、疑似要素は 2 箇所とも `content:""` ＋「何を描いているか」のコメントあり、他パーツのクラス参照なし、命名は `un-` 接頭辞の BEM 風。
- **クリーンルーム: OK**。`node scripts/audit/cleanroom.mjs` → `cleanroom: OK (1900 reference runs indexed)`。参照 CSS の連続 3 宣言一致・`swell` 文字列とも検出なし。
- **spec §6 受け入れ基準**: 4 項目すべて充足（11 バリアント × 3 viewport が閾値内 / 直下余白 2em・最後の子 0 / blockquote 二重縦線再現 / inline code が `inline-flex` で行間を広げない）。

## 残課題（非 FAIL・任意）

1. spec/parts/content.md 内の自己矛盾: §3 の `image` 行は figcaption を「上 0.6em」と書くが、§5 の要素表と実装・参照実測はいずれも `margin-top: 0.75em`。参照の再現は 0 % 差で正しいので実装は無修正でよいが、§3 の記述を 0.75em に直すのが望ましい（**spec-suspect**、判定には影響させない）。
2. `audits/content/shots/` に 2026-09-02 生成の `link-*-hover-*.png` 6 枚が残留している（content は `HOVER_PARTS` 外のため上書きされない）。誤解を招くので削除するか、`HOVER_PARTS` に content を追加して常時生成するかのどちらかに寄せると良い。
3. `rgba(0,0,0,0.1)` の 2 箇所トークン化（上記コーディング規則の項）。
