# 02 — デザイントークン

`src/styles/tokens.css` の `:root` に定義する。値は参照サイト（SWELL 既定値）を描画・計測した結果。
利用者はサイト側でこの custom property を上書きしてテーマ化する（SWELL のカスタマイザー相当）。

## 1. ブレークポイント

| 名前 | 値 | 用途 |
|---|---|---|
| `sm` | `600px` | スマホ→タブレット境界 |
| `lg` | `960px` | タブレット→PC 境界（サイドバー出現） |

`@media (min-width: 600px)` / `@media (min-width: 960px)` の 2 つを基本とする。サイト最大幅の切り替えのみ `@media (min-width: 1200px)` を追加で使う（`--un-container-pad`）。タブの列幅だけ参照が 960px で切り替えるため、そこも実測どおりにする。

## 2. 色

| トークン | 既定値 | 参照名 |
|---|---|---|
| `--un-color-main` | `#04384c` | color_main |
| `--un-color-main-thin` | `rgba(5,70,95,.05)` | color_main_thin |
| `--un-color-main-dark` | `rgba(3,42,57,1)` | color_main_dark |
| `--un-color-text` | `#333` | color_text |
| `--un-color-link` | `#1176d4` | color_link |
| `--un-color-heading` | `#04384c` | color_htag |
| `--un-color-bg` | `#fdfdfd` | color_bg |
| `--un-color-border` | `hsla(0,0%,78%,.5)` | color_border |
| `--un-color-gray` | `hsla(0,0%,78%,.15)` | color_gray |
| `--un-color-hover-gray` | `rgba(3,2,2,.05)` | hov_gray |
| `--un-color-gradient-1` | `#d8ffff` | color_gradient1 |
| `--un-color-gradient-2` | `#87e7ff` | color_gradient2 |
| `--un-color-code-bg` | `#f7f7f7` | インラインコード背景 |
| `--un-color-table-border` | `#dcdcdc` | 表の罫線 |
| `--un-color-quote-rule` | `rgba(180,180,180,.75)` | 引用の縦線 |
| `--un-color-heading-rule` | `rgba(150,150,150,.2)` | h3 下線の薄い側 |
| `--un-color-note-text` | `#5f5a59` | 注釈ボックスの文字 |
| `--un-color-note-bg` | `#f7f7f7` | 注釈ボックスの背景 |
| `--un-color-note-rule` | `rgba(199,199,199,.6)` | 注釈ボックスの内側破線 |
| `--un-color-btn-red` | `#f74a4a` | ボタン（赤）|
| `--un-color-btn-blue` | `#338df4` | ボタン（青）|
| `--un-color-btn-green` | `#62d847` | ボタン（緑）|
| `--un-color-btn-red-dark` | `#b93838` | 立体ボタンの影（赤）|
| `--un-color-btn-blue-dark` | `#266ab7` | 立体ボタンの影（青）|
| `--un-color-btn-green-dark` | `#4aa235` | 立体ボタンの影（緑）|
| `--un-color-balloon-gray-bg` / `-line` | `#f7f7f7` / `#ccc` | ふきだし（灰）|
| `--un-color-balloon-red-bg` / `-line` | `#ffebeb` / `#f48789` | ふきだし（赤）|
| `--un-color-balloon-blue-bg` / `-line` | `#e2f6ff` / `#93d2f0` | ふきだし（青）|
| `--un-color-balloon-green-bg` / `-line` | `#d1f8c2` / `#9ddd93` | ふきだし（緑）|
| `--un-color-balloon-yellow-bg` / `-line` | `#f9f7d2` / `#fbe593` | ふきだし（黄）|
| `--un-color-balloon-icon-border` | `#ececec` | ふきだしアイコンの縁 |
| `--un-color-step-arrow` | `#dedede` | ステップ（big）の矢印 |
| `--un-color-tab-line` | `#ddd` | タブ（simple）の帯と線 |
| `--un-color-colset-1` / `-bg` | `#f59b5f` / `#fff8eb` | キャプションボックスの色セット 1 |
| `--un-color-colset-2` / `-bg` | `#5fb9f5` / `#edf5ff` | 色セット 2 |
| `--un-color-colset-3` / `-bg` | `#2fcd90` / `#eafaf2` | 色セット 3 |

### 2.1 濃色 / 淡色セット（キャプションボックス・カラム等の色セット）

| トークン | 既定値 |
|---|---|
| `--un-color-deep-1` … `-4` | `#e44141` `#3d79d5` `#63a84d` `#f09f4d` |
| `--un-color-pale-1` … `-4` | `#fff2f0` `#f3f8fd` `#f1f9ee` `#fdf9ee` |

### 2.2 マーカー

| トークン | 既定値 |
|---|---|
| `--un-color-mark-yellow` | `#fcf69f` |
| `--un-color-mark-blue` | `#b7e3ff` |
| `--un-color-mark-green` | `#bdf9c3` |
| `--un-color-mark-orange` | `#ffddbc` |

