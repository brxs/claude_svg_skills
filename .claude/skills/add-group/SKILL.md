---
description: Group SVG elements together for collective transforms and styling
---

# Add Group

Groups SVG elements into a `<g>` element for collective transformations, shared styling, and organization.

## Usage

```bash
node .claude/skills/add-group/index.js <svg-file> <selector> <group-id> [options]
```

## Selectors

| Selector | Description |
|----------|-------------|
| `path` | All path elements |
| `circle` | All circle elements |
| `path,circle` | Multiple types |
| `path:0` | First path |
| `path:0,path:1` | Specific elements |
| `path:1-3` | Range (indices 1, 2, 3) |
| `all` | All shape elements |

## Options

| Option | Description |
|--------|-------------|
| `transform` | Apply transform to group |
| `opacity` | Group opacity (0-1) |
| `fill` | Default fill color |
| `stroke` | Default stroke color |
| `stroke-width` | Default stroke width |

## Examples

### Group by Type

```bash
# Group all paths
node .claude/skills/add-group/index.js output/art.svg path pathGroup

# Group all circles
node .claude/skills/add-group/index.js output/art.svg circle circleGroup

# Group multiple types
node .claude/skills/add-group/index.js output/art.svg path,circle shapesGroup
```

### Group Specific Elements

```bash
# Group first two circles
node .claude/skills/add-group/index.js output/art.svg circle:0,circle:1 twoCircles

# Group using range
node .claude/skills/add-group/index.js output/art.svg path:0-2 firstThreePaths

# Group last element
node .claude/skills/add-group/index.js output/art.svg path:-1 lastPath
```

### Group with Transform

```bash
# Group and rotate
node .claude/skills/add-group/index.js output/art.svg circle circleGroup transform="rotate(45 200 200)"

# Group and scale
node .claude/skills/add-group/index.js output/art.svg path pathGroup transform="scale(1.5)"

# Group and translate
node .claude/skills/add-group/index.js output/art.svg rect rectGroup transform="translate(50 50)"
```

### Group with Styling

```bash
# Group with opacity
node .claude/skills/add-group/index.js output/art.svg path fadedPaths opacity=0.5

# Group with shared fill
node .claude/skills/add-group/index.js output/art.svg circle redCircles fill=#E53935

# Group with shared stroke
node .claude/skills/add-group/index.js output/art.svg line lineGroup stroke=#333 stroke-width=2
```

### Group Everything

```bash
# Group all shapes
node .claude/skills/add-group/index.js output/art.svg all everything

# Group all and transform
node .claude/skills/add-group/index.js output/art.svg all content transform="rotate(15 200 200)"
```

## Working with Groups

### Transform Groups Later

After creating a group, use apply-transform:

```bash
# Create group
node .claude/skills/add-group/index.js output/art.svg circle circles

# Transform the group
node .claude/skills/apply-transform/index.js output/art.svg g:0 rotate 45 200 200
```

### Style Groups Later

Use edit-element to modify group attributes:

```bash
# Change group opacity
node .claude/skills/edit-element/index.js output/art.svg g:0 opacity 0.7

# Add filter to group
node .claude/skills/edit-element/index.js output/art.svg g:0 filter "url(#shadow)"

# Add clip path to group
node .claude/skills/edit-element/index.js output/art.svg g:0 clip-path "url(#clipCircle)"
```

## Common Workflows

### Rotate Multiple Elements Together

```bash
# Group elements
node .claude/skills/add-group/index.js output/art.svg path:0,circle:0 combo

# Rotate as unit
node .claude/skills/apply-transform/index.js output/art.svg g:0 rotate 30 200 200
```

### Apply Effect to Multiple Elements

```bash
# Create shadow filter
node .claude/skills/add-filter/index.js output/art.svg drop-shadow shadow

# Group elements
node .claude/skills/add-group/index.js output/art.svg circle,rect shapes

# Apply filter to group
node .claude/skills/edit-element/index.js output/art.svg g:0 filter "url(#shadow)"
```

### Fade Multiple Elements

```bash
# Group elements
node .claude/skills/add-group/index.js output/art.svg path:2-5 backgroundPaths

# Set group opacity
node .claude/skills/edit-element/index.js output/art.svg g:0 opacity 0.3
```

### Clip Multiple Elements

```bash
# Create clip path
node .claude/skills/add-clip-path/index.js output/art.svg circle clipMask 200 200 150

# Group elements
node .claude/skills/add-group/index.js output/art.svg all content

# Apply clip
node .claude/skills/edit-element/index.js output/art.svg g:0 clip-path "url(#clipMask)"
```

## Notes

- Groups are `<g>` elements that contain other elements
- Transforms on groups apply to all children
- Group styles act as defaults (children can override)
- Groups are placed at the end of the SVG (front layer)
- Use layer-order to reposition groups if needed
- Elements are removed from original positions when grouped
- Group IDs should be unique
- Reference groups with `g:0`, `g:1`, etc. in other skills
