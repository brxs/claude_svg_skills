/**
 * Built-in color palettes for geometric art.
 */
export const PALETTES = {
  bauhaus: ['#E53935', '#1E88E5', '#FDD835', '#212121', '#FAFAFA'],
  mondrian: ['#D40920', '#1356A2', '#F7D842', '#FFFFFF', '#000000'],
  pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
  earth: ['#8B4513', '#D2691E', '#F4A460', '#DEB887', '#BC8F8F'],
  ocean: ['#001F3F', '#0074D9', '#7FDBFF', '#39CCCC', '#01FF70'],
  sunset: ['#FF6B6B', '#FFA07A', '#FFD93D', '#6BCB77', '#4D96FF'],
  nordic: ['#2E4057', '#048A81', '#54C6EB', '#8EE3EF', '#F7F7F7'],
  retro: ['#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0'],
  forest: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'],
  grayscale: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF']
};

/**
 * Get a random color from a named palette.
 * @param {string} paletteName - Name of the palette
 * @returns {string} Random hex color from the palette
 */
export function randomFromPalette(paletteName) {
  const palette = PALETTES[paletteName] || PALETTES.bauhaus;
  return palette[Math.floor(Math.random() * palette.length)];
}

/**
 * Pick N distinct colors from a palette.
 * @param {string} paletteName - Name of the palette
 * @param {number} count - Number of colors to pick
 * @returns {Array} Array of hex color strings
 */
export function pickColors(paletteName, count) {
  const palette = PALETTES[paletteName] || PALETTES.bauhaus;
  const shuffled = [...palette].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, palette.length));
}

/**
 * Create a linear gradient.
 * @param {object} canvas - SVG.js canvas
 * @param {number} x1 - Start X (0-1)
 * @param {number} y1 - Start Y (0-1)
 * @param {number} x2 - End X (0-1)
 * @param {number} y2 - End Y (0-1)
 * @param {Array} stops - Array of {offset, color, opacity} objects
 * @returns {object} SVG.js gradient object
 */
export function linearGradient(canvas, x1, y1, x2, y2, stops) {
  return canvas.gradient('linear', function (add) {
    stops.forEach(stop => {
      add.stop(stop.offset, stop.color, stop.opacity);
    });
  }).from(x1, y1).to(x2, y2);
}

/**
 * Create a radial gradient.
 * @param {object} canvas - SVG.js canvas
 * @param {Array} stops - Array of {offset, color, opacity} objects
 * @returns {object} SVG.js gradient object
 */
export function radialGradient(canvas, stops) {
  return canvas.gradient('radial', function (add) {
    stops.forEach(stop => {
      add.stop(stop.offset, stop.color, stop.opacity);
    });
  });
}

/**
 * Create an SVG pattern for fills.
 * @param {object} canvas - SVG.js canvas
 * @param {number} width - Pattern width
 * @param {number} height - Pattern height
 * @param {function} drawFn - Function to draw pattern: (pattern, width, height) => void
 * @returns {object} SVG.js pattern object
 */
export function createPattern(canvas, width, height, drawFn) {
  return canvas.pattern(width, height, function (add) {
    drawFn(add, width, height);
  });
}

/**
 * Convert hex color to RGB object.
 * @param {string} hex - Hex color string (e.g., '#FF0000')
 * @returns {object} Object with r, g, b properties (0-255)
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB values to hex color string.
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color string
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Interpolate between two colors.
 * @param {string} color1 - Start color (hex)
 * @param {string} color2 - End color (hex)
 * @param {number} t - Interpolation factor (0-1)
 * @returns {string} Interpolated hex color
 */
export function lerpColor(color1, color2, t) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  return rgbToHex(
    c1.r + (c2.r - c1.r) * t,
    c1.g + (c2.g - c1.g) * t,
    c1.b + (c2.b - c1.b) * t
  );
}

/**
 * Generate a color scale function between two colors.
 * @param {string} color1 - Start color (hex)
 * @param {string} color2 - End color (hex)
 * @returns {function} Function that takes t (0-1) and returns interpolated color
 */
export function colorScale(color1, color2) {
  return (t) => lerpColor(color1, color2, t);
}
