// Skill: Edit attributes of existing SVG elements
// Usage: node .claude/skills/edit-element/index.js <svg-file> <selector> <attribute> <value>
import { loadSvgFromString, loadSvg, saveSvg } from '../../../src/index.js';

const [,, file, selector, attribute, value] = process.argv;

if (!file || !selector || !attribute || value === undefined) {
  console.error('Usage: node index.js <svg-file> <selector> <attribute> <value>');
  console.error('');
  console.error('Selectors:');
  console.error('  svg          - The root SVG element');
  console.error('  path         - All path elements');
  console.error('  path:0       - First path element');
  console.error('  circle:2     - Third circle element');
  console.error('  all          - All shape elements');
  console.error('');
  console.error('Attributes: width, height, stroke-width, stroke, fill, opacity, etc.');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js output/art.svg svg width 200mm');
  console.error('  node index.js output/art.svg path:0 stroke red');
  console.error('  node index.js output/art.svg all stroke-width 2');
  process.exit(1);
}

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

// Parse selector - can be "svg", "path", "path:0", "line:2", "all", etc.
const [elementType, indexStr] = selector.split(':');
const targetIndex = indexStr !== undefined ? parseInt(indexStr, 10) : null;

let modifiedCount = 0;

if (elementType === 'svg') {
  // Edit the root SVG element
  canvas.attr(attribute, value);
  modifiedCount = 1;
} else {
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

  // Determine which elements to modify
  const indicesToModify = targetIndex !== null ? [targetIndex] : elements.map((_, i) => i);

  for (const idx of indicesToModify) {
    if (idx < 0 || idx >= elements.length) continue;
    elements[idx].attr(attribute, value);
    modifiedCount++;
  }
}

saveSvg(canvas, file);
console.log(`Modified ${modifiedCount} ${elementType} element(s): ${attribute}="${value}"`);
