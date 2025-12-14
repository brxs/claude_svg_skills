---
description: Add text that follows a path (curved, circular, wavy text)
---

# Add Text Path

Adds text that follows along a path - perfect for curved text, circular labels, wavy effects, and text along custom shapes.

## Usage

```bash
node .claude/skills/add-textPath/index.js <svg-file> <mode> <text> [...args] [options]
```

## Modes

| Mode | Arguments | Description |
|------|-----------|-------------|
| `path` | path-id | Follow an existing path |
| `circle` | cx cy r | Text around a circle |
| `arc` | cx cy r start end | Text along an arc (degrees) |
| `wave` | y amplitude freq | Wavy text |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `font-size` | 16 | Font size |
| `fill` | #000 | Text color |
| `font-family` | sans-serif | Font family |
| `font-weight` | - | Font weight |
| `letter-spacing` | - | Space between letters |
| `offset` | 0 | Start offset along path (%, px) |
| `side` | left | Side of path (left/right) |
| `id` | - | ID for the text element |

## Examples

### Circular Text

```bash
# Text around a circle
node .claude/skills/add-textPath/index.js output/art.svg circle "Around and around we go" 200 200 100

# Smaller circle, styled
node .claude/skills/add-textPath/index.js output/art.svg circle "LOGO TEXT" 200 200 80 font-size=20 font-weight=bold letter-spacing=3

# Large outer ring
node .claude/skills/add-textPath/index.js output/art.svg circle "Circular text is fun" 200 200 180 font-size=14
```

### Arc Text

```bash
# Top half arc (180° to 360°)
node .claude/skills/add-textPath/index.js output/art.svg arc "Top Arc Text" 200 200 120 180 360

# Bottom half arc (0° to 180°)
node .claude/skills/add-textPath/index.js output/art.svg arc "Bottom Arc" 200 200 120 0 180

# Quarter arc
node .claude/skills/add-textPath/index.js output/art.svg arc "Quarter" 200 200 100 0 90

# Three-quarter arc
node .claude/skills/add-textPath/index.js output/art.svg arc "Almost full circle" 200 200 100 45 315
```

### Wavy Text

```bash
# Gentle wave
node .claude/skills/add-textPath/index.js output/art.svg wave "Wavy text flows smoothly" 200 15 0.03

# Choppy wave
node .claude/skills/add-textPath/index.js output/art.svg wave "Bouncy text!" 150 30 0.08

# Subtle wave
node .claude/skills/add-textPath/index.js output/art.svg wave "Subtle undulation" 300 8 0.02
```

### Follow Existing Path

```bash
# First, give a path an ID
node .claude/skills/edit-element/index.js output/art.svg path:0 id myPath

# Then add text along it
node .claude/skills/add-textPath/index.js output/art.svg path "Following the path" myPath
```

### Styled Text Paths

```bash
# Bold red circular text
node .claude/skills/add-textPath/index.js output/art.svg circle "IMPORTANT" 200 200 100 font-size=24 fill=#E53935 font-weight=bold

# Spaced out letters
node .claude/skills/add-textPath/index.js output/art.svg circle "S P A C E D" 200 200 120 letter-spacing=10

# With offset (start partway along)
node .claude/skills/add-textPath/index.js output/art.svg circle "Offset start" 200 200 100 offset=25%
```

## Arc Angles

Angles are measured from the top (12 o'clock position):

```
        0° (top)
         |
270° ----+---- 90°
         |
       180° (bottom)
```

| Start → End | Result |
|-------------|--------|
| 180 → 360 | Top half (smile) |
| 0 → 180 | Bottom half |
| 270 → 90 | Right half |
| 90 → 270 | Left half |
| 0 → 90 | Bottom-right quarter |

## Wave Parameters

| Parameter | Effect |
|-----------|--------|
| `y` | Vertical center position |
| `amplitude` | Wave height (larger = taller waves) |
| `frequency` | Wave density (larger = more waves) |

```bash
# Tall, sparse waves
node .claude/skills/add-textPath/index.js output/art.svg wave "Big waves" 200 40 0.02

# Short, dense waves
node .claude/skills/add-textPath/index.js output/art.svg wave "Ripples" 200 10 0.1
```

## Common Workflows

### Logo Badge

```bash
# Outer ring text
node .claude/skills/add-textPath/index.js output/logo.svg arc "ESTABLISHED" 200 200 150 200 340 font-size=14 letter-spacing=2

# Inner ring text (bottom)
node .claude/skills/add-textPath/index.js output/logo.svg arc "SINCE 2024" 200 200 150 20 160 font-size=14 letter-spacing=2
```

### Curved Header

```bash
# Slight arc for header
node .claude/skills/add-textPath/index.js output/art.svg arc "Welcome to My Site" 200 300 250 210 330 font-size=28
```

### Decorative Wave

```bash
# Wavy decorative text
node .claude/skills/add-textPath/index.js output/art.svg wave "~ flowing text ~" 350 12 0.04 fill=#666 font-style=italic
```

### Text Along Custom Shape

```bash
# Create a curved path
node .claude/skills/add-path/index.js output/art.svg "M50,200 Q200,50 350,200" stroke=none
node .claude/skills/edit-element/index.js output/art.svg path:-1 id curvePath

# Add text along it
node .claude/skills/add-textPath/index.js output/art.svg path "Following the curve" curvePath font-size=18
```

## Notes

- Text flows in the direction the path is drawn
- `circle` mode creates a clockwise path starting from the left
- Arc angles are in degrees, measured from top (0°)
- The path used for text is invisible (no stroke/fill)
- Use `offset` to position text start point
- `letter-spacing` helps with readability on curves
- Long text may overflow the path length
- Paths are stored in `<defs>` when auto-generated
