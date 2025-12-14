import { circle, rectangle, regularPolygon } from './shapes.js';

/**
 * Create a grid of elements using a callback function for each cell.
 * @param {object} canvas - SVG.js canvas
 * @param {number} cols - Number of columns
 * @param {number} rows - Number of rows
 * @param {number} cellWidth - Width of each cell
 * @param {number} cellHeight - Height of each cell
 * @param {function} callback - Function called for each cell: (canvas, x, y, width, height, row, col) => element
 * @returns {Array} Array of created elements
 */
export function grid(canvas, cols, rows, cellWidth, cellHeight, callback) {
  const elements = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellWidth;
      const y = row * cellHeight;
      const element = callback(canvas, x, y, cellWidth, cellHeight, row, col);
      if (element) elements.push(element);
    }
  }
  return elements;
}

/**
 * Create concentric circles around a center point.
 * @param {object} canvas - SVG.js canvas
 * @param {number} cx - Center X coordinate
 * @param {number} cy - Center Y coordinate
 * @param {number} count - Number of circles
 * @param {number} maxRadius - Radius of the outermost circle
 * @param {object} options - Options with fillFn and/or strokeFn callbacks
 * @returns {Array} Array of circle elements (outermost first)
 */
export function concentricCircles(canvas, cx, cy, count, maxRadius, options = {}) {
  const circles = [];
  const radiusStep = maxRadius / count;

  for (let i = count; i > 0; i--) {
    const radius = i * radiusStep;
    const fill = options.fillFn ? options.fillFn(i, count) : 'none';
    const stroke = options.strokeFn ? options.strokeFn(i, count) : { color: '#000', width: 1 };

    circles.push(circle(canvas, cx, cy, radius, { fill, stroke }));
  }

  return circles;
}

/**
 * Create a radial pattern of shapes around a center point.
 * @param {object} canvas - SVG.js canvas
 * @param {number} cx - Center X coordinate
 * @param {number} cy - Center Y coordinate
 * @param {number} count - Number of shapes to place
 * @param {number} radius - Distance from center to each shape
 * @param {function} shapeFn - Function to create each shape: (canvas, x, y, index, angle) => element
 * @returns {Array} Array of created elements
 */
export function radialPattern(canvas, cx, cy, count, radius, shapeFn) {
  const elements = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    elements.push(shapeFn(canvas, x, y, i, angle));
  }
  return elements;
}

/**
 * Create a checkerboard pattern.
 * @param {object} canvas - SVG.js canvas
 * @param {number} cols - Number of columns
 * @param {number} rows - Number of rows
 * @param {number} cellSize - Size of each cell (square)
 * @param {string} color1 - Color for even cells
 * @param {string} color2 - Color for odd cells
 * @returns {Array} Array of rectangle elements
 */
export function checkerboard(canvas, cols, rows, cellSize, color1, color2) {
  return grid(canvas, cols, rows, cellSize, cellSize, (c, x, y, w, h, row, col) => {
    const isEven = (row + col) % 2 === 0;
    return rectangle(c, x, y, w, h, { fill: isEven ? color1 : color2 });
  });
}

/**
 * Create a spiral pattern of shapes.
 * @param {object} canvas - SVG.js canvas
 * @param {number} cx - Center X coordinate
 * @param {number} cy - Center Y coordinate
 * @param {number} turns - Number of spiral turns
 * @param {number} spacing - Space between spiral arms
 * @param {number} pointsPerTurn - Number of shapes per turn
 * @param {function} shapeFn - Function to create each shape: (canvas, x, y, index, angle, radius) => element
 * @returns {Array} Array of created elements
 */
export function spiralPattern(canvas, cx, cy, turns, spacing, pointsPerTurn, shapeFn) {
  const elements = [];
  const totalPoints = turns * pointsPerTurn;

  for (let i = 0; i < totalPoints; i++) {
    const progress = i / totalPoints;
    const angle = progress * turns * Math.PI * 2;
    const radius = progress * turns * spacing;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    elements.push(shapeFn(canvas, x, y, i, angle, radius));
  }

  return elements;
}

/**
 * Create a hexagonal grid pattern.
 * @param {object} canvas - SVG.js canvas
 * @param {number} cols - Number of columns
 * @param {number} rows - Number of rows
 * @param {number} hexRadius - Radius of each hexagon
 * @param {function} callback - Function called for each hex: (canvas, cx, cy, row, col) => element
 * @returns {Array} Array of created elements
 */
export function hexGrid(canvas, cols, rows, hexRadius, callback) {
  const elements = [];
  const hexWidth = hexRadius * 2;
  const hexHeight = hexRadius * Math.sqrt(3);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offsetX = row % 2 === 1 ? hexRadius : 0;
      const cx = col * hexWidth * 0.75 + hexRadius + offsetX;
      const cy = row * hexHeight * 0.5 + hexRadius;
      const element = callback(canvas, cx, cy, row, col);
      if (element) elements.push(element);
    }
  }

  return elements;
}
