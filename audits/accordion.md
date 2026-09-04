# audit: accordion  (2026-09-04)

verdict: **FAIL**

審査対象: `src/styles/parts/accordion.css` sha256 `b861d18a7e4a…`（作業ツリー。commit 35f80aa + 未コミット差分）

> **審査環境の注意**: 審査中に他エージェントが `dist` を繰り返し再ビルドし、`src/styles/parts/accordion.css`
> も一度書き換わった（09:53 に `.un-accordion__body > *` の余白規則が追加され、途中一瞬 `[open] >` セレクタが
> 壊れた状態が観測された）。上記 sha256 で安定してから全計測をやり直している。独自検証スクリプトは
> `dist/catalog/accordion/index.html` から CSS の href を実行時に解決してハッシュ変動に耐えるようにした。

## 自動計測

`node scripts/audit/run.mjs accordion --no-build --port 4409` → **PASS**（24/24 行）。
pixel diff は spec/04-audit.md §2.1 によりグリフ透明状態で計測。

| variant | vw | pixel diff % | box Δ (w/h) | ink Δ (cx/cy/w/h) | style diffs |
|---|---|---|---|---|---|
| default / -hover | 375 | 0 | 0/0 | 0/0.5/0/1 | 0 |
| simple / -hover | 375 | 0 | 0/0 | 0/0.5/0/1 | 0 |
| border / -hover | 375 | 0 | 0/0 | 0/0.5/0/1 | 0 |
| main / -hover | 375 | 0 | 0/0 | 0/0/0/2 | 0 |
| default / -hover | 768 | 0 | 0/0 | 0.5/1/1/0 | 0 |
| simple / -hover | 768 | 0 | 0/0 | 0.5/1/1/0 | 0 |
| border / -hover | 768 | 0 | 0/0 | 0.5/1/1/0 | 0 |
| main / -hover | 768 | 0 | 0/0 | 0.5/1/1/0 | 0 |
| default / -hover | 1200 | 0 | 0/0 | 0.5/1/1/0 | 0 |
| simple / -hover | 1200 | 0 | 0/0 | 0.5/1/1/0 | 0 |
| border / -hover | 1200 | 0 | 0/0 | 0.5/1/1/0 | 0 |
| main / -hover | 1200 | 0 | 0/0 | 0.5/1/1/0 | 0 |

**閉じた状態は本物に一致している。** 独自に全 CSS プロパティ（`getComputedStyle` の全エントリ、深さ 6、
`::before`/`::after`/`::marker` 込み）を総当たりしても、閉じた状態のレイアウト・描画プロパティの差分は
**ゼロ**（差が出たのは後述の list-style / -webkit-font-smoothing / -webkit- 重複だけ）。
項目 1 つ / 3 つ / 見出し 2 行折り返し のいずれでも差分 0。

自動計測が PASS なのは、**カタログ・fixture が閉じた項目しか含まないため**であり、
以下の FAIL 項目はいずれも自動計測の射程外にある。

## FAIL 項目（実装者への指示）

### 1. 開いた状態の本文に上下パディングが無い（全 4 バリアント / 全 vw）

`.un-accordion__body` の `padding-top` / `padding-bottom`: 参照 **16px（1em）** → 実装 **0px**。

- 参照 CSS: `.swell-block-accordion__body { padding: 1em }` ＋ 閉のときだけ
  `:not(.is-opened) > .swell-block-accordion__body { padding-top: 0 !important; padding-bottom: 0 !important }`。
  つまり **1em は開いた状態の静止値**であって、アニメーションの途中値ではない。
