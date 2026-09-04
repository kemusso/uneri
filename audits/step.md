# audit: step  (2026-09-04)

verdict: **PASS**

3 回目の審査（再審査）。実行コマンド: `node scripts/audit/run.mjs step --no-build --port 4407`
加えて審査側で独自ハーネスを再構成し、参照 CSS（`reference/swell/build/css/{main,blocks,single,swell_custom}.css`）＋ SWELL マークアップと
`dist/_astro/Catalog.v8rjWERd.css` ＋ uneri マークアップを同じ体裁のページに載せて突き合わせた（閾値は spec/04-audit.md §3 と同じ）。

- ハーネス A（参照 vs 実装、90 セル）: variant × numStyle 全 12 通り / 項目 1 個 / 項目 12 個（連番 2 桁）/ 本文 2 段落＋リスト / 入れ子 10 通り × 375・768・1200
- ハーネス B（`.un-content` の中 vs 素の div、15 ケース）: 全 12 通り＋本文 3 ブロック、pixel + computed style
- ハーネス C（記事の流れの中）: `p` → Step → Step → `p` を参照と突き合わせ

## 0. 前回 FAIL 7 件の再検証

| # | 前回の指摘 | 今回 | 根拠 |
|---|---|---|---|
| 1 | 本文が 2 ブロック以上で余白が消える | **解消** | `default` / `big` / `small` × 本文（段落 2 つ＋リスト）が 375/768/1200 で pixel 0 % / box Δ 0 / style diff 0。カタログの `rich-body` も 3 viewport で 0 % |
| 2 | `.un-content` の外で本文の余白が変わる | **解消** | ハーネス B が 15/15 で **中と外が 1 ピクセルも違わない**（`.un-step .un-step__body > *` の `margin-top:0` / `margin-bottom:1em`、最後の子 0 が両文脈で一致）|
| 3 | 詳細度 (0,3,0) | **解消** | step.css の全セレクタ（46 本）を数え直して最大 **(0,2,0)**。(0,2,0) は `.un-step .un-step__body > *` と `.un-step .un-step__body > :last-child` の 2 本のみ。`--_num-align` は `.un-step--horizontal` / `.un-step--small`（各 (0,1,0)）で切り替わる |
| 4 | 入れ子で親 variant が漏れた | **解消** | 入れ子 10 通り × 3 viewport で、**実装が親の装飾を内側に漏らしたケースは 0 件**。差が出た 7 ケースはすべて「参照側が漏らして実装が漏らさない」向き（§入れ子）|
| 5 | fixture の small の number に色クラスが付いていた | **解消** | 現 fixture は `<div class="swell-block-step__number"><span class="__shape u-col-main" role="presentation"></span>…`。SWELL 実出力（`reference/swell/fn-step.html`, `reference/swell/demo01-8.html`）と一致。実装も `color` を `.un-step__shape` に移してあり、small の `__label` / `::after` は本文色を継承する |
| 6 | props / spec の不一致、spec の記述漏れ | **解消** | spec §2 と `interface Props` が型・既定値とも一致（§仕様適合）。§5 に `--_round` の切り替え方針と body の子の余白が追記されている |
| 7 | `standalone.mjs` が本文の余白を検証できなかった | **解消** | `.un-step .un-step__body > *` の `margin-top` / `margin-bottom`、`… > :last-child` の `margin-bottom` が比較対象に入り、`rich-body` バリアントで実際に走っている。`%` / `calc()` の寸法だけ除外する方針は spec/04-audit.md §5 に明記済み |

## 自動計測（`scripts/audit/run.mjs step --no-build --port 4407`）

| variant | vw | pixel diff | box Δ (w/h) | style diffs | pass |
|---|---|---|---|---|---|
| default | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| big | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| small | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| num | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| horizontal | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| vertical | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |
| rich-body | 375 / 768 / 1200 | 0 % | 0/0 | 0 | ✅ |

21/21 セル PASS。

## 審査側ハーネス

### A. 参照 vs 実装（90 セル / 69 PASS）

| 群 | 内容 | 結果 |
|---|---|---|
| 掛け合わせ | `{default,big,small}` × `{circle,num,horizontal,vertical}` = 12 通り × 3 vw | **36/36 PASS**（pixel 0 % / box Δ 0 / style diff 0）|
| 項目 1 個 | `default` / `big` / `small`（`:first-child` と `:last-child` が同一）× 3 vw | 9/9 PASS |
| 本文複数ブロック | 段落 2 つ＋リスト、`default` / `big` / `small` × 3 vw | 9/9 PASS |
| 項目 12 個 | 連番 2 桁（10・11・12）、`default` / `small` × 3 vw | 6/6 PASS |
| 入れ子 | 10 通り × 3 vw | 15/30 PASS（残りは下記のとおり参照側の漏れ）|

差が出た 21 セルの内訳:

