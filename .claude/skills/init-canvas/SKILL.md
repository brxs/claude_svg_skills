---
description: Initialize a new SVG canvas file
---

# Init Canvas

Creates a new blank SVG canvas file.

## Usage

```bash
node .claude/skills/init-canvas/index.js <width> <height> <background> <output>
```

## Parameters

- `width` - Canvas width in pixels (default: 500)
- `height` - Canvas height in pixels (default: 809)
- `background` - Background color as hex (default: #FAFAFA)
- `output` - Output file path (default: output/canvas.svg)

## Example

```bash
node .claude/skills/init-canvas/index.js 500 809 '#FAFAFA' output/art.svg
```
