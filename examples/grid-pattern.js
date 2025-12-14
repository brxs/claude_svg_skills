import {
  createCanvas,
  grid,
  rectangle,
  circle,
  randomFromPalette,
  saveSvg,
  getOutputPath
} from '../src/index.js';

// Create a canvas
const canvas = createCanvas(500, 500, '#FFFFFF');

// Create a grid with random shapes
grid(canvas, 5, 5, 100, 100, (canvas, x, y, w, h, row, col) => {
  const color = randomFromPalette('bauhaus');
  const shapeType = Math.random();

  if (shapeType < 0.5) {
    // Rectangle with margin
    return rectangle(canvas, x + 5, y + 5, w - 10, h - 10, { fill: color });
  } else {
    // Centered circle
    return circle(canvas, x + w / 2, y + h / 2, (w - 10) / 2, { fill: color });
  }
});

// Save the result
const filepath = getOutputPath('grid-pattern.svg');
saveSvg(canvas, filepath);
console.log(`Saved: ${filepath}`);
