# audit: text  (2026-09-04)

verdict: **FAIL**

参照 = `reference/fixtures/text.html`（SWELL）/ 実装 = `dist/catalog/text/index.html`。
`node scripts/audit/run.mjs text --no-build --port 4405` は **57 セル（19 バリアント × 375/768/1200）すべてで pixel 0 / box 0 / style diff 0**、
`cleanroom.mjs` OK、`standalone.mjs` OK。前回 FAIL 5 件のうち **4 件は実際に直っている**ことを、
CSS を意図的に壊す退行テストで裏取りした（下記「前回 FAIL 項目の検証」）。

ただし前回 FAIL #3（利用者の `style` prop が捨てられる）は **文字列形式だけの部分修正** であり、
`interface Props extends HTMLAttributes<'span'>` が型として許可しているオブジェクト形式（`CSSProperties`）を渡すと
利用者のスタイルは依然として破棄され、さらに `style="…;[object Object]"` という不正な属性値が出力される。
spec/parts/text.md §2「利用者の `style` は破棄せず…連結する」に対する未達のため FAIL とする。

---

## 前回 FAIL 項目の検証（最優先）

| # | 前回の FAIL | 結果 | 検証方法（審査側で実施） |
|---|---|---|---|
| 1 | `--un-text-size` / `--un-text-color` / `--un-mark-color` が子孫に継承され二重適用 | **解消** | `text.css` から `--un-*: initial` の 3 行を削除して再ビルド → `nest-size-color` が pixel 3.99 / 3.45 / 2.66 %、box Δ 高さ 16.875 / 9 / 9 px、style diff 4 で ❌ に転落。fixture が退行を確実に捕まえることを確認。さらに独自 fixture で `lg>sm` / `red>blue` / `mark>mark` / `lg>素の span>mark` の 3〜4 段まで参照と一致 |
| 2 | 色付きテキスト内のリンク色 | **解消（`.un-content` 内）** | `Text.astro` から `--un-color-link:currentColor` を削除して再ビルド → `color-link` が style diff 6 で ❌。ただし後述の「所見 2」の制約あり |
| 3 | 利用者の `style` prop が捨てられる | **未達（下記 FAIL 1）** | 実際にコンポーネントをレンダリングして出力 HTML を確認 |
| 4 | fixture が定義的性質を出していない | **解消** | 19 バリアントが spec §3 と 1:1、参照 fixture と実装カタログのバリアント名・順序・ダミーテキストが完全一致。`mark-wrap` は `.un-mark{display:inline-block}` を注入した退行テストで pixel 16.0 % / box Δ 27 px と、`mark-yellow`（3.18 %）より強く反応することを確認（折り返しの定義的性質が効いている） |
| 5 | `standalone.mjs` がこのパーツを検証できない | **解消** | 2 種類の壊し方で確認（下記） |

### standalone.mjs の実効性テスト（審査側で CSS を意図的に破壊）

| 壊し方 | 検出 |
|---|---|
| `.un-mark` → `.un-content .un-mark` にセレクタを変更 | **検出**。`text.css: rule ".un-content .un-mark" depends on .un-content` を 19/19 バリアントで報告。加えて CRITICAL プロパティ経由でも `background-image: in=linear-gradient(...) out=none` を検出 |
| `.un-content` の文字列を使わない隠れた container 依存（`base.css` に `.un-content { --_ctx-col:#333; --_ctx-pad:0px }` を足し、`text.css` で `color:var(--un-text-color, var(--_ctx-col, rgb(1,2,3)))` / `padding-bottom:var(--_ctx-pad,4px)` として参照） | **検出**。`.un-mark[0] padding-bottom: in=0px out=4px`、`.un-text[0] color: in=rgb(51,51,51) out=rgb(1,2,3)` を報告 |

`standalone.mjs` はこのパーツに対して実効性がある。修飾子なしのブロッククラス（`.un-mark` / `.un-text`）が `DECORATED` に含まれ、
`text.css` が宣言する `color` / `font-size` / `background-image` / `box-sizing` が実際に突き合わされている。

（補足: `standalone.mjs` は「container 依存の有無」の検査であって正しさの検査ではない。
`.un-mark` の `background-image` 宣言を丸ごと削除しても内外で同値になるため NG にならない。これは設計どおりで、
その退行は `run.mjs` の pixel diff が拾う。）

---

## 自動計測（run.mjs / 公式 fixture）

19 バリアント × 3 viewport = 57 セル。**全セルが同値**のため viewport を横に畳んで記載する（値は 375 / 768 / 1200 の順）。

| variant | vw | pixel diff % | box Δ (w/h) | style diffs |
|---|---|---|---|---|
| mark-yellow | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| mark-blue | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| mark-green | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| mark-orange | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| color-red | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| color-blue | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| color-green | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| color-main | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| size-xs | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| size-sm | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| size-md | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| size-lg | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| size-xl | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| size-inline | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| color-inline | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| thin | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| mark-wrap | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| nest-size-color | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |
| color-link | 375 / 768 / 1200 | 0 / 0 / 0 | 0/0 | 0 |

