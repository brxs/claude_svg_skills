---
description: Add repeating pattern definitions for tiled fills
---

# Add Pattern

Adds pattern definitions to SVG files for repeating/tiled fills like dots, stripes, grids, and more.

## Usage

```bash
node .claude/skills/add-pattern/index.js <svg-file> <type> <id> [options]
```

## Pattern Types

| Type | Description |
|------|-------------|
| `dots` | Polka dot pattern |
| `lines` | Horizontal lines |
| `stripes` | Vertical stripes |
| `diagonal` | Diagonal lines |
| `grid` | Grid lines |
| `crosshatch` | X crosshatch |
| `checkerboard` | Checkerboard squares |
| `zigzag` | Zigzag lines |
| `hexagons` | Hexagon outlines |
| `triangles` | Triangle outlines |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `size` | 10 | Pattern tile size |
| `color` | #000 | Pattern color |
| `bg` | transparent | Background color |
| `stroke` | 1 | Line stroke width |
| `angle` | 0 | Pattern rotation |

## Examples

### Dots

```bash
# Basic polka dots
node .claude/skills/add-pattern/index.js output/art.svg dots polkaDots

# Large red dots on white
node .claude/skills/add-pattern/index.js output/art.svg dots bigDots size=30 color=#E53935 bg=#fff

# Small blue dots
node .claude/skills/add-pattern/index.js output/art.svg dots tinyDots size=8 color=#1E88E5
```

### Stripes

```bash
# Vertical stripes
node .claude/skills/add-pattern/index.js output/art.svg stripes vertStripes size=10 color=#000 bg=#fff

# Wide stripes
node .claude/skills/add-pattern/index.js output/art.svg stripes wideStripes size=20 color=#1E88E5 bg=#fff

# Angled stripes (45 degrees)
node .claude/skills/add-pattern/index.js output/art.svg stripes angledStripes size=10 color=#E53935 bg=#fff angle=45
```

### Lines

```bash
# Horizontal lines
node .claude/skills/add-pattern/index.js output/art.svg lines hLines size=8 color=#333

# Thick lines
node .claude/skills/add-pattern/index.js output/art.svg lines thickLines size=15 color=#000 stroke=3

# Rotated lines (vertical)
node .claude/skills/add-pattern/index.js output/art.svg lines vLines size=10 color=#666 angle=90
```

### Diagonal

```bash
# Diagonal lines
node .claude/skills/add-pattern/index.js output/art.svg diagonal diagLines size=10 color=#333

# Dense diagonal
node .claude/skills/add-pattern/index.js output/art.svg diagonal denseDiag size=5 color=#000 stroke=1
```

### Grid

```bash
# Basic grid
node .claude/skills/add-pattern/index.js output/art.svg grid gridPattern size=20 color=#ccc

# Graph paper
node .claude/skills/add-pattern/index.js output/art.svg grid graphPaper size=10 color=#ddd bg=#fff stroke=0.5
```

### Crosshatch

```bash
# Crosshatch
node .claude/skills/add-pattern/index.js output/art.svg crosshatch xhatch size=10 color=#333

# Dense crosshatch
node .claude/skills/add-pattern/index.js output/art.svg crosshatch denseHatch size=6 color=#666
```

### Checkerboard

```bash
# Classic checkerboard
node .claude/skills/add-pattern/index.js output/art.svg checkerboard checker size=20 color=#000 bg=#fff

# Small checks
node .claude/skills/add-pattern/index.js output/art.svg checkerboard smallCheck size=8 color=#333 bg=#eee

# Colored checks
node .claude/skills/add-pattern/index.js output/art.svg checkerboard colorCheck size=15 color=#E53935 bg=#FDD835
```

### Zigzag

```bash
# Zigzag lines
node .claude/skills/add-pattern/index.js output/art.svg zigzag zigzagPattern size=20 color=#000

# Thick zigzag
node .claude/skills/add-pattern/index.js output/art.svg zigzag thickZig size=30 color=#E53935 stroke=2
```

### Hexagons

```bash
# Hexagon tiles
node .claude/skills/add-pattern/index.js output/art.svg hexagons hexPattern size=20 color=#333

# Large hexagons
node .claude/skills/add-pattern/index.js output/art.svg hexagons bigHex size=40 color=#666 stroke=2
```

### Triangles

```bash
# Triangle tiles
node .claude/skills/add-pattern/index.js output/art.svg triangles triPattern size=20 color=#333

# Small triangles
node .claude/skills/add-pattern/index.js output/art.svg triangles smallTri size=10 color=#999
```

## Applying Patterns

After creating a pattern, apply it using edit-element:

```bash
# Apply as fill
node .claude/skills/edit-element/index.js output/art.svg rect fill "url(#polkaDots)"

# Apply as stroke (less common)
node .claude/skills/edit-element/index.js output/art.svg path stroke "url(#gridPattern)"

# Remove pattern
node .claude/skills/edit-element/index.js output/art.svg rect fill "#fff"
```

## Common Workflows

### Textured Background

```bash
# Create subtle dot texture
node .claude/skills/add-pattern/index.js output/art.svg dots texture size=4 color=#ddd bg=#fff

# Apply to background
node .claude/skills/edit-element/index.js output/art.svg rect:0 fill "url(#texture)"
```

### Striped Shape

```bash
# Create candy stripes
node .claude/skills/add-pattern/index.js output/art.svg stripes candy size=8 color=#E53935 bg=#fff angle=45

# Apply to circle
node .claude/skills/edit-element/index.js output/art.svg circle fill "url(#candy)"
```

### Graph Paper Effect

```bash
# Create grid pattern
node .claude/skills/add-pattern/index.js output/art.svg grid paper size=20 color=#aaddff bg=#fff stroke=0.5

# Apply to canvas background
node .claude/skills/edit-element/index.js output/art.svg rect:0 fill "url(#paper)"
```

### Blueprint Style

```bash
# Blue grid on dark blue
node .claude/skills/add-pattern/index.js output/art.svg grid blueprint size=15 color=#4488cc bg=#1a3a5c

# Apply to background
node .claude/skills/edit-element/index.js output/art.svg rect:0 fill "url(#blueprint)"
```

## Notes

- Patterns are stored in `<defs>` section
- Reference with `fill="url(#id)"` syntax
- Patterns tile seamlessly across the filled area
- Use `bg` option for solid background between pattern elements
- `angle` rotates the entire pattern
- `patternUnits="userSpaceOnUse"` means sizes are in SVG coordinates
- Combine with opacity for subtle effects
