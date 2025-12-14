import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';

/**
 * Create a new SVG canvas with the given dimensions.
 * @param {number} width - Canvas width in pixels (default: 800)
 * @param {number} height - Canvas height in pixels (default: 600)
 * @param {string|null} background - Background color (hex string) or null for transparent
 * @returns {object} SVG.js canvas instance
 */
export function createCanvas(width = 800, height = 600, background = null) {
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  const canvas = SVG(document.documentElement);
  canvas.size(width, height);
  canvas.viewbox(0, 0, width, height);

  if (background) {
    canvas.rect(width, height).fill(background);
  }

  return canvas;
}

/**
 * Get the SVG string representation of the canvas.
 * @param {object} canvas - SVG.js canvas instance
 * @returns {string} SVG markup string
 */
export function getSvgString(canvas) {
  return canvas.svg();
}

/**
 * Parse an SVG string and return a canvas for manipulation.
 * @param {string} svgString - SVG markup to parse
 * @returns {object} SVG.js canvas instance
 */
export function loadSvgFromString(svgString) {
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  // Parse the SVG string properly by adopting it
  const canvas = SVG(document.documentElement);
  canvas.svg(svgString);

  // Return the first child which is the actual SVG content
  return canvas.first() || canvas;
}
