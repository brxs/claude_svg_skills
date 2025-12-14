---
description: Apply geometric transforms to existing SVG elements
---

# Apply Transform

Applies rotation, scaling, translation, and other transforms to existing SVG elements.

## Usage

```bash
node .claude/skills/apply-transform/index.js <svg-file> <selector> <transform> [...args]
```

## Selectors

| Selector | Target |
|----------|--------|
| `path` | All path elements |
| `path:0` | First path (0-indexed) |
| `line:2` | Third line element |
| `circle` | All circles |
| `all` | All shape elements |

## Transforms

### Rotate

```bash
# Rotate 45 degrees around element's own center
node .claude/skills/apply-transform/index.js output/art.svg path:0 rotate 45

# Rotate around specific point (200, 200)
node .claude/skills/apply-transform/index.js output/art.svg path:0 rotate 45 200 200
```

### Scale

```bash
# Uniform scale (2x)
node .claude/skills/apply-transform/index.js output/art.svg circle scale 2

# Non-uniform scale (2x width, 0.5x height)
node .claude/skills/apply-transform/index.js output/art.svg rect scale 2 0.5
```

### Translate

```bash
# Move 50 pixels right, 100 pixels down
node .claude/skills/apply-transform/index.js output/art.svg path translate 50 100
```

### Skew

```bash
# Skew along X axis by 15 degrees
node .claude/skills/apply-transform/index.js output/art.svg path skewX 15

# Skew along Y axis by 10 degrees
node .claude/skills/apply-transform/index.js output/art.svg path skewY 10
```

### Flip

```bash
# Horizontal flip
node .claude/skills/apply-transform/index.js output/art.svg path flip x

# Vertical flip
node .claude/skills/apply-transform/index.js output/art.svg path flip y

# Both axes
node .claude/skills/apply-transform/index.js output/art.svg path flip both
```

### Reset

```bash
# Remove all transforms from element
node .claude/skills/apply-transform/index.js output/art.svg path:0 reset
```

## Chaining Transforms

Transforms accumulate. Running multiple commands adds to the transform stack:

```bash
# First rotate, then scale
node .claude/skills/apply-transform/index.js output/art.svg path:0 rotate 45
node .claude/skills/apply-transform/index.js output/art.svg path:0 scale 1.5
# Result: transform="rotate(45) scale(1.5)"
```

## Examples

```bash
# Rotate all paths 30 degrees
node .claude/skills/apply-transform/index.js output/topo.svg path rotate 30

# Scale first circle to half size
node .claude/skills/apply-transform/index.js output/art.svg circle:0 scale 0.5

# Move all lines down
node .claude/skills/apply-transform/index.js output/grid.svg line translate 0 50

# Reset transforms on all elements
node .claude/skills/apply-transform/index.js output/art.svg all reset
```
