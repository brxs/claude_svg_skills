---
description: Add an SVG path to an existing SVG file
---

# Add Path

Adds a custom SVG path using path data syntax to an existing SVG file.

## Usage

```bash
node .claude/skills/add-path/index.js <svg-file> <path-data> <fill> <stroke> <stroke-width>
```

## Parameters

- `svg-file` - Path to the SVG file to modify
- `path-data` - SVG path data string (M, L, C, Q, A, Z commands)
- `fill` - Fill color as hex or 'none' (default: none)
- `stroke` - Stroke color as hex or 'none' (default: #212121)
- `stroke-width` - Stroke width (default: 2)

## Path Commands

- `M x y` - Move to
- `L x y` - Line to
- `H x` - Horizontal line to
- `V y` - Vertical line to
- `C x1 y1 x2 y2 x y` - Cubic bezier
- `Q x1 y1 x y` - Quadratic bezier
- `A rx ry rotation large-arc sweep x y` - Arc
- `Z` - Close path

## Examples

```bash
# Curved line
node .claude/skills/add-path/index.js output/art.svg "M 100 200 Q 250 100 400 200" none '#E53935' 3

# Filled shape
node .claude/skills/add-path/index.js output/art.svg "M 100 100 L 200 100 L 150 200 Z" '#FDD835' none 0
```
