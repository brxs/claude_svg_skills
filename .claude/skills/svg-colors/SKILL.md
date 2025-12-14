---
description: Work with colors, palettes, and gradients for SVG art
---

# SVG Colors and Gradients

## Built-in Palettes

```javascript
import { PALETTES, randomFromPalette, pickColors } from './src/index.js';

// Get a random color
const color = randomFromPalette('bauhaus');

// Pick N distinct colors
const [c1, c2, c3] = pickColors('mondrian', 3);
```

## Available Palettes

| Name | Colors |
|------|--------|
| bauhaus | `#E53935, #1E88E5, #FDD835, #212121, #FAFAFA` |
| mondrian | `#D40920, #1356A2, #F7D842, #FFFFFF, #000000` |
| pastel | `#FFB3BA, #FFDFBA, #FFFFBA, #BAFFC9, #BAE1FF` |
| earth | `#8B4513, #D2691E, #F4A460, #DEB887, #BC8F8F` |
| ocean | `#001F3F, #0074D9, #7FDBFF, #39CCCC, #01FF70` |
| sunset | `#FF6B6B, #FFA07A, #FFD93D, #6BCB77, #4D96FF` |
| nordic | `#2E4057, #048A81, #54C6EB, #8EE3EF, #F7F7F7` |
| retro | `#F72585, #7209B7, #3A0CA3, #4361EE, #4CC9F0` |
| forest | `#2D6A4F, #40916C, #52B788, #74C69D, #95D5B2` |
| grayscale | `#000000, #333333, #666666, #999999, #CCCCCC, #FFFFFF` |

## Linear Gradient

```javascript
import { linearGradient } from './src/index.js';

const gradient = linearGradient(canvas, 0, 0, 1, 1, [
  { offset: 0, color: '#ff0000' },
  { offset: 0.5, color: '#00ff00' },
  { offset: 1, color: '#0000ff' }
]);

circle(canvas, 200, 200, 100, { fill: gradient });
```

## Radial Gradient

```javascript
import { radialGradient } from './src/index.js';

const gradient = radialGradient(canvas, [
  { offset: 0, color: '#ffffff' },
  { offset: 1, color: '#000000' }
]);
```

## Color Interpolation

```javascript
import { lerpColor, colorScale } from './src/index.js';

// Single interpolation
const midColor = lerpColor('#ff0000', '#0000ff', 0.5);

// Create a scale function
const scale = colorScale('#ff0000', '#0000ff');
const color = scale(0.3);  // 30% between red and blue
```

## Color Conversion

```javascript
import { hexToRgb, rgbToHex } from './src/index.js';

const rgb = hexToRgb('#ff0000');  // { r: 255, g: 0, b: 0 }
const hex = rgbToHex(255, 0, 0);  // '#ff0000'
```
