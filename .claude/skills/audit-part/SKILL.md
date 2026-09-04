---
name: audit-part
description: 指定パーツの SWELL 再現度を、実装者とは別のサブエージェントに厳格審査させる。/audit-part <part>（例 /audit-part box）。spec/04-audit.md の手順と閾値に従い、audits/<part>.md に判定を書く。
---

# /audit-part <part>

`$ARGUMENTS` = パーツ名（kebab-case。`spec/parts/<part>.md` と `src/pages/catalog/<part>.astro` が存在すること）。

## あなた（呼び出し側）の手順

1. 引数が無ければ止まって聞く。`spec/parts/<part>.md` が無ければ「spec を先に書け」と返して終了。
2. **自分では判定しない。** 以下のプロンプトで `general-purpose` サブエージェントを 1 つ起動し、結果を待つ。
3. サブエージェントの報告（`audits/<part>.md`）をユーザーにそのまま要約する。PASS/FAIL と FAIL 項目数を最初に書く。
4. FAIL なら FAIL 項目を順に修正し、再度 `/audit-part <part>` を実行する。PASS になるまで次のパーツに進まない。
5. PASS したら `spec/03-parts.md` と `spec/parts/<part>.md` の状態を `pass` に更新する。

## サブエージェントへのプロンプト（そのまま渡す。`<part>` を置換）

```
あなたは uneri プロジェクト（/Users/fumiya/Downloads/uneri）の審査官です。
パーツ「<part>」が参照（SWELL）の見た目を再現できているかを、spec/04-audit.md の手順と合否基準に従って厳格に審査してください。
あなたはコードを修正してはいけません。判定と報告のみを行います。
甘い判定は禁止です。「ほぼ同じ」は FAIL です。閾値を 1 つでも超えたら FAIL です。

手順:
1. spec/04-audit.md、spec/01-coding-rules.md、spec/parts/<part>.md を読む。
2. `node scripts/audit/run.mjs <part>` を実行する（ビルド込み。失敗したらそのエラーを報告して終了）。
3. `audits/<part>/report.md` と `report.json` を読む。
4. `audits/<part>/shots/` の **全ての** `-ref.png` / `-impl.png` / `-diff.png` を Read ツールで開いて目視する（画像は Read で表示される）。`-motion.png`（アニメーションの 8 フレームを縦に連結したもの）があれば必ず ref と impl を見比べ、光り方・出るタイミング・広がり方が同種か確認する。数値が PASS でも目視で違いがあれば記録する。spec/04-audit.md §4 の観点（疑似要素の形、グラデーション、アイコンの大きさ/位置、折り返し、影）を必ず確認する。
5. 仕様適合（spec/04-audit.md §5）:
   - spec/parts/<part>.md §3 のバリアントが全て `[data-variant]` としてカタログにあるか
   - src/components/<Part>.astro の `interface Props` が spec §2 と一致するか
   - src/styles/parts/<part>.css が spec/01-coding-rules.md §3 に違反していないか（`!important`、詳細度 (0,3,0) 以上、`swell` の文字列、トークンを経由しないリテラル色、アイコンフォント）
   - `node scripts/audit/cleanroom.mjs` と `node scripts/audit/standalone.mjs` を実行して OK か
6. **自動判定の穴を疑い、独自に検証する**（過去の審査で有効だった手口: 参照と実装の全 computed style 総当たり、バリアントの内容では露出しない性質（`:not(:first-child)` の余白・内容幅・入れ子・継承・クリック可否・単体設置）の再現、参照 CSS のルールを 1 宣言ずつ実装と突き合わせる）。ツール・fixture・spec の不備を見つけたら tool-suspect / fixture-suspect / spec-suspect として報告し、判定は FAIL にする。
7. `audits/<part>.md` を spec/04-audit.md §6 のフォーマットで書く。FAIL 項目は「どのバリアント・どの viewport・どの要素・どのプロパティ・参照値 → 実装値・推定原因」の粒度で書く。
8. 最後に verdict と FAIL 項目の一覧を返答として返す。

注意:
- 参照との差が「アイコンの形状のみ」（別アイコンセット由来）で、大きさ・太さ・位置が一致している場合は FAIL 理由にせず「icon-shape」として所見に書く。
- 参照側の fixture に不備（マークアップ間違い、変数未定義）を疑う場合は、その根拠を書いた上で「fixture-suspect」として報告する。判定は保留せず FAIL にする。
- 報告は日本語。
```
