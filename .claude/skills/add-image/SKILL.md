---
description: Embed external images (PNG, JPG, SVG) into SVG files
---

# Add Image

Embeds external images into SVG files. Supports local files, URLs, and base64 embedding.

## Usage

```bash
node .claude/skills/add-image/index.js <svg-file> <image-src> <x> <y> <width> <height> [options]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `image-src` | Path to image file or URL |
| `x`, `y` | Position (top-left corner) |
| `width`, `height` | Display dimensions |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `preserve` | xMidYMid | Aspect ratio handling |
| `meet`/`slice` | meet | Scale mode |
| `opacity` | 1 | Image opacity |
| `id` | - | Element ID |
| `embed` | false | Embed as base64 |
| `clip-path` | - | Apply clip path |
| `mask` | - | Apply mask |
| `filter` | - | Apply filter |

## Examples

### Basic Image

```bash
# Add image at position
node .claude/skills/add-image/index.js output/art.svg photo.jpg 50 50 200 150

# Full canvas background
node .claude/skills/add-image/index.js output/art.svg background.png 0 0 400 400

# Small icon
node .claude/skills/add-image/index.js output/art.svg icon.png 10 10 32 32
```

### From URL

```bash
# Remote image
node .claude/skills/add-image/index.js output/art.svg "https://example.com/image.png" 0 0 200 200
```

### Embedded (Base64)

```bash
# Embed image data directly in SVG
node .claude/skills/add-image/index.js output/art.svg photo.jpg 50 50 200 150 embed=true
```

Embedding is useful for:
- Self-contained SVG files
- Avoiding external dependencies
- Email/sharing compatibility

### Aspect Ratio

```bash
# Stretch to fill (ignore aspect ratio)
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 200 preserve=none

# Center and fit (default)
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 200 preserve=xMidYMid

# Align top-left
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 200 preserve=xMinYMin

# Align bottom-right
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 200 preserve=xMaxYMax
```

### Scale Mode

```bash
# Fit entire image (may have gaps) - default
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 200 meet

# Fill area (may crop)
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 200 slice
```

### With Effects

```bash
# Semi-transparent
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 400 opacity=0.5

# With filter
node .claude/skills/add-filter/index.js output/art.svg grayscale grayFilter
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 400 filter="url(#grayFilter)"

# With clip path
node .claude/skills/add-clip-path/index.js output/art.svg circle clipCircle 200 200 150
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 400 clip-path="url(#clipCircle)"

# With mask (vignette)
node .claude/skills/add-mask/index.js output/art.svg vignette photoMask 20 40
node .claude/skills/add-image/index.js output/art.svg photo.jpg 0 0 400 400 mask="url(#photoMask)"
```

## Preserve Aspect Ratio Values

| Value | Alignment |
|-------|-----------|
| `none` | Stretch to fill |
| `xMinYMin` | Top-left |
| `xMidYMin` | Top-center |
| `xMaxYMin` | Top-right |
| `xMinYMid` | Middle-left |
| `xMidYMid` | Center (default) |
| `xMaxYMid` | Middle-right |
| `xMinYMax` | Bottom-left |
| `xMidYMax` | Bottom-center |
| `xMaxYMax` | Bottom-right |

## Meet vs Slice

| Mode | Behavior |
|------|----------|
| `meet` | Scale to fit entirely within box (letterbox) |
| `slice` | Scale to fill box completely (crop overflow) |

```bash
# Fit with letterboxing
node .claude/skills/add-image/index.js output/art.svg wide.jpg 0 0 200 200 meet

# Fill and crop
node .claude/skills/add-image/index.js output/art.svg wide.jpg 0 0 200 200 slice
```

## Common Workflows

### Photo with Frame

```bash
# Add photo
node .claude/skills/add-image/index.js output/art.svg photo.jpg 20 20 360 360

# Add border rect on top
node .claude/skills/add-rect/index.js output/art.svg 20 20 360 360 fill=none stroke=#333 stroke-width=4
```

### Circular Avatar

```bash
# Create clip path
node .claude/skills/add-clip-path/index.js output/art.svg circle avatarClip 200 200 100

# Add clipped image
node .claude/skills/add-image/index.js output/art.svg avatar.jpg 100 100 200 200 clip-path="url(#avatarClip)" slice
```

### Background with Overlay

```bash
# Add background image
node .claude/skills/add-image/index.js output/art.svg bg.jpg 0 0 400 400 id=background

# Add semi-transparent overlay
node .claude/skills/add-rect/index.js output/art.svg 0 0 400 400 fill=#000 opacity=0.3

# Add content on top
node .claude/skills/add-text/index.js output/art.svg 200 200 "Title" font-size=32 fill=#fff text-anchor=middle
```

### Tiled Pattern (Manual)

```bash
# Add multiple small images
node .claude/skills/add-image/index.js output/art.svg tile.png 0 0 100 100
node .claude/skills/add-image/index.js output/art.svg tile.png 100 0 100 100
node .claude/skills/add-image/index.js output/art.svg tile.png 200 0 100 100
# ... etc
```

## Supported Formats

| Format | Extension |
|--------|-----------|
| PNG | .png |
| JPEG | .jpg, .jpeg |
| GIF | .gif |
| WebP | .webp |
| SVG | .svg |

## Notes

- Image paths are relative to the SVG file location
- Use `embed=true` for portable, self-contained SVGs
- Embedded images increase file size significantly
- URLs must be accessible when SVG is viewed
- `slice` mode crops; `meet` mode letterboxes
- Filters, masks, and clip paths work on images
- Images render at their layer position (use layer-order to adjust)
