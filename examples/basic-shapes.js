import {
  createCanvas,
  circle,
  rectangle,
  regularPolygon,
  line,
  saveSvg,
  getOutputPath
} from '../src/index.js';

// Create a canvas with a light background
const canvas = createCanvas(400, 400, '#FAFAFA');

// Red circle in top-left
circle(canvas, 100, 100, 60, { fill: '#E53935' });

// Blue rectangle in top-right
rectangle(canvas, 180, 60, 120, 80, {
  fill: '#1E88E5',
  cornerRadius: 8
});

// Yellow hexagon in bottom-left
regularPolygon(canvas, 100, 280, 50, 6, { fill: '#FDD835' });

// Black triangle in bottom-right
regularPolygon(canvas, 280, 280, 50, 3, { fill: '#212121' });

// Connecting lines
line(canvas, 100, 100, 240, 100, {
  stroke: { color: '#000', width: 2 }
});
line(canvas, 100, 280, 280, 280, {
  stroke: { color: '#000', width: 2 }
});

// Save the result
const filepath = getOutputPath('basic-shapes.svg');
saveSvg(canvas, filepath);
console.log(`Saved: ${filepath}`);
