# Claude SVG Skills

This project enables geometric art creation using SVG via CLI skills.

## Quick Start

```bash
npm install

# Create a canvas and add shapes
node .claude/skills/init-canvas/index.js output/art.svg 400 400 "#fff"
node .claude/skills/add-circle/index.js output/art.svg 200 200 50 fill=#E53935
node .claude/skills/render-svg/index.js output/art.svg
```

## Project Structure

- `.claude/skills/` - CLI skills for SVG operations
- `src/` - Core utility modules (JS API)
- `examples/` - Runnable example scripts
- `output/` - Generated SVG files (gitignored)

---

## CLI Skills Reference

### Canvas & Output

| Skill | Usage |
|-------|-------|
| `init-canvas` | `node .claude/skills/init-canvas/index.js <file> <width> <height> [bg-color]` |
| `render-svg` | `node .claude/skills/render-svg/index.js <svg-file> [output.png]` |
| `list-elements` | `node .claude/skills/list-elements/index.js <svg-file> [filter] [--summary\|--verbose]` |
| `set-size` | `node .claude/skills/set-size/index.js <svg-file> <width> <height> [scale-to-fit\|stretch]` |

### Shape Creation

| Skill | Usage |
|-------|-------|
| `add-circle` | `node .claude/skills/add-circle/index.js <file> <cx> <cy> <r> [options]` |
| `add-rect` | `node .claude/skills/add-rect/index.js <file> <x> <y> <w> <h> [options]` |
| `add-ellipse` | `node .claude/skills/add-ellipse/index.js <file> <cx> <cy> <rx> <ry> [options]` |
| `add-line` | `node .claude/skills/add-line/index.js <file> <x1> <y1> <x2> <y2> [options]` |
| `add-polygon` | `node .claude/skills/add-polygon/index.js <file> <points> [options]` |
| `add-regular-polygon` | `node .claude/skills/add-regular-polygon/index.js <file> <cx> <cy> <r> <sides> [options]` |
| `add-path` | `node .claude/skills/add-path/index.js <file> <d> [options]` |
| `add-text` | `node .claude/skills/add-text/index.js <file> <x> <y> <text> [options]` |
| `add-textPath` | `node .claude/skills/add-textPath/index.js <file> <mode> <text> [...args] [options]` |
| `add-image` | `node .claude/skills/add-image/index.js <file> <src> <x> <y> <w> <h> [options]` |

### Definitions (defs)

| Skill | Usage |
|-------|-------|
| `add-gradient` | `node .claude/skills/add-gradient/index.js <file> <linear\|radial> <id> <colors> [options]` |
| `add-pattern` | `node .claude/skills/add-pattern/index.js <file> <type> <id> [options]` |
| `add-filter` | `node .claude/skills/add-filter/index.js <file> <type> <id> [options]` |
| `add-marker` | `node .claude/skills/add-marker/index.js <file> <type> <id> [options]` |
| `add-clip-path` | `node .claude/skills/add-clip-path/index.js <file> <shape> <id> [...args]` |
| `add-mask` | `node .claude/skills/add-mask/index.js <file> <type> <id> [...args] [options]` |

### Element Manipulation

| Skill | Usage |
|-------|-------|
| `edit-element` | `node .claude/skills/edit-element/index.js <file> <selector> <attr> <value>` |
| `delete-element` | `node .claude/skills/delete-element/index.js <file> <selector>` |
| `apply-transform` | `node .claude/skills/apply-transform/index.js <file> <selector> <transform> [...args]` |
| `layer-order` | `node .claude/skills/layer-order/index.js <file> <selector> <front\|back\|up\|down>` |
| `clone-element` | `node .claude/skills/clone-element/index.js <file> <selector> [options]` |
| `add-group` | `node .claude/skills/add-group/index.js <file> <selector> <group-id> [options]` |
| `add-use` | `node .claude/skills/add-use/index.js <file> <ref-id> <x> <y> [options]` |
| `add-animation` | `node .claude/skills/add-animation/index.js <file> <selector> <type> <values> <dur> [options]` |

### Plotter/Export Workflow

| Skill | Usage |
|-------|-------|
| `remove-animations` | `node .claude/skills/remove-animations/index.js <svg-file>` |
| `remove-defs` | `node .claude/skills/remove-defs/index.js <svg-file> <type> [keep-paths]` |
| `convert-colors` | `node .claude/skills/convert-colors/index.js <svg-file> <color> [stroke-only\|fill-only]` |
| `text-to-path` | `node .claude/skills/text-to-path/index.js <svg-file> <font-file> [stroke-only\|fill-only]` |
| `reduce-colors` | `node .claude/skills/reduce-colors/index.js <svg-file> [threshold=n\|max=n\|palette=name]` |
| `split-by-color` | `node .claude/skills/split-by-color/index.js <svg-file> [stroke-only\|to-black]` |
| `set-size` | `node .claude/skills/set-size/index.js <svg-file> <width> <height> [scale-to-fit]` |

