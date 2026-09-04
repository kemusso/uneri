# audit: balloon  (2026-09-04) — 再審査

verdict: **FAIL**

## 0. 前回 FAIL 項目の解消確認

| # | 前回の指摘 | 結果 |
|---|---|---|
| 1 | `--_outline-*` が入れ子に漏れる | **解消**。`.un-balloon` で `--_outline-width:0 / -style:none / -color:currentColor` にリセット済み。`nested` の内側で `--_outline-width` が `0`、外側が `1px` であることを実測で確認 |
| 2 | spec の依存トークン名の誤り | **解消**。spec §冒頭の `--un-color-balloon-*-bg` / `-line` / `--un-color-balloon-icon-border` / `--un-color-text` / `--un-radius-balloon` は `src/styles/tokens.css` の定義と一致 |
| 3 | 修飾子を `> :where(…)` 連鎖に限定・`nested` バリアント追加 | **一部不適切**。下記 FAIL-2 / FAIL-3 |

## 1. 自動計測（`node scripts/audit/run.mjs balloon --no-build --port 4406`）

verdict(auto): PASS。12 バリアント × 3 viewport = 36 行すべて box Δ 0-0 / style diffs 0。
pixel diff は `nested` のみ 0.017 %（375）/ 0.007 %（768）/ 0.006 %（1200）、他は全て 0 %。

補強として **全 computed プロパティ総当たり**（`getComputedStyle` の全エントリ、
`::before` / `::after` 込み、深さ 7、375/768/1200）を独自に実施 → **差分ゼロ**。
閉じた通常状態の再現度そのものは非常に高い。以下は自動計測では出ない指摘。

## 2. FAIL 項目（実装者への指示）

### FAIL-1. `col-blue` バリアントが青でない（fixture・カタログの両方）

| ファイル | 該当箇所 | 現状 | あるべき値 |
|---|---|---|---|
| `src/pages/catalog/balloon.astro` | `<Content data-variant="col-blue">` | `<Balloon … color="red">` | `color="blue"` |
| `reference/fixtures/balloon.html` | `data-variant="col-blue"` | `<div class="c-balloon -bln-left" data-col="red">` | `data-col="blue"` |

参照・実装の**両方が赤**なので pixel diff 0 で PASS するが、spec §3 が定める
`col-blue`（背景 `#e2f6ff` / 線 `#93d2f0`）は **一度も検証されていない**。
spec/04-audit.md §2.0（「そのスタイルの定義的な性質が出るダミーを選ぶこと」）に真っ向から反する。
実質的にバリアント 1 件の欠落 → 仕様適合 NG。

なお審査側で両方を青に差し替えて再計測したところ差分ゼロだったので、
トークン値（`--un-color-balloon-blue-bg/-line`）自体は正しい。直すのは fixture とカタログのみ。

### FAIL-2. `nested` の内側ふきだしのしっぽが参照と違う（目視で分かる差）

`audits/balloon/shots/nested-1200-ref.png` と `-impl.png` を比べると、
内側ふきだしの左に **参照は輪郭付きの丸が 1 個見える／実装は何も無い**。

| 対象（`nested` 内側の `.un-balloon__tail > *`） | 参照 | 実装 |
|---|---|---|
| 1 つめ | 8×8px、`border-radius: 50%`、`border: 1px #f48789`、背景 `#ffebeb` | 10×16px の三角（`border-width: 8px 10px 8px 0`）、`border-radius: 0`、輪郭なし |
| 2 つめ | 12×12px、`border-radius: 50%`、`border: 1px #f48789`、`top: 8px` / `left: -16px` | `display: none`（0×0） |

参照 SWELL は `-thinking` / `-border-on` を `.c-balloon__body` に付け、
`.-thinking .c-balloon__before` / `.-thinking.-border-on .c-balloon__after` という
**子孫セレクタ**で書いているため、外側の think + border が内側のしっぽにも効く。
実装は `.un-balloon--think > :where(__body) > :where(__text) > :where(__tail) > *` と
`> :where(…)` 連鎖にしたので効かない。

**さらに悪いのは中途半端になっている点**: しっぽの *位置* だけは
`.un-balloon--think .un-balloon__tail > :where(:first-child) { left: -21px }` と
子孫セレクタのままなので、内側の三角が `left: -21px`（think 用のオフセット）に置かれている。
参照にも uneri の設計にもない状態。実測:

```
INNER tail kids: block 10px×16px left=-21px top=0px  border=8px/10px radius=0 bg=transparent border-right-color=#ffebeb
                 none  0px×0px   left=-10px …
```

塗り色が外側の背景と同じ `#ffebeb` なので「見えない三角」になり、
pixel diff は 948×225 のショットに対して 0.006 % にしか出ない。

### FAIL-3. spec §3 と §7 が矛盾しており、実装はどちらとも一致しない

- spec §3 の `nested` 行: 「修飾子が内側に漏れない（**角アイコン・思考・枠線が内側に効かない**）」
- spec §7: 「参照が子孫セレクタで内側にも効かせている箇所（**`border` の枠線としっぽの位置**）は、
  参照の見た目に合わせて子孫のままにする」

