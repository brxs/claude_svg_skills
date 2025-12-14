import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { getSvgString } from './canvas.js';
import { getOutputPath } from './io.js';

/**
 * Render an SVG canvas to a PNG buffer.
 * @param {object} canvas - SVG.js canvas instance
 * @param {object} options - Render options
 * @param {number} options.scale - Scale factor (default: 1)
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function renderToBuffer(canvas, options = {}) {
  const svgString = getSvgString(canvas);
  return renderSvgStringToBuffer(svgString, options);
}

/**
 * Render an SVG string to a PNG buffer.
 * @param {string} svgString - SVG markup
 * @param {object} options - Render options
 * @param {number} options.scale - Scale factor (default: 1)
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function renderSvgStringToBuffer(svgString, options = {}) {
  const scale = options.scale || 1;

  let sharpInstance = sharp(Buffer.from(svgString));

  if (scale !== 1) {
    const metadata = await sharpInstance.metadata();
    sharpInstance = sharpInstance.resize({
      width: Math.round(metadata.width * scale),
      height: Math.round(metadata.height * scale)
    });
  }

  return sharpInstance.png().toBuffer();
}

/**
 * Render an SVG canvas to a PNG file.
 * @param {object} canvas - SVG.js canvas instance
 * @param {string} filepath - Output PNG path
 * @param {object} options - Render options
 * @returns {Promise<string>} The filepath that was written
 */
export async function renderToPng(canvas, filepath, options = {}) {
  const buffer = await renderToBuffer(canvas, options);

  const dir = dirname(filepath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(filepath, buffer);
  return filepath;
}

/**
 * Render an SVG file to a PNG file.
 * @param {string} svgPath - Input SVG file path
 * @param {string} pngPath - Output PNG file path (optional, defaults to same name with .png)
 * @param {object} options - Render options
 * @returns {Promise<string>} The PNG filepath that was written
 */
export async function renderSvgFileToPng(svgPath, pngPath, options = {}) {
  const svgString = readFileSync(svgPath, 'utf8');
  const outputPath = pngPath || svgPath.replace(/\.svg$/i, '.png');

  const buffer = await renderSvgStringToBuffer(svgString, options);

  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outputPath, buffer);
  return outputPath;
}

/**
 * Quick render helper - renders SVG to PNG in output directory.
 * @param {object} canvas - SVG.js canvas instance
 * @param {string} name - Base filename (without extension)
 * @param {object} options - Render options
 * @returns {Promise<{svg: string, png: string}>} Paths to both files
 */
export async function saveAndRender(canvas, name, options = {}) {
  const { saveSvg } = await import('./io.js');

  const svgPath = getOutputPath(`${name}.svg`);
  const pngPath = getOutputPath(`${name}.png`);

  saveSvg(canvas, svgPath);
  await renderToPng(canvas, pngPath, options);

  return { svg: svgPath, png: pngPath };
}