---

## Selectors

Most manipulation skills use selectors to target elements:

| Selector | Description |
|----------|-------------|
| `svg` | Root SVG element |
| `path` | All path elements |
| `path:0` | First path (0-indexed) |
| `path:-1` | Last path |
| `circle:2` | Third circle |
| `all` | All shape elements |

---

## Common Options

### Shape Styling
```
fill=<color>           Fill color
stroke=<color>         Stroke color
stroke-width=<n>       Stroke width
opacity=<0-1>          Opacity
```

### Referencing Definitions
```
fill="url(#gradientId)"
stroke="url(#patternId)"
filter="url(#filterId)"
clip-path="url(#clipId)"
mask="url(#maskId)"
marker-end="url(#markerId)"
```

---

## Plotter/Export Workflow

Prepare SVGs for pen plotters, laser cutters, and CNC machines:

### Full Workflow Example

```bash
# 1. Remove animations (plotters need static SVG)
node .claude/skills/remove-animations/index.js output/art.svg

# 2. Remove gradients/filters (plotters can't render these)
node .claude/skills/remove-defs/index.js output/art.svg all keep-paths

# 3. Convert text to paths (plotters can't render fonts)
node .claude/skills/text-to-path/index.js output/art.svg /path/to/font.ttf stroke-only

# 4. Reduce to plotter-friendly color count
node .claude/skills/reduce-colors/index.js output/art.svg max=6

# 5. Split by color (one file per pen)
node .claude/skills/split-by-color/index.js output/art.svg stroke-only

# 6. Set physical size
node .claude/skills/set-size/index.js output/art.svg 10cm 10cm
```

### remove-animations

Strips SMIL animations for static output:
```bash
node .claude/skills/remove-animations/index.js output/art.svg
```

### remove-defs

Remove gradients, filters, patterns:
```bash
# Remove all definitions
node .claude/skills/remove-defs/index.js output/art.svg all

# Keep paths referenced by defs (like textPath)
node .claude/skills/remove-defs/index.js output/art.svg all keep-paths

# Remove only gradients
node .claude/skills/remove-defs/index.js output/art.svg gradients
```

### convert-colors

Convert all colors to a single color:
```bash
# Convert to black
node .claude/skills/convert-colors/index.js output/art.svg black

# Convert strokes only
node .claude/skills/convert-colors/index.js output/art.svg "#333" stroke-only
```

### text-to-path

Convert text elements to vector paths:
```bash
# Basic conversion (filled paths)
node .claude/skills/text-to-path/index.js output/art.svg /path/to/font.ttf

# Stroke paths (for single-line fonts)
node .claude/skills/text-to-path/index.js output/art.svg /path/to/font.ttf stroke-only stroke=0.5
```

### reduce-colors

Reduce number of colors by clustering:
```bash
# Reduce by similarity threshold
node .claude/skills/reduce-colors/index.js output/art.svg threshold=60

# Limit to max colors
node .claude/skills/reduce-colors/index.js output/art.svg max=6

# Map to predefined palette
node .claude/skills/reduce-colors/index.js output/art.svg palette=basic
```

Palettes: `basic`, `grayscale`, `warm`, `cool`, `earth`, `neon`

### split-by-color

Split SVG into separate files by color:
```bash
# Basic split
node .claude/skills/split-by-color/index.js output/art.svg
# Creates: art-ff0000.svg, art-00ff00.svg, etc.

# Split strokes only, convert to black
node .claude/skills/split-by-color/index.js output/art.svg stroke-only to-black
```

### set-size

Set physical dimensions with units:
```bash
# Basic size
node .claude/skills/set-size/index.js output/art.svg 10cm 10cm

# Scale to fit (adjusts viewBox, no distortion)
node .claude/skills/set-size/index.js output/art.svg 200mm 100mm scale-to-fit

# Stretch to fill (may distort)
node .claude/skills/set-size/index.js output/art.svg 8in 6in stretch
```

Units: `mm`, `cm`, `in`, `pt`, `px`

---

## Skill Details

### init-canvas

Creates a new SVG canvas.

```bash
node .claude/skills/init-canvas/index.js output/art.svg 400 400 "#ffffff"
```

### add-circle

```bash
node .claude/skills/add-circle/index.js output/art.svg 200 200 50 fill=#E53935 stroke=#000 stroke-width=2
```

### add-rect

```bash
node .claude/skills/add-rect/index.js output/art.svg 50 50 100 80 fill=#1E88E5 rx=10 ry=10
```

### add-ellipse

