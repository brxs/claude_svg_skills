---
description: Add marker definitions (arrows, dots, etc.) for lines and paths
---

# Add Marker

Adds marker definitions to SVG files for use as arrowheads, endpoints, or vertex markers on lines and paths.

## Usage

```bash
node .claude/skills/add-marker/index.js <svg-file> <type> <id> [options]
```

## Marker Types

| Type | Description |
|------|-------------|
| `arrow` | Arrowhead pointing forward |
| `arrow-reverse` | Arrowhead pointing backward |
| `dot` | Filled circle |
| `circle-open` | Open circle (stroke only) |
| `square` | Filled square |
| `diamond` | Filled diamond |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `size` | 6 | Marker size in pixels |
| `fill` | #000 | Fill color |
| `stroke` | none | Stroke color |

## Examples

### Create Markers

```bash
# Basic arrow
node .claude/skills/add-marker/index.js output/art.svg arrow arrowEnd

# Colored arrow
node .claude/skills/add-marker/index.js output/art.svg arrow redArrow fill=#E53935

# Large dot
node .claude/skills/add-marker/index.js output/art.svg dot bigDot fill=#1E88E5 size=10

# Diamond marker
node .claude/skills/add-marker/index.js output/art.svg diamond diamondMark fill=#FDD835
```

### Apply to Elements

After creating markers, apply them using edit-element:

```bash
# Arrow at end of line
node .claude/skills/edit-element/index.js output/art.svg line marker-end "url(#arrowEnd)"

# Arrow at start
node .claude/skills/edit-element/index.js output/art.svg line marker-start "url(#arrowEnd)"

# Dots at both ends
node .claude/skills/edit-element/index.js output/art.svg line marker-start "url(#bigDot)"
node .claude/skills/edit-element/index.js output/art.svg line marker-end "url(#bigDot)"

# Markers at path vertices
node .claude/skills/edit-element/index.js output/art.svg path marker-mid "url(#diamondMark)"
```

## Marker Positions

| Attribute | Position |
|-----------|----------|
| `marker-start` | Beginning of line/path |
| `marker-end` | End of line/path |
| `marker-mid` | Middle vertices (path only) |

## Common Workflows

### Arrows for Flowcharts

```bash
# Create arrow marker
node .claude/skills/add-marker/index.js output/flow.svg arrow flowArrow fill=#333

# Add lines with arrows
node .claude/skills/add-line/index.js output/flow.svg 100 100 200 100 stroke=#333
node .claude/skills/edit-element/index.js output/flow.svg line:-1 marker-end "url(#flowArrow)"
```

### Graph with Data Points

```bash
# Create dot marker
node .claude/skills/add-marker/index.js output/graph.svg dot dataPoint fill=#E53935 size=8

# Apply to path
node .claude/skills/edit-element/index.js output/graph.svg path marker-start "url(#dataPoint)"
node .claude/skills/edit-element/index.js output/graph.svg path marker-mid "url(#dataPoint)"
node .claude/skills/edit-element/index.js output/graph.svg path marker-end "url(#dataPoint)"
```

### Bidirectional Arrow

```bash
# Create forward and backward arrows
node .claude/skills/add-marker/index.js output/art.svg arrow arrowFwd fill=#000
node .claude/skills/add-marker/index.js output/art.svg arrow-reverse arrowBack fill=#000

# Apply both to line
node .claude/skills/edit-element/index.js output/art.svg line marker-start "url(#arrowBack)"
node .claude/skills/edit-element/index.js output/art.svg line marker-end "url(#arrowFwd)"
```

### Styled Connectors

```bash
# Open circles for connection points
node .claude/skills/add-marker/index.js output/art.svg circle-open connector fill=#666 size=8

# Apply to lines
node .claude/skills/edit-element/index.js output/art.svg line marker-start "url(#connector)"
node .claude/skills/edit-element/index.js output/art.svg line marker-end "url(#connector)"
```

## Notes

- Markers are stored in `<defs>` section
- Marker size scales with stroke-width (markerUnits="strokeWidth")
- Reference markers with `url(#id)` syntax
- Markers auto-orient to follow line/path direction
- Create multiple markers with different IDs for varied styles