- 6 セル（`default-circle @375/768/1200`, `nest_default-num__default-circle @375/768/1200`）: **ハーネス側の器の差**。比較対象要素そのものの `margin-top` / `margin-bottom`（ページ先頭・末尾での `.post_content` と `.un-content` のマージン）だけで、pixel 0 % / box Δ 0/0。パーツの差ではない。
- 15 セル: **入れ子で参照側が漏れているケース**（下記）。

### 入れ子（重点確認）

| 入れ子 | 参照 | 実装 | 向き |
|---|---|---|---|
| `big` の中に `default` | 内側の `__title` が `text-align:center`（`.is-style-big .swell-block-step__title` が子孫結合子）| `text-align:start` | 参照が漏らす |
| `small` の中に `big` / `default-num` | 内側の item / number / label / `::before` に small の padding・`flex-direction:row`・`justify-content:flex-start`・`opacity:.8`・`font-size:14px`・連結線（`left:7px`・`border-left:2px` により矢印の `translateX` が -7px）が乗る | 内側は自分の variant のまま（矢印は -12px）| 参照が漏らす |
| `horizontal` の中に `circle` / `big-vertical` | 内側の number が `flex-direction:row`、label が `padding-right/bottom:4px`（`[data-num-style=horizontal] .swell-block-step__number` が子孫結合子）| 内側は `column` / `padding-bottom:1px` | 参照が漏らす |

**実装が親の装飾を内側に漏らしたケースは 1 件もない。** `.un-step--X > :where(.un-step__item) > :where(…)` の子結合子スコープが全 variant で効いている。
`--_round` / `--_num-align` はカスタムプロパティなので入れ子の内側にも継承されるが、計測した全組み合わせで参照側の子孫結合子による漏れと**同じ値**になり差は出なかった（例: `default-circle` の中の `default-num` は参照・実装とも番号が丸のままで一致。`align-items` の差分は全ケースで 0 件）。

### B. `.un-content` の外（15 ケース）

全 12 通り＋本文 3 ブロック（`default` / `big` / `small`）を「`.un-content` の中」と「同じ文字設定だけを与えた素の div の中」で描画し、pixel + computed style + 要素高さを比較 → **15/15 で完全一致**（pixel 0.000 %、style diff 0、高さ差 0）。
`node scripts/audit/standalone.mjs step --verbose` も 7/7 OK（231 ルール）。

### C. 記事の流れの中

`p` → Step → Step → `p` を参照と突き合わせ。375 / 768 / 1200 とも **pixel 0.000 %**、各ブロックの `margin-top` / `margin-bottom` / 高さが完全一致（`0px / 30px`(2em) @375、`0px / 32px` @768・1200、末尾 `p` は `margin-bottom:0`）。

## FAIL 項目（実装者への指示）

なし。

## 目視所見

`audits/step/shots/` の `default-1200` / `big-1200` / `small-375` / `num-375` / `horizontal-1200` / `rich-body-768` の ref・impl・diff を確認。

- 丸番号の直径・`STEP` の位置・破線の連結線の開始点と終点・最終項目で線が出ないこと、すべて一致。
- `big` の下向き三角: 参照は `translateX(-50%)`、実装は `translateX(-12px)`。要素は `width:0` + `border:12px` で border box 幅 24px、`-50%` = `-12px` なので用値が同じ。頂点位置・幅・色・上下の破線位置とも一致。
- `small` の丸（2px 枠・中は背景色）の径と縦線（2px 実線、top 18px / left 7px）、`STEP` と数字のベースライン、ともに一致。
- `num` の角のままの四角、`horizontal` の `STEP` と数字の横並び・下端揃え、いずれも一致。
- `rich-body` の段落間 1em・リスト前 1em・最後のリストの下 0 が参照と同じ。テキストの折り返し位置も一致。
- diff 画像はすべて全面透明（差分ピクセル 0）。

## 仕様適合

- **バリアント網羅**: OK。spec §3 の 7 バリアント（`default` / `big` / `small` / `num` / `horizontal` / `vertical` / `rich-body`）がすべてカタログにあり、fixture と同じダミーテキスト・同じ順序・同じ `data-variant` 名で並ぶ。カタログに spec 外のものはない（`01-coding-rules.md` §6）。
- **props**: OK。`Step`: `variant?: 'default'|'big'|'small'`（既定 `'default'`）、`numStyle?: 'circle'|'num'|'horizontal'|'vertical'`（既定 `'circle'`）、`class`、`id`、`extends HTMLAttributes<'div'>`。`StepItem`: `title: string`、`label?: string | null`（既定 `'STEP'`）、`shape?: boolean`（既定 `false`）、`class`、`id`。いずれも spec §2 と型・既定値とも一致。`class` はルート要素に付き、`id` も受ける。`src/index.ts` から `Step` / `StepItem` を re-export 済み。
- **コーディング規則**: OK。step.css の全セレクタ（46 本）を数え直して最大 **(0,2,0)**、`!important` 0 件、`swell` の文字列 0 件、リテラル hex は `#fff` のみ（白は許容）、他は `--un-color-main` / `--un-color-border` / `--un-color-text` / `--un-color-step-arrow` のトークン経由。`.un-content` の前置なし、他パーツのクラス参照なし、`@media` は `min-width` のみ、手書きベンダープレフィックスなし。`--_round` / `--_num-align` は `--_<name>` 規則どおり。`::before` には `content:""` と「何を描いているか」のコメントあり。Astro 側は 1 行 JSDoc + spec ポインタ、`interface Props`、`class:list`、ルート要素 1 つを満たす。
- **クリーンルーム**: OK（`node scripts/audit/cleanroom.mjs` → `cleanroom: OK (1900 reference runs indexed)`）。
- **standalone**: OK（`node scripts/audit/standalone.mjs step` → 7/7、231 ルール）。
- **fixture の忠実性**: OK。`default` / `big` / `small` の各マークアップが SWELL 実出力（`reference/swell/ext-step.html`, `fn-step.html`, `demo01-8.html`）と一致。`u-fz-l` = `--swl-fz--large` = `1.25em`、`u-fz-m` = `1.1em` で実装の `font-size` と対応。

