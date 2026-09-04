# audit(auto): list  2026-09-04

verdict: **PASS**

pixel diff は spec/04-audit.md §2.1 によりグリフを透明にした状態で計測。グリフは ink box で比較。

| variant | vw | pixel diff % | box Δ (w/h) | ink Δ (中心x/中心y/w/h) | style diffs | pass |
|---|---|---|---|---|---|---|
| default | 375 | 0 | 0/0 | — | 0 | ✅ |
| note | 375 | 0 | 0/0 | — | 0 | ✅ |
| check | 375 | 0 | 0/0 | 0.5/1/1/0 | 0 | ✅ |
| good | 375 | 0 | 0/0 | 0/1/0/0 | 0 | ✅ |
| bad | 375 | 0 | 0/0 | 0/1.5/2/1 | 0 | ✅ |
| triangle | 375 | 0 | 0/0 | 0/1.5/0/1 | 0 | ✅ |
| num-circle | 375 | 0 | 0/0 | — | 0 | ✅ |
| ordered-default | 375 | 0 | 0/0 | — | 0 | ✅ |
| check-nested | 375 | 0 | 0/0 | 0.5/1/1/0 | 0 | ✅ |
| num-circle-nested | 375 | 0 | 0/0 | — | 0 | ✅ |
| note-ordered | 375 | 0 | 0/0 | — | 0 | ✅ |
| num-circle-ul | 375 | 0 | 0/0 | — | 0 | ✅ |
| note-nested | 375 | 0 | 0/0 | — | 0 | ✅ |
| num-circle-reversed | 375 | 0 | 0/0 | — | 0 | ✅ |
| note-ordered-nested | 375 | 0 | 0/0 | — | 0 | ✅ |
| note-reversed | 375 | 0 | 0/0 | — | 0 | ✅ |
| num-circle-deep | 375 | 0 | 0/0 | — | 0 | ✅ |
| default | 768 | 0 | 0/0 | — | 0 | ✅ |
| note | 768 | 0 | 0/0 | — | 0 | ✅ |
| check | 768 | 0 | 0/0 | 0.5/0.5/1/1 | 0 | ✅ |
| good | 768 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| bad | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| triangle | 768 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| num-circle | 768 | 0 | 0/0 | — | 0 | ✅ |
| ordered-default | 768 | 0 | 0/0 | — | 0 | ✅ |
| check-nested | 768 | 0 | 0/0 | 0.5/0.5/1/1 | 0 | ✅ |
| num-circle-nested | 768 | 0 | 0/0 | — | 0 | ✅ |
| note-ordered | 768 | 0 | 0/0 | — | 0 | ✅ |
| num-circle-ul | 768 | 0 | 0/0 | — | 0 | ✅ |
| note-nested | 768 | 0 | 0/0 | — | 0 | ✅ |
| num-circle-reversed | 768 | 0 | 0/0 | — | 0 | ✅ |
| note-ordered-nested | 768 | 0 | 0/0 | — | 0 | ✅ |
| note-reversed | 768 | 0 | 0/0 | — | 0 | ✅ |
| num-circle-deep | 768 | 0 | 0/0 | — | 0 | ✅ |
| default | 1200 | 0 | 0/0 | — | 0 | ✅ |
| note | 1200 | 0 | 0/0 | — | 0 | ✅ |
| check | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| good | 1200 | 0 | 0/0 | 0/0/0/0 | 0 | ✅ |
| bad | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| triangle | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| num-circle | 1200 | 0 | 0/0 | — | 0 | ✅ |
| ordered-default | 1200 | 0 | 0/0 | — | 0 | ✅ |
| check-nested | 1200 | 0 | 0/0 | 0/0.5/0/1 | 0 | ✅ |
| num-circle-nested | 1200 | 0 | 0/0 | — | 0 | ✅ |
| note-ordered | 1200 | 0 | 0/0 | — | 0 | ✅ |
| num-circle-ul | 1200 | 0 | 0/0 | — | 0 | ✅ |
| note-nested | 1200 | 0 | 0/0 | — | 0 | ✅ |
| num-circle-reversed | 1200 | 0 | 0/0 | — | 0 | ✅ |
| note-ordered-nested | 1200 | 0 | 0/0 | — | 0 | ✅ |
| note-reversed | 1200 | 0 | 0/0 | — | 0 | ✅ |
| num-circle-deep | 1200 | 0 | 0/0 | — | 0 | ✅ |

## style diffs
