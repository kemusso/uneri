# 04 — 審査（audit）手順と合否基準

審査は実装者と別のエージェント（サブエージェント）が行う。実装者は自己採点しない。
呼び出し: `/audit-part <part>`（`.claude/skills/audit-part/`）。

## 1. 審査の前提

- 比較対象は「同じマシン・同じブラウザ・同じフォント」で描画した 2 枚のページ。
  - **参照**: `reference/fixtures/<part>.html` — SWELL の CSS と SWELL のマークアップで組んだページ
  - **実装**: `dist/catalog/<part>/index.html` — uneri のカタログページ
- 両ページは **同じダミーテキスト・同じ順序・同じ `data-variant` 名** でバリアントを並べる。差分が出たらそれはスタイル差である。
- 各バリアントは `[data-variant="<name>"]` 要素で包む。審査はこの要素単位で行う。

## 2. 自動計測（`scripts/audit/run.mjs`）

```
node scripts/audit/run.mjs <part> [--no-build]
```

viewport 幅 `375` / `768` / `1200` の 3 通りで、バリアントごとに（スクリーンショットは要素の周囲 24px を含めて撮る。枠外にはみ出す装飾も比較対象にするため）:

1. 参照・実装それぞれの `[data-variant]` 要素をスクリーンショット → `audits/<part>/shots/<variant>-<vw>-{ref,impl,diff}.png`
2. `pixelmatch` で差分ピクセル率を算出
3. 要素の bounding box（幅・高さ）を比較
4. ルート要素と子孫（最大深さ 4）の computed style を採取して差分を取る
   対象プロパティ: `color background-color background-image border-* border-radius box-shadow padding-* margin-* font-size font-weight line-height letter-spacing text-align display gap width height opacity`
5. `:hover` が意味を持つパーツ（Button, LinkList, BoxMenu, BlogCard, BannerLink, Accordion, Faq, Tab）はホバー状態でも 1〜4 を行う
6. 結果を `audits/<part>/report.json` と `audits/<part>/report.md` に書く

### 2.0 バリアント設計の注意

**「そのスタイルの定義的な性質」が出るダミーテキストを選ぶこと。** 例: `fit-content` のボックスに折り返す長文を入れると幅の違いが pixel diff にも bounding box にも現れず、誤って PASS する。幅が内容に依存するパーツには短文のバリアントを必ず用意する。

### 2.1 アイコンを含むパーツの扱い

参照はアイコンフォントで、uneri は SVG でグリフを描くため、`content` / `font-family` / `background-image` / `mask-image` は原理的に一致しない。`scripts/audit/run.mjs` の `ICON_PARTS` に登録したパーツでは:

1. グリフだけを透明にした状態（参照は `color: transparent`、実装は塗りを `transparent` / `background-image: none`）でスクリーンショットを撮り、pixel diff はその状態で採る。これで枠・背景・円・罫線・余白は通常どおり厳密に比較される。
2. グリフの描画領域（通常時とグリフ非表示時の差分ピクセルの外接矩形 = ink box）を参照と実装で比較する。**中心が ±2px** を超える、または**寸法が ±30%（最低 3px）**を超えたら FAIL。形は問わない（別の図形で描くため、ink box の寸法は完全一致し得ない）。
3. アイコンの疑似要素については `content` / `font-family` / `background-image` / `mask-image` / `background-size` / `background-repeat` / `background-position` と、グリフ自身の箱（`display` / `width` / `height` / `transform-origin`）、参照側が透明な `background-color` を比較から除外する。アイコンフォントのグリフはインラインのテキスト、uneri の mask は塗られた箱で、箱の寸法は原理的に一致しない（位置と大きさは ink box で判定する）。それ以外（位置・寸法・font-size・line-height・色・border・transform）は通常どおり比較する。

### 2.2 アニメーションを含むパーツの扱い

`run.mjs` の `ANIM_PARTS` に登録したパーツでは、参照・実装の両方で

- `transition` を無効化（hover の遷移先そのものを比較するため）
- `animation-play-state: paused` + `animation-delay: 0s`（アニメーションを 0% フレームに固定。`animation-*` の値は比較できる状態で残る）

してから計測・撮影する。`animation-name` だけは uneri が自作の keyframes 名を使うため比較から除外する。参照 CSS は autoprefixer 済みで `transition-property` に `-webkit-transform` が混ざるため、`-webkit-` の重複エントリは無視して比較する。
フレームの取り出しは Web Animations API（`getAnimations()` の `currentTime`）で行う。`animation-delay` によるシークは、すでに一時停止したアニメーションでは効かず実行ごとにぶれる。
さらに 1 周期を 16 フレームに刻んで縦に連結した `<variant>-<vw>-{ref,impl}-motion.png` を出力する。動き（出るタイミング・向き・広がり方・消え方）はこの画像で目視審査する。

## 3. 合否基準（数値）

バリアント × viewport ごとに全て満たして PASS。1 つでも落ちたら部品全体が FAIL。