- 実装 CSS は `padding-right/left: 1em` しか宣言せず、`[open] > .un-accordion__body` にも padding を戻していない。
- 実測（@1200・`details[open]` / 参照は SWELL の JS と同じく `.is-opened` を付与）:

  | variant | body padding 参照 → 実装 | body 高さ 参照 → 実装 | 項目高さ 参照 → 実装 |
  |---|---|---|---|
  | default | `16px` → `0px 16px` | 60.80 → 28.80 | 121.59 → 89.59 |
  | simple | `16px 8px` → `0px 8px` | 61.80 → 29.80 | 124.59 → 92.59 |
  | border | `16px 8px` → `0px 8px` | 61.80 → 29.80 | 124.59 → 92.59 |
  | main | `16px` → `0px 16px` | 61.80 → 29.80 | 122.59 → 90.59 |

  開いた項目 1 つあたり **32px（上下 16px ずつ）不足**。本文が見出し帯および項目下辺に密着する。

- spec/parts/accordion.md §7 の免責は「JS で高さをアニメーションさせる」点についてのもので、
  静止状態のパディングまで免除していない。§5 の計測表が `body | padding-left / padding-right | 1em / 1em`
  としか書いていないのが原因（**spec の記載漏れ**。§5 に padding-top / padding-bottom = 1em（開）/ 0（閉）を追記すべき）。
- 推定修正: `[open] > .un-accordion__body { padding-top: 1em; padding-bottom: 1em }`
  （`transition` の `padding` は既に宣言済みなので開閉アニメーションにも乗る）。

### 2. `.un-accordion__label` に `word-break: break-all` が無く、横方向にはみ出す

参照 `.swell-block-accordion__title .swell-block-accordion__label { word-break: break-all }` → 実装は未宣言（`normal`）。

- 全 4 バリアント・閉じた状態でも再現する。見出しに改行可能位置のない長い文字列（URL 等）を入れると、
  `summary` が flex コンテナで label が `flex-grow:1` のため、label の min-content 幅（＝語全体の幅）が
  そのまま最小幅になり、ボックスをはみ出す。
- 実測（アコーディオン幅 280px、見出し `見出し https://example.com/very/long/path/…`、`.un-content` の中）:

  | | 参照 | 実装 |
  |---|---|---|
  | `summary.scrollWidth` / `clientWidth` | 248 / 248（はみ出し 0） | **664 / 280（はみ出し 416px）** |
  | label 幅 | 196 | 628.17 |
  | 矢印アイコンの x | 212（枠内） | 644.17（**枠外**） |
  | summary 高さ | 147.19 | 89.59 |

- `.un-content` の `overflow-wrap: break-word` では代替にならない（`break-word` は flex アイテムの
  自動最小サイズ＝min-content を縮めない。`word-break: break-all` は min-content を 1 文字幅にする）。
  `.un-content` の外ではさらに悪化する。
- spec/parts/accordion.md §5 の label 行が `flex-grow / padding-right` しか記録していないのが原因（**spec の記載漏れ**）。
- 推定修正: `.un-accordion__label { word-break: break-all }`。
- fixture 側の不備でもある。spec/04-audit.md §2.0 が警告している「定義的な性質が出るダミーテキスト」に
  該当するのに、`reference/fixtures/accordion.html` / `src/pages/catalog/accordion.astro` の見出しは
  短い日本語 2 件しかなく、この差は自動計測に一切現れない。

### 3. 開いた状態の `overflow`（全 4 バリアント）

`[open] > .un-accordion__body`: 参照 `overflow: hidden` → 実装 `overflow: visible`。

- 参照は開いた後も `hidden` のまま（`.swell-block-accordion__body { overflow: hidden }` を打ち消していない）。
- 本文にはみ出す要素（横長のテーブル、負マージンのボックス）を入れたときに挙動が分かれる。
- 推定修正: `[open] > .un-accordion__body` から `overflow: visible` を落とす（`hidden` のままにする）。

### 4. `.un-accordion__icon` の `line-height: 1.8em` は継承値のハードコード

参照はアイコン span に `line-height` を宣言していない（`.swell-block-accordion__icon { flex:0 0 auto; font-size:1.25em; text-align:right; width:1em }` のみ）。
実装は `line-height: 1.8em` を直に書いている。カタログの行間がちょうど 1.8 なので審査条件下では
計算値が一致してしまうが、**行間が 1.8 でない文脈では参照と食い違う**。

