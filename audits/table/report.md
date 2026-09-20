# audit(auto): table  2026-09-20

verdict: **PASS**

pixel diff は spec/04-audit.md §2.1 によりグリフを透明にした状態で計測。グリフは ink box で比較。

| variant | vw | pixel diff % | box Δ (w/h) | ink Δ (中心x/中心y/w/h) | style diffs | 許容乖離 | pass |
|---|---|---|---|---|---|---|---|
| default | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| simple | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| simple-scroll | 375 | 5.034 | 0/3 | — | 0 | 22 | ✅ |
| double | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| head-column | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| stack | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| scroll | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| scroll-pc | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| scroll-sp | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| min-width-10 | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| min-width-30 | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| fixed-column | 375 | 0 | 0/0 | — | 0 | 4 | ✅ |
| fixed-column-scrolled | 375 | 0.617 | 0/0 | — | 0 | 4 | ✅ |
| centered | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| cell-bg | 375 | 0 | 0/0 | — | 0 | 0 | ✅ |
| icon-obj-double-circle | 375 | 0 | 0/0 | 0/0/2/0 | 0 | 0 | ✅ |
| icon-obj-circle | 375 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-obj-triangle | 375 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-obj-close | 375 | 0 | 0/0 | 0/0/2/2 | 0 | 0 | ✅ |
| icon-obj-hatena | 375 | 0 | 0/0 | 0/0/2/0 | 0 | 0 | ✅ |
| icon-obj-line | 375 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-obj-check | 375 | 0 | 0/0 | 0.5/0/1/2 | 0 | 0 | ✅ |
| icon-bg-double-circle | 375 | 0 | 0/0 | 0.5/0/1/0 | 0 | 0 | ✅ |
| icon-bg-circle | 375 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-triangle | 375 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-bg-close | 375 | 0 | 0/0 | 0/0/2/2 | 0 | 0 | ✅ |
| icon-bg-hatena | 375 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-line | 375 | 0 | 0/0 | 0/0/2/0 | 0 | 0 | ✅ |
| icon-bg-check | 375 | 0 | 0/0 | 0.5/0/1/2 | 0 | 0 | ✅ |
| icon-obj-size-s | 375 | 0 | 0/0 | 0/0/2/2 | 0 | 0 | ✅ |
| icon-obj-size-l | 375 | 0 | 0/0 | 0/0/2/2 | 0 | 0 | ✅ |
| icon-bg-size-s | 375 | 0 | 0/0 | 0/0/2/2 | 0 | 0 | ✅ |
| icon-bg-size-l | 375 | 0 | 0/0 | 0.5/0/1/0 | 0 | 0 | ✅ |
| default | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| simple | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| simple-scroll | 768 | 3.954 | 0/3 | — | 0 | 22 | ✅ |
| double | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| head-column | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| stack | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| scroll | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| scroll-pc | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| scroll-sp | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| min-width-10 | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| min-width-30 | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| fixed-column | 768 | 0 | 0/0 | — | 0 | 4 | ✅ |
| fixed-column-scrolled | 768 | 0.33 | 0/0 | — | 0 | 4 | ✅ |
| centered | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| cell-bg | 768 | 0 | 0/0 | — | 0 | 0 | ✅ |
| icon-obj-double-circle | 768 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-obj-circle | 768 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-obj-triangle | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-obj-close | 768 | 0 | 0/0 | 0/0/0/2 | 0 | 0 | ✅ |
| icon-obj-hatena | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-obj-line | 768 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-obj-check | 768 | 0 | 0/0 | 0.5/0/1/2 | 0 | 0 | ✅ |
| icon-bg-double-circle | 768 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-circle | 768 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-triangle | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-bg-close | 768 | 0 | 0/0 | 0/0/0/2 | 0 | 0 | ✅ |
| icon-bg-hatena | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-bg-line | 768 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-check | 768 | 0 | 0/0 | 0.5/0/1/2 | 0 | 0 | ✅ |
| icon-obj-size-s | 768 | 0 | 0/0 | 0/0/2/2 | 0 | 0 | ✅ |
| icon-obj-size-l | 768 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-size-s | 768 | 0 | 0/0 | 0/0/2/2 | 0 | 0 | ✅ |
| icon-bg-size-l | 768 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| default | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| simple | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| simple-scroll | 1200 | 3.629 | 0/3 | — | 0 | 22 | ✅ |
| double | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| head-column | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| stack | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| scroll | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| scroll-pc | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| scroll-sp | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| min-width-10 | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| min-width-30 | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| fixed-column | 1200 | 0 | 0/0 | — | 0 | 4 | ✅ |
| fixed-column-scrolled | 1200 | 0.244 | 0/0 | — | 0 | 4 | ✅ |
| centered | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| cell-bg | 1200 | 0 | 0/0 | — | 0 | 0 | ✅ |
| icon-obj-double-circle | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-obj-circle | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-obj-triangle | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-obj-close | 1200 | 0 | 0/0 | 0/0/0/2 | 0 | 0 | ✅ |
| icon-obj-hatena | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-obj-line | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-obj-check | 1200 | 0 | 0/0 | 0.5/0/1/2 | 0 | 0 | ✅ |
| icon-bg-double-circle | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-circle | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-triangle | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-bg-close | 1200 | 0 | 0/0 | 0/0/0/2 | 0 | 0 | ✅ |
| icon-bg-hatena | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | 0 | ✅ |
| icon-bg-line | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-check | 1200 | 0 | 0/0 | 0.5/0/1/2 | 0 | 0 | ✅ |
| icon-obj-size-s | 1200 | 0 | 0/0 | 0/0/2/2 | 0 | 0 | ✅ |
| icon-obj-size-l | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |
| icon-bg-size-s | 1200 | 0 | 0/0 | 0/0/2/2 | 0 | 0 | ✅ |
| icon-bg-size-l | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | 0 | ✅ |

