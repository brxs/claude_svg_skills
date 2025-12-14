---
description: Add mask definitions for soft edges, fades, and alpha transparency effects
---

# Add Mask

Adds mask definitions to SVG files. Unlike clip paths (hard edges), masks support soft edges, gradients, and alpha transparency effects.

## How Masks Work

Masks use luminance to determine visibility:
- **White** = Fully visible
- **Black** = Fully hidden
- **Gray** = Partially visible (transparency)
- **Gradients** = Smooth transitions

## Usage

```bash
node .claude/skills/add-mask/index.js <svg-file> <type> <id> [...args] [options]
```

## Mask Types

### Shape Masks (Hard Edge)

| Type | Arguments | Description |
|------|-----------|-------------|
| `circle` | cx cy r | Circular mask |
| `rect` | x y width height | Rectangular mask |
| `ellipse` | cx cy rx ry | Elliptical mask |

### Gradient Masks (Soft Edge)

| Type | Arguments | Description |
|------|-----------|-------------|
| `radial-fade` | [cx] [cy] [r] | Fade from center outward |
| `linear-fade` | [angle] | Directional fade |
| `vignette` | [inset] [softness] | Soft edge vignette |

## Options

| Option | Description |
|--------|-------------|
| `invert=true` | Invert the mask (swap visible/hidden) |

## Examples

### Shape Masks

```bash
# Circular spotlight
node .claude/skills/add-mask/index.js output/art.svg circle spotlight 200 200 100

# Rectangular window
node .claude/skills/add-mask/index.js output/art.svg rect window 50 50 300 300

# Oval mask
node .claude/skills/add-mask/index.js output/art.svg ellipse oval 200 200 150 100
```

### Radial Fade

```bash
# Center fade (default)
node .claude/skills/add-mask/index.js output/art.svg radial-fade centerFade

# Custom position and size
node .claude/skills/add-mask/index.js output/art.svg radial-fade spotFade 150 150 120

# Inverted (fade IN from edges)
node .claude/skills/add-mask/index.js output/art.svg radial-fade holeFade invert=true
```

### Linear Fade

```bash
# Fade left to right (default, 0°)
node .claude/skills/add-mask/index.js output/art.svg linear-fade fadeRight

# Fade top to bottom (90°)
node .claude/skills/add-mask/index.js output/art.svg linear-fade fadeDown 90

# Fade bottom to top (270° or -90°)
node .claude/skills/add-mask/index.js output/art.svg linear-fade fadeUp 270

# Diagonal fade (45°)
node .claude/skills/add-mask/index.js output/art.svg linear-fade fadeDiag 45

# Inverted
node .claude/skills/add-mask/index.js output/art.svg linear-fade fadeIn 90 invert=true
```

### Vignette

```bash
# Subtle vignette
node .claude/skills/add-mask/index.js output/art.svg vignette soft 20 30

# Strong vignette
node .claude/skills/add-mask/index.js output/art.svg vignette strong 40 60

# Tight vignette (more padding)
node .claude/skills/add-mask/index.js output/art.svg vignette tight 60 40

# Inverted (bright edges, dark center)
node .claude/skills/add-mask/index.js output/art.svg vignette glow 20 40 invert=true
```

## Applying Masks

After creating a mask, apply it using edit-element:

```bash
# Apply to specific element
node .claude/skills/edit-element/index.js output/art.svg rect:0 mask "url(#spotlight)"

# Apply to group
node .claude/skills/edit-element/index.js output/art.svg g:0 mask "url(#fadeDown)"

# Remove mask
node .claude/skills/edit-element/index.js output/art.svg rect:0 mask "none"
```

## Common Workflows

### Spotlight Effect

```bash
# Create dark overlay
node .claude/skills/add-rect/index.js output/art.svg 0 0 400 400 fill=#000 opacity=0.7

# Create radial fade mask
node .claude/skills/add-mask/index.js output/art.svg radial-fade spotlight 200 200 150

# Apply to overlay (creates spotlight)
node .claude/skills/edit-element/index.js output/art.svg rect:-1 mask "url(#spotlight)"
```

### Photo Vignette

```bash
# Create vignette mask
node .claude/skills/add-mask/index.js output/art.svg vignette photoVignette 30 50

# Apply to image or background group
node .claude/skills/edit-element/index.js output/art.svg g:0 mask "url(#photoVignette)"
```

### Fade Transition

```bash
# Image/content fades out toward bottom
node .claude/skills/add-mask/index.js output/art.svg linear-fade fadeOut 90

# Apply to content
node .claude/skills/edit-element/index.js output/art.svg g:0 mask "url(#fadeOut)"
```

### Reveal Animation (Static)

```bash
# Create gradient mask from left
node .claude/skills/add-mask/index.js output/art.svg linear-fade reveal 0

# Shows left side, hides right
node .claude/skills/edit-element/index.js output/art.svg path mask "url(#reveal)"
```

## Mask vs Clip Path

| Feature | mask | clip-path |
|---------|------|-----------|
| Edge type | Soft or hard | Hard only |
| Transparency | Yes (gradients) | No |
| Performance | Slower | Faster |
| Use case | Fades, vignettes | Sharp cutouts |

Use `add-clip-path` for hard-edged shapes, `add-mask` for soft effects.

## Angle Reference (linear-fade)

| Angle | Direction |
|-------|-----------|
| 0° | Left → Right |
| 90° | Top → Bottom |
| 180° | Right → Left |
| 270° | Bottom → Top |
| 45° | Top-left → Bottom-right |

## Notes

- Masks are stored in `<defs>` section
- Reference with `mask="url(#id)"` syntax
- Masks use luminance (brightness) for alpha
- Gradient masks automatically create helper gradient definitions
- Vignette `inset` = padding from edges, `softness` = gradient spread
- Use `invert=true` to flip visible/hidden areas
- Masks can impact rendering performance
