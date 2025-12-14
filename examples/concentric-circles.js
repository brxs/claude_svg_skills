import {
  createCanvas,
  concentricCircles,
  PALETTES,
  saveSvg,
  getOutputPath
} from '../src/index.js';

// Create a canvas with dark background
const canvas = createCanvas(400, 400, '#212121');
const palette = PALETTES.bauhaus;

// Create concentric circles with alternating colors
concentricCircles(canvas, 200, 200, 8, 180, {
  fillFn: (i, total) => palette[i % palette.length],
  strokeFn: () => null // No stroke
});

// Save the result
const filepath = getOutputPath('concentric-circles.svg');
saveSvg(canvas, filepath);
console.log(`Saved: ${filepath}`);
