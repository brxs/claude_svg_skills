---
description: Apply geometric transformations including rotation, scaling, translation, and skewing
---

# SVG Transformations

## Rotation

```javascript
import { rotate } from './src/index.js';

rotate(element, 45);             // 45 degrees around element center
rotate(element, 45, 100, 100);   // 45 degrees around point (100, 100)
```

## Scale

```javascript
import { scale } from './src/index.js';

scale(element, 2);               // Uniform 2x scale
scale(element, 2, 1.5);          // Non-uniform scale
scale(element, 2, 2, cx, cy);    // Scale around specific point
```

## Translate

```javascript
import { translate } from './src/index.js';

translate(element, 50, 25);      // Move right 50, down 25
```

## Skew

```javascript
import { skew } from './src/index.js';

skew(element, 15, 0);            // Skew 15 degrees on X axis
```

## Flip

```javascript
import { flip } from './src/index.js';

flip(element, 'x');    // Horizontal flip
flip(element, 'y');    // Vertical flip
flip(element, 'both'); // Both axes
```

## Grouping

Group elements to transform together:

```javascript
import { group, rotate, scale } from './src/index.js';

const elements = [circle1, circle2, circle3];
const g = group(canvas, elements);
rotate(g, 45);
scale(g, 1.5);
```

## Move & Center

```javascript
import { move, center } from './src/index.js';

move(element, 100, 200);    // Move top-left to (100, 200)
center(element, 200, 200);  // Center element at (200, 200)
```

## Transform Order

Transforms are applied in sequence. Order matters:

```javascript
// Rotate, then translate
rotate(shape, 45);
translate(shape, 100, 0);

// vs Translate, then rotate (different result)
translate(shape, 100, 0);
rotate(shape, 45);
```
