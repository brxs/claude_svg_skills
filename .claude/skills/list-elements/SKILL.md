---
description: List and inspect SVG elements for debugging
---

# List Elements

Inspects SVG files and lists their elements, attributes, and structure. Essential for debugging and understanding SVG content before editing.

## Usage

```bash
node .claude/skills/list-elements/index.js <svg-file> [filter] [options]
```

## Filters

| Filter | Description |
|--------|-------------|
| `all` | Show all elements (default) |
| `path` | Show only paths |
| `circle` | Show only circles |
| `rect` | Show only rectangles |
| `line` | Show only lines |
| `text` | Show only text elements |
| `g` | Show only groups |
| `defs` | Show definitions (gradients, filters, etc.) |

## Options

| Option | Description |
|--------|-------------|
| `--summary` | Show only element counts |
| `--verbose` | Show all attributes |

## Examples

### Basic Inspection

```bash
# List all elements
node .claude/skills/list-elements/index.js output/art.svg

# Quick summary
node .claude/skills/list-elements/index.js output/art.svg --summary

# Verbose output
node .claude/skills/list-elements/index.js output/art.svg --verbose
```

### Filter by Type

```bash
# Show only paths
node .claude/skills/list-elements/index.js output/art.svg path

# Show only circles
node .claude/skills/list-elements/index.js output/art.svg circle

# Show definitions (gradients, filters, etc.)
node .claude/skills/list-elements/index.js output/art.svg defs
```

## Output Format

### Standard Output

```
╔════════════════════════════════════════╗
║           SVG STRUCTURE                ║
╚════════════════════════════════════════╝

File: output/art.svg
Size: 400 × 400
ViewBox: 0 0 400 400

┌─ DEFINITIONS ─────────────────────────┐
│ linearGradient#sunset
│ filter#shadow
└────────────────────────────────────────┘

┌─ ELEMENTS ─────────────────────────────┐
│ rect:0 (0, 0) 400×400 [fill:#fafafa]
│ circle:0 (200, 200) r=50 [fill:#E53935]
│ path:0 [fill:#1E88E5]
│ text:0 "Hello World"
└────────────────────────────────────────┘

Selectors for other skills:
  rect:0
  circle:0
  path:0
  text:0
```

### Summary Output

```bash
node .claude/skills/list-elements/index.js output/art.svg --summary
```

```
Element Counts:
──────────────────────────────

Shapes:
  rect: 2
  circle: 5
  path: 3
  text: 1

Definitions:
  linearGradient: 2
  filter: 1

Containers:
  g: 2

Total: 16 elements
```

### Verbose Output

Shows all attributes for each element:

```
│ circle:0 #myCircle (200, 200) r=50
│   cx=200, cy=200, r=50, fill=#E53935, opacity=0.8
```

## Information Shown

### For Shapes

| Element | Key Info |
|---------|----------|
| `rect` | Position (x, y), dimensions (w×h) |
| `circle` | Center (cx, cy), radius |
| `ellipse` | Center (cx, cy), radii (rx, ry) |
| `line` | Start point → End point |
| `path` | Path data preview |
| `text` | Text content preview |
| `use` | Referenced element |

### For Definitions

| Element | Key Info |
|---------|----------|
| `linearGradient` | ID, number of stops |
| `radialGradient` | ID, number of stops |
| `filter` | ID, number of effects |
| `clipPath` | ID |
| `pattern` | ID |
| `marker` | ID |

### Common Attributes

Always shown when present:
- `id` - Element identifier
- `fill` - Fill color
- `stroke` - Stroke color
- `opacity` - Transparency
- `transform` - Applied transforms

## Common Workflows

### Before Editing

```bash
# Check what's in the file
node .claude/skills/list-elements/index.js output/art.svg

# Find the right selector
# Output shows: circle:0, circle:1, circle:2

# Now edit the second circle
node .claude/skills/edit-element/index.js output/art.svg circle:1 fill=#E53935
```

### Debugging

```bash
# Something looks wrong - inspect the SVG
node .claude/skills/list-elements/index.js output/art.svg --verbose

# Check what definitions exist
node .claude/skills/list-elements/index.js output/art.svg defs
```

### Understanding Structure

```bash
# Quick overview of complex SVG
node .claude/skills/list-elements/index.js output/complex.svg --summary

# Then drill down
node .claude/skills/list-elements/index.js output/complex.svg path
```

## Notes

- Selector hints are shown at the bottom for use with other skills
- Elements are listed in document order
- The first rect is often the background
- IDs are shown with `#` prefix
- Groups show their ID but not contents (use --verbose for more)
- Path data is truncated for readability
- Text content is truncated to 20 characters
