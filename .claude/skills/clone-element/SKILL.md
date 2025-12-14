---
description: Duplicate existing SVG elements with optional offset and modifications
---

# Clone Element

Duplicates existing SVG elements. Simpler than `add-use` - creates actual copies without requiring IDs or references.

## Usage

```bash
node .claude/skills/clone-element/index.js <svg-file> <selector> [options]
```

## Selectors

| Selector | Target |
|----------|--------|
| `path:0` | First path |
| `circle:1` | Second circle |
| `rect:-1` | Last rectangle |
| `g:0` | First group |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `dx` | 0 | X offset per clone |
| `dy` | 0 | Y offset per clone |
| `count` | 1 | Number of clones |
| `transform` | - | Apply transform |
| `fill` | - | Override fill |
| `stroke` | - | Override stroke |
| `opacity` | - | Override opacity |
| `id` | - | Assign ID to clone |

## Examples

### Simple Clone

```bash
# Clone in place
node .claude/skills/clone-element/index.js output/art.svg circle:0

# Clone with offset
node .claude/skills/clone-element/index.js output/art.svg circle:0 dx=50 dy=0

# Clone last element
node .claude/skills/clone-element/index.js output/art.svg path:-1 dx=0 dy=50
```

### Multiple Clones

```bash
# Create 5 copies spaced horizontally
node .claude/skills/clone-element/index.js output/art.svg circle:0 dx=40 dy=0 count=5

# Create diagonal line of copies
node .claude/skills/clone-element/index.js output/art.svg rect:0 dx=30 dy=30 count=4

# Vertical stack
node .claude/skills/clone-element/index.js output/art.svg path:0 dx=0 dy=25 count=10
```

### Clone with Style Changes

```bash
# Clone with different fill
node .claude/skills/clone-element/index.js output/art.svg circle:0 dx=60 fill=#E53935

# Clone with transparency
node .claude/skills/clone-element/index.js output/art.svg rect:0 dx=50 opacity=0.5

# Clone with new stroke
node .claude/skills/clone-element/index.js output/art.svg path:0 dy=40 stroke=#1E88E5 stroke-width=2
```

### Clone with Transform

```bash
# Clone and rotate
node .claude/skills/clone-element/index.js output/art.svg path:0 transform="rotate(45 200 200)"

# Clone and scale
node .claude/skills/clone-element/index.js output/art.svg circle:0 dx=100 transform="scale(0.5)"

# Clone, offset, and rotate
node .claude/skills/clone-element/index.js output/art.svg rect:0 dx=50 dy=50 transform="rotate(15)"
```

### Clone Groups

```bash
# Clone entire group
node .claude/skills/clone-element/index.js output/art.svg g:0 dx=150 dy=0

# Multiple group copies
node .claude/skills/clone-element/index.js output/art.svg g:0 dx=100 count=3
```

## Common Patterns

### Row of Shapes

```bash
# Create original
node .claude/skills/add-circle/index.js output/art.svg 50 200 20 fill=#E53935

# Clone into row
node .claude/skills/clone-element/index.js output/art.svg circle:0 dx=50 dy=0 count=7
```

### Grid Pattern

```bash
# Create first row
node .claude/skills/add-rect/index.js output/art.svg 20 20 30 30 fill=#1E88E5
node .claude/skills/clone-element/index.js output/art.svg rect:-1 dx=40 count=4

# Clone row downward (clone the last rect of each position)
# Or use add-group first, then clone the group
```

### Fading Trail

```bash
# Create base shape
node .claude/skills/add-circle/index.js output/art.svg 100 200 30 fill=#E53935

# Clone with decreasing opacity (run multiple times)
node .claude/skills/clone-element/index.js output/art.svg circle:0 dx=40 opacity=0.8
node .claude/skills/clone-element/index.js output/art.svg circle:-1 dx=40 opacity=0.6
node .claude/skills/clone-element/index.js output/art.svg circle:-1 dx=40 opacity=0.4
node .claude/skills/clone-element/index.js output/art.svg circle:-1 dx=40 opacity=0.2
```

### Scattered Copies

```bash
# Clone to different positions using transform
node .claude/skills/clone-element/index.js output/art.svg path:0 transform="translate(100 50)"
node .claude/skills/clone-element/index.js output/art.svg path:0 transform="translate(-50 80)"
node .claude/skills/clone-element/index.js output/art.svg path:0 transform="translate(30 -60)"
```

### Rotational Pattern

```bash
# Create petal
node .claude/skills/add-ellipse/index.js output/art.svg 200 150 20 50 fill=#FDD835

# Clone with rotation around center
node .claude/skills/clone-element/index.js output/art.svg ellipse:0 transform="rotate(60 200 200)"
node .claude/skills/clone-element/index.js output/art.svg ellipse:0 transform="rotate(120 200 200)"
node .claude/skills/clone-element/index.js output/art.svg ellipse:0 transform="rotate(180 200 200)"
node .claude/skills/clone-element/index.js output/art.svg ellipse:0 transform="rotate(240 200 200)"
node .claude/skills/clone-element/index.js output/art.svg ellipse:0 transform="rotate(300 200 200)"
```

## Clone vs Use

| Feature | clone-element | add-use |
|---------|---------------|---------|
| Creates copy | Yes (full duplicate) | No (reference) |
| Requires ID | No | Yes |
| Edit independently | Yes | No (all instances linked) |
| File size | Larger | Smaller |
| Best for | Few copies, variations | Many identical copies |

## Notes

- Clones are inserted immediately after the original
- Original element is preserved
- IDs are removed from clones to avoid duplicates (unless `id` option used)
- `dx`/`dy` offsets are cumulative when `count` > 1
- Transforms are applied via the transform attribute
- Clone inherits all attributes unless overridden
- Groups (`<g>`) can be cloned with all their children
