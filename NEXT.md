# 次にやること

## 1. `impl` の 18 パーツを厳格審査に通す

`spec/03-parts.md` の状態は `pass` 8 / `impl` 18 / `todo` 0。
`impl` は**自動審査（`npm run audit`）が PASS しているだけ**で、`/audit-part <part>` による別エージェントの厳格審査はまだ。1 パーツずつ通して `pass` に上げる。

自動審査は 25 パーツすべて PASS、`audit:standalone`・`audit:cleanroom` も OK（2026-09-05 時点）。

積み残しの心当たり:
- tab — hover の定義が薄い、`#666` の直値、幅の決め方
- faq — 回答の中の見出しがマージンを失う、`data-q` の塗り分け
- accordion — `open` 状態の見た目（`is-opened`）とキャレットの向き

## 2. 実記事 1 本で通し確認

SWELL 製の実ブログの**構成だけ**を設計図として借り、本文と画像は自前のダミーに差し替えて 1 記事組む。パーツの取りこぼしと API の使い勝手を洗うのが目的。

候補（本文で実際に使われているブロックを数えて選定済み）:
- <https://okomoli.com/aitools-matome/> — 16 種。比較表＋セルアイコンが多く、アフィリのまとめ記事と同型。**第一候補**
- <https://otome-log.com/swell_review/> — リッチカラム・ステップ・リンクリストが多い
- <https://okomoli.com/catchy-review/> — 分量が手頃

他人の本文・画像はコピーしない（構成だけ借りる）。

## 3. Issue 自動処理

- `.claude/agents/uneri-fixer.md` — Issue 1 件を「修正 → 審査 → PR → close」まで持っていく手順書
- セッション側で `gh issue list` を 5 分間隔で見る Monitor を張ると、Issue が立った時点で通知が来る（session-scoped なので毎回張り直す）
- **審査はこのマシンでしか回らない**（`reference/` は git に入れない）。GitHub Actions で回せるのは `astro build` と `audit:standalone` まで
