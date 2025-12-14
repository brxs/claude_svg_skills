---
description: Remove SVG definitions (gradients, filters, patterns, masks, etc.)
---

# Remove Defs

Removes definition elements from SVG files. Useful for simplifying SVGs, removing effects, or preparing for output devices that don't support advanced features.

## Usage

```bash
node .claude/skills/remove-defs/index.js <svg-file> [options]
```

## Options

| Option | Description |
|--------|-------------|
| `all` | Remove all defs (default) |
| `unused` | Only remove unused definitions |
| `gradients` | Remove only gradients |
| `filters` | Remove only filters |
| `patterns` | Remove only patterns |
| `markers` | Remove only markers |
| `masks` | Remove only masks |
| `clip-paths` | Remove only clip paths |
| `keep-paths` | Keep path definitions (needed for textPath) |

## What It Removes

| Definition Type | Elements |
|----------------|----------|
| Gradients | `<linearGradient>`, `<radialGradient>` |
| Filters | `<filter>` (blur, shadow, glow, etc.) |
| Patterns | `<pattern>` |
| Markers | `<marker>` (arrow heads, dots) |
| Masks | `<mask>` |
| Clip Paths | `<clipPath>` |

## Examples

### Remove All Definitions

```bash
node .claude/skills/remove-defs/index.js output/art.svg
```

### Remove Only Unused Definitions

```bash
node .claude/skills/remove-defs/index.js output/art.svg unused
```

### Remove Specific Types

```bash
# Remove only gradients and filters
node .claude/skills/remove-defs/index.js output/art.svg gradients filters

# Remove only masks
node .claude/skills/remove-defs/index.js output/art.svg masks
```

### Keep Path Definitions

```bash
# Remove all but keep paths (for circular text, etc.)
node .claude/skills/remove-defs/index.js output/art.svg all keep-paths
```

## Use Cases

- **Plotter preparation** - Remove gradients, filters for line-only output
- **Simplification** - Clean up SVG for web performance
- **Compatibility** - Remove features unsupported by target software
- **Cleanup** - Remove unused definitions after editing

## Notes

- Modifies the file in place
- Also removes references to removed defs (filter="url(#...)", etc.)
- Use `keep-paths` to preserve textPath references
- Cleans up empty `<defs>` tags after removal
