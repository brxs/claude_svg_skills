---
description: Add text elements to existing SVG files
---

# Add Text

Adds text elements to existing SVG files with full styling support.

## Usage

```bash
node .claude/skills/add-text/index.js <svg-file> <x> <y> <text> [options]
```

## Basic Examples

```bash
# Simple text
node .claude/skills/add-text/index.js output/art.svg 200 200 "Hello World"

# Styled title
node .claude/skills/add-text/index.js output/art.svg 200 50 "My Art" font-size=32 font-weight=bold

# Centered text
node .claude/skills/add-text/index.js output/art.svg 200 200 "Center" text-anchor=middle
```

## Options

| Option | Values | Default |
|--------|--------|---------|
| `font-size` | Number (px) | 16 |
| `font-family` | Font name | sans-serif |
| `fill` | Color | #000 |
| `opacity` | 0-1 | 1 |
| `text-anchor` | start, middle, end | start |
| `dominant-baseline` | auto, middle, hanging | auto |
| `font-weight` | normal, bold, 100-900 | normal |
| `font-style` | normal, italic | normal |
| `rotate` | Angle in degrees | - |
| `letter-spacing` | Number (px) | - |

## Text Alignment

### Horizontal (text-anchor)

```bash
# Left-aligned (default)
node .claude/skills/add-text/index.js output/art.svg 200 100 "Left" text-anchor=start

# Center-aligned
node .claude/skills/add-text/index.js output/art.svg 200 100 "Center" text-anchor=middle

# Right-aligned
node .claude/skills/add-text/index.js output/art.svg 200 100 "Right" text-anchor=end
```

### Vertical (dominant-baseline)

```bash
# Text sits on baseline (default)
node .claude/skills/add-text/index.js output/art.svg 200 200 "Baseline"

# Vertically centered
node .claude/skills/add-text/index.js output/art.svg 200 200 "Middle" dominant-baseline=middle

# Text hangs from point
node .claude/skills/add-text/index.js output/art.svg 200 200 "Hanging" dominant-baseline=hanging
```

## Styling Examples

### Colors

```bash
# Red text
node .claude/skills/add-text/index.js output/art.svg 100 100 "Red" fill=#E53935

# Semi-transparent
node .claude/skills/add-text/index.js output/art.svg 100 100 "Faded" fill=#000 opacity=0.5
```

### Fonts

```bash
# Bold heading
node .claude/skills/add-text/index.js output/art.svg 200 50 "Title" font-size=28 font-weight=bold

# Italic
node .claude/skills/add-text/index.js output/art.svg 200 100 "Emphasis" font-style=italic

# Monospace
node .claude/skills/add-text/index.js output/art.svg 200 100 "Code" font-family=monospace
```

### Rotation

```bash
# Rotated 45 degrees
node .claude/skills/add-text/index.js output/art.svg 200 200 "Angled" rotate=45

# Vertical text (90 degrees)
node .claude/skills/add-text/index.js output/art.svg 50 200 "Vertical" rotate=-90
```

## Labels for Art

```bash
# Add title
node .claude/skills/add-text/index.js output/art.svg 200 30 "Topographic Study" font-size=20 text-anchor=middle

# Add signature
node .claude/skills/add-text/index.js output/art.svg 380 390 "2024" font-size=10 text-anchor=end opacity=0.5

# Add region labels
node .claude/skills/add-text/index.js output/art.svg 150 200 "Peak A" font-size=12
node .claude/skills/add-text/index.js output/art.svg 280 180 "Valley" font-size=12 font-style=italic
```

## Notes

- The x, y coordinates specify the starting point of the text baseline
- Use `text-anchor=middle` for center-aligned text at a point
- Use `dominant-baseline=middle` to vertically center text at a point
- Font availability depends on the viewing environment
- Safe font families: sans-serif, serif, monospace, Arial, Helvetica, Georgia, Times
