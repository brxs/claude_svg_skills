// Skill: Convert all colors in SVG to a single color
// Usage: node .claude/skills/convert-colors/index.js <svg-file> <color> [options]
import { loadSvgFromString, loadSvg, saveSvg } from '../../../src/index.js';

const [,, file, color, ...options] = process.argv;

if (!file || !color) {
  console.error('Usage: node index.js <svg-file> <color> [options]');
  console.error('');
  console.error('Arguments:');
  console.error('  color        - Target color (hex like #000000 or name like black)');
  console.error('');
  console.error('Options:');
  console.error('  stroke-only  - Only convert stroke colors');
  console.error('  fill-only    - Only convert fill colors');
  console.error('  keep-white   - Don\'t convert white (#ffffff)');
  console.error('  keep-none    - Don\'t convert "none" values');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js output/art.svg #000000');
  console.error('  node index.js output/art.svg black stroke-only');
  console.error('  node index.js output/art.svg "#333333" keep-white');
  process.exit(1);
}

// Parse options
const strokeOnly = options.includes('stroke-only');
const fillOnly = options.includes('fill-only');
const keepWhite = options.includes('keep-white');
const keepNone = options.includes('keep-none');

// Normalize color
let targetColor = color;
const colorNames = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  gray: '#808080',
  grey: '#808080'
};
if (colorNames[color.toLowerCase()]) {
  targetColor = colorNames[color.toLowerCase()];
}

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

let strokeCount = 0;
let fillCount = 0;

// Helper to check if color should be skipped
function shouldSkip(value) {
  if (!value) return true;
  if (value === 'none' && keepNone) return true;
  if (value === 'none') return true;
  if (String(value).startsWith('url(')) return true;
  if (keepWhite && (String(value).toLowerCase() === '#ffffff' || String(value).toLowerCase() === '#fff')) return true;
  return false;
}

// Get all elements recursively
function processElement(el) {
  // Convert stroke
  if (!fillOnly) {
    const stroke = el.attr('stroke');
    if (stroke && !shouldSkip(stroke)) {
      el.attr('stroke', targetColor);
      strokeCount++;
    }
  }

  // Convert fill
  if (!strokeOnly) {
    const fill = el.attr('fill');
    if (fill && !shouldSkip(fill)) {
      el.attr('fill', targetColor);
      fillCount++;
    }
  }

  // Process children
  if (el.children) {
    el.children().forEach(child => processElement(child));
  }
}

processElement(canvas);

saveSvg(canvas, file);

const parts = [];
if (strokeCount > 0) parts.push(`${strokeCount} stroke(s)`);
if (fillCount > 0) parts.push(`${fillCount} fill(s)`);

if (parts.length > 0) {
  console.log(`Converted ${parts.join(' and ')} to ${targetColor}`);
} else {
  console.log('No colors converted');
}
