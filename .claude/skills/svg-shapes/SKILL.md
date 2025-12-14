---
description: Create geometric shapes including circles, rectangles, polygons, and lines
---

# SVG Shape Primitives

All shapes accept an `options` object with:
- `fill` - Color string or gradient
- `stroke` - Object: `{ color, width, opacity, linecap, linejoin }`
- `opacity` - Number 0-1

## Circle

```javascript
import { circle } from './src/index.js';

circle(canvas, cx, cy, radius, { fill: '#ff0000' });
```

## Rectangle

```javascript
import { rectangle } from './src/index.js';

rectangle(canvas, x, y, width, height, {
  fill: '#0000ff',
  cornerRadius: 10  // Optional rounded corners
});
```

## Regular Polygon

Equilateral shapes (triangle, square, pentagon, hexagon, etc.):

```javascript
import { regularPolygon } from './src/index.js';

// Triangle (3 sides)
regularPolygon(canvas, cx, cy, radius, 3, { fill: '#00ff00' });

// Hexagon (6 sides)
regularPolygon(canvas, cx, cy, radius, 6, { fill: '#ffff00' });
```

## Custom Polygon

```javascript
import { polygon } from './src/index.js';

polygon(canvas, [[0,0], [100,0], [50,100]], { fill: '#purple' });
```

## Line

```javascript
import { line } from './src/index.js';

line(canvas, x1, y1, x2, y2, {
  stroke: { color: '#000', width: 2 }
});
```

## Ellipse

```javascript
import { ellipse } from './src/index.js';

ellipse(canvas, cx, cy, rx, ry, { fill: '#orange' });
```

## Path (SVG path data)

```javascript
import { path } from './src/index.js';

path(canvas, 'M 0 0 L 100 100 L 100 0 Z', { fill: '#cyan' });
```