```bash
node .claude/skills/add-ellipse/index.js output/art.svg 200 200 100 60 fill=#FDD835
```

### add-line

```bash
node .claude/skills/add-line/index.js output/art.svg 0 0 400 400 stroke=#333 stroke-width=2
```

### add-polygon

Custom polygon with explicit points:
```bash
node .claude/skills/add-polygon/index.js output/art.svg "100,10 150,100 50,100" fill=#E53935
```

### add-regular-polygon

Regular polygons (triangle, hexagon, etc.):
```bash
node .claude/skills/add-regular-polygon/index.js output/art.svg 200 200 80 6 fill=#1E88E5
```

### add-path

SVG path with d attribute:
```bash
node .claude/skills/add-path/index.js output/art.svg "M100,100 Q200,50 300,100 T500,100" stroke=#333 fill=none
```

### add-text

```bash
node .claude/skills/add-text/index.js output/art.svg 200 200 "Hello" font-size=24 text-anchor=middle fill=#333
```

### add-textPath

Text along paths:
```bash
# Circular text
node .claude/skills/add-textPath/index.js output/art.svg circle "Around" 200 200 100 font-size=14

# Arc text
node .claude/skills/add-textPath/index.js output/art.svg arc "Curved" 200 200 120 180 360

# Wavy text
node .claude/skills/add-textPath/index.js output/art.svg wave "Wavy" 200 20 0.05
```

### add-image

```bash
# From file
node .claude/skills/add-image/index.js output/art.svg photo.jpg 50 50 200 150

# Embedded as base64
node .claude/skills/add-image/index.js output/art.svg icon.png 10 10 50 50 embed=true

# With effects
node .claude/skills/add-image/index.js output/art.svg bg.jpg 0 0 400 400 opacity=0.5 clip-path="url(#clip)"
```

### add-gradient

```bash
# Linear gradient
node .claude/skills/add-gradient/index.js output/art.svg linear sunset "#E53935,#FDD835,#1E88E5" angle=45

# Radial gradient
node .claude/skills/add-gradient/index.js output/art.svg radial glow "#fff,#000" cx=50 cy=50

# Apply
node .claude/skills/edit-element/index.js output/art.svg circle fill "url(#sunset)"
```

### add-pattern

Pattern types: `dots`, `lines`, `stripes`, `diagonal`, `grid`, `crosshatch`, `checkerboard`, `zigzag`, `hexagons`, `triangles`

```bash
node .claude/skills/add-pattern/index.js output/art.svg dots polka size=20 color=#E53935 bg=#fff
node .claude/skills/edit-element/index.js output/art.svg rect fill "url(#polka)"
```

### add-filter

Filter types: `blur`, `drop-shadow`, `glow`, `inner-shadow`, `emboss`, `noise`, `grayscale`, `sepia`, `invert`, `saturate`, `brightness`, `contrast`

```bash
node .claude/skills/add-filter/index.js output/art.svg drop-shadow shadow dx=4 dy=4 opacity=0.3
node .claude/skills/edit-element/index.js output/art.svg circle filter "url(#shadow)"
```

### add-marker

Marker types: `arrow`, `arrow-reverse`, `dot`, `circle-open`, `square`, `diamond`

```bash
node .claude/skills/add-marker/index.js output/art.svg arrow arrowEnd fill=#333
node .claude/skills/edit-element/index.js output/art.svg line marker-end "url(#arrowEnd)"
```

### add-clip-path

Shapes: `circle`, `rect`, `ellipse`, `polygon`, `path`, `inset`

```bash
node .claude/skills/add-clip-path/index.js output/art.svg circle clip 200 200 100
node .claude/skills/edit-element/index.js output/art.svg rect clip-path "url(#clip)"
```

### add-mask

Types: `circle`, `rect`, `ellipse`, `radial-fade`, `linear-fade`, `vignette`

```bash
node .claude/skills/add-mask/index.js output/art.svg vignette soft 30 50
node .claude/skills/edit-element/index.js output/art.svg g mask "url(#soft)"
```

### edit-element

Modify any attribute (supports `svg` selector for root element):
```bash
node .claude/skills/edit-element/index.js output/art.svg circle:0 fill "#E53935"
node .claude/skills/edit-element/index.js output/art.svg path stroke-width 3
node .claude/skills/edit-element/index.js output/art.svg svg width 200mm
node .claude/skills/edit-element/index.js output/art.svg svg height 200mm
```

### delete-element

```bash
node .claude/skills/delete-element/index.js output/art.svg path:0
node .claude/skills/delete-element/index.js output/art.svg text
```

### apply-transform

Transforms: `rotate`, `scale`, `translate`, `skewX`, `skewY`, `flip`, `reset`

