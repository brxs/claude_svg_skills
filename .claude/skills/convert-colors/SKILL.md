---
description: Convert all colors in SVG to a single color
---

# Convert Colors

Batch converts all stroke and/or fill colors in an SVG to a single target color. Useful for creating monochrome versions or preparing for single-color output.

## Usage

```bash
node .claude/skills/convert-colors/index.js <svg-file> <color> [options]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `color` | Target color (hex or name) |

## Options

| Option | Description |
|--------|-------------|
| `stroke-only` | Only convert stroke colors |
| `fill-only` | Only convert fill colors |
| `keep-white` | Don't convert white (#ffffff) |
| `keep-none` | Don't convert "none" values |

## Supported Color Formats

- Hex: `#000000`, `#333`, `#ff0000`
- Names: `black`, `white`, `red`, `green`, `blue`, `gray`

## Examples

### Convert Everything to Black

```bash
node .claude/skills/convert-colors/index.js output/art.svg black
```

### Convert Only Strokes

```bash
node .claude/skills/convert-colors/index.js output/art.svg "#000000" stroke-only
```

### Keep White Colors

```bash
node .claude/skills/convert-colors/index.js output/art.svg black keep-white
```

### Convert Fills to Gray

```bash
node .claude/skills/convert-colors/index.js output/art.svg "#808080" fill-only
```

## Use Cases

- **Plotter preparation** - Convert to single pen color
- **Print optimization** - Create black & white version
- **Accessibility** - High contrast versions
- **Laser cutting** - Single color for cut lines

## Notes

- Modifies the file in place
- Preserves `fill="none"` and `stroke="none"` by default
- Preserves gradient/pattern references (`url(#...)`)
- Does not modify colors inside `<style>` tags