| 項目 | 閾値 |
|---|---|
| 差分ピクセル率 | **≤ 0.3 %**（アンチエイリアス差を吸収する程度） |
| bounding box の幅・高さ | **差 ≤ 1px** |
| computed style 差分 | 色: ΔE(sRGB 単純距離) ≤ 3 / 長さ: ≤ 0.5px / それ以外: 完全一致 |
| ホバー状態 | 上記と同じ |

## 3.1 許容乖離（参照と意図的に違う箇所）

SWELL は**ベースであって上限ではない**。参照そのものが読みにくい／壊れている箇所では、uneri は意図的に参照から外れてよい。

外れる場合は必ず次の 3 つを揃える。揃っていない差分は従来どおり FAIL。

1. `scripts/audit/run.mjs` の `DEVIATIONS[<part>]` に登録する。`variant` / `path` / `prop` の正規表現で対象を絞り、`why` に**根拠（issue 番号と理由）**を書く。見た目が動く場合だけ `pixelPct` / `boxPx` で閾値を緩める。
2. 対象パーツの `spec/parts/<part>.md` に「意図的乖離」として、参照値・uneri 値・理由を書く。
3. CSS の該当ルールに、参照と違うことと参照先（issue 番号か spec の節）をコメントで残す。

登録された差分は `audits/<part>/report.md` の「許容乖離」節に理由つきで出力され、合否には数えない。**緩めるのは登録した対象だけ**で、同じバリアントの他のプロパティは厳密に比較され続ける。

`-scrolled` で終わるバリアント名は、参照・実装の両方で最初にはみ出す要素を `scrollLeft` = はみ出し幅の 37% までスクロールさせてから計測する。sticky な列の不具合は表が動いて初めて出るため、`scrollLeft: 0` のままでは見えない。37% という半端な値は、丸い値だとセルの罫線がちょうど固定列の右端に重なり、無い境界を有るように見せてしまうため。

## 4. 目視審査（数値で拾えないもの）

自動計測が PASS でも、審査エージェントは `-ref.png` / `-impl.png` / `-diff.png` を **全て開いて** 確認し、以下を報告する。

- 疑似要素の形（吹き出しの三角、かっこ、ステップ線の端点）
- グラデーション・ストライプの向きと周期
- アイコンの形状（別アイコンセットなので完全一致しない。**大きさ・太さ・位置** が一致していれば可。形の違いは "icon-shape" として記録し、FAIL 理由にはしない）
- テキストの折り返し位置
- 影のぼかし幅

## 5. 仕様適合審査

- `spec/parts/<part>.md` のバリアントが **全て** カタログにあるか。欠けていれば FAIL。
- props の型・既定値が spec と一致するか（`src/components/<Part>.astro` の `interface Props` を読む）。
- `spec/01-coding-rules.md` 違反（`!important`、詳細度、命名、`swell` の文字列混入、リテラル色）。1 件でも FAIL。
- `node scripts/audit/standalone.mjs` が OK であること。素の見出し（container スコープと決めている `heading.css`）、記事本文の要素既定（`un-image` / `un-table` / 修飾子なしの `.un-list`）、および `%` や `calc()` で書かれた寸法（中身の高さに依存し、その中身は記事本文側の管轄）は比較から外す。全カタログバリアントを「`.un-content` の中」と「同じ文字設定だけを与えた素の div の中」の 2 通りで描画し、`src/styles/parts/*.css` の各ルールが**宣言したプロパティ**を**そのルールが狙った要素・疑似要素**の上で突き合わせる。container 依存があれば必ず差が出る（素の見出しは container スコープと決めているので除外）。
- 参照 CSS のある 1 ルール内の「連続する 3 宣言」と同じ並びが `src/styles/` `src/components/` にないこと、`swell` の文字列がないこと（クリーンルーム確認。`scripts/audit/cleanroom.mjs`）。あれば FAIL。単発の宣言（計測値・フォントスタック等）の一致は許容。

## 6. 報告フォーマット（`audits/<part>.md`）

```markdown
# audit: <part>  (<日付>)

verdict: PASS | FAIL

## 自動計測
| variant | vw | pixel diff | box Δ | style diffs |
| ...

## FAIL 項目（実装者への指示）
1. `<variant>` @<vw>: <何が> <参照値> → <実装値>。<推定原因>
...

## 目視所見
- ...

## 仕様適合
- バリアント網羅: OK / 欠落: ...
- props: ...
- コーディング規則: ...
- クリーンルーム: OK / NG: ...
```

- FAIL 項目は **実装者が直せる粒度**（どのバリアント・どの要素・どのプロパティ・参照値と実装値）で書く。「なんとなく違う」は不可。
- 審査エージェントはコードを修正しない。報告のみ。

## 7. 再審査

FAIL 項目を修正したら同じコマンドで再審査。前回の FAIL 項目が解消しているかを先頭に列挙する。
