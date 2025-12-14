---
description: Delete elements from existing SVG files
---

# Delete Element

Removes elements from SVG files by selector.

## Usage

```bash
node .claude/skills/delete-element/index.js <svg-file> <selector>
```

## Selectors

| Selector | Target |
|----------|--------|
| `path` | All path elements |
| `path:0` | First path (0-indexed) |
| `path:-1` | Last path |
| `circle:2` | Third circle |
| `text` | All text elements |
| `line` | All line elements |
| `rect` | All rectangle elements |
| `all` | All shape elements |

## Examples

### Delete Specific Element

```bash
# Delete first path
node .claude/skills/delete-element/index.js output/art.svg path:0

# Delete last circle
node .claude/skills/delete-element/index.js output/art.svg circle:-1

# Delete third line
node .claude/skills/delete-element/index.js output/art.svg line:2
```

### Delete All of Type

```bash
# Delete all text labels
node .claude/skills/delete-element/index.js output/art.svg text

# Delete all paths
node .claude/skills/delete-element/index.js output/art.svg path

# Delete all circles
node .claude/skills/delete-element/index.js output/art.svg circle
```

### Delete All Shapes

```bash
# Delete everything (keeps background rect if it's first)
node .claude/skills/delete-element/index.js output/art.svg all
```

## Negative Indexing

Use negative indices to count from the end:

| Index | Meaning |
|-------|---------|
| `:0` | First element |
| `:1` | Second element |
| `:-1` | Last element |
| `:-2` | Second to last |

```bash
# Delete last two paths
node .claude/skills/delete-element/index.js output/art.svg path:-1
node .claude/skills/delete-element/index.js output/art.svg path:-1
```

## Common Workflows

### Clean Up Labels

```bash
# Remove all text annotations
node .claude/skills/delete-element/index.js output/art.svg text
```

### Remove Grid Lines

```bash
# Remove all lines
node .claude/skills/delete-element/index.js output/art.svg line
```

### Start Over (Keep Canvas)

```bash
# Delete all shapes but keep background
node .claude/skills/delete-element/index.js output/art.svg path
node .claude/skills/delete-element/index.js output/art.svg circle
node .claude/skills/delete-element/index.js output/art.svg line
```

## Notes

- Deletion is permanent - no undo
- Elements are matched in document order
- Self-closing (`<path ... />`) and open/close (`<g>...</g>`) formats both supported
- Nested elements (like groups) are fully removed including children
- Background rectangles are typically at index 0
