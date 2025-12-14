---
description: Add a circle to an existing SVG file
---

# Add Circle

Adds a circle to an existing SVG file.

## Usage

```bash
node .claude/skills/add-circle/index.js <svg-file> <cx> <cy> <radius> <fill>
```

## Parameters

- `svg-file` - Path to the SVG file to modify
- `cx` - Center X coordinate
- `cy` - Center Y coordinate
- `radius` - Circle radius
- `fill` - Fill color as hex (default: #E53935)

## Example

```bash
node .claude/skills/add-circle/index.js output/art.svg 250 200 80 '#FDD835'
```