## style diffs

## 許容乖離（spec/04-audit.md §3.1）

参照と意図的に違う箇所。合否には数えない。

- `simple-scroll` `div` **height**: 参照 `177px` → uneri `180px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]` **height**: 参照 `177px` → uneri `180px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]` **height**: 参照 `161px` → uneri `164px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]` **height**: 参照 `40px` → uneri `41.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]` **height**: 参照 `40px` → uneri `41.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[0]` **border-bottom-width**: 参照 `0px` → uneri `4px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[0]` **border-bottom-style**: 参照 `none` → uneri `double`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[0]` **border-bottom-color**: 参照 `rgb(51, 51, 51)` → uneri `rgb(220, 220, 220)`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[0]` **height**: 参照 `40px` → uneri `41.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[1]` **border-bottom-width**: 参照 `0px` → uneri `4px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[1]` **border-bottom-style**: 参照 `none` → uneri `double`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[1]` **border-bottom-color**: 参照 `rgb(51, 51, 51)` → uneri `rgb(220, 220, 220)`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[1]` **height**: 参照 `40px` → uneri `41.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[2]` **border-bottom-width**: 参照 `0px` → uneri `4px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[2]` **border-bottom-style**: 参照 `none` → uneri `double`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[2]` **border-bottom-color**: 参照 `rgb(51, 51, 51)` → uneri `rgb(220, 220, 220)`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>thead[0]>tr[0]>th[2]` **height**: 参照 `40px` → uneri `41.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>tbody[1]` **height**: 参照 `120px` → uneri `121.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>tbody[1]>tr[0]` **height**: 参照 `40px` → uneri `41.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>tbody[1]>tr[0]>th[0]` **height**: 参照 `40px` → uneri `41.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>tbody[1]>tr[0]>td[1]` **height**: 参照 `40px` → uneri `41.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `simple-scroll` `div>figure[0]>table[0]>tbody[1]>tr[0]>td[2]` **height**: 参照 `40px` → uneri `41.5px`
  - issue #2: simple keeps its 4px header rule under scroll, which makes the table 3px taller and shifts every row 1.5px — hence the height, box and pixel allowances. The reference's scroll reset eats the rule and simple becomes indistinguishable from default.

- `fixed-column` `div>figure[0]>table[0]>thead[0]>tr[0]>th[0]::after` **(pseudo)**: 参照 `absent` → uneri `present`
  - issue #1: the sticky column draws its own right edge (1px, hence the pixel allowance). The reference leaves the collapsed border behind and the boundary vanishes mid-scroll.

- `fixed-column` `div>figure[0]>table[0]>tbody[1]>tr[0]>th[0]::after` **(pseudo)**: 参照 `absent` → uneri `present`
  - issue #1: the sticky column draws its own right edge (1px, hence the pixel allowance). The reference leaves the collapsed border behind and the boundary vanishes mid-scroll.

- `fixed-column` `div>figure[0]>table[0]>tbody[1]>tr[1]>th[0]::after` **(pseudo)**: 参照 `absent` → uneri `present`
  - issue #1: the sticky column draws its own right edge (1px, hence the pixel allowance). The reference leaves the collapsed border behind and the boundary vanishes mid-scroll.

- `fixed-column` `div>figure[0]>table[0]>tbody[1]>tr[2]>th[0]::after` **(pseudo)**: 参照 `absent` → uneri `present`
  - issue #1: the sticky column draws its own right edge (1px, hence the pixel allowance). The reference leaves the collapsed border behind and the boundary vanishes mid-scroll.

- `fixed-column-scrolled` `div>figure[0]>table[0]>thead[0]>tr[0]>th[0]::after` **(pseudo)**: 参照 `absent` → uneri `present`
  - issue #1: the sticky column draws its own right edge (1px, hence the pixel allowance). The reference leaves the collapsed border behind and the boundary vanishes mid-scroll.

- `fixed-column-scrolled` `div>figure[0]>table[0]>tbody[1]>tr[0]>th[0]::after` **(pseudo)**: 参照 `absent` → uneri `present`
  - issue #1: the sticky column draws its own right edge (1px, hence the pixel allowance). The reference leaves the collapsed border behind and the boundary vanishes mid-scroll.

- `fixed-column-scrolled` `div>figure[0]>table[0]>tbody[1]>tr[1]>th[0]::after` **(pseudo)**: 参照 `absent` → uneri `present`
  - issue #1: the sticky column draws its own right edge (1px, hence the pixel allowance). The reference leaves the collapsed border behind and the boundary vanishes mid-scroll.

- `fixed-column-scrolled` `div>figure[0]>table[0]>tbody[1]>tr[2]>th[0]::after` **(pseudo)**: 参照 `absent` → uneri `present`
  - issue #1: the sticky column draws its own right edge (1px, hence the pixel allowance). The reference leaves the collapsed border behind and the boundary vanishes mid-scroll.
