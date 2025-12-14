---
description: Reduce number of colors in SVG by merging similar colors
---

# Reduce Colors

Reduces the number of unique colors in an SVG by merging similar colors together. Useful for preparing files for plotters with limited pen colors.

## Usage

```bash
node .claude/skills/reduce-colors/index.js <svg-file> [options]
```

## Options

| Option | Description |
|--------|-------------|
| `threshold=<n>` | Color distance threshold for merging (0-255, default: 50) |
| `max=<n>` | Maximum number of output colors |
| `palette=<name>` | Map colors to a predefined palette |
| `stroke-only` | Only reduce stroke colors |
| `fill-only` | Only reduce fill colors |

## Predefined Palettes

| Name | Colors |
|------|--------|
| `basic` | Black, white, red, green, blue, yellow, magenta, cyan |
| `grayscale` | 6 shades from black to white |
| `warm` | Black, white, reds, oranges, yellows |
| `cool` | Black, white, blues, cyans, purples |
| `earth` | Black, white, browns, greens |
| `neon` | Black, white, bright neon colors |

## Examples

### Merge Similar Colors (Default Threshold)

```bash
node .claude/skills/reduce-colors/index.js output/art.svg
# Merges colors within distance 50
```

### Limit to Specific Number of Colors

```bash
node .claude/skills/reduce-colors/index.js output/art.svg max=6
# Reduces to at most 6 colors
```

### Map to Basic Palette

```bash
node .claude/skills/reduce-colors/index.js output/art.svg palette=basic
# Maps all colors to nearest basic color (8 colors max)
```

### Aggressive Merging

```bash
node .claude/skills/reduce-colors/index.js output/art.svg threshold=100
# Higher threshold = more aggressive merging
```

## Workflow for Multi-Pen Plotter

```bash
# 1. Prepare SVG (remove animations, defs, convert text)
node .claude/skills/remove-animations/index.js output/art.svg
node .claude/skills/remove-defs/index.js output/art.svg all keep-paths
node .claude/skills/text-to-path/index.js output/art.svg /path/to/font.ttf stroke-only

# 2. Reduce to plotter pen count (e.g., 4 pens)
node .claude/skills/reduce-colors/index.js output/art.svg max=4

# 3. Split into separate files per color
node .claude/skills/split-by-color/index.js output/art.svg stroke-only to-black
```

## How It Works

1. **Threshold-based**: Colors within the threshold distance (Euclidean in RGB space) are merged. The most frequent color becomes the representative.

2. **Max colors**: If more colors than max, the two closest clusters are repeatedly merged until the limit is reached.

3. **Palette mapping**: Each color is mapped to its nearest color in the chosen palette.

## Notes

- Color distance is calculated in RGB space (0-255 per channel)
- Max RGB distance is ~441 (black to white)
- Threshold of 50 merges fairly similar colors
- Threshold of 100+ merges noticeably different colors
- Uses frequency-weighted clustering (common colors preferred as representatives)