57 枚の `-diff.png` を全走査したが、差分色（赤）ピクセルは 1 個もない。

## 独自検証（審査エージェントが自作した追加 fixture・19 ケース × 3 viewport）

公式 fixture と同一のシェル（参照は SWELL の `post_content`、実装は `dist` のカタログ HTML と同一の CSS）に
参照 SWELL クラスと実装コンポーネントの出力 HTML を並置し、pixel / bounding box / computed style
（color, background-image, background-color, font-size, font-weight, line-height, letter-spacing, opacity,
display, text-decoration-*, box-sizing, margin, padding）を要素ツリー全体で比較。

`x-mark-in-size` / `x-size-in-size` / `x-mark-in-mark` / `x-color-in-color` / `x-plain-in-size` / `x-plain-in-color` /
`x-deep-nest`（3 段） / `x-in-strong` / `x-in-h2` / `x-in-li` / `x-thin-in-thin` / `x-link-in-mark` /
`x-link-nested-color`（赤 > lg > `a`） / `x-mark-in-color` / `x-color-in-mark` / `x-style-prop`（文字列 `style` の透過） /
`x-mark-style-prop` / `x-arb-mark-color`（`#ff8800`） / `x-arb-size`（`2.25em`）

→ **全 57 セルで参照と完全一致**（pixel > 0.3 % なし、box Δ ≤ 1px、上記プロパティの不一致 0）。
入れ子の二重適用、折り返し、見出し・`strong`・`li` の中、リンク内包、任意色・任意サイズ、文字列 `style` の透過は
いずれも参照どおり。opacity の入れ子（`thin` in `thin` = 0.64 相当）も一致。

`.un-content` の外（`color:#333;font-family:var(--un-font-family);font-size:1rem;font-weight:500;line-height:1.8`
だけを与えた素の div）でも 19 バリアント全ての `.un-mark` / `.un-text` の装飾プロパティは container 内と同値
（差分は所見 2 の `a` のみ）。

---

## FAIL 項目（実装者への指示）

1. **`Mark.astro` / `Text.astro`: `style` prop のオブジェクト形式が破棄され、不正な属性値になる。**
   `interface Props extends HTMLAttributes<'span'>` は Astro の型定義上
   `style?: string | CSSProperties | undefined | null`（`node_modules/astro/astro-jsx.d.ts:578`）であり、
   オブジェクトを渡すのは型チェックを通る正当な入力。しかし両コンポーネントは
   `[…, userStyle].filter(Boolean).join(';')` で文字列連結しているため、実出力は次のようになる（実際にビルドして確認）。

   ```
   入力:       <Text color="red" style={{ letterSpacing: '0.2em' }}>…</Text>
   期待:       style="--un-text-color:var(--un-color-deep-1);--un-color-link:currentColor;letter-spacing:0.2em"
   実際:       style="--un-text-color:var(--un-color-deep-1);--un-color-link:currentColor;[object Object]"

   入力:       <Mark style={{ letterSpacing: '0.2em' }}>…</Mark>
   実際:       style="--un-mark-color:var(--un-color-mark-yellow);[object Object]"
   ```

   利用者のスタイルは適用されず（前回 FAIL #3 が未解消のまま）、加えて壊れた CSS 宣言がページに出る。
   素の Astro 要素（`<span style={{ letterSpacing:'0.2em' }}>`）は `style="letter-spacing:0.2em"` を正しく出すため、
   パーツを噛ませた瞬間に標準の挙動から退化する。
   推定原因: `style` を string 前提で `join(';')` している（`Mark.astro` 24 行目 / `Text.astro` 29-34 行目）。
   修正方針はいずれかで可 —
   (a) `interface Props` で `style?: string` を明示的に再宣言し、型と実装を一致させる、
   (b) オブジェクトを camelCase → kebab-case に変換して連結する。
   なお文字列形式（末尾 `;` 付きを含む）と rest spread（`class` / `id` / `data-*` / `aria-*`）は正しく動作している。

---

## 目視所見

- `audits/text/shots/` の `mark-yellow` `mark-orange` `mark-wrap` `size-xl` `thin` `nest-size-color` `color-link` を
  375/768/1200 で ref / impl / diff とも確認。マーカーの位置（行の下 36 %）、太さ、折り返し 2 行目への追従、
  テキストの折り返し位置、色、薄字の濃度いずれも参照と区別がつかない。diff は全面黒。
- `mark-wrap`: 参照・実装とも 2 行それぞれの下端にマーカーが付き、行末での途切れ方も同じ。
- `nest-size-color`: 内側の赤いテキストが外側の 1.25em を二重に受けず、参照と同じ字面幅。
- `color-link`: リンクが `#e44141` で下線なし、参照と一致。
- 疑似要素による装飾はこのパーツにないため、形状・グラデーション周期・影の観点は該当なし。

