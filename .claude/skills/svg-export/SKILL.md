---
description: Save SVG files to disk and manage output
---

# SVG File Export

## Save to File

```javascript
import { saveSvg, getOutputPath } from './src/index.js';

// Save to output directory
const filepath = getOutputPath('my-artwork.svg');
saveSvg(canvas, filepath);

// Or save to specific path
saveSvg(canvas, './custom/path/artwork.svg');
```

## Timestamped Filenames

```javascript
import { timestampedFilename, getOutputPath, saveSvg } from './src/index.js';

const filename = timestampedFilename('artwork');  // artwork-2024-01-15T10-30-00.svg
saveSvg(canvas, getOutputPath(filename));
```

## Load Existing SVG

```javascript
import { loadSvg, fileExists } from './src/index.js';

if (fileExists('./output/my-art.svg')) {
  const svgContent = loadSvg('./output/my-art.svg');
}
```

## Complete Workflow

```javascript
import {
  createCanvas,
  circle,
  saveSvg,
  getOutputPath,
  timestampedFilename
} from './src/index.js';

// Create artwork
const canvas = createCanvas(400, 400, '#ffffff');
circle(canvas, 200, 200, 100, { fill: '#E53935' });

// Save with unique name
const filename = timestampedFilename('circles');
const filepath = getOutputPath(filename);
saveSvg(canvas, filepath);

console.log(`Saved: ${filepath}`);
```

## Output Directory

All artwork saved via `getOutputPath()` goes to `./output/`:
- Created automatically if missing
- Gitignored to avoid committing generated files
- Use for all generated SVGs