### 2.3 リスト

| トークン | 既定値 |
|---|---|
| `--un-color-list-check` | `#04384c` |
| `--un-color-list-num` | `#04384c` |
| `--un-color-list-good` | `#86dd7b` |
| `--un-color-list-triangle` | `#f4e03a` |
| `--un-color-list-bad` | `#f36060` |

### 2.4 FAQ

参照サイトは Q/A の色を設定していないため既定は本文色。色を付けたい場合に上書きする。

| トークン | 既定値 |
|---|---|
| `--un-color-faq-q` | `currentColor` |
| `--un-color-faq-a` | `currentColor` |

### 2.5 アイコン付きボックス（icon / big-icon 系）

| 種類 | アイコン色 | 背景色 |
|---|---|---|
| good | `#3cd250` | `#ecffe9` |
| bad | `#4b73eb` | `#eafaff` |
| info | `#f578b4` | `#fff0fa` |
| announce | `#ffa537` | `#fff5f0` |
| pen | `#7a7a7a` | `#f7f7f7` |
| book | `#787364` | `#f8f6ef` |
| point | `#ffa639` | — |
| check | `#86d67c` | — |
| batsu | `#f36060` | — |
| hatena | `#5295cc` | — |
| caution | `#f7da38` | — |
| memo | `#84878a` | — |

トークン名: `--un-color-icon-<name>` / `--un-color-icon-<name>-bg`。

## 3. タイポグラフィ

| トークン | 既定値 |
|---|---|
| `--un-font-family` | `"游ゴシック体","Yu Gothic",YuGothic,"Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif` |
| `--un-font-weight` | `500` |
| `--un-font-mono` | `Menlo,Consolas,メイリオ,sans-serif` |
| `--un-fz-root` | `3.6vw`（sm 以上で `16px`） |
| `--un-fz-content` | `4vw`（sm 以上で `1rem`） |
| `--un-fz-xs` | `.75em` |
| `--un-fz-sm` | `.9em` |
| `--un-fz-md` | `1.1em` |
| `--un-fz-lg` | `1.25em` |
| `--un-fz-xl` | `1.6em` |
| `--un-line-height` | `1.8`（本文）|

## 4. 余白・サイズ

| トークン | 既定値 | 意味 |
|---|---|---|
| `--un-block-margin` | `2em` | 本文内ブロック間の上下マージン |
| `--un-box-padding` | `1.5em` | ボックス内側の余白 |
| `--un-list-padding-left` | `1.5em` | リストの左余白 |
| `--un-list-padding-bg` | `1em 1em 1em 1.75em` | 背景付きリストの余白 |
| `--un-radius-sm` | `2px` | |
| `--un-radius-md` | `4px` | ボタン・ボックス |
| `--un-radius-pill` | `40px` | 丸ボタン |
| `--un-radius-btn` | `80px` | ボタン（参照実測）|
| `--un-radius-balloon` | `8px` | ふきだし |
| `--un-container-pad` | `4vw` | サイト左右余白（`<960` は 4vw、`960–1199` は 32px、`≥1200` は 48px。実測）|
| `--un-content-pad` | `0`（lg 以上で `16px`）| `.un-content` 左右 padding |
| `--un-article-width` | `900px` | 本文最大幅 |
| `--un-container-width` | `1200px` | サイト最大幅 |
| `--un-sidebar-width` | `280px` | |

## 5. 影・境界線

| トークン | 既定値 |
|---|---|
| `--un-shadow-box` | `0 2px 4px rgba(0,0,0,.05),0 4px 4px -4px rgba(0,0,0,.1)` |
| `--un-shadow-img` | `0 2px 8px rgba(0,0,0,.1),0 4px 8px -4px rgba(0,0,0,.2)` |
| `--un-shadow-btn` | `0 2px 2px rgba(0,0,0,.1),0 4px 8px -4px rgba(0,0,0,.2)` |
| `--un-shadow-btn-hover` | `0 4px 12px rgba(0,0,0,.1),0 12px 24px -12px rgba(0,0,0,.2)` |
| `--un-shadow-color` | `rgba(0,0,0,.12)` |
| `--un-border-1` | `solid 1px var(--un-color-main)` |
| `--un-border-2` | `double 4px var(--un-color-main)` |
| `--un-border-3` | `dashed 2px var(--un-color-border)` |
| `--un-border-4` | `solid 4px var(--un-color-gray)` |

## 6. サムネイル比率

| トークン | 既定値 |
|---|---|
| `--un-ratio-card` | `56.25%` (16:9) |
| `--un-ratio-list` | `61.805%` |
| `--un-ratio-blogcard` | `56.25%` |

## 7. 追加のルール

- トークンを増やすときは本表に追記してから CSS に書く。
- パーツ固有で外部に公開しない値は `--_` 接頭辞でパーツ CSS 内に閉じる。
