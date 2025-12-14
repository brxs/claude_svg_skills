---
description: Create and manage SVG canvases for geometric art
---

# SVG Canvas Management

## Creating a Canvas

```javascript
import { createCanvas, getSvgString } from './src/index.js';

// Create canvas: width, height, background color
const canvas = createCanvas(800, 600, '#ffffff');

// Get SVG string when done
const svgOutput = getSvgString(canvas);
```

## Parameters

- `width` - Canvas width in pixels (default: 800)
- `height` - Canvas height in pixels (default: 600)
- `background` - Hex color string or `null` for transparent

## Custom Viewbox

```javascript
canvas.viewbox(0, 0, 100, 100); // Use normalized 0-100 coordinates
```

## Loading Existing SVG

```javascript
import { loadSvgFromString } from './src/index.js';

const svgContent = '<svg>...</svg>';
const canvas = loadSvgFromString(svgContent);
```

## Complete Workflow

```javascript
import { createCanvas, circle, saveSvg, getOutputPath } from './src/index.js';

const canvas = createCanvas(400, 400, '#fff');
circle(canvas, 200, 200, 100, { fill: '#E53935' });
saveSvg(canvas, getOutputPath('artwork.svg'));
```