## 仕様適合

- **バリアント網羅**: OK。spec/parts/text.md §3 の 19 バリアントが過不足なくカタログにあり、
  参照 fixture と実装カタログでバリアント名・順序・ダミーテキスト（タグを除いた文字列）が完全一致。
- **props**: NG（FAIL 1）。名前付きの値・既定値は spec §2 と一致
  （`Mark { color = 'yellow' }`、`Text { size?, color?, thin = false }`、いずれも `class?` / `id?` / `(string & {})` 対応）、
  トークン写像（`--un-color-mark-*` / `--un-color-deep-1..3` / `--un-color-main` / `--un-fz-*`）も §5 と一致するが、
  継承した `style` の型と実装が食い違う。
- **コーディング規則**: OK。`!important` なし、詳細度は最大 `(0,1,0)`
  （`.un-mark` / `.un-text` / `.un-text--thin` / `.un-*::before|after`）、命名は `un-` 接頭辞 + BEM、
  `swell` 文字列なし、`text.css` にリテラル hex なし（色は全てトークン経由）、単位は `em`、
  `.un-content` 前置なし、`@media` なし、ベンダープレフィックスなし、`class:list` 使用、`interface Props` あり、
  frontmatter 1 行コメントに spec へのポインタあり、ルート要素 1 つ、`id` prop 受け取りあり。
  `src/index.ts` に `Mark` / `Text` の re-export、`src/styles/index.css` に `parts/text.css` の import あり。
  カタログの `#f40540` は spec §3 の `color-inline` バリアントの実演値であり、パーツ CSS のリテラル色ではない。
- **クリーンルーム**: OK（`cleanroom: OK (1900 reference runs indexed)`）。
- **standalone**: OK（`standalone: OK (119 variants, 187 rules)`）。上記のとおり実効性も確認済み。

## 所見（FAIL 理由にはしないが記録）

1. **`.un-mark` は `background-image` 単独指定、参照は `background` ショートハンド。**
   参照は `background:linear-gradient(...)` なので `background-color` / `-position` / `-size` / `-repeat` も同時にリセットされるが、
   uneri はしない。公式 fixture・独自 fixture のいずれでも差は出ず（span に他の背景がないため）、
   `.un-mark` を背景色付き要素に付けた場合だけ挙動が分かれる。uneri 側の方が副作用が小さいので現状で可。

2. **`.un-content` の外では、色付き `Text` の中のリンクが文字色に追従しない。**
   `Text` は `--un-color-link:currentColor` を出すが、それを消費するのは `base.css` の
   `.un-content :where(a) { color: var(--un-color-link) }` だけ。container 外では
   `a` が UA 既定（`rgb(0,0,238)` + 下線）に戻る（審査側の inside/outside 比較で確認）。
   spec/01 §3 が「素の要素に既定を与える規則は `.un-content` に閉じる」を許しており、
   参照 SWELL も `.swl-inline-color` + `.post_content a` という同じ構造なので **参照との差はゼロ**。
   ただし spec/parts/text.md §2 は「`color` を指定したときは装飾範囲内のリンク色も追従させる」を
   Text パーツの API 契約として書いているため、container 外の挙動を spec に明記するか、
   `.un-text` 側で `a` の色も引き受けるかを決めておくのが望ましい（現状は spec の記述が実装より広い）。

3. **参照 fixture 内でのマークアップの不統一。**
   `color-red` / `color-blue` / `color-green` / `color-main` は `.font_col_*` 単独、`color-link` だけ `.font_col_red swl-inline-color`。
   一方 uneri は `color` 指定時に常に `--un-color-link:currentColor` を出す。
   spec §2 が「参照の `.swl-inline-color` と同じ」と明言しているので判定には影響しないが、
   参照側も `color-*` 全バリアントで `swl-inline-color` を併記した方が対応関係が明確
   （現状はリンクを含まないバリアントで差が出ないため露見しないだけ）。

4. **`color-link` の pixel diff の余裕が薄い。**
   `--un-color-link:currentColor` を削除した退行テストで pixel diff は 0.197〜0.272 % にとどまり、
   閾値 0.3 % を **下回った**（FAIL 判定は style diff 6 件で成立）。
   fixture のリンク文字列（「その中のリンク」8 文字）が短いことが原因。
   pixel 側にも余裕を持たせるため、`color-link` のリンクテキストを 1 行の半分程度まで長くすることを推奨する。

## 審査中に行った破壊テストの後始末

`src/styles/parts/text.css` / `src/styles/base.css` / `src/components/Text.astro` を一時的に改変したが、
バックアップから復元し `diff` で完全一致を確認済み。`npx astro build` 済みで
`run.mjs` = PASS / `standalone.mjs` = OK / `cleanroom.mjs` = OK の状態に戻してある。
一時ファイル（`.audit-tmp/`、`src/pages/probetmp.astro`、`dist/probetmp/`）は削除済み。
審査エージェントは製品コードを恒久的に変更していない。