```bash
node .claude/skills/apply-transform/index.js output/art.svg path:0 rotate 45 200 200
node .claude/skills/apply-transform/index.js output/art.svg circle scale 1.5
node .claude/skills/apply-transform/index.js output/art.svg rect translate 50 100
```

### layer-order

```bash
node .claude/skills/layer-order/index.js output/art.svg circle:0 front
node .claude/skills/layer-order/index.js output/art.svg path:2 back
node .claude/skills/layer-order/index.js output/art.svg rect:0 up
```

### clone-element

```bash
# Single clone with offset
node .claude/skills/clone-element/index.js output/art.svg circle:0 dx=50 dy=0

# Multiple clones
node .claude/skills/clone-element/index.js output/art.svg circle:0 dx=40 count=5

# Clone with modifications
node .claude/skills/clone-element/index.js output/art.svg rect:0 dx=60 fill=#E53935 opacity=0.5
```

### add-group

```bash
node .claude/skills/add-group/index.js output/art.svg circle myGroup
node .claude/skills/add-group/index.js output/art.svg path:0,path:1 twoPathsGroup
node .claude/skills/add-group/index.js output/art.svg circle:0-2 rangeGroup opacity=0.8
```

### add-use

Reuse elements by reference:
```bash
# First add ID to element
node .claude/skills/edit-element/index.js output/art.svg circle:0 id myCircle

# Create instances
node .claude/skills/add-use/index.js output/art.svg myCircle 100 0
node .claude/skills/add-use/index.js output/art.svg myCircle 200 0 opacity=0.5
```

### add-animation

Animation types: `opacity`, `stroke-width`, `stroke-dashoffset`, `rotate`, `scale`, `translate`

```bash
# Breathing opacity
node .claude/skills/add-animation/index.js output/art.svg path opacity "1;0.5;1" 3s

# Rotation
node .claude/skills/add-animation/index.js output/art.svg circle:0 rotate 360 5s

# Scale pulse
node .claude/skills/add-animation/index.js output/art.svg circle scale "1;1.2;1" 2s ease=ease-in-out
```

### list-elements

```bash
# List all elements
node .claude/skills/list-elements/index.js output/art.svg

# Summary only
node .claude/skills/list-elements/index.js output/art.svg all --summary

# Filter by type
node .claude/skills/list-elements/index.js output/art.svg path

# Show definitions
node .claude/skills/list-elements/index.js output/art.svg defs
```

### render-svg

```bash
node .claude/skills/render-svg/index.js output/art.svg
node .claude/skills/render-svg/index.js output/art.svg output/custom-name.png
```

---

## Example Workflow

```bash
# 1. Create canvas
node .claude/skills/init-canvas/index.js output/art.svg 400 400 "#fafafa"

# 2. Add gradient
node .claude/skills/add-gradient/index.js output/art.svg linear bg "#667eea,#764ba2" angle=135

# 3. Add background with gradient
node .claude/skills/add-rect/index.js output/art.svg 0 0 400 400 fill="url(#bg)"

# 4. Add shapes
node .claude/skills/add-circle/index.js output/art.svg 200 200 80 fill=#fff opacity=0.9
node .claude/skills/add-circle/index.js output/art.svg 200 200 60 fill=#fff opacity=0.7
node .claude/skills/add-circle/index.js output/art.svg 200 200 40 fill=#fff opacity=0.5

# 5. Add text
node .claude/skills/add-text/index.js output/art.svg 200 205 "GO" font-size=32 text-anchor=middle fill=#667eea font-weight=bold

# 6. Add shadow filter
node .claude/skills/add-filter/index.js output/art.svg drop-shadow shadow dx=2 dy=2 opacity=0.3
node .claude/skills/edit-element/index.js output/art.svg circle:0 filter "url(#shadow)"

# 7. Render to PNG
node .claude/skills/render-svg/index.js output/art.svg
```

---

## JavaScript API

For programmatic use, import from `src/index.js`:

```javascript
import {
  createCanvas,
  circle,
  rectangle,
  regularPolygon,
  saveSvg,
  getOutputPath
} from './src/index.js';

const canvas = createCanvas(400, 400, '#fff');
circle(canvas, 200, 200, 100, { fill: '#E53935' });
saveSvg(canvas, getOutputPath('my-art.svg'));
```

## Color Palettes

Available: `bauhaus`, `mondrian`, `pastel`, `earth`, `ocean`, `sunset`, `nordic`, `retro`, `forest`, `grayscale`

```javascript
import { randomFromPalette, PALETTES } from './src/index.js';
const color = randomFromPalette('bauhaus');
```

## Conventions

- Use ESM imports (`"type": "module"` in package.json)
- Save all output to `output/` directory
- Skills are at `.claude/skills/<name>/index.js`
- Each skill has a `SKILL.md` with detailed documentation
