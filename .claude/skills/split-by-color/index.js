// Skill: Split SVG into separate files by color (for multi-pen plotters)
// Usage: node .claude/skills/split-by-color/index.js <svg-file> [options]
import { loadSvgFromString, loadSvg, saveSvg } from '../../../src/index.js';
import { createCanvas } from '../../../src/canvas.js';
import fs from 'fs';
import path from 'path';

const [,, file, ...options] = process.argv;

if (!file) {
  console.error('Usage: node index.js <svg-file> [options]');
  console.error('');
  console.error('Options:');
  console.error('  stroke-only    - Only consider stroke colors (ignore fill)');
  console.error('  fill-only      - Only consider fill colors (ignore stroke)');
  console.error('  to-black       - Convert each output file to black strokes');
  console.error('  keep-bg        - Keep background rectangle in each file');
  console.error('');
  console.error('Output:');
  console.error('  Creates files named: <original>-<color>.svg');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js output/art.svg');
  console.error('  node index.js output/art.svg stroke-only to-black');
  process.exit(1);
}

const strokeOnly = options.includes('stroke-only');
const fillOnly = options.includes('fill-only');
const toBlack = options.includes('to-black');
const keepBg = options.includes('keep-bg');

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

// Get canvas dimensions
const width = parseFloat(canvas.attr('width')) || 500;
const height = parseFloat(canvas.attr('height')) || 500;
const viewBox = canvas.attr('viewBox');

// Normalize color to hex
function normalizeColor(color) {
  if (!color || color === 'none' || color === 'transparent') return null;
  if (String(color).startsWith('url(')) return null;

  const colorStr = String(color).toLowerCase().trim();

  // Named colors to hex
  const colorNames = {
    black: '#000000', white: '#ffffff', red: '#ff0000',
    green: '#008000', blue: '#0000ff', yellow: '#ffff00',
    cyan: '#00ffff', magenta: '#ff00ff', gray: '#808080',
    grey: '#808080', orange: '#ffa500', pink: '#ffc0cb',
    purple: '#800080', brown: '#a52a2a'
  };

  if (colorNames[colorStr]) return colorNames[colorStr];

  // Normalize short hex
  if (/^#[0-9a-f]{3}$/i.test(colorStr)) {
    return '#' + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2] + colorStr[3] + colorStr[3];
  }

  // Already full hex
  if (/^#[0-9a-f]{6}$/i.test(colorStr)) {
    return colorStr;
  }

  // RGB format
  const rgbMatch = colorStr.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  return colorStr;
}

// Collect all colors from elements
const colorMap = new Map(); // color -> elements

function collectColors(el, parentStroke, parentFill) {
  const stroke = el.attr('stroke') || parentStroke;
  const fill = el.attr('fill') || parentFill;

  // Skip defs, style elements
  const tagName = el.node?.nodeName?.toLowerCase();
  if (['defs', 'style', 'linearGradient', 'radialGradient', 'filter', 'pattern', 'mask', 'clipPath'].includes(tagName)) {
    return;
  }

  // Get colors for this element
  const colors = [];

  if (!fillOnly) {
    const strokeColor = normalizeColor(stroke);
    if (strokeColor) colors.push({ color: strokeColor, attr: 'stroke' });
  }

  if (!strokeOnly) {
    const fillColor = normalizeColor(fill);
    if (fillColor) colors.push({ color: fillColor, attr: 'fill' });
  }

  // Add element to color buckets
  for (const { color } of colors) {
    if (!colorMap.has(color)) {
      colorMap.set(color, []);
    }
    colorMap.get(color).push(el);
  }

  // Process children
  if (el.children) {
    el.children().forEach(child => collectColors(child, stroke, fill));
  }
}

// Start collection from root children (skip the svg element itself)
canvas.children().forEach(child => collectColors(child, null, null));

// Generate output files
const baseName = path.basename(file, '.svg');
const dirName = path.dirname(file);

console.log(`Found ${colorMap.size} unique color(s)`);

let fileCount = 0;

for (const [color, elements] of colorMap) {
  // Create new canvas
  const newCanvas = createCanvas(width, height, 'transparent');
  if (viewBox) newCanvas.attr('viewBox', viewBox);

  // Add background if requested
  if (keepBg) {
    newCanvas.rect(width, height).fill('#ffffff').back();
  }

  // Clone elements into new canvas
  for (const el of elements) {
    try {
      const clone = el.clone();
      newCanvas.add(clone);

      // Convert to black if requested
      if (toBlack) {
        if (clone.attr('stroke') && normalizeColor(clone.attr('stroke')) === color) {
          clone.attr('stroke', '#000000');
        }
        if (clone.attr('fill') && normalizeColor(clone.attr('fill')) === color) {
          clone.attr('fill', '#000000');
        }
      }
    } catch (err) {
      // Skip elements that can't be cloned
    }
  }

  // Generate filename
  const colorName = color.replace('#', '');
  const outputFile = path.join(dirName, `${baseName}-${colorName}.svg`);

  saveSvg(newCanvas, outputFile);
  console.log(`  ${color}: ${elements.length} element(s) -> ${path.basename(outputFile)}`);
  fileCount++;
}

console.log(`Created ${fileCount} file(s)`);
