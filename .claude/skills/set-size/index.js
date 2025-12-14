// Skill: Set physical size of SVG with optional scale-to-fit
// Usage: node .claude/skills/set-size/index.js <svg-file> <width> <height> [options]
import { loadSvgFromString, loadSvg, saveSvg } from '../../../src/index.js';

const [,, file, width, height, ...options] = process.argv;

if (!file || !width || !height) {
  console.error('Usage: node index.js <svg-file> <width> <height> [options]');
  console.error('');
  console.error('Arguments:');
  console.error('  width   - Width with unit (e.g., 10cm, 200mm, 8in)');
  console.error('  height  - Height with unit (e.g., 10cm, 200mm, 8in)');
  console.error('');
  console.error('Options:');
  console.error('  scale-to-fit  - Scale viewBox to fit new aspect ratio (no distortion)');
  console.error('  stretch       - Stretch content to fill (may distort)');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js output/art.svg 10cm 10cm');
  console.error('  node index.js output/art.svg 200mm 100mm scale-to-fit');
  console.error('  node index.js output/art.svg 8in 6in stretch');
  process.exit(1);
}

const scaleToFit = options.includes('scale-to-fit');
const stretch = options.includes('stretch');

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

// Parse dimensions (extract numeric value)
function parseSize(sizeStr) {
  const match = sizeStr.match(/^([\d.]+)(\w+)?$/);
  if (!match) return { value: parseFloat(sizeStr), unit: '' };
  return { value: parseFloat(match[1]), unit: match[2] || '' };
}

const newWidth = parseSize(width);
const newHeight = parseSize(height);

// Get current viewBox
const viewBox = canvas.attr('viewBox');
let vbX = 0, vbY = 0, vbWidth, vbHeight;

if (viewBox) {
  const parts = viewBox.split(/[\s,]+/).map(Number);
  [vbX, vbY, vbWidth, vbHeight] = parts;
} else {
  vbWidth = parseFloat(canvas.attr('width')) || 500;
  vbHeight = parseFloat(canvas.attr('height')) || 500;
}

// Set physical size
canvas.attr('width', width);
canvas.attr('height', height);

if (scaleToFit) {
  // Adjust viewBox to maintain aspect ratio, centering content
  const currentAspect = vbWidth / vbHeight;
  const newAspect = newWidth.value / newHeight.value;

  let newVbWidth = vbWidth;
  let newVbHeight = vbHeight;
  let newVbX = vbX;
  let newVbY = vbY;

  if (newAspect > currentAspect) {
    // New is wider - expand viewBox width
    newVbWidth = vbHeight * newAspect;
    newVbX = vbX - (newVbWidth - vbWidth) / 2;
  } else if (newAspect < currentAspect) {
    // New is taller - expand viewBox height
    newVbHeight = vbWidth / newAspect;
    newVbY = vbY - (newVbHeight - vbHeight) / 2;
  }

  canvas.attr('viewBox', `${newVbX} ${newVbY} ${newVbWidth} ${newVbHeight}`);
  console.log(`Adjusted viewBox: ${newVbX} ${newVbY} ${newVbWidth} ${newVbHeight}`);
} else if (stretch) {
  // Keep viewBox as-is, content will stretch to fit
  console.log(`Content will stretch to fit ${width} x ${height}`);
} else {
  // Default: just set size, viewBox unchanged (uniform scale)
  console.log(`ViewBox unchanged (uniform scale)`);
}

saveSvg(canvas, file);
console.log(`Set size to ${width} x ${height}`);