§3 は「枠線は内側に効かない」、§7 は「枠線は内側に効かせる」と言っている。
実測では実装の内側 `__text` は `border-top-width: 1px` / `border-top-color: rgb(244,135,137)` で、
**§7 のとおり効いている**（＝§3 の記述が誤り）。しっぽの位置も効いている。
一方でしっぽの**形と輪郭**だけ効いていない（FAIL-2）。

結論として現状の切り分けは「参照追随」でも「入れ子で漏らさない」でもない第三の状態であり、
どちらを取るのか決めて spec §3 と §7 を一致させ、実装を揃えること。
参照追随を選ぶなら `.un-balloon--think` / `--border` のしっぽ規則を子孫セレクタに戻す。
漏らさない設計を選ぶなら `.un-balloon--border .un-balloon__text` と
`.un-balloon--think .un-balloon__tail`／`.un-balloon--border .un-balloon__tail` も
`> :where(…)` 連鎖にし、そのぶん参照と見た目が変わることを spec §7 に明記して
`nested` を「参照とは意図的に異なるバリアント」として扱う（＝pixel diff の対象から外す）。

### FAIL-4. 審査ツールの穴（新規報告）

**(a) computed style の採取深さが足りない**

`run.mjs` の `capture()` は `COLLECT` を `depthMax: 6` で呼ぶ。`nested` の内側しっぽは
`[data-variant]` から数えて

```
div(0) > .un-balloon(1) > __body(2) > __text(3) > .un-balloon(4) > __body(5) > __text(6) > __tail(7) > span(8)
```

で **深さ 7〜8**。つまり入れ子ふきだしのしっぽは一切採取されない。
実験: dist に `.un-balloon__text .un-balloon .un-balloon__tail > * { z-index: 99 }` を注入しても
style diffs は 0 のまま（同時に注入した深さ 6 の `__text` の背景変更 1 件だけが検出された）。

**(b) 0.3 % 閾値が大きいバリアントで効かない**

`nested` のショットは 948×225 = 213,300px。しっぽの丸 1 個（約 20px）は 0.009 %。
`rich` や `nested` のように面積の大きいバリアントでは、小さな装飾の有無が原理的に閾値を通る。

対策案: `depthMax` を要素数上限に変える（またはバリアントごとに指定可能にする）、
pixel diff を「バリアント全体の面積比」ではなく「参照側の非背景ピクセル数に対する比」で採る。

## 3. 目視所見

- `left` / `right` / `square` / `border` / `col-red` / `col-green` / `col-yellow` / `rich` は
  375 / 768 / 1200 とも参照と見分けがつかない（`-diff.png` 全面白）。
- `right`: アイコンが右、しっぽが右向きに反転（`rotateY(180deg)` の鏡像）。参照と同じ。
- `think` / `think-border`: 8px と 12px の丸が左上に 2 つ。輪郭の有無も参照どおり。
- `border`: 三角が二重（背景色の三角 `left:-8px` の後ろに線色の三角 `left:-10px`）。参照と同じ。
- アイコン: <600px で 60px、≥600px で 80px。名前は 10px / opacity 0.8。参照と同じ。
- `nested`: **上記 FAIL-2 のとおり内側のしっぽが違う**。それ以外（角アイコンが外側だけ、
  内側 `__text` の赤枠、内外の余白）は参照と一致。
- 参照 `[data-col] .c-balloon__text` は色を子孫セレクタで内側に漏らす。uneri は
  ふきだしごとに custom property を置くので漏らさない。spec §7 が「追随しない」と宣言済みだが、
  そのために `nested` を**内外同色**にしてあり、この差が計測に一切現れない設計になっている。
  spec/04-audit.md §2.0 の趣旨からは、内外を別色にした `nested` も置いて
  「ここは意図的に違う」と明示的に記録すべき（報告のみ。単体では FAIL にしない）。

## 4. 仕様適合

- **バリアント網羅**: spec §3 の 12 バリアントは `data-variant` 名としては揃っている。
  ただし `col-blue` が中身は赤 → **NG**（FAIL-1）。
- **props**: `icon? / name? / dir?='left' / shape?='circle' / tail?='speech' / border?=false /
  color?='gray' / class? / id?`。型・既定値とも spec §2 と一致 → OK。
  `color` が名前以外のときは背景だけ差し替え線色は既定という §7 の規定も実装と一致。
- **コーディング規則**: `!important` なし、`swell` 文字列なし、リテラル色なし（全てトークン経由）、
  `--_bg` / `--_line` / `--_outline-*` は内部専用の `--_` 接頭辞、受け取り値は
  `--un-balloon-bg` / `--un-balloon-line`、`styleToString` / `joinStyles` で利用者の `style` を取り込み、
  疑似要素ではなく実要素でしっぽを描いているためコメントで用途を明記 → OK。
  セレクタ詳細度は最大 `.un-balloon--border .un-balloon__text` などの (0,2,0) で上限内 → OK。
- **`cleanroom.mjs`**: OK（1900 reference runs indexed、3 連続宣言の一致なし）。
- **`standalone.mjs`**: OK（balloon 12 バリアント）。dist の CSS を `.un-content` 前置に
  書き換える感度確認で FAIL を返すことも確認済み。
- **依存トークン**: spec 記載のトークン名がすべて `tokens.css` に実在し、CSS の使用と一致 → OK。
