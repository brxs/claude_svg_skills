---
description: Add a regular polygon (triangle, hexagon, etc.) to an existing SVG file
---

# Add Regular Polygon

Adds a regular polygon (equilateral triangle, square, pentagon, hexagon, etc.) to an existing SVG file.

## Usage

```bash
node .claude/skills/add-regular-polygon/index.js <svg-file> <cx> <cy> <radius> <sides> <fill>
```

## Parameters

- `svg-file` - Path to the SVG file to modify
- `cx` - Center X coordinate
- `cy` - Center Y coordinate
- `radius` - Distance from center to vertices
- `sides` - Number of sides (3=triangle, 4=square, 5=pentagon, 6=hexagon, etc.)
- `fill` - Fill color as hex (default: #E53935)

## Examples

```bash
# Triangle
node .claude/skills/add-regular-polygon/index.js output/art.svg 250 200 50 3 '#FDD835'

# Hexagon
node .claude/skills/add-regular-polygon/index.js output/art.svg 250 200 50 6 '#1E88E5'
```
