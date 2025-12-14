---
description: Generate geometric patterns including grids, concentric circles, radial patterns, and tiled designs
---

# SVG Pattern Generation

## Grid Pattern

Create a grid and draw in each cell:

```javascript
import { grid, rectangle, circle } from './src/index.js';

grid(canvas, cols, rows, cellWidth, cellHeight, (canvas, x, y, w, h, row, col) => {
  // Return a shape for this cell
  return rectangle(canvas, x + 2, y + 2, w - 4, h - 4, { fill: '#000' });
});
```

Callback receives: `(canvas, x, y, width, height, row, col)`

## Checkerboard

```javascript
import { checkerboard } from './src/index.js';

checkerboard(canvas, 8, 8, 50, '#000000', '#ffffff');
```

## Concentric Circles

```javascript
import { concentricCircles } from './src/index.js';

concentricCircles(canvas, cx, cy, count, maxRadius, {
  fillFn: (i, total) => i % 2 === 0 ? '#E53935' : '#1E88E5',
  strokeFn: (i, total) => ({ color: '#000', width: 1 })
});
```

## Radial Pattern

Place shapes in a circle:

```javascript
import { radialPattern, circle } from './src/index.js';

radialPattern(canvas, cx, cy, 12, radius, (canvas, x, y, i, angle) => {
  return circle(canvas, x, y, 20, { fill: '#FDD835' });
});
```

## Spiral Pattern

```javascript
import { spiralPattern, circle } from './src/index.js';

spiralPattern(canvas, cx, cy, turns, spacing, pointsPerTurn, (canvas, x, y, i, angle, r) => {
  return circle(canvas, x, y, 5, { fill: '#000' });
});
```

## Hexagonal Grid

```javascript
import { hexGrid, regularPolygon } from './src/index.js';

hexGrid(canvas, cols, rows, hexRadius, (canvas, cx, cy, row, col) => {
  return regularPolygon(canvas, cx, cy, hexRadius - 2, 6, { fill: '#E53935' });
});
```
