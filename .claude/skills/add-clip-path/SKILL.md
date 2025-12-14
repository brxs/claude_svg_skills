---
description: Add clip path definitions to mask/crop SVG elements
---

# Add Clip Path

Adds clip path definitions to SVG files. Clip paths mask elements so only the parts inside the clip shape are visible.

## Usage

```bash
node .claude/skills/add-clip-path/index.js <svg-file> <shape> <id> [...args]
```

## Shapes

| Shape | Arguments | Description |
|-------|-----------|-------------|
| `circle` | cx cy r | Circular clip |
| `ellipse` | cx cy rx ry | Elliptical clip |
| `rect` | x y width height [rx] [ry] | Rectangular clip |
| `inset` | top right bottom left [rx] | Inset from edges |
| `polygon` | points | Custom polygon |
| `path` | d | SVG path data |

## Examples

### Circle Clip

```bash
# Circle at center, radius 100
node .claude/skills/add-clip-path/index.js output/art.svg circle clipCircle 200 200 100

# Small circle
node .claude/skills/add-clip-path/index.js output/art.svg circle smallClip 150 150 50
```

### Rectangle Clip

```bash
# Basic rectangle
node .claude/skills/add-clip-path/index.js output/art.svg rect clipRect 50 50 300 300

# Rounded corners
node .claude/skills/add-clip-path/index.js output/art.svg rect clipRounded 50 50 300 300 20 20
```

### Inset (Padding from Edges)

```bash
# 20px from all edges
node .claude/skills/add-clip-path/index.js output/art.svg inset clipInset 20 20 20 20

# Different insets per side (top, right, bottom, left)
node .claude/skills/add-clip-path/index.js output/art.svg inset clipPadded 10 30 10 30

# Inset with rounded corners
node .claude/skills/add-clip-path/index.js output/art.svg inset clipInsetRound 20 20 20 20 15
```

### Ellipse Clip

```bash
# Oval clip
node .claude/skills/add-clip-path/index.js output/art.svg ellipse clipOval 200 200 150 100
```

### Polygon Clip

```bash
# Triangle
node .claude/skills/add-clip-path/index.js output/art.svg polygon clipTriangle "200,50 350,350 50,350"

# Diamond
node .claude/skills/add-clip-path/index.js output/art.svg polygon clipDiamond "200,0 400,200 200,400 0,200"

# Hexagon
node .claude/skills/add-clip-path/index.js output/art.svg polygon clipHex "100,0 300,0 400,200 300,400 100,400 0,200"
```

### Path Clip

```bash
# Custom path shape
node .claude/skills/add-clip-path/index.js output/art.svg path clipCustom "M100,100 Q200,0 300,100 L300,300 Q200,400 100,300 Z"

# Star shape
node .claude/skills/add-clip-path/index.js output/art.svg path clipStar "M200,0 L240,150 L400,150 L270,240 L310,400 L200,300 L90,400 L130,240 L0,150 L160,150 Z"
```

## Applying Clip Paths

After creating a clip path, apply it using edit-element:

```bash
# Apply to specific element
node .claude/skills/edit-element/index.js output/art.svg rect:0 clip-path "url(#clipCircle)"

# Apply to image or group
node .claude/skills/edit-element/index.js output/art.svg g clip-path "url(#clipTriangle)"

# Remove clip path
node .claude/skills/edit-element/index.js output/art.svg rect:0 clip-path "none"
```

## Common Workflows

### Circular Image Crop

```bash
# Create circle clip at center
node .claude/skills/add-clip-path/index.js output/photo.svg circle avatarClip 200 200 150

# Apply to background or image
node .claude/skills/edit-element/index.js output/photo.svg rect:0 clip-path "url(#avatarClip)"
```

### Vignette Border

```bash
# Inset with rounded corners
node .claude/skills/add-clip-path/index.js output/art.svg inset vignette 30 30 30 30 20

# Apply to entire content
node .claude/skills/edit-element/index.js output/art.svg g clip-path "url(#vignette)"
```

### Window/Porthole Effect

```bash
# Create circular window
node .claude/skills/add-clip-path/index.js output/scene.svg circle window 200 200 120

# Apply to layer
node .claude/skills/edit-element/index.js output/scene.svg g:1 clip-path "url(#window)"
```

### Diagonal Cut

```bash
# Diagonal clip using polygon
node .claude/skills/add-clip-path/index.js output/art.svg polygon diagonalClip "0,0 400,0 400,300 0,400"
```

### Text Mask Shape

```bash
# Use interesting shape to clip content
node .claude/skills/add-clip-path/index.js output/art.svg polygon arrowClip "200,0 400,200 200,150 0,200"
```

## Notes

- Clip paths are stored in `<defs>` section
- Reference with `clip-path="url(#id)"` syntax
- Content outside the clip shape is hidden, not deleted
- Clip paths can be applied to any element including groups
- For complex shapes, use `path` with SVG path commands
- `inset` automatically calculates from canvas dimensions
- Coordinates are in the same space as the SVG canvas
