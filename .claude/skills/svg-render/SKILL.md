---
description: Render SVG to PNG images for visual inspection and feedback
---

# SVG Rendering

Render SVGs to PNG format so Claude can view the result and provide feedback.

## Quick Save and Render

The easiest way - saves both SVG and PNG:

```javascript
import { createCanvas, circle, saveAndRender } from './src/index.js';

const canvas = createCanvas(400, 400, '#fff');
circle(canvas, 200, 200, 100, { fill: '#E53935' });

const { svg, png } = await saveAndRender(canvas, 'my-artwork');
console.log(`SVG: ${svg}`);
console.log(`PNG: ${png}`);
```

## Render Canvas to PNG

```javascript
import { renderToPng } from './src/index.js';

await renderToPng(canvas, './output/artwork.png');

// With scale factor (2x for higher resolution)
await renderToPng(canvas, './output/artwork-hd.png', { scale: 2 });
```

## Render Existing SVG File

```javascript
import { renderSvgFileToPng } from './src/index.js';

// Converts artwork.svg to artwork.png
await renderSvgFileToPng('./output/artwork.svg');

// Or specify output path
await renderSvgFileToPng('./output/artwork.svg', './output/preview.png');
```

## Get PNG as Buffer

For programmatic use without saving to disk:

```javascript
import { renderToBuffer, renderSvgStringToBuffer } from './src/index.js';

// From canvas
const buffer = await renderToBuffer(canvas);

// From SVG string
const buffer = await renderSvgStringToBuffer('<svg>...</svg>');
```

## Workflow for Visual Feedback

1. Create artwork with `createCanvas` and shapes
2. Use `saveAndRender` to save both SVG and PNG
3. Claude reads the PNG file to see the result
4. Iterate based on visual feedback

```javascript
import {
  createCanvas,
  circle,
  saveAndRender,
  getOutputPath
} from './src/index.js';

const canvas = createCanvas(400, 400, '#1a1a2e');
circle(canvas, 200, 200, 150, { fill: '#E53935' });

const { png } = await saveAndRender(canvas, 'draft');
console.log(`Rendered to: ${png}`);
// Claude can now read this PNG and provide feedback
```
