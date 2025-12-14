---
description: Add a rectangle to an existing SVG file
---

# Add Rectangle

Adds a rectangle to an existing SVG file.

## Usage

```bash
node .claude/skills/add-rect/index.js <svg-file> <x> <y> <width> <height> <fill>
```

## Parameters

- `svg-file` - Path to the SVG file to modify
- `x` - Top-left X coordinate
- `y` - Top-left Y coordinate
- `width` - Rectangle width
- `height` - Rectangle height
- `fill` - Fill color as hex (default: #1E88E5)

## Example

```bash
node .claude/skills/add-rect/index.js output/art.svg 100 450 60 180 '#1E88E5'
```
