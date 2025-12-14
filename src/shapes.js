/**
 * Apply style options to an SVG element.
 * @param {object} element - SVG.js element
 * @param {object} options - Style options
 */
function applyStyles(element, options) {
  if (options.fill !== undefined) element.fill(options.fill);
  if (options.stroke) element.stroke(options.stroke);
  if (options.opacity !== undefined) element.opacity(options.opacity);
  return element;
}

/**
 * Create a circle.
 * @param {object} canvas - SVG.js canvas
 * @param {number} cx - Center X coordinate
 * @param {number} cy - Center Y coordinate
 * @param {number} radius - Circle radius
 * @param {object} options - Style options (fill, stroke, opacity)
 * @returns {object} SVG.js circle element
 */
export function circle(canvas, cx, cy, radius, options = {}) {
  const c = canvas.circle(radius * 2);
  c.center(cx, cy);
  applyStyles(c, options);
  return c;
}

/**
 * Create a rectangle.
 * @param {object} canvas - SVG.js canvas
 * @param {number} x - Top-left X coordinate
 * @param {number} y - Top-left Y coordinate
 * @param {number} width - Rectangle width
 * @param {number} height - Rectangle height
 * @param {object} options - Style options (fill, stroke, opacity, cornerRadius)
 * @returns {object} SVG.js rect element
 */
export function rectangle(canvas, x, y, width, height, options = {}) {
  const r = canvas.rect(width, height).move(x, y);
  if (options.cornerRadius) r.radius(options.cornerRadius);
  applyStyles(r, options);
  return r;
}

/**
 * Create a polygon from an array of points.
 * @param {object} canvas - SVG.js canvas
 * @param {Array} points - Array of [x, y] coordinate pairs
 * @param {object} options - Style options
 * @returns {object} SVG.js polygon element
 */
export function polygon(canvas, points, options = {}) {
  const p = canvas.polygon(points);
  applyStyles(p, options);
  return p;
}

/**
 * Create a regular polygon (equilateral triangle, square, pentagon, hexagon, etc.).
 * @param {object} canvas - SVG.js canvas
 * @param {number} cx - Center X coordinate
 * @param {number} cy - Center Y coordinate
 * @param {number} radius - Distance from center to vertices
 * @param {number} sides - Number of sides (3 = triangle, 4 = square, 6 = hexagon, etc.)
 * @param {object} options - Style options
 * @returns {object} SVG.js polygon element
 */
export function regularPolygon(canvas, cx, cy, radius, sides, options = {}) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    points.push([
      cx + radius * Math.cos(angle),
      cy + radius * Math.sin(angle)
    ]);
  }
  return polygon(canvas, points, options);
}

/**
 * Create a line.
 * @param {object} canvas - SVG.js canvas
 * @param {number} x1 - Start X coordinate
 * @param {number} y1 - Start Y coordinate
 * @param {number} x2 - End X coordinate
 * @param {number} y2 - End Y coordinate
 * @param {object} options - Style options (stroke is the most relevant)
 * @returns {object} SVG.js line element
 */
export function line(canvas, x1, y1, x2, y2, options = {}) {
  const l = canvas.line(x1, y1, x2, y2);
  applyStyles(l, options);
  return l;
}

/**
 * Create a polyline from an array of points.
 * @param {object} canvas - SVG.js canvas
 * @param {Array} points - Array of [x, y] coordinate pairs
 * @param {object} options - Style options
 * @returns {object} SVG.js polyline element
 */
export function polyline(canvas, points, options = {}) {
  const pl = canvas.polyline(points);
  applyStyles(pl, options);
  return pl;
}

/**
 * Create an ellipse.
 * @param {object} canvas - SVG.js canvas
 * @param {number} cx - Center X coordinate
 * @param {number} cy - Center Y coordinate
 * @param {number} rx - Horizontal radius
 * @param {number} ry - Vertical radius
 * @param {object} options - Style options
 * @returns {object} SVG.js ellipse element
 */
export function ellipse(canvas, cx, cy, rx, ry, options = {}) {
  const e = canvas.ellipse(rx * 2, ry * 2);
  e.center(cx, cy);
  applyStyles(e, options);
  return e;
}

/**
 * Create a path from SVG path data.
 * @param {object} canvas - SVG.js canvas
 * @param {string} pathData - SVG path data string (e.g., "M 0 0 L 100 100")
 * @param {object} options - Style options
 * @returns {object} SVG.js path element
 */
export function path(canvas, pathData, options = {}) {
  const p = canvas.path(pathData);
  applyStyles(p, options);
  return p;
}
