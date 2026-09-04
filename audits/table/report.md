# audit(auto): table  2026-09-04

verdict: **PASS**

pixel diff は spec/04-audit.md §2.1 によりグリフを透明にした状態で計測。グリフは ink box で比較。

| variant | vw | pixel diff % | box Δ (w/h) | ink Δ (中心x/中心y/w/h) | style diffs | pass |
|---|---|---|---|---|---|---|
| default | 375 | 0 | 0/0 | — | 0 | ✅ |
| simple | 375 | 0 | 0/0 | — | 0 | ✅ |
| double | 375 | 0 | 0/0 | — | 0 | ✅ |
| head-column | 375 | 0 | 0/0 | — | 0 | ✅ |
| stack | 375 | 0 | 0/0 | — | 0 | ✅ |
| scroll | 375 | 0 | 0/0 | — | 0 | ✅ |
| scroll-pc | 375 | 0 | 0/0 | — | 0 | ✅ |
| scroll-sp | 375 | 0 | 0/0 | — | 0 | ✅ |
| min-width-10 | 375 | 0 | 0/0 | — | 0 | ✅ |
| min-width-30 | 375 | 0 | 0/0 | — | 0 | ✅ |
| fixed-column | 375 | 0 | 0/0 | — | 0 | ✅ |
| centered | 375 | 0 | 0/0 | — | 0 | ✅ |
| cell-bg | 375 | 0 | 0/0 | — | 0 | ✅ |
| icon-obj-double-circle | 375 | 0 | 0/0 | 0/0/2/0 | 0 | ✅ |
| icon-obj-circle | 375 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-obj-triangle | 375 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-obj-close | 375 | 0 | 0/0 | 0/0/2/2 | 0 | ✅ |
| icon-obj-hatena | 375 | 0 | 0/0 | 0/0/2/0 | 0 | ✅ |
| icon-obj-line | 375 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-obj-check | 375 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| icon-bg-double-circle | 375 | 0 | 0/0 | 0.5/0/1/0 | 0 | ✅ |
| icon-bg-circle | 375 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-triangle | 375 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-bg-close | 375 | 0 | 0/0 | 0/0/2/2 | 0 | ✅ |
| icon-bg-hatena | 375 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-line | 375 | 0 | 0/0 | 0/0/2/0 | 0 | ✅ |
| icon-bg-check | 375 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| icon-obj-size-s | 375 | 0 | 0/0 | 0/0/2/2 | 0 | ✅ |
| icon-obj-size-l | 375 | 0 | 0/0 | 0/0/2/2 | 0 | ✅ |
| icon-bg-size-s | 375 | 0 | 0/0 | 0/0/2/2 | 0 | ✅ |
| icon-bg-size-l | 375 | 0 | 0/0 | 0.5/0/1/0 | 0 | ✅ |
| default | 768 | 0 | 0/0 | — | 0 | ✅ |
| simple | 768 | 0 | 0/0 | — | 0 | ✅ |
| double | 768 | 0 | 0/0 | — | 0 | ✅ |
| head-column | 768 | 0 | 0/0 | — | 0 | ✅ |
| stack | 768 | 0 | 0/0 | — | 0 | ✅ |
| scroll | 768 | 0 | 0/0 | — | 0 | ✅ |
| scroll-pc | 768 | 0 | 0/0 | — | 0 | ✅ |
| scroll-sp | 768 | 0 | 0/0 | — | 0 | ✅ |
| min-width-10 | 768 | 0 | 0/0 | — | 0 | ✅ |
| min-width-30 | 768 | 0 | 0/0 | — | 0 | ✅ |
| fixed-column | 768 | 0 | 0/0 | — | 0 | ✅ |
| centered | 768 | 0 | 0/0 | — | 0 | ✅ |
| cell-bg | 768 | 0 | 0/0 | — | 0 | ✅ |
| icon-obj-double-circle | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-obj-circle | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-obj-triangle | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-obj-close | 768 | 0 | 0/0 | 0/0/0/2 | 0 | ✅ |
| icon-obj-hatena | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-obj-line | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-obj-check | 768 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| icon-bg-double-circle | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-circle | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-triangle | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-bg-close | 768 | 0 | 0/0 | 0/0/0/2 | 0 | ✅ |
| icon-bg-hatena | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-bg-line | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-check | 768 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| icon-obj-size-s | 768 | 0 | 0/0 | 0/0/2/2 | 0 | ✅ |
| icon-obj-size-l | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-size-s | 768 | 0 | 0/0 | 0/0/2/2 | 0 | ✅ |
| icon-bg-size-l | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| default | 1200 | 0 | 0/0 | — | 0 | ✅ |
| simple | 1200 | 0 | 0/0 | — | 0 | ✅ |
| double | 1200 | 0 | 0/0 | — | 0 | ✅ |
| head-column | 1200 | 0 | 0/0 | — | 0 | ✅ |
| stack | 1200 | 0 | 0/0 | — | 0 | ✅ |
| scroll | 1200 | 0 | 0/0 | — | 0 | ✅ |
| scroll-pc | 1200 | 0 | 0/0 | — | 0 | ✅ |
| scroll-sp | 1200 | 0 | 0/0 | — | 0 | ✅ |
| min-width-10 | 1200 | 0 | 0/0 | — | 0 | ✅ |
| min-width-30 | 1200 | 0 | 0/0 | — | 0 | ✅ |
| fixed-column | 1200 | 0 | 0/0 | — | 0 | ✅ |
| centered | 1200 | 0 | 0/0 | — | 0 | ✅ |
| cell-bg | 1200 | 0 | 0/0 | — | 0 | ✅ |
| icon-obj-double-circle | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-obj-circle | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-obj-triangle | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-obj-close | 1200 | 0 | 0/0 | 0/0/0/2 | 0 | ✅ |
| icon-obj-hatena | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-obj-line | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-obj-check | 1200 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| icon-bg-double-circle | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-circle | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-triangle | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-bg-close | 1200 | 0 | 0/0 | 0/0/0/2 | 0 | ✅ |
| icon-bg-hatena | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| icon-bg-line | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-check | 1200 | 0 | 0/0 | 0.5/0/1/2 | 0 | ✅ |
| icon-obj-size-s | 1200 | 0 | 0/0 | 0/0/2/2 | 0 | ✅ |
| icon-obj-size-l | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| icon-bg-size-s | 1200 | 0 | 0/0 | 0/0/2/2 | 0 | ✅ |
| icon-bg-size-l | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |

## style diffs