## 申し送り（FAIL ではないが次に効くもの）

1. **`--_round` / `--_num-align` は継承で内側に伝わる。** 子結合子でスコープした他の規則と違い、この 2 つはカスタムプロパティなので入れ子の内側にも届く。今回計測した全組み合わせでは参照側の子孫結合子による漏れと同値になり差は出なかったが、構造としては漏れている。内側で打ち消す（例: `.un-step--num, .un-step--vertical { --_round: 0 }` / `.un-step--big, .un-step--default { --_num-align: normal }`）ほうが安全。
2. **`--_num-align` の勝ち負けがファイル内の記述順に依存している。** `.un-step--horizontal`（112 行）と `.un-step--small`（173 行）はどちらも (0,1,0) で同じ要素に乗るため、`variant="small" numStyle="horizontal"` が参照どおり `center` になるのは「small が後にある」からだけ（参照も `.is-style-small .__number` の後勝ちで `center`）。順序を入れ替えると静かに壊れるので、コメントを添えるか順序に依らない書き方にしたい。
3. **`@media (min-width:600px)` の `.un-step__item::before { width: 1px }` が `.un-step--small` の `width: 2px` を上書きしている。** 両方 (0,1,1) で media 側が後ろにあるため。`box-sizing: border-box` と `border-left: 2px` のおかげで用値は 2px のままで、実測でも 768/1200 の `small` は pixel 0 % / style diff 0 だが、spec §5 small の「幅 2px の実線」と CSS の見た目が食い違う。共通側を `.un-step--default` 系に限定するか、small 側も media 内で書き直したい。
4. **fixture / カタログが薄い。** 現在の 7 バリアントは掛け合わせ 12 通りのうち 7 通りしか含まず、項目は常に 2 個。過去 2 回の FAIL（`small` × 非 circle、`big` × `horizontal`、本文複数ブロック、入れ子）はいずれも `run.mjs` 単独では拾えず、審査側ハーネスで初めて出た。`rich-body` の追加は前進だが、**掛け合わせ 12 通り・項目 1 個・項目 10 個以上（連番 2 桁）** を spec §3 とカタログに足さないと `run.mjs` の PASS は同じ穴を残す。
5. **`standalone.mjs` の `%` / `calc()` 除外は本物の緩和。** step では `height:100%` / `calc(100% - 20px)` / `top:100%` / `left:50%` だけが対象で妥当だが、今後 `width: 50%` のようにコンテナ依存が本質の宣言を書いても検出されない。spec/04-audit.md §5 に明記されているので運用上は承認済みだが、穴として記録しておく。
6. **`spec/parts/step.md` §3 の `rich-body` 行の「参照クラス」が「同上」になっている。** 直上の行は `vertical` だが、fixture の `rich-body` は `is-style-default` + `data-num-style="circle"`。表記を直したい。
7. **単位の規則との緊張。** `01-coding-rules.md` §3 は「フォント・余白は `em`/`rem`」とするが、step.css は参照に合わせて `font-size: 10/12/14/20/24px`、`padding-bottom: 1px`、`padding-right: 4px`、`margin-right: 8px`、`margin-left: -24px`、`padding: 0 0 3em 64px` を px で持つ。48px の丸に紐づく幾何なので px が正しく、spec/parts/step.md §5 もその値で書かれている（`balloon.css` も同様に `font-size: 10px`）。step 個別の違反とはせず、`01-coding-rules.md` §3 に「参照の実測値に紐づく幾何は px」という但し書きを入れて解消するのが筋。
8. **`scripts/audit/run.mjs` に未コミットの変更がある**（古いスクショの削除、CDP セッションの再利用、`HOVER_SETTLE_MS` の待機をトランジションの `finish()` に置換）。閾値・比較対象を緩める変更はなく step の判定には影響しないが、実装者が審査ツールを触っているのでコミットして差分が見える形にしておきたい。
