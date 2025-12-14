# Claude SVG Skills

A comprehensive toolkit for creating geometric SVG art via CLI commands. Built for use with Claude Code.

## Features

- **35+ CLI skills** for complete SVG manipulation
- Create shapes, gradients, patterns, filters, masks, and more
- Transform, animate, and organize elements
- **Plotter/CNC workflow** - prepare SVGs for pen plotters and laser cutters
- Render SVG to PNG
- No coding required - pure command-line workflow

## Quick Start

```bash
npm install

# Create a canvas
node .claude/skills/init-canvas/index.js output/art.svg 400 400 "#fff"

# Add a circle
node .claude/skills/add-circle/index.js output/art.svg 200 200 80 fill=#E53935

# Add a gradient
node .claude/skills/add-gradient/index.js output/art.svg linear bg "#667eea,#764ba2" angle=45

# Render to PNG
node .claude/skills/render-svg/index.js output/art.svg
```

## Available Skills

### Canvas & Output
| Skill | Description |
|-------|-------------|
| `init-canvas` | Create new SVG canvas |
| `render-svg` | Export SVG to PNG |
| `list-elements` | Inspect SVG structure |
| `set-size` | Set physical dimensions (mm, cm, in) with scale-to-fit |

### Shape Creation
| Skill | Description |
|-------|-------------|
| `add-circle` | Add circles |
| `add-rect` | Add rectangles |
| `add-ellipse` | Add ellipses |
| `add-line` | Add lines |
| `add-polygon` | Add custom polygons |
| `add-regular-polygon` | Add regular polygons (triangle, hexagon, etc.) |
| `add-path` | Add SVG paths |
| `add-text` | Add text |
| `add-textPath` | Add text along paths (circular, arc, wavy) |
| `add-image` | Embed images |

### Definitions
| Skill | Description |
|-------|-------------|
| `add-gradient` | Linear and radial gradients |
| `add-pattern` | Repeating patterns (dots, stripes, grid, etc.) |
| `add-filter` | Effects (blur, shadow, glow, grayscale, etc.) |
| `add-marker` | Arrow heads and line markers |
| `add-clip-path` | Clipping masks (hard edge) |
| `add-mask` | Alpha masks (soft edge, fades) |

### Element Manipulation
| Skill | Description |
|-------|-------------|
| `edit-element` | Modify any attribute (supports `svg` selector) |
| `delete-element` | Remove elements |
| `apply-transform` | Rotate, scale, translate, skew |
| `layer-order` | Change z-order (front/back) |
| `clone-element` | Duplicate elements |
| `add-group` | Group elements together |
| `add-use` | Reuse elements by reference |
| `add-animation` | Add SMIL animations |

### Plotter/Export Workflow
| Skill | Description |
|-------|-------------|
| `remove-animations` | Strip SMIL animations for static output |
| `remove-defs` | Remove gradients, filters, patterns |
| `convert-colors` | Convert all colors to single color (e.g., black) |
| `text-to-path` | Convert text/textPath to vector paths |
| `reduce-colors` | Reduce color count by clustering similar colors |
| `split-by-color` | Split into separate files per color |
| `set-size` | Set physical size (mm, cm, in) with scale-to-fit |

## Plotter Workflow Example

Prepare an SVG for a multi-pen plotter:

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

## Selectors

Most skills use selectors to target elements:

```bash
svg         # Root SVG element (for edit-element)
path        # All paths
path:0      # First path
path:-1     # Last path
circle:2    # Third circle
all         # All shape elements
```

## Example Workflow

```bash
# 1. Create canvas with gradient background
node .claude/skills/init-canvas/index.js output/logo.svg 400 400
node .claude/skills/add-gradient/index.js output/logo.svg radial bg "#fff,#e0e0e0"
node .claude/skills/add-rect/index.js output/logo.svg 0 0 400 400 fill="url(#bg)"

# 2. Add shapes
node .claude/skills/add-circle/index.js output/logo.svg 200 200 120 fill=#1E88E5
node .claude/skills/add-circle/index.js output/logo.svg 200 200 80 fill=#fff

# 3. Add text
node .claude/skills/add-text/index.js output/logo.svg 200 215 "GO" font-size=48 text-anchor=middle fill=#1E88E5 font-weight=bold

# 4. Add shadow effect
node .claude/skills/add-filter/index.js output/logo.svg drop-shadow shadow dx=3 dy=3 opacity=0.2
node .claude/skills/edit-element/index.js output/logo.svg circle:0 filter "url(#shadow)"

# 5. Export
node .claude/skills/render-svg/index.js output/logo.svg
```

## Common Options

### Shape Styling
```bash
fill=#E53935           # Fill color
stroke=#000            # Stroke color
stroke-width=2         # Stroke width
opacity=0.5            # Transparency
```

### Applying Definitions
```bash
fill="url(#gradientId)"
filter="url(#filterId)"
clip-path="url(#clipId)"
mask="url(#maskId)"
marker-end="url(#markerId)"
```

## Project Structure

```
.claude/skills/     # CLI skills (35+ tools)
src/                # JavaScript API modules
examples/           # Example scripts
output/             # Generated files (gitignored)
```

## Documentation

- Full documentation: [CLAUDE.md](CLAUDE.md)
- Each skill has detailed docs in `.claude/skills/<name>/SKILL.md`

## JavaScript API

For programmatic use:

```javascript
import { createCanvas, circle, saveSvg, getOutputPath } from './src/index.js';

const canvas = createCanvas(400, 400, '#fff');
circle(canvas, 200, 200, 100, { fill: '#E53935' });
saveSvg(canvas, getOutputPath('art.svg'));
```

## Requirements

- Node.js 18+
- npm

## License

MIT
