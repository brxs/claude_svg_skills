---
description: Edit attributes of existing SVG elements
---

# Edit Element

Modifies attributes of existing SVG elements in a file.

## Usage

```bash
node .claude/skills/edit-element/index.js <svg-file> <selector> <attribute> <value>
```

## Parameters

- `svg-file` - Path to the SVG file to modify
- `selector` - Element selector (see below)
- `attribute` - Attribute name to modify
- `value` - New attribute value

## Selectors

| Selector | Description |
|----------|-------------|
| `path` | All path elements |
| `path:0` | First path element (0-indexed) |
| `path:5` | Sixth path element |
| `line` | All line elements |
| `line:2` | Third line element |
| `circle` | All circle elements |
| `rect` | All rect elements |
| `all` | All shape elements |

## Common Attributes

- `stroke-width` - Line thickness
- `stroke` - Line color
- `fill` - Fill color
- `opacity` - Overall opacity (0-1)
- `stroke-opacity` - Stroke opacity (0-1)
- `fill-opacity` - Fill opacity (0-1)
- `stroke-dasharray` - Dash pattern (e.g., "4,4")

## Examples

```bash
# Change all path stroke widths to 2
node .claude/skills/edit-element/index.js output/art.svg path stroke-width 2

# Change first path to red
node .claude/skills/edit-element/index.js output/art.svg path:0 stroke '#ff0000'

# Make all lines dashed
node .claude/skills/edit-element/index.js output/art.svg line stroke-dasharray '5,5'

# Set opacity on third circle
node .claude/skills/edit-element/index.js output/art.svg circle:2 opacity 0.5

# Change all shapes to blue stroke
node .claude/skills/edit-element/index.js output/art.svg all stroke '#0000ff'
```
