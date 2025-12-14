---
description: Set physical size of SVG for plotters/printers
---

# Set Size

Sets the physical dimensions of an SVG file with optional scaling options.

## Usage

```bash
node .claude/skills/set-size/index.js <svg-file> <width> <height> [options]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `width` | Width with unit (e.g., `10cm`, `200mm`, `8in`) |
| `height` | Height with unit (e.g., `10cm`, `200mm`, `8in`) |

## Options

| Option | Description |
|--------|-------------|
| `scale-to-fit` | Adjust viewBox to fit new aspect ratio without distortion |
| `stretch` | Stretch content to fill (may distort if aspect ratio differs) |

## Supported Units

- `mm` - millimeters
- `cm` - centimeters
- `in` - inches
- `pt` - points (1/72 inch)
- `px` - pixels (default)

## Examples

### Basic Size (Uniform Scale)

```bash
node .claude/skills/set-size/index.js output/art.svg 10cm 10cm
```

Sets size to 10×10cm. Content scales uniformly.

### Scale to Fit (No Distortion)

```bash
node .claude/skills/set-size/index.js output/art.svg 200mm 100mm scale-to-fit
```

Sets size to 200×100mm and adjusts viewBox so content fits without distortion (adds padding if needed).

### Stretch to Fill

```bash
node .claude/skills/set-size/index.js output/art.svg 8in 6in stretch
```

Sets size to 8×6in. Content stretches to fill (may distort if original aspect ratio differs).

## Behavior

| Mode | ViewBox | Content |
|------|---------|---------|
| Default | Unchanged | Scales uniformly, may not fill |
| `scale-to-fit` | Adjusted | Centers with padding, no distortion |
| `stretch` | Unchanged | Stretches to fill, may distort |
