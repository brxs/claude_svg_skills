---
description: Add a line to an existing SVG file
---

# Add Line

Adds a line between two points to an existing SVG file.

## Usage

```bash
node .claude/skills/add-line/index.js <svg-file> <x1> <y1> <x2> <y2> <stroke> <width>
```

## Parameters

- `svg-file` - Path to the SVG file to modify
- `x1` - Start X coordinate
- `y1` - Start Y coordinate
- `x2` - End X coordinate
- `y2` - End Y coordinate
- `stroke` - Stroke color as hex (default: #212121)
- `width` - Stroke width (default: 2)

## Example

```bash
node .claude/skills/add-line/index.js output/art.svg 100 100 300 300 '#E53935' 3
```