- 実測（周囲の `line-height: 1.4`、@1200）: 参照 `28px` → 実装 **`36px`**（固定）。
- 現状はアイコン span の高さを `calc(1em + 1px)` で固定し子を `display:block` にしているため
  レイアウトへの影響は出ていないが、参照が持たない値を「fixture で測った数値」として埋め込む形になっており、
  自動計測の style diff を通すためだけの宣言になっている。
- spec/parts/accordion.md §5 の「icon | line-height | 1.8em」は参照の宣言ではなく継承後の実測値。
  同じく「icon | 寸法 | 1em × calc(1em + 1px)」も参照は `width: 1em` しか宣言しておらず、
  高さは内容依存。**spec §5 の記載を「参照の宣言」と「実測の派生値」に分けて書き直すべき**。
- 推定修正: `.un-accordion__icon { line-height: 1.8em }` を削除して継承させる。

## 目視所見

- **矢印の向き・大きさ・位置**: 閉じた状態は参照・実装とも下向きの塗りつぶし三角形。10 倍拡大で
  比較したが、大きさ・位置とも判別できないレベルで一致（ink Δ ≤ 1px、中心 ≤ 0.5px）。
  形は uneri 側が頂点がわずかに平ら／上辺がやや広い。spec/04-audit.md §4 の "icon-shape" として記録、FAIL 理由にはしない。
- **開いた状態の矢印**: 参照は `icon-caret-up` という別グリフ、uneri は同じ caret SVG を
  `transform: scale(-1)` で反転する。computed transform は参照 `matrix(1,0,0,1,0,0)` に対し
  実装 `matrix(-1,0,0,-1,0,0)` と一致しないが、**描画結果は同じ上向き三角形**。
  対称な図形を 1 個の SVG で使い回す妥当な手法。"icon-shape" として記録、FAIL 理由にしない。
- **見出しの帯**: default の灰帯（`--un-color-gray`）、main の濃紺帯＋白文字とも pixel diff 0。
  main の白い矢印も参照と同位置・同サイズ。
- **項目の区切り**: simple の上下 1px 実線、border の 1px 枠、default の 1em 間隔、いずれも一致。
  simple/border の本文上端の 1px 破線は、閉じた状態でも参照・実装とも同じ位置に 1px 描かれる（`height:0` + border-box）。
- **本文の余白**: 閉じた状態は一致。**開いた状態は上下 16px が抜けており、
  本文が帯に密着して見た目が明確に崩れる**（FAIL 項目 1、スクリーンショットで確認）。
- ホバー: 参照・実装とも `summary` にホバー装飾は無く、pixel diff 0。

### 数値に出たが FAIL としないもの（根拠つき）

| 対象 | 参照 | 実装 | 判断 |
|---|---|---|---|
| `summary` とその子孫の `list-style-type` / `-position` | `disclosure-closed` / `inside` | `none` / `outside` | 実装が `list-style: none` を明示。参照は `display:flex` だけでマーカーを消しているため Firefox で漏れる。**実装のほうが堅い**。描画差なし |
| `i::before` の `-webkit-font-smoothing` | `antialiased` | `auto` | アイコンフォントのグリフ描画設定。mask 塗りには無関係（§2.1 の趣旨） |
| `i::before` の `-webkit-mask-position-x/y` | `0%`（mask 無し） | `50%` | 参照に mask が無いので比較対象外 |
| `i` の `transition-*` | `transform, opacity, -webkit-transform`（3 値） | `transform, opacity`（2 値） | autoprefixer の重複。§2.2 で明示的に無視する扱い |
| `.un-content` 内外の `p` の margin | — | 内 0 / 外 16px | `base.css` と UA 既定の差。§5 が「記事本文の要素既定」として比較から除外 |

## 仕様適合

- **バリアント網羅**: OK。`default` / `simple` / `border` / `main` の 4 つが spec §3・fixture・カタログで
  1:1、順序もダミーテキストも一致。spec にないバリアントはカタログに無い。
