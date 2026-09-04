# 03 — 再現対象パーツ一覧

参照 = SWELL のクラス名（比較対象の特定用。uneri 側では使わない）。
状態: `todo` → `spec` (仕様済) → `impl` (実装済) → `pass` (審査合格)。
順番は依存の少ないものから。**1 つ pass するまで次に進まない。**

## A. 基礎

| # | パーツ | コンポーネント | バリアント | 参照 | 状態 |
|---|---|---|---|---|---|
| A1 | 本文基礎 | `Content`（`.un-content`） | p / a / strong / img / blockquote / code / hr の既定スタイルと余白 | `.post_content` | pass |
| A2 | 見出し | `Heading` または `.un-content h2/h3/h4` | h2 標準 / h2 section-title / h3 / h4 | `.post_content h2` `.is-style-section_ttl` | pass |
| A3 | テキスト装飾 | `Mark`, `Text` | marker: yellow / blue / green / orange; size: xs / sm / md / lg / xl; color: red / blue / green / main（任意色可）; thin | `.mark_yellow` 等 | impl |
| A4 | 目次 | `Toc` | default (二重線) / 番号なし | `.p-toc` | todo |

## B. ボックス

| # | パーツ | コンポーネント | バリアント | 参照 | 状態 |
|---|---|---|---|---|---|
| B1 | ボックス装飾 | `Box` | border-sm / border-sg / border-dm / border-dg / border-left / bg-gray / bg-main-thin / bg-main / stripe / grid / dent / emboss / kakko / big-kakko / note / sticky / balloon / balloon2 | `.is-style-border_sm` 等 | pass |
| B2 | アイコンボックス（段落） | `Box` (`icon` prop) | good / bad / info / announce / pen / book | `.is-style-icon_good` 等 | pass |
| B3 | 大アイコンボックス | `Box` (`bigIcon` prop) | good / bad / point / check / batsu / hatena / caution / memo | `.is-style-big_icon_good` 等 | pass |
| B4 | キャプションボックス | `CapBox` | default / small-title / onborder / onborder2 / inner / intext / shadow; colset: main / 1 / 2 / 3 | `.cap_box.is-style-*` `.-colset-*` | todo |
| B5 | ふきだし | `Balloon` | dir: left / right; shape: speech / think; border: none / on; icon shape: circle / square | `.c-balloon` | impl |

## C. リスト

| # | パーツ | コンポーネント | バリアント | 参照 | 状態 |
|---|---|---|---|---|---|
| C1 | リスト装飾 | `List` | default / note / check / good / bad / triangle / num-circle; `ordered` | `.is-style-*_list` | pass |
| C2 | 説明リスト | `Dl` | default / border / float | `.swell-block-dl` | todo |
| C3 | リンクリスト | `LinkList` | default / border / button | `.swell-block-linkList` | todo |

## D. インタラクション

| # | パーツ | コンポーネント | バリアント | 参照 | 状態 |
|---|---|---|---|---|---|
| D1 | ボタン | `Button` | normal / solid / line / shiny; size: s / m / l; color: main / red / blue / green（任意色可）; align; `sponsored` | `.swell-block-button` | impl |
| D2 | FAQ | `Faq` + `FaqItem` | default / border / box / stripe | `.swell-block-faq` | impl |
| D3 | アコーディオン | `Accordion` | default / border / main / simple | `.swell-block-accordion` | todo |
| D4 | タブ | `Tab` | default / simple / bb (下線) / balloon | `.swell-block-tab` | todo |
| D5 | ステップ | `Step` | default / big / small; numStyle: circle / num / horizontal / vertical | `.swell-block-step` | pass |

## E. 表・比較

| # | パーツ | コンポーネント | バリアント | 参照 | 状態 |
|---|---|---|---|---|---|
| E1 | テーブル | `Table`, `Cell` | default / simple; セルアイコン: double-circle / circle / triangle / close / hatena / check / line (obj / bg); 横スクロール; 先頭列固定 | `.wp-block-table` `.swl-cell-bg` | todo |
| E2 | レビュー | `Review` | default; 星 0.5 刻み; メリット/デメリット | `.swell-block-review` | todo |
| E3 | リッチカラム | `Columns`, `Column` | default / border / shadow; 列数 pc/tab/sp; `padding`; 列 `bg` | `.swell-block-columns` | todo |

## F. リンク・ナビゲーション

| # | パーツ | コンポーネント | バリアント | 参照 | 状態 |
|---|---|---|---|---|---|
| F1 | ブログカード | `BlogCard` | type 1 / 2 / 3; `label`; 外部リンク | `.p-blogCard` | todo |
| F2 | バナーリンク | `BannerLink` | shadow / blur / overlay-color; 高さ; 角丸; `subText` | `.swell-block-bannerLink` | todo |
| F3 | ボックスメニュー | `BoxMenu` | default / fill; direction vertical / horizontal; 列数; `gap`; `iconSize` | `.swell-block-box-menu` | todo |
| F4 | 投稿リスト | `PostList` | card / list / simple / thumb / big; `ranking`; 列数 | `.p-postList` | todo |

## G. レイアウト

| # | パーツ | コンポーネント | バリアント | 参照 | 状態 |
|---|---|---|---|---|---|
| G1 | フルワイド | `FullWide` | 上下余白 0/20/40/60/80; 内幅 container / article / full; 区切り形状 wave / circle / line / tilt | `.swell-block-fullWide` | todo |
| G2 | セクション見出し | `SecTitle` | default; `sub` | `.c-secTitle` | todo |

## 対象外（spec/00-overview.md §2 参照）

AB テスト、ブログパーツ、広告タグ、メインビジュアル、ピックアップバナー、CTA、LP、固定目次ボタン、SP メニュー、追従サイドバー。

## 進め方の目安

Phase 1: A1 → A2 → B1 → B2 → B3 → C1 → D1（記事に最低限必要なもの）
Phase 2: B4 → B5 → D2 → D3 → D5 → E1 → A4
Phase 3: E2 → F1 → E3 → F3 → C2 → C3 → D4 → F2 → A3
Phase 4: F4 → G1 → G2
