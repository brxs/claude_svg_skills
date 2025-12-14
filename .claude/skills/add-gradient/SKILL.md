---
description: Add linear and radial gradient definitions to SVG files
---

# Add Gradient

Adds gradient definitions to SVG files that can be applied to elements via fill or stroke.

## Usage

```bash
node .claude/skills/add-gradient/index.js <svg-file> <type> <id> <colors> [options]
```

## Gradient Types

### Linear Gradient

```bash
# Left to right (default)
node .claude/skills/add-gradient/index.js output/art.svg linear grad1 "#E53935,#1E88E5"

# Top to bottom (90 degrees)
node .claude/skills/add-gradient/index.js output/art.svg linear grad2 "#ff0,#f00" angle=90

# Diagonal (45 degrees)
node .claude/skills/add-gradient/index.js output/art.svg linear grad3 "#fff,#000" angle=45

# Custom direction with explicit points
node .claude/skills/add-gradient/index.js output/art.svg linear grad4 "#E53935,#1E88E5" x1=0 y1=100 x2=100 y2=0
```

### Radial Gradient

```bash
# Center outward (default)
node .claude/skills/add-gradient/index.js output/art.svg radial grad1 "#fff,#000"

# Off-center
node .claude/skills/add-gradient/index.js output/art.svg radial grad2 "#fff,#000" cx=30 cy=30

# With focal point (spotlight effect)
node .claude/skills/add-gradient/index.js output/art.svg radial grad3 "#fff,#000" fx=30 fy=30

# Custom radius
node .claude/skills/add-gradient/index.js output/art.svg radial grad4 "#fff,#000" r=70
```

## Color Stops

### Even Distribution

Colors are evenly distributed by default:

```bash
# Two colors: 0% and 100%
node .claude/skills/add-gradient/index.js output/art.svg linear g1 "#E53935,#1E88E5"

# Three colors: 0%, 50%, 100%
node .claude/skills/add-gradient/index.js output/art.svg linear g2 "#E53935,#FDD835,#1E88E5"

# Four colors: 0%, 33%, 67%, 100%
node .claude/skills/add-gradient/index.js output/art.svg linear g3 "#f00,#ff0,#0f0,#00f"
```

### Custom Positions

Use `@` to specify exact positions (0-100%):

```bash
# Color at specific positions
node .claude/skills/add-gradient/index.js output/art.svg linear g1 "#E53935@0,#FDD835@30,#1E88E5@100"

# Sharp transition
node .claude/skills/add-gradient/index.js output/art.svg linear g2 "#E53935@0,#E53935@50,#1E88E5@50,#1E88E5@100"
```

## Linear Gradient Options

| Option | Description | Default |
|--------|-------------|---------|
| `angle` | Gradient angle in degrees | 0 (left→right) |
| `x1` | Start X position (0-100%) | 0 |
| `y1` | Start Y position (0-100%) | 0 |
| `x2` | End X position (0-100%) | 100 |
| `y2` | End Y position (0-100%) | 0 |

### Angle Reference

| Angle | Direction |
|-------|-----------|
| 0 | Left → Right |
| 90 | Top → Bottom |
| 180 | Right → Left |
| 270 | Bottom → Top |
| 45 | Top-left → Bottom-right |

## Radial Gradient Options

| Option | Description | Default |
|--------|-------------|---------|
| `cx` | Center X position (0-100%) | 50 |
| `cy` | Center Y position (0-100%) | 50 |
| `r` | Radius (0-100%) | 50 |
| `fx` | Focal point X (0-100%) | same as cx |
| `fy` | Focal point Y (0-100%) | same as cy |

## Applying Gradients

After creating a gradient, apply it using the edit-element skill:

```bash
# Create gradient
node .claude/skills/add-gradient/index.js output/art.svg linear sunset "#E53935,#FDD835"

# Apply to fill
node .claude/skills/edit-element/index.js output/art.svg circle fill "url(#sunset)"

# Apply to stroke
node .claude/skills/edit-element/index.js output/art.svg path stroke "url(#sunset)"
```

## Examples

### Sunset Background

```bash
node .claude/skills/add-gradient/index.js output/art.svg linear sky "#1a237e,#E53935,#FDD835" angle=90
node .claude/skills/edit-element/index.js output/art.svg rect:0 fill "url(#sky)"
```

### Metallic Sphere

```bash
node .claude/skills/add-gradient/index.js output/art.svg radial metal "#fff@0,#888@40,#333@100" fx=30 fy=30
node .claude/skills/edit-element/index.js output/art.svg circle fill "url(#metal)"
```

### Rainbow

```bash
node .claude/skills/add-gradient/index.js output/art.svg linear rainbow "#E53935,#FDD835,#43A047,#1E88E5,#8E24AA"
```

### Glowing Effect

```bash
node .claude/skills/add-gradient/index.js output/art.svg radial glow "#FDD835@0,#FDD835@30,transparent@100"
```

## Notes

- Gradient IDs must be unique within the SVG
- Gradients are stored in `<defs>` section
- Reference gradients with `url(#id)` syntax
- Positions are percentages relative to the element's bounding box
- Use `transparent` as a color for fade effects
