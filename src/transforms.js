/**
 * Rotate an element by the given degrees.
 * @param {object} element - SVG.js element
 * @param {number} degrees - Rotation angle in degrees
 * @param {number} cx - Optional center X for rotation
 * @param {number} cy - Optional center Y for rotation
 * @returns {object} The element (for chaining)
 */
export function rotate(element, degrees, cx, cy) {
  if (cx !== undefined && cy !== undefined) {
    element.rotate(degrees, cx, cy);
  } else {
    element.rotate(degrees);
  }
  return element;
}

/**
 * Scale an element.
 * @param {object} element - SVG.js element
 * @param {number} sx - Scale factor for X axis
 * @param {number} sy - Scale factor for Y axis (defaults to sx for uniform scaling)
 * @param {number} cx - Optional center X for scaling
 * @param {number} cy - Optional center Y for scaling
 * @returns {object} The element (for chaining)
 */
export function scale(element, sx, sy, cx, cy) {
  element.scale(sx, sy ?? sx, cx, cy);
  return element;
}

/**
 * Translate (move) an element by the given offset.
 * @param {object} element - SVG.js element
 * @param {number} dx - Horizontal offset
 * @param {number} dy - Vertical offset
 * @returns {object} The element (for chaining)
 */
export function translate(element, dx, dy) {
  element.translate(dx, dy);
  return element;
}

/**
 * Skew an element.
 * @param {object} element - SVG.js element
 * @param {number} ax - Skew angle on X axis in degrees
 * @param {number} ay - Skew angle on Y axis in degrees (default: 0)
 * @returns {object} The element (for chaining)
 */
export function skew(element, ax, ay) {
  element.skew(ax, ay ?? 0);
  return element;
}

/**
 * Flip an element horizontally or vertically.
 * @param {object} element - SVG.js element
 * @param {string} axis - 'x' for horizontal, 'y' for vertical, 'both' for both
 * @returns {object} The element (for chaining)
 */
export function flip(element, axis) {
  if (axis === 'both') {
    element.flip('x');
    element.flip('y');
  } else {
    element.flip(axis);
  }
  return element;
}

/**
 * Group multiple elements together for unified transformations.
 * @param {object} canvas - SVG.js canvas
 * @param {Array} elements - Array of SVG.js elements to group
 * @returns {object} SVG.js group element
 */
export function group(canvas, elements) {
  const g = canvas.group();
  elements.forEach(el => g.add(el));
  return g;
}

/**
 * Move an element to a specific position.
 * @param {object} element - SVG.js element
 * @param {number} x - New X coordinate
 * @param {number} y - New Y coordinate
 * @returns {object} The element (for chaining)
 */
export function move(element, x, y) {
  element.move(x, y);
  return element;
}

/**
 * Center an element at a specific position.
 * @param {object} element - SVG.js element
 * @param {number} cx - Center X coordinate
 * @param {number} cy - Center Y coordinate
 * @returns {object} The element (for chaining)
 */
export function center(element, cx, cy) {
  element.center(cx, cy);
  return element;
}

/**
 * Reset all transformations on an element.
 * @param {object} element - SVG.js element
 * @returns {object} The element (for chaining)
 */
export function resetTransform(element) {
  element.transform({});
  return element;
}
