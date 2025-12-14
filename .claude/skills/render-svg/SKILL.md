---
description: Render an SVG file to PNG for viewing
---

# Render SVG

Renders an SVG file to PNG format so it can be viewed.

## Usage

```bash
node .claude/skills/render-svg/index.js <svg-file>
```

## Parameters

- `svg-file` - Path to the SVG file to render

## Output

Creates a PNG file with the same name in the same directory.

## Example

```bash
node .claude/skills/render-svg/index.js output/art.svg
# Creates: output/art.png
```
