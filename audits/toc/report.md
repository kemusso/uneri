# audit(auto): toc  2026-09-04

verdict: **PASS**

pixel diff は spec/04-audit.md §2.1 によりグリフを透明にした状態で計測。グリフは ink box で比較。

| variant | vw | pixel diff % | box Δ (w/h) | ink Δ (中心x/中心y/w/h) | style diffs | pass |
|---|---|---|---|---|---|---|
| default | 375 | 0 | 0/0.0625 | 0/1.5/0/1 | 0 | ✅ |
| double | 375 | 0 | 0/0.0625 | 0/1.5/0/1 | 0 | ✅ |
| default | 768 | 0 | 0/0 | 0.5/1.5/1/1 | 0 | ✅ |
| double | 768 | 0 | 0/0 | 0.5/1.5/1/1 | 0 | ✅ |
| default | 1200 | 0.01 | 0/0 | 0.5/1.5/1/1 | 0 | ✅ |
| double | 1200 | 0.017 | 0/0 | 0.5/1.5/1/1 | 0 | ✅ |

## style diffs
