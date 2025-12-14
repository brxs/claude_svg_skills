---
description: Split SVG into separate files by color for multi-pen plotters
---

# Split by Color

Splits an SVG file into multiple output files, one per unique color. Perfect for multi-pen plotters where each pen has a different color.

## Usage

```bash
node .claude/skills/split-by-color/index.js <svg-file> [options]
```

## Options

| Option | Description |
|--------|-------------|
| `stroke-only` | Only consider stroke colors (ignore fill) |
| `fill-only` | Only consider fill colors (ignore stroke) |
| `to-black` | Convert each output file to black strokes |
| `keep-bg` | Keep white background rectangle in each file |

## Output

Creates files named `<original>-<color>.svg` where color is the hex code without the `#`.

For example: `art.svg` with red and blue elements becomes:
- `art-ff0000.svg` (red elements)
- `art-0000ff.svg` (blue elements)

## Examples

### Basic Split

```bash
node .claude/skills/split-by-color/index.js output/art.svg
# Creates: art-ff0000.svg, art-00ff00.svg, art-0000ff.svg, etc.
```

### For Single-Pen Plotter (Convert All to Black)

```bash
node .claude/skills/split-by-color/index.js output/art.svg to-black
# Creates separate files, each with black strokes
```

### Strokes Only (Ignore Fills)

```bash
node .claude/skills/split-by-color/index.js output/art.svg stroke-only
# Only splits based on stroke colors
```

## Workflow for Multi-Pen Plotter

```bash
# 1. Remove animations
node .claude/skills/remove-animations/index.js output/art.svg

# 2. Remove defs (gradients, filters)
node .claude/skills/remove-defs/index.js output/art.svg all keep-paths

# 3. Convert text to paths
node .claude/skills/text-to-path/index.js output/art.svg /path/to/font.ttf stroke-only

# 4. Split by color
node .claude/skills/split-by-color/index.js output/art.svg stroke-only to-black

# 5. Load each file for the corresponding pen color
```

## Notes

- Ignores elements with `fill: none` or `stroke: none`
- Ignores gradient and pattern fills (url references)
- Normalizes colors to 6-digit hex codes
- Elements may appear in multiple files if they have both stroke and fill colors
