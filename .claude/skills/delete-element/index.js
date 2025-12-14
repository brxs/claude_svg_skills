// Skill: Delete elements from SVG files
// Usage: node .claude/skills/delete-element/index.js <svg-file> <selector>
import { loadSvgFromString, loadSvg, saveSvg } from '../../../src/index.js';

const [,, file, selector] = process.argv;

if (!file || !selector) {
  console.error('Usage: node index.js <svg-file> <selector>');
  console.error('');
  console.error('Selectors:');
  console.error('  path           - Delete all path elements');
  console.error('  path:0         - Delete first path (0-indexed)');
  console.error('  path:-1        - Delete last path');
  console.error('  circle:2       - Delete third circle');
  console.error('  text           - Delete all text elements');
  console.error('  all            - Delete all shape elements (use with caution!)');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg path:0');
  console.error('  node index.js out.svg text');
  console.error('  node index.js out.svg circle:-1');
  process.exit(1);
}

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

// Parse selector
const [elementType, indexStr] = selector.split(':');
let targetIndex = indexStr !== undefined ? parseInt(indexStr, 10) : null;

// Find matching elements
const validTypes = ['path', 'line', 'circle', 'rect', 'ellipse', 'polygon', 'polyline', 'text', 'g'];
const typesToSearch = elementType === 'all' ? validTypes : [elementType];

const elements = [];

function collectElements(parent) {
  if (parent.children) {
    parent.children().forEach(child => {
      const tagName = child.node?.nodeName?.toLowerCase();
      if (typesToSearch.includes(tagName)) {
        elements.push(child);
      }
      collectElements(child);
    });
  }
}

collectElements(canvas);

if (elements.length === 0) {
  console.error(`No <${elementType}> elements found`);
  process.exit(1);
}

// Handle negative index
if (targetIndex !== null && targetIndex < 0) {
  targetIndex = elements.length + targetIndex;
}

// Determine which elements to delete
const indicesToDelete = targetIndex !== null ? [targetIndex] : elements.map((_, i) => i);

// Delete in reverse order to maintain indices
let deletedCount = 0;
for (const idx of indicesToDelete.sort((a, b) => b - a)) {
  if (idx < 0 || idx >= elements.length) continue;
  elements[idx].remove();
  deletedCount++;
}

saveSvg(canvas, file);
console.log(`Deleted ${deletedCount} ${elementType} element(s)`);
