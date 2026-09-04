# uneri

**うねり** — Japanese-blog-style content blocks for [Astro](https://astro.build).
Boxes, lists, balloons, buttons, FAQ, steps, tabs, tables, reviews, blog cards and more — the decoration vocabulary Japanese bloggers expect, as plain Astro components + CSS with zero dependencies.

Inspired by the WordPress theme SWELL. Not affiliated; clean-room implementation, MIT licensed.

> Status: pre-alpha. See `spec/03-parts.md` for progress.

## Usage

```astro
---
import 'uneri/styles';
import { Box, Button } from 'uneri';
---
<div class="un-content">
  <Box style="stripe">ストライプ背景のボックス</Box>
  <Button style="solid" href="/go">申し込む</Button>
</div>
```

## Development

Spec-driven. Read `spec/` first.
