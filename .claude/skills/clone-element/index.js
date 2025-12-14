// Skill: Clone/duplicate existing SVG elements
// Usage: node .claude/skills/clone-element/index.js <svg-file> <selector> [options]
import fs from 'fs';

const [,, file, selector, ...options] = process.argv;

if (!file || !selector) {
  console.error('Usage: node index.js <svg-file> <selector> [options]');
  console.error('');
  console.error('Selectors:');
  console.error('  path:0         - Clone first path');
  console.error('  circle:1       - Clone second circle');
  console.error('  rect:-1        - Clone last rectangle');
  console.error('  g:0            - Clone first group');
  console.error('');
  console.error('Options:');
  console.error('  dx=<n>         - Offset X (default: 0)');
  console.error('  dy=<n>         - Offset Y (default: 0)');
  console.error('  count=<n>      - Number of clones (default: 1)');
  console.error('  transform=<v>  - Apply transform to clone');
  console.error('  fill=<color>   - Override fill');
  console.error('  stroke=<color> - Override stroke');
  console.error('  opacity=<0-1>  - Override opacity');
  console.error('  id=<id>        - Give clone an ID');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg circle:0');
  console.error('  node index.js out.svg circle:0 dx=50 dy=0');
  console.error('  node index.js out.svg path:0 dx=30 dy=30 count=5');
  console.error('  node index.js out.svg rect:0 transform="rotate(45 200 200)"');
  console.error('  node index.js out.svg circle:0 dx=50 fill=#E53935 opacity=0.5');
  process.exit(1);
}

// Parse options
const opts = {
  dx: '0',
  dy: '0',
  count: '1'
};
const overrides = {};

for (const opt of options) {
  const eqIndex = opt.indexOf('=');
  if (eqIndex !== -1) {
    const key = opt.slice(0, eqIndex);
    const val = opt.slice(eqIndex + 1);
    if (['dx', 'dy', 'count'].includes(key)) {
      opts[key] = val;
    } else {
      overrides[key] = val;
    }
  }
}

const dx = parseFloat(opts.dx);
const dy = parseFloat(opts.dy);
const count = parseInt(opts.count, 10);

let svgContent = fs.readFileSync(file, 'utf8');

// Parse selector
const [elementType, indexStr] = selector.split(':');
if (indexStr === undefined) {
  console.error('Selector must include index (e.g., path:0, circle:1)');
  process.exit(1);
}

let targetIndex = parseInt(indexStr, 10);

// Find elements
const elementPattern = new RegExp(`<${elementType}\\s`, 'gi');
const matches = [...svgContent.matchAll(elementPattern)];

if (matches.length === 0) {
  console.error(`No <${elementType}> elements found`);
  process.exit(1);
}

// Handle negative index
if (targetIndex < 0) {
  targetIndex = matches.length + targetIndex;
}

if (targetIndex < 0 || targetIndex >= matches.length) {
  console.error(`Index ${indexStr} out of range (0-${matches.length - 1})`);
  process.exit(1);
}

// Extract the target element
const match = matches[targetIndex];
const startPos = match.index;

// Find end of element
const afterStart = svgContent.slice(startPos);
let elementStr = '';
let endPos = startPos;

// Check for self-closing tag
const selfClosingMatch = afterStart.match(/^<[^>]*\/>/);
if (selfClosingMatch) {
  elementStr = selfClosingMatch[0];
  endPos = startPos + elementStr.length;
} else {
  // Find closing tag, handling nesting
  const openTagEnd = svgContent.indexOf('>', startPos);
  let depth = 1;
  let searchPos = openTagEnd + 1;
  const openTagPattern = new RegExp(`<${elementType}[\\s>]`, 'gi');
  const closeTagPattern = new RegExp(`</${elementType}>`, 'gi');

  while (depth > 0 && searchPos < svgContent.length) {
    openTagPattern.lastIndex = searchPos;
    closeTagPattern.lastIndex = searchPos;

    const nextOpen = openTagPattern.exec(svgContent);
    const nextClose = closeTagPattern.exec(svgContent);

    if (!nextClose) break;

    if (nextOpen && nextOpen.index < nextClose.index) {
      depth++;
      searchPos = nextOpen.index + 1;
    } else {
      depth--;
      if (depth === 0) {
        endPos = nextClose.index + nextClose[0].length;
        elementStr = svgContent.slice(startPos, endPos);
      } else {
        searchPos = nextClose.index + 1;
      }
    }
  }
}

if (!elementStr) {
  console.error('Could not extract element');
  process.exit(1);
}

// Function to apply offset via transform
function applyOffset(el, offsetX, offsetY) {
  if (offsetX === 0 && offsetY === 0) return el;

  const translateStr = `translate(${offsetX} ${offsetY})`;
  const transformMatch = el.match(/transform="([^"]*)"/);

  if (transformMatch) {
    // Prepend translate to existing transform
    return el.replace(/transform="([^"]*)"/, `transform="${translateStr} $1"`);
  } else {
    // Add transform attribute
    const insertPos = el.search(/\s*\/?>/);
    return el.slice(0, insertPos) + ` transform="${translateStr}"` + el.slice(insertPos);
  }
}

// Function to apply attribute overrides
function applyOverrides(el, attrs) {
  let result = el;

  for (const [key, val] of Object.entries(attrs)) {
    const attrRegex = new RegExp(`${key}="[^"]*"`, 'i');

    if (attrRegex.test(result)) {
      // Replace existing attribute
      result = result.replace(attrRegex, `${key}="${val}"`);
    } else {
      // Add new attribute
      const insertPos = result.search(/\s*\/?>/);
      result = result.slice(0, insertPos) + ` ${key}="${val}"` + result.slice(insertPos);
    }
  }

  return result;
}

// Create clones
const clones = [];
for (let i = 1; i <= count; i++) {
  let clone = elementStr;

  // Apply cumulative offset
  clone = applyOffset(clone, dx * i, dy * i);

  // Apply overrides
  clone = applyOverrides(clone, overrides);

  // Handle ID - make unique or apply custom
  if (overrides.id && count > 1) {
    clone = clone.replace(/id="[^"]*"/, `id="${overrides.id}-${i}"`);
  }

  // Remove original ID if no override specified (to avoid duplicates)
  if (!overrides.id) {
    clone = clone.replace(/\s+id="[^"]*"/, '');
  }

  clones.push(clone);
}

// Insert clones after the original element
const insertPos = endPos;
svgContent = svgContent.slice(0, insertPos) + '\n' + clones.join('\n') + svgContent.slice(insertPos);

fs.writeFileSync(file, svgContent);

if (count === 1) {
  console.log(`Cloned ${elementType}:${indexStr}` + (dx || dy ? ` with offset (${dx}, ${dy})` : ''));
} else {
  console.log(`Created ${count} clones of ${elementType}:${indexStr} with offset (${dx}, ${dy}) each`);
}