- **props**: OK。
  - `Accordion`: `variant?: 'default'|'simple'|'border'|'main'`（既定 `'default'`）/ `class` / `id`、
    `HTMLAttributes<'div'>` 継承・`...rest` をルートに展開。spec §2 と一致。
  - `AccordionItem`: `title: string`（必須）/ `open?: boolean`（既定 `false`）/ `class` / `id`、
    `HTMLAttributes<'details'>` 継承。spec §2 と一致。
  - 指摘（軽微）: `title` が `HTMLAttributes<'details'>` の HTML `title` 属性と名前衝突し、
    分割代入で取り出されるため利用者はツールチップ用の `title` を渡せない。spec どおりなので FAIL にはしない。
  - `src/index.ts` から `Accordion` / `AccordionItem` とも re-export 済み。
- **コーディング規則（spec/01-coding-rules.md）**: 数え直した結果、規則違反なし。
  - `!important`: 0 件 / `swell` の文字列: 0 件。
  - リテラル色: `#fff` のみ（§3 の「白/黒/透明は可」）。他は全てトークン経由。
  - 詳細度: 全 30 セレクタを機械的に数え直し、最大 **(0,2,0)**（`.un-accordion .un-accordion__body > *`、
    `[open] > .un-accordion__title .un-accordion__icon--closed` ほか）。`:where()` は 0、
    状態擬似クラスと属性セレクタは §3 どおり除外。上限内。
  - 命名: `.un-accordion` / `__item` / `__title` / `__label` / `__icon` / `__body`、
    修飾子 `--default/simple/border/main`、内部変数 `--_caret`。§2 に適合。
  - 状態はクラスでなく `[open]` 属性で表現。§2.1 に適合。
  - アイコンは `mask-image` + data URI（アイコンフォント不使用）。§3 に適合。
  - 疑似要素に `content:""` ＋「何を描いているか」のコメントあり。§3 に適合。
  - 指摘（軽微・FAIL にはしない）: `::-webkit-details-marker` は §3 の「ベンダープレフィックス手書き禁止」に
    形式上触れるが、これはプロパティではなく標準代替の無い疑似要素セレクタで、参照 CSS も同じ 1 宣言を持つ。
    Safari のマーカーを消す唯一の手段のため許容と判断。
  - アクセシビリティ（§5）: §5 は「開閉するものは `button` + `aria-expanded` + `aria-controls`」と書いているが、
    本パーツは spec/parts/accordion.md §1 で `details`/`summary` の標準動作と定めており、
    `summary` はネイティブに同等のロールと展開状態を持つ。実測でも `summary` はフォーカス可能
    （`tabIndex=0`、`outline-style: auto` が残っている＝フォーカスリングを消していない）、
    Enter キーで `details.open` が切り替わる。装飾アイコンには `aria-hidden="true"` あり。適合と判断。
- **`.un-content` の外**: OK。全 4 バリアント × 6 パターンを `.un-content` 内と
  「同じ文字設定だけを与えた素の div」内でレンダリングして比較したところ、
  アコーディオン自身が持つ装飾（帯・枠・罫線・パディング・矢印位置）に差は無い。
  差が出るのは `.un-content` 自身の左右パディングと、本文 `p` の既定 margin（§5 が除外する範囲）のみ。
- **standalone**: `node scripts/audit/standalone.mjs accordion` → **OK**（4 variants, 313 rules）。
- **クリーンルーム**: `node scripts/audit/cleanroom.mjs` → **OK**（1900 reference runs indexed）。

## 審査ツール・fixture の不備（根拠つき）

### A. 開いた状態がどのツールからも見えない（今回の FAIL 1・3 が見逃された原因）

- `run.mjs` はカタログページをそのまま撮るが、`src/pages/catalog/accordion.astro` の
  `AccordionItem` は 1 つも `open` になっていない。
- `standalone.mjs` も同じ dist の markup を使うため、`[open] > …` のルールは
  「inside 0 個 / outside 0 個」で一致扱いになり素通りする。
