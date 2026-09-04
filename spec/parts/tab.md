# Tab — タブ（D4）

- 状態: impl
- 参照: SWELL タブブロック `.swell-block-tab`（`.is-style-default` / `-simple` / `-bb` / `-balloon`）、`.c-tabList` / `.c-tabBody`
- 依存トークン: `--un-color-main` `--un-color-text` `--un-color-bg` `--un-color-gray` `--un-color-tab-line`
- ファイル: `src/components/Tab.astro`, `src/components/TabPanel.astro`, `src/styles/parts/tab.css`, `src/pages/catalog/tab.astro`, `reference/fixtures/tab.html`

## 1. 用途

見出しの並びで内容を切り替える表示。**切り替えの動作は持たない**（`00-overview.md` の非目標「装飾以外の JS」）。最初のタブが選択された状態を静的に描く。

## 2. API

```ts
// Tab（親）
interface Props extends HTMLAttributes<'div'> {
  variant?: 'default' | 'simple' | 'bb' | 'balloon'; // 既定 'default'
  /** タブ 1 つの幅。`auto` は内容幅 */
  width?: '25' | '33' | '50' | 'auto';               // ≥960px。既定 '25'
  widthSp?: '25' | '33' | '50' | 'auto';             // <960px。既定 '50'
  /** 見出しの並び */
  labels: string[];
  class?: string;
  id?: string;
}

// TabPanel（子）
interface Props extends HTMLAttributes<'div'> {
  /** 何番目のタブに対応するか（0 始まり）*/
  index: number;
  class?: string;
  id?: string;
}
```

slot: Tab は TabPanel の並び、TabPanel は中身。

## 3. バリアント一覧

| data-variant | props | 参照クラス | 見た目の要点 |
|---|---|---|---|
| `default` | 既定 | `.is-style-default` | 選択タブが濃い塗り、本文を枠で囲む |
| `simple` | `variant="simple"` | `.is-style-simple` | 選択タブが薄い灰、枠なし |
| `bb` | `variant="bb"` | `.is-style-bb` | 下線だけ、選択タブがメインカラー |
| `balloon` | `variant="balloon"` | `.is-style-balloon` | 角丸のタブ、選択がメインカラー |

## 4. マークアップ

```html
<div class="un-tab un-tab--default">
  <ul class="un-tab__list" role="tablist">
    <li class="un-tab__item" role="presentation">
      <button class="un-tab__button" role="tab" aria-selected="true">…</button>
    </li>
  </ul>
  <div class="un-tab__body">
    <div class="un-tab__panel" role="tabpanel">…</div>
  </div>
</div>
```

## 5. 計測値（参照の実測。@1200 / 本文 16px）

| 対象 | プロパティ | 値 |
|---|---|---|
| list | display / flex-wrap | flex / wrap |
| list（simple / bb / balloon）| justify-content | center |
| item | flex-basis / position / text-align | `width`（≥960）/ `widthSp`（<960）/ relative / center |
| button | display / width / cursor | block / 100% / pointer |
| button | font-size / line-height / font-weight | 13px（≥600 は 14px。参照は px 固定）/ 1 / 400 |
| button | padding | 0.75em 0.5em |
| body（default）| padding / border / margin-top / position | 1.5em（≥600 は 2em）/ 1px solid `--un-color-text` / -1px（タブと線を重ねる）/ relative |
| body / panel | position / width | relative / パネルは 100% |

### バリアント別
| variant | 対象 | プロパティ | 値 |
|---|---|---|---|
| default | 選択タブ | background / color | `--un-color-text` / `--un-color-bg` |
| default | 非選択タブ | color / opacity | `--un-color-text` / 0.5 |
| simple | item | margin-bottom / 2 つめ以降の margin-left | 0.5em / -1px（枠線を重ねる）|
| simple | button | padding / border | 1em 0.5em / 1px solid `--un-color-tab-line` |
| simple | 選択タブ | background | `--un-color-tab-line` |
| simple | 非選択タブ | color | #666 |

| bb | list / item | flex-wrap / flex-shrink / margin-bottom | nowrap / 1 / 0.75em |
| bb | button | padding | 0.25em 0.5em 1em |
| bb | button::before | 下端の細線 | 幅 100%・高さ 1px・`--un-color-text` の opacity .4、z-index 0 |
| bb | button::after | 選択線 | 幅 100%・高さ 2px・`--un-color-main`、既定は `opacity: 0`、選択で 1（0.25s）|
| bb | 選択タブ | color / font-weight | `--un-color-main` / 700 |
| bb | 非選択タブ | color / opacity | `--un-color-text` / 0.7 |

| balloon | button::before | しっぽ | `border-width: 8px 8px 0`・上辺だけ `--un-color-main` の三角（下端中央、`translateX(-50%)`）。既定は `opacity: 0`、選択タブで 1（0.25s）|
| balloon | 選択タブ | background / color | `--un-color-main` / #fff |
| balloon | 非選択タブ | background | `--un-color-gray` |
| balloon | item | flex-shrink / margin-bottom / padding / transition | 1 / 16px / 0 4px / `background-color, color` 0.1s |
| balloon | button | padding / box-shadow | 1em / `--un-shadow-box` |

## 6. 受け入れ基準

- [ ] 全 4 バリアントが 375 / 768 / 1200 で pixel diff ≤ 0.3%、box Δ ≤ 1px
- [ ] 選択・非選択の見た目が参照と一致する
- [ ] `width` でタブ幅が変わる
- [ ] `.un-content` の外でも成立する

## 7. 備考

- タブ幅の切り替えだけ `960px` を使う（参照の実測。本文のブレークポイント 600px とは別）。

- 参照は JS でタブを切り替える。uneri は静的な見た目のみを提供し、切り替えは利用者側で `aria-selected` と `hidden` を付け替える前提にする（`00-overview.md` の非目標）。
