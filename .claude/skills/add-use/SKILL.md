---
description: Reference and reuse existing SVG elements with <use>
---

# Add Use

Creates `<use>` elements that reference and reuse existing SVG elements. This allows instancing - creating multiple copies of an element without duplicating the SVG code.

## Usage

```bash
node .claude/skills/add-use/index.js <svg-file> <ref-id> <x> <y> [options]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `ref-id` | ID of element to reference (without #) |
| `x` | Horizontal offset |
| `y` | Vertical offset |

## Options

| Option | Description |
|--------|-------------|
| `width` | Override width |
| `height` | Override height |
| `transform` | Apply transform |
| `opacity` | Instance opacity |
| `fill` | Override fill color |
| `stroke` | Override stroke color |
| `id` | Give this instance an ID |

## Basic Workflow

### Step 1: Give Element an ID

First, add an ID to the element you want to reuse:

```bash
# Add ID to first circle
node .claude/skills/edit-element/index.js output/art.svg circle:0 id myCircle
```

### Step 2: Create Instances

Then create instances using `<use>`:

```bash
# Create instance at offset (100, 0)
node .claude/skills/add-use/index.js output/art.svg myCircle 100 0

# Create another at (200, 0)
node .claude/skills/add-use/index.js output/art.svg myCircle 200 0

# Create one with transform
node .claude/skills/add-use/index.js output/art.svg myCircle 0 100 transform="scale(0.5)"
```

## Examples

### Multiple Copies

```bash
# Create original shape
node .claude/skills/add-circle/index.js output/art.svg 50 50 20 fill=#E53935
node .claude/skills/edit-element/index.js output/art.svg circle:0 id dot

# Create grid of copies
node .claude/skills/add-use/index.js output/art.svg dot 50 0
node .claude/skills/add-use/index.js output/art.svg dot 100 0
node .claude/skills/add-use/index.js output/art.svg dot 0 50
node .claude/skills/add-use/index.js output/art.svg dot 50 50
node .claude/skills/add-use/index.js output/art.svg dot 100 50
```

### Transformed Copies

```bash
# Original
node .claude/skills/edit-element/index.js output/art.svg path:0 id myPath

# Rotated copies
node .claude/skills/add-use/index.js output/art.svg myPath 0 0 transform="rotate(45 200 200)"
node .claude/skills/add-use/index.js output/art.svg myPath 0 0 transform="rotate(90 200 200)"
node .claude/skills/add-use/index.js output/art.svg myPath 0 0 transform="rotate(135 200 200)"
```

### Scaled Copies

```bash
# Original shape
node .claude/skills/edit-element/index.js output/art.svg rect:0 id box

# Different sized copies
node .claude/skills/add-use/index.js output/art.svg box 0 0 transform="scale(0.5)"
node .claude/skills/add-use/index.js output/art.svg box 0 0 transform="scale(1.5)"
node .claude/skills/add-use/index.js output/art.svg box 0 0 transform="scale(2)"
```

### Styled Instances

```bash
# Original
node .claude/skills/edit-element/index.js output/art.svg circle:0 id baseCircle

# Instances with different opacity
node .claude/skills/add-use/index.js output/art.svg baseCircle 50 0 opacity=0.8
node .claude/skills/add-use/index.js output/art.svg baseCircle 100 0 opacity=0.6
node .claude/skills/add-use/index.js output/art.svg baseCircle 150 0 opacity=0.4
```

### Reusing Groups

```bash
# Create a group
node .claude/skills/add-group/index.js output/art.svg circle:0,rect:0 myGroup

# Edit the group to have an ID (groups get IDs automatically)
# Create instances of the entire group
node .claude/skills/add-use/index.js output/art.svg myGroup 100 0
node .claude/skills/add-use/index.js output/art.svg myGroup 200 0
```

## Common Patterns

### Radial Copies

```bash
# Create petal shape and give it ID
node .claude/skills/edit-element/index.js output/art.svg path:0 id petal

# Create rotated copies around center
for angle in 0 60 120 180 240 300; do
  node .claude/skills/add-use/index.js output/art.svg petal 0 0 transform="rotate($angle 200 200)"
done
```

### Border Pattern

```bash
# Create corner element
node .claude/skills/edit-element/index.js output/art.svg path:0 id corner

# Place at four corners
node .claude/skills/add-use/index.js output/art.svg corner 0 0
node .claude/skills/add-use/index.js output/art.svg corner 0 0 transform="rotate(90 200 200)"
node .claude/skills/add-use/index.js output/art.svg corner 0 0 transform="rotate(180 200 200)"
node .claude/skills/add-use/index.js output/art.svg corner 0 0 transform="rotate(270 200 200)"
```

### Icon Library

```bash
# Add IDs to icon shapes
node .claude/skills/edit-element/index.js output/icons.svg path:0 id iconStar
node .claude/skills/edit-element/index.js output/icons.svg path:1 id iconHeart
node .claude/skills/edit-element/index.js output/icons.svg path:2 id iconCheck

# Use icons in another SVG (same file)
node .claude/skills/add-use/index.js output/icons.svg iconStar 10 10 width=20 height=20
node .claude/skills/add-use/index.js output/icons.svg iconHeart 40 10 width=20 height=20
```

## Understanding Position

The `x` and `y` values offset the instance from where the original element is:

- Original at (100, 100), use with x=50, y=0 → Instance appears at (150, 100)
- Original at (0, 0), use with x=200, y=200 → Instance appears at (200, 200)

For elements not at origin, you may need to account for their original position.

## Notes

- Referenced element must have an `id` attribute
- Changes to original element affect all `<use>` instances
- `<use>` inherits styles but can override some (fill, stroke, opacity)
- Position (x, y) is relative offset from original
- Transforms on `<use>` apply after the offset
- Works with any element: shapes, groups, even other `<use>` elements
- For complex reusable components, consider using `<symbol>` in `<defs>`
- The `href` attribute (not `xlink:href`) is used for modern SVG
