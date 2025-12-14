import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getSvgString } from './canvas.js';

/**
 * Get the project root directory.
 * @returns {string} Absolute path to project root
 */
export function getProjectRoot() {
  const currentFile = fileURLToPath(import.meta.url);
  return dirname(dirname(currentFile));
}

/**
 * Get the output directory path, creating it if it doesn't exist.
 * @param {string} filename - Optional filename to append
 * @returns {string} Path to output directory or file
 */
export function getOutputPath(filename) {
  const outputDir = join(getProjectRoot(), 'output');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  return filename ? join(outputDir, filename) : outputDir;
}

/**
 * Save a canvas to an SVG file.
 * @param {object} canvas - SVG.js canvas instance
 * @param {string} filepath - Path to save the file
 * @returns {string} The filepath that was written
 */
export function saveSvg(canvas, filepath) {
  const dir = dirname(filepath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const svgString = getSvgString(canvas);
  writeFileSync(filepath, svgString, 'utf8');
  return filepath;
}

/**
 * Load SVG content from a file.
 * @param {string} filepath - Path to the SVG file
 * @returns {string} SVG content as string
 */
export function loadSvg(filepath) {
  return readFileSync(filepath, 'utf8');
}

/**
 * Check if a file exists.
 * @param {string} filepath - Path to check
 * @returns {boolean} True if file exists
 */
export function fileExists(filepath) {
  return existsSync(filepath);
}

/**
 * Generate a timestamped filename.
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension (default: 'svg')
 * @returns {string} Filename with timestamp
 */
export function timestampedFilename(prefix = 'artwork', extension = 'svg') {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${timestamp}.${extension}`;
}
