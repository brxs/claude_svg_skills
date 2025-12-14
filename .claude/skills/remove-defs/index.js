// Skill: Remove definitions from SVG (gradients, filters, patterns, etc.)
// Usage: node .claude/skills/remove-defs/index.js <svg-file> [options]
import { loadSvgFromString, loadSvg, saveSvg } from '../../../src/index.js';

const [,, file, ...options] = process.argv;

if (!file) {
  console.error('Usage: node index.js <svg-file> [options]');
  console.error('');
  console.error('Options:');
  console.error('  all          - Remove all defs (default)');
  console.error('  unused       - Only remove unused defs');
  console.error('  gradients    - Remove only gradients');
  console.error('  filters      - Remove only filters');
  console.error('  patterns     - Remove only patterns');
  console.error('  markers      - Remove only markers');
  console.error('  masks        - Remove only masks');
  console.error('  clip-paths   - Remove only clip paths');
  console.error('  keep-paths   - Keep path definitions (for textPath)');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js output/art.svg');
  console.error('  node index.js output/art.svg unused');
  console.error('  node index.js output/art.svg gradients filters');
  console.error('  node index.js output/art.svg all keep-paths');
  process.exit(1);
}

// Parse options
const removeAll = options.length === 0 || options.includes('all');
const unusedOnly = options.includes('unused');
const removeGradients = removeAll || options.includes('gradients');
const removeFilters = removeAll || options.includes('filters');
const removePatterns = removeAll || options.includes('patterns');
const removeMarkers = removeAll || options.includes('markers');
const removeMasks = removeAll || options.includes('masks');
const removeClipPaths = removeAll || options.includes('clip-paths');
const keepPaths = options.includes('keep-paths');

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

const removed = [];

// Helper to check if a def ID is used elsewhere in the document
function isUsed(id, canvas) {
  const svgString = canvas.svg();
  const urlPattern = new RegExp(`url\\(#${id}\\)`, 'g');
  const hrefPattern = new RegExp(`href="#${id}"`, 'g');
  return urlPattern.test(svgString) || hrefPattern.test(svgString);
}

// Remove elements by type from defs
function removeDefType(tagName) {
  const elements = canvas.find(tagName);
  let count = 0;

  elements.forEach(el => {
    const id = el.attr('id');
    // If in defs (has an ID and parent is defs or is a definition type)
    if (id) {
      if (unusedOnly && isUsed(id, canvas)) return;
      el.remove();
      count++;
    }
  });

  if (count > 0) removed.push(`${count} ${tagName}(s)`);
}

// Remove gradient elements
if (removeGradients) {
  removeDefType('linearGradient');
  removeDefType('radialGradient');
}

// Remove filters
if (removeFilters) {
  removeDefType('filter');
}

// Remove patterns
if (removePatterns) {
  removeDefType('pattern');
}

// Remove markers
if (removeMarkers) {
  removeDefType('marker');
}

// Remove masks
if (removeMasks) {
  removeDefType('mask');
}

// Remove clip paths
if (removeClipPaths) {
  removeDefType('clipPath');
}

// Clean up references to removed defs
function cleanReferences(el) {
  const refAttrs = ['filter', 'mask', 'clip-path', 'fill', 'stroke'];

  refAttrs.forEach(attr => {
    const value = el.attr(attr);
    if (value && String(value).startsWith('url(#')) {
      const id = String(value).match(/url\(#([^)]+)\)/)?.[1];
      if (id && !canvas.find(`#${id}`).length) {
        el.attr(attr, null);
      }
    }
  });

  if (el.children) {
    el.children().forEach(child => cleanReferences(child));
  }
}

cleanReferences(canvas);

// Remove empty defs
const defs = canvas.find('defs');
defs.forEach(def => {
  if (def.children().length === 0) {
    def.remove();
  } else if (keepPaths) {
    // Keep defs that only have paths (for textPath)
    const nonPathChildren = def.children().filter(c => c.type !== 'path');
    if (nonPathChildren.length === 0) return;
  }
});

saveSvg(canvas, file);

if (removed.length > 0) {
  console.log(`Removed ${removed.join(', ')}`);
} else {
  console.log('No definitions removed');
}
