---
description: Convert text elements to paths for plotter/CNC output
---

# Text to Path

Converts SVG text elements to vector paths using a font file. Essential for pen plotters, laser cutters, and CNC machines that can't render fonts.

## Usage

```bash
node .claude/skills/text-to-path/index.js <svg-file> <font-file> [options]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `svg-file` | SVG file to process |
| `font-file` | TTF or OTF font file to use |

## Options

| Option | Description |
|--------|-------------|
| `stroke-only` | Output stroked paths (for single-line fonts) |
| `fill-only` | Output filled paths (default) |
| `stroke=<width>` | Stroke width for stroke-only mode |

## Examples

### Basic Conversion (Filled Outlines)

```bash
node .claude/skills/text-to-path/index.js output/art.svg /path/to/Arial.ttf
```

### Single-Line for Plotters

```bash
# Using a single-line font (Hershey, etc.)
node .claude/skills/text-to-path/index.js output/art.svg fonts/HersheyScript.ttf stroke-only stroke=0.5
```

### Custom Stroke Width

```bash
node .claude/skills/text-to-path/index.js output/art.svg fonts/font.otf stroke-only stroke=1.5
```

## Output Modes

### Fill Mode (Default)

Creates filled path outlines - suitable for:
- Vinyl cutting
- Laser engraving (filled)
- General vector output

### Stroke Mode

Creates stroked paths - suitable for:
- Pen plotters
- Single-line engraving
- Drawing machines

## Font Sources

### System Fonts (macOS)

```bash
# Common locations
/System/Library/Fonts/
/Library/Fonts/
~/Library/Fonts/

# Example
node index.js art.svg /System/Library/Fonts/Helvetica.ttc
```

### Single-Line Fonts (Recommended for Plotters)

- [Hershey Fonts](https://github.com/evil-mad/EggBot/tree/master/inkscape_driver/hersheydata)
- [CNC Vector Fonts](https://www.evilmadscientist.com/2011/hershey-text-an-inkscape-extension-for-engraving-fonts/)

## Limitations

- **textPath not supported** - Text on curves (circular text) not yet converted
- **Font required** - Must provide a font file that matches the original design
- **No CSS styles** - Inline attributes only (font-size, fill, etc.)

## Workflow for Plotters

```bash
# 1. Remove animations
node .claude/skills/remove-animations/index.js output/art.svg

# 2. Remove defs
node .claude/skills/remove-defs/index.js output/art.svg all keep-paths

# 3. Convert colors to black
node .claude/skills/convert-colors/index.js output/art.svg black

# 4. Convert text to paths
node .claude/skills/text-to-path/index.js output/art.svg /path/to/font.ttf stroke-only

# 5. Ready for plotter!
```

## Notes

- Preserves text position, anchor, and transforms
- Handles letter-spacing attribute
- Original text elements are replaced (not duplicated)
- Works with TTF and OTF font formats