- **検証**: サンドボックス複製（`src/styles` と `dist` をコピーし `standalone.mjs` の ROOT を移した環境）で
  `[open] > .un-accordion__body { padding-top: 999px; background: red; position: fixed }` を
  CSS とビルド済み CSS の両方に注入したところ、`standalone: OK (4 variants, 314 rules)` のまま通過した。
- 対策案: カタログ／fixture に `open` の項目を含むバリアント（例 `default-open`）を 1 つ足す。
  spec/parts/accordion.md §7 の「開いた状態は参照と一致しない」は **高さのアニメーション**についてのみ有効で、
  padding / overflow / 本文ブロックの余白といった静止値は比較可能。**現在の線引きは広すぎる**。

### B. アイコンの ink box 判定の穴

`ICON_PARTS` に accordion を登録し、グリフを透明にして pixel diff を採る方式そのものは妥当で、
実際 4 バリアント全 vw で **0.000%** という非常に強い一致を得ている（枠・帯・罫線・余白・矢印以外の全てが厳密比較される）。
ただし ink box 側には抜け道がある。実装の caret に意図的な摂動を注入して確認した（`default` @1200、参照 ink box = 13×84）:

| 注入した欠陥 | pixel%（グリフ透明時） | ink Δ (cx/cy/w/h) | run.mjs の判定 |
|---|---|---|---|
| なし（基準） | 0.000 | 0.5/1/1/0 | PASS |
| caret を 0.7em に縮小（全項目） | 0.000 | 0.5/1/**3**/2 | **PASS（見逃し）** |
| caret を 1.3em に拡大 | 0.000 | 0.5/1/5/2 | FAIL ✓ |
| 横に +2px ずらす | 0.000 | **2.5**/1/1/0 | FAIL ✓ |
| 縦に +4px ずらす | 0.000 | 0.5/**3**/1/0 | FAIL ✓ |
| **2 項目めだけ** caret を 0.4em に縮小 | 0.000 | 0.5/2/1/2 | **PASS（見逃し）** |
| **caret を上向きに差し替え（向きが逆）** | 0.000 | 0.5/0/1/0 | **PASS（見逃し）** |

原因は 2 つ。
1. **ink box をバリアント全体の 1 枚の画像から採るので、複数項目のグリフの「和集合」になる。**
   `h` は 84px（2 個の caret を跨ぐ距離）になり、`±30%` の許容が 25px 相当に膨らむ。
   項目ごとの欠陥（1 個だけ小さい・1 個だけずれている）が平均化されて埋もれる。
   → ink box は `[data-variant]` 単位ではなく **アイコン要素ごと**に採るべき。
2. **ink box は向きを見ない。** 上向き三角と下向き三角は外接矩形が同一なので、
   矢印が逆でも数値上は完全一致する。§4 の「形の違いは FAIL 理由にしない」は形状の話であって
   向きは意味を持つので、**向きは目視でしか担保できない**（本審査では拡大目視で下向き＝閉／上向き＝開を確認済み）。

なお `standalone.mjs` 自体の検出力は健全であることも確認した（同サンドボックスで
`.un-content .un-accordion__title{padding:2em}` の注入 → FAIL 4/4、
accordion の `box-sizing` リセット削除 → FAIL 4/4、
`.un-accordion__label{overflow-wrap:inherit}`（コンテナ継承依存）の注入 → FAIL 4/4 を検出）。

### C. fixture のダミーテキストが不足（FAIL 2 が見逃された原因）

見出しが短い日本語 2 件のみで、`word-break` の効く長い連続文字列も、
本文に複数ブロックを置いたケースも無い。spec/04-audit.md §2.0 が名指しで警告している類型。

### D. spec/parts/accordion.md §5 の計測表の欠落

FAIL 1・2・4 はいずれも「§5 の表に参照 CSS の宣言が写されていない」ことが直接の原因。
`body` の `padding-top/bottom`、`label` の `word-break`、`icon` の `line-height`（参照は非宣言）を
§5 に反映しないと、実装者は同じ間違いを繰り返す。
