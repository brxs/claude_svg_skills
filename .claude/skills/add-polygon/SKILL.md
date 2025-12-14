---
description: Add a custom polygon to an existing SVG file
---

# Add Polygon

Adds a custom polygon with arbitrary vertices to an existing SVG file.

## Usage

```bash
node .claude/skills/add-polygon/index.js <svg-file> <points> <fill>
```

## Parameters

- `svg-file` - Path to the SVG file to modify
- `points` - Space-separated coordinates: "x1,y1 x2,y2 x3,y3 ..."
- `fill` - Fill color as hex (default: #E53935)

## Example

```bash
# Custom triangle
node .claude/skills/add-polygon/index.js output/art.svg "100,300 250,100 400,300" '#FDD835'

# Custom quadrilateral
node .claude/skills/add-polygon/index.js output/art.svg "100,100 400,150 350,300 50,250" '#1E88E5'
```
