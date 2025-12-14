---
description: Add an ellipse to an existing SVG file
---

# Add Ellipse

Adds an ellipse to an existing SVG file.

## Usage

```bash
node .claude/skills/add-ellipse/index.js <svg-file> <cx> <cy> <rx> <ry> <fill>
```

## Parameters

- `svg-file` - Path to the SVG file to modify
- `cx` - Center X coordinate
- `cy` - Center Y coordinate
- `rx` - Horizontal radius
- `ry` - Vertical radius
- `fill` - Fill color as hex (default: #E53935)

## Example

```bash
node .claude/skills/add-ellipse/index.js output/art.svg 250 200 100 50 '#1E88E5'
```
