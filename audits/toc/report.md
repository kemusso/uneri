# audit(auto): toc  2026-09-20

verdict: **PASS**

pixel diff は spec/04-audit.md §2.1 によりグリフを透明にした状態で計測。グリフは ink box で比較。

| variant | vw | pixel diff % | box Δ (w/h) | ink Δ (中心x/中心y/w/h) | style diffs | 許容乖離 | pass |
|---|---|---|---|---|---|---|---|
| default | 375 | 1.514 | 0/0.0625 | 0/1.5/0/1 | 0 | 7 | ✅ |
| double | 375 | 1.912 | 0/0.0625 | 0/1.5/0/1 | 0 | 7 | ✅ |
| default | 768 | 0.923 | 0/0 | 0.5/1.5/1/1 | 0 | 7 | ✅ |
| double | 768 | 1.019 | 0/0 | 0.5/1.5/1/1 | 0 | 7 | ✅ |
| default | 1200 | 0.744 | 0/0 | 0.5/1.5/1/1 | 0 | 7 | ✅ |
| double | 1200 | 0.828 | 0/0 | 0.5/1.5/1/1 | 0 | 7 | ✅ |

## style diffs

## 許容乖離（spec/04-audit.md §3.1）

参照と意図的に違う箇所。合否には数えない。

- `default` `div>div[0]>ol[1]` **padding-left**: 参照 `0px` → uneri `22.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `default` `div>div[0]>ol[1]>li[0]` **width**: 参照 `345px` → uneri `322.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `default` `div>div[0]>ol[1]>li[1]` **width**: 参照 `345px` → uneri `322.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `default` `div>div[0]>ol[1]>li[2]` **width**: 参照 `345px` → uneri `322.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `default` `div>div[0]>ol[1]>li[2]>ol[1]` **padding-left**: 参照 `7.5px` → uneri `22.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `default` `div>div[0]>ol[1]>li[2]>ol[1]` **width**: 参照 `345px` → uneri `322.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `default` `div>div[0]>ol[1]>li[2]>ol[1]>li[0]` **width**: 参照 `337.5px` → uneri `300px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `double` `div>div[0]>ol[1]` **padding-left**: 参照 `0px` → uneri `22.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `double` `div>div[0]>ol[1]>li[0]` **width**: 参照 `315px` → uneri `292.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `double` `div>div[0]>ol[1]>li[1]` **width**: 参照 `315px` → uneri `292.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `double` `div>div[0]>ol[1]>li[2]` **width**: 参照 `315px` → uneri `292.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `double` `div>div[0]>ol[1]>li[2]>ol[1]` **padding-left**: 参照 `7.5px` → uneri `22.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `double` `div>div[0]>ol[1]>li[2]>ol[1]` **width**: 参照 `315px` → uneri `292.5px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.

- `double` `div>div[0]>ol[1]>li[2]>ol[1]>li[0]` **width**: 参照 `307.5px` → uneri `270px`
  - issue #3: the list reserves a gutter for its markers. The reference reserves none, so "10." and up are clipped wherever the toc meets its container edge.
