# audit(auto): review  2026-09-20

verdict: **PASS**

pixel diff は spec/04-audit.md §2.1 によりグリフを透明にした状態で計測。グリフは ink box で比較。

| variant | vw | pixel diff % | box Δ (w/h) | ink Δ (中心x/中心y/w/h) | style diffs | 許容乖離 | pass |
|---|---|---|---|---|---|---|---|
| default | 375 | 0.03 | 0/0 | 1/0.5/0/1 | 0 | 0 | ✅ |
| no-image | 375 | 0.042 | 0/0 | 1/0.5/0/1 | 0 | 0 | ✅ |
| merits-only | 375 | 0.033 | 0/0 | 1/0.5/0/1 | 0 | 0 | ✅ |
| default | 768 | 0.005 | 0/0 | 1/0.5/0/1 | 0 | 0 | ✅ |
| no-image | 768 | 0.008 | 0/0 | 1/0.5/0/1 | 0 | 0 | ✅ |
| merits-only | 768 | 0.004 | 0/0 | 1/0.5/0/1 | 0 | 0 | ✅ |
| default | 1200 | 0.004 | 0/0 | 1/0.5/0/1 | 0 | 0 | ✅ |
| no-image | 1200 | 0.006 | 0/0 | 1/0.5/0/1 | 0 | 0 | ✅ |
| merits-only | 1200 | 0.003 | 0/0 | 1/0.5/0/1 | 0 | 0 | ✅ |

## style diffs
