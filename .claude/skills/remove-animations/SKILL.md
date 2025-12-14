---
description: Remove all SMIL animations from SVG files
---

# Remove Animations

Strips all SMIL animation elements from an SVG file. Useful for creating static versions or preparing SVGs for print/plotter output.

## Usage

```bash
node .claude/skills/remove-animations/index.js <svg-file>
```

## What It Removes

| Element | Purpose |
|---------|---------|
| `<animate>` | Attribute animations |
| `<animateTransform>` | Transform animations (rotate, scale, etc.) |
| `<animateMotion>` | Motion path animations |
| `<set>` | Discrete attribute changes |

## Examples

```bash
# Remove all animations from an SVG
node .claude/skills/remove-animations/index.js output/animated.svg

# Create a static copy first
cp output/animated.svg output/static.svg
node .claude/skills/remove-animations/index.js output/static.svg
```

## Use Cases

- **Print preparation** - Remove animations for static print output
- **Plotter output** - Simplify SVG for pen plotters
- **Performance** - Create lighter static versions
- **Compatibility** - For tools that don't support SMIL

## Notes

- Modifies the file in place
- Creates a backup before running if needed
- Does not remove CSS animations (only SMIL)
- Cleans up whitespace left by removed elements
