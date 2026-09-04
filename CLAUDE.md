# uneri

日本語ブログ向け装飾パーツ集（Astro）。仕様駆動で開発する。**まず `spec/` を読むこと。**

- `spec/00-overview.md` — 目的・非目標・ライセンス方針（クリーンルーム。SWELL のコードを持ち込まない）
- `spec/01-coding-rules.md` — 命名・CSS・コンポーネント API の規則
- `spec/02-design-tokens.md` — トークン
- `spec/03-parts.md` — パーツ一覧と進捗。**1 つ pass するまで次に進まない**
- `spec/04-audit.md` — 審査手順。`/audit-part <part>` で別エージェントに審査させる
- `spec/parts/<part>.md` — パーツ個別仕様。無いものは実装しない

## ワークフロー（1 パーツ）

spec/parts/<part>.md → reference/fixtures/<part>.html → src/styles/parts/<part>.css + src/components/<Part>.astro → src/pages/catalog/<part>.astro → `/audit-part <part>` → FAIL を潰す → PASS で状態更新・コミット

## 禁止

- `reference/swell/` の CSS を開いて写す（描画結果の観察・計測は可）
- `reference/` 配下を git に追加する
- 名前・クラス・変数に `swell` を含める

## コマンド

- `npm run build` / `npm run dev`
- `npm run audit -- <part>` — 自動計測（scripts/audit/run.mjs）
- `npm run audit:cleanroom` — コピー検出
