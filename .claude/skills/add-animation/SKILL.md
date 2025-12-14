---
description: Add SMIL animations to existing SVG elements
---

# Add Animation

Adds SMIL (SVG animation) elements to existing SVG shapes.

## Usage

```bash
node .claude/skills/add-animation/index.js <svg-file> <selector> <type> <values> <duration> [options]
```

## Selectors

| Selector | Target |
|----------|--------|
| `path` | All path elements |
| `path:0` | First path (0-indexed) |
| `circle:2` | Third circle |
| `all` | All shape elements |

## Animation Types

### Opacity (fade)

```bash
# Pulse opacity between 1 and 0.5 over 3 seconds
node .claude/skills/add-animation/index.js output/art.svg path:0 opacity "1;0.5;1" 3s

# Fade in
node .claude/skills/add-animation/index.js output/art.svg circle opacity "0;1" 2s repeat=1
```

### Stroke Dash Offset (flowing lines)

```bash
# Create flowing line effect - great for paths/ridges
node .claude/skills/add-animation/index.js output/art.svg path stroke-dashoffset "0;20" 2s
```

Note: Element needs `stroke-dasharray` set first:
```bash
node .claude/skills/edit-element/index.js output/art.svg path stroke-dasharray "3,6"
node .claude/skills/add-animation/index.js output/art.svg path stroke-dashoffset "0;18" 2s
```

### Stroke Width

```bash
# Pulsing stroke width
node .claude/skills/add-animation/index.js output/art.svg path stroke-width "1;2;1" 2s
```

### Rotation

```bash
# Continuous 360 degree rotation
node .claude/skills/add-animation/index.js output/art.svg circle:0 rotate 360 5s

# Wobble (45 degrees back and forth would need values)
node .claude/skills/add-animation/index.js output/art.svg path:0 rotate 45 2s repeat=2
```

### Scale

```bash
# Breathing/pulsing scale
node .claude/skills/add-animation/index.js output/art.svg circle scale "1;1.2;1" 3s

# Heartbeat effect
node .claude/skills/add-animation/index.js output/art.svg path:0 scale "1;1.1;1;1.15;1" 1s
```

### Translate

```bash
# Gentle floating motion
node .claude/skills/add-animation/index.js output/art.svg path:0 translate "0,0;5,3;0,0" 4s
```

## Options

| Option | Values | Default |
|--------|--------|---------|
| `repeat` | Number or `indefinite` | `indefinite` |
| `ease` | `linear`, `ease-in`, `ease-out`, `ease-in-out` | linear |

```bash
# Play once
node .claude/skills/add-animation/index.js output/art.svg path opacity "0;1" 1s repeat=1

# Ease in-out
node .claude/skills/add-animation/index.js output/art.svg circle scale "1;1.5;1" 2s ease=ease-in-out
```

## Examples

### Breathing contours

```bash
# Add breathing to all paths
node .claude/skills/add-animation/index.js output/topo.svg path opacity "1;0.7;1" 4s
```

### Flowing ridges

```bash
# First set up dashes
node .claude/skills/edit-element/index.js output/art.svg path stroke-dasharray "3,6"
# Then animate
node .claude/skills/add-animation/index.js output/art.svg path stroke-dashoffset "0;18" 2s
```

### Pulsing center

```bash
node .claude/skills/add-animation/index.js output/art.svg circle:0 scale "1;1.05;1" 3s
node .claude/skills/add-animation/index.js output/art.svg circle:0 opacity "1;0.8;1" 3s
```

## Notes

- Animations are added as child elements inside the target
- Multiple animations can be added to the same element
- View animated SVGs in a browser (PNG export won't show animation)
- Self-closing elements (like `<path ... />`) are automatically converted to open/close format
