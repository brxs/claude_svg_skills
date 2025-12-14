---
description: Change the stacking order (z-index) of SVG elements
---

# Layer Order

Changes the rendering order of SVG elements. In SVG, elements later in the document render on top of earlier elements.

## Usage

```bash
node .claude/skills/layer-order/index.js <svg-file> <selector> <action>
```

## Selectors

Must include an index:

| Selector | Target |
|----------|--------|
| `path:0` | First path |
| `circle:1` | Second circle |
| `rect:-1` | Last rectangle |

## Actions

| Action | Description |
|--------|-------------|
| `front` | Bring to front (renders on top of everything) |
| `back` | Send to back (renders just after background) |
| `up` | Move up one layer |
| `down` | Move down one layer |

## Examples

### Bring to Front

```bash
# Bring first circle to front
node .claude/skills/layer-order/index.js output/art.svg circle:0 front
```

### Send to Back

```bash
# Send last path behind other elements
node .claude/skills/layer-order/index.js output/art.svg path:-1 back
```

### Move Up/Down

```bash
# Move element up one layer
node .claude/skills/layer-order/index.js output/art.svg rect:0 up

# Move element down one layer
node .claude/skills/layer-order/index.js output/art.svg circle:1 down
```

## How SVG Layering Works

SVG uses "painter's model" - elements are painted in document order:

```
First in document  → Renders at back (covered by later elements)
Last in document   → Renders at front (covers earlier elements)
```

```xml
<svg>
  <rect ... />     <!-- Bottom layer -->
  <circle ... />   <!-- Middle layer -->
  <path ... />     <!-- Top layer -->
</svg>
```

## Common Workflows

### Overlapping Shapes

```bash
# Create overlapping circles
node .claude/skills/add-circle/index.js output/art.svg 180 200 50 fill=#E53935
node .claude/skills/add-circle/index.js output/art.svg 220 200 50 fill=#1E88E5

# Bring red circle to front
node .claude/skills/layer-order/index.js output/art.svg circle:0 front
```

### Labels on Top

```bash
# Ensure text labels are on top
node .claude/skills/layer-order/index.js output/art.svg text:0 front
```

### Background Elements

```bash
# Send decorative element behind main content
node .claude/skills/layer-order/index.js output/art.svg path:3 back
```

## Notes

- The first element (index 0) is typically the background rectangle
- `back` places element after the background, not before it
- Negative indices work (-1 = last, -2 = second to last)
- Groups (`<g>`) can also be reordered
- Use `front` and `back` for major changes, `up`/`down` for fine-tuning
