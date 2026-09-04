# uneri — 概要仕様

> うねり (uneri) = swell. 日本語ブログ向けの装飾パーツ集を Astro コンポーネントとして提供する。

## 1. 目的

- WordPress テーマ SWELL が提供する「記事装飾パーツ」と **見た目が区別できないレベル** の部品を、Astro（静的サイト）で使えるようにする。
- 依存ゼロ（Tailwind 等のフレームワークに依存しない）。CSS と `.astro` のみ。
- MDX から `<Box style="stripe">…</Box>` のように呼び出せること。
- 将来的に LLM が記事を生成するとき、**パーツの語彙（props）が曖昧でない** こと。

## 2. 非目標（やらないこと）

- WordPress のブロックエディタ GUI。
- テーマ機能（メインビジュアル、ピックアップバナー、LP 機能、広告管理、AB テスト、ブログパーツ）。
- SWELL のサイト全体レイアウト（ヘッダー/フッター/サイドバー）。ただしカタログ用に最低限のレイアウトは持つ。
- SWELL の JS 挙動のうち、装飾に関係しないもの（pjax、追従ヘッダー等）。

## 3. ライセンス方針（最重要）

- 本プロジェクトは **MIT** で公開する。
- したがって SWELL のコード（CSS/JS/PHP）を **1 行も持ち込まない**。クリーンルーム実装。
  - 許可: SWELL をブラウザで描画した結果の観察（スクリーンショット、`getComputedStyle` の値、寸法の実測）。これらは事実であり表現ではない。
  - 許可: SWELL のクラス名・data 属性を「参照名」として spec に記録すること（比較対象の特定に必要）。
  - 禁止: SWELL の CSS ファイルを開いてルールを写す／整形して貼る／変数名を流用する。
  - 禁止: SWELL のアイコンフォント（`swell-icons`）の同梱。アイコンは MIT/ISC 系（Tabler Icons / Lucide）から選ぶ。
- 参照資料は `reference/` 配下に置き、**git 管理しない**（`.gitignore` 済み）。
- プロジェクト名・パッケージ名・クラス名・変数名に `swell` を含めない。README での言及は "Inspired by SWELL" の一文のみ。

## 4. 開発プロセス（仕様駆動）

1 パーツにつき、必ずこの順で進める。

```
spec/parts/<part>.md を書く（受け入れ基準を含む）
  → reference/fixtures/<part>/ に比較用 SWELL 描画ページを用意
  → src/styles/parts/<part>.css + src/components/<Part>.astro を実装
  → src/pages/catalog/<part>.astro にカタログを追加（spec の全バリアントを網羅）
  → /audit-part <part> でサブエージェント審査（audits/<part>.md に結果）
  → FAIL 項目を潰して再審査。PASS になるまで次のパーツに進まない
```

- spec に書いていないバリアント・props は実装しない。欲しくなったら先に spec を直す。
- 審査（audit）は実装者と別のエージェントが行う。実装者は自己採点しない。

## 5. 用語

| 用語 | 意味 |
|---|---|
| パーツ (part) | 1 つの装飾単位。`Box`, `Button` など。1 コンポーネント + 1 CSS ファイル |
| バリアント (variant) | パーツの見た目の種類。`style` prop で選ぶ。`Box style="stripe"` |
| 参照 (reference) | 比較対象となる SWELL の描画結果 |
| 受け入れ基準 (acceptance) | 審査で確認する具体的な項目。数値で書く |

## 6. 関連文書

- [01-coding-rules.md](01-coding-rules.md) — 命名・CSS・コンポーネント API の規則
- [02-design-tokens.md](02-design-tokens.md) — 色・余白・フォント等の共通トークン
- [03-parts.md](03-parts.md) — 再現対象パーツの一覧と進捗
- [04-audit.md](04-audit.md) — 審査の手順と合否基準
- `spec/parts/*.md` — パーツ個別仕様
