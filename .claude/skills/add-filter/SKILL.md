---
description: Add filter effects (blur, shadow, glow, color adjustments) to SVG files
---

# Add Filter

Adds filter definitions to SVG files for visual effects like blur, shadows, glow, and color adjustments.

## Usage

```bash
node .claude/skills/add-filter/index.js <svg-file> <type> <id> [options]
```

## Filter Types

### Effects

| Type | Description |
|------|-------------|
| `blur` | Gaussian blur |
| `drop-shadow` | Drop shadow |
| `glow` | Outer glow |
| `inner-shadow` | Inner shadow |
| `emboss` | Embossed/raised look |
| `noise` | Noise/grain texture |

### Color Adjustments

| Type | Description |
|------|-------------|
| `grayscale` | Convert to grayscale |
| `sepia` | Sepia tone |
| `invert` | Invert colors |
| `saturate` | Adjust saturation |
| `brightness` | Adjust brightness |
| `contrast` | Adjust contrast |

## Common Options

| Option | Default | Used By |
|--------|---------|---------|
| `amount` | varies | All types |
| `color` | #000 | shadow, glow |
| `dx`, `dy` | 2 | shadows |
| `opacity` | 0.5 | shadow, glow |

## Examples

### Blur

```bash
# Soft blur
node .claude/skills/add-filter/index.js output/art.svg blur softBlur amount=2

# Heavy blur
node .claude/skills/add-filter/index.js output/art.svg blur heavyBlur amount=8
```

### Drop Shadow

```bash
# Basic shadow
node .claude/skills/add-filter/index.js output/art.svg drop-shadow shadow

# Custom shadow
node .claude/skills/add-filter/index.js output/art.svg drop-shadow longShadow dx=6 dy=6 amount=3 opacity=0.4

# Colored shadow
node .claude/skills/add-filter/index.js output/art.svg drop-shadow redShadow color=#E53935 opacity=0.6
```

### Glow

```bash
# White glow
node .claude/skills/add-filter/index.js output/art.svg glow whiteGlow color=#fff amount=5

# Neon glow
node .claude/skills/add-filter/index.js output/art.svg glow neonGlow color=#00ff00 amount=8 opacity=1

# Soft warm glow
node .claude/skills/add-filter/index.js output/art.svg glow warmGlow color=#FDD835 amount=4 opacity=0.6
```

### Inner Shadow

```bash
# Inset shadow
node .claude/skills/add-filter/index.js output/art.svg inner-shadow inset dx=2 dy=2 amount=2
```

### Emboss

```bash
# Raised effect
node .claude/skills/add-filter/index.js output/art.svg emboss raised amount=1
```

### Noise/Texture

```bash
# Subtle grain
node .claude/skills/add-filter/index.js output/art.svg noise grain amount=0.2

# Heavy distortion
node .claude/skills/add-filter/index.js output/art.svg noise distort amount=0.8 freq=0.5
```

### Color Adjustments

```bash
# Grayscale
node .claude/skills/add-filter/index.js output/art.svg grayscale gray

# Partial grayscale (50%)
node .claude/skills/add-filter/index.js output/art.svg grayscale halfGray amount=0.5

# Sepia tone
node .claude/skills/add-filter/index.js output/art.svg sepia vintage

# Invert colors
node .claude/skills/add-filter/index.js output/art.svg invert negative

# Increase saturation
node .claude/skills/add-filter/index.js output/art.svg saturate vivid amount=2

# Desaturate
node .claude/skills/add-filter/index.js output/art.svg saturate muted amount=0.5

# Brighten
node .claude/skills/add-filter/index.js output/art.svg brightness bright amount=1.5

# Darken
node .claude/skills/add-filter/index.js output/art.svg brightness dark amount=0.7

# High contrast
node .claude/skills/add-filter/index.js output/art.svg contrast highContrast amount=2

# Low contrast
node .claude/skills/add-filter/index.js output/art.svg contrast lowContrast amount=0.5
```

## Applying Filters

After creating a filter, apply it using edit-element:

```bash
# Apply to specific element
node .claude/skills/edit-element/index.js output/art.svg circle:0 filter "url(#shadow)"

# Apply to all paths
node .claude/skills/edit-element/index.js output/art.svg path filter "url(#blur)"

# Remove filter
node .claude/skills/edit-element/index.js output/art.svg circle:0 filter "none"
```

## Common Workflows

### Depth with Shadows

```bash
# Create layered shadows for depth
node .claude/skills/add-filter/index.js output/art.svg drop-shadow close dx=2 dy=2 amount=1 opacity=0.3
node .claude/skills/add-filter/index.js output/art.svg drop-shadow far dx=8 dy=8 amount=4 opacity=0.2
```

### Neon Sign Effect

```bash
# Bright glow on dark background
node .claude/skills/add-filter/index.js output/art.svg glow neon color=#ff00ff amount=6 opacity=1
node .claude/skills/edit-element/index.js output/art.svg text filter "url(#neon)"
```

### Vintage Photo

```bash
# Combine sepia and low contrast
node .claude/skills/add-filter/index.js output/art.svg sepia vintage amount=0.8
node .claude/skills/edit-element/index.js output/art.svg rect:0 filter "url(#vintage)"
```

### Focus Effect

```bash
# Blur background, keep subject sharp
node .claude/skills/add-filter/index.js output/art.svg blur bgBlur amount=3
node .claude/skills/edit-element/index.js output/art.svg path filter "url(#bgBlur)"
# Leave the main subject without filter
```

## Notes

- Filters are stored in `<defs>` section
- Reference filters with `url(#id)` syntax
- Filter region extends 50% beyond element bounds (handles shadows/glows)
- Filters can impact rendering performance on complex SVGs
- Combine multiple filters by chaining or creating composite filters
- Amount values vary by filter type (see examples for typical ranges)
