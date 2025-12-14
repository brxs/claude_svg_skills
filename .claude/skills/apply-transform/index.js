// Skill: Apply transforms to existing SVG elements
// Usage: node .claude/skills/apply-transform/index.js <svg-file> <selector> <transform> [...args]
import fs from 'fs';

const [,, file, selector, transform, ...args] = process.argv;

if (!file || !selector || !transform) {
  console.error('Usage: node index.js <svg-file> <selector> <transform> [...args]');
  console.error('Selectors: path, path:0, line, circle, rect, all');
  console.error('Transforms:');
  console.error('  rotate <angle> [cx cy]     - Rotate by angle degrees');
  console.error('  scale <s> | <sx sy>        - Scale uniformly or non-uniformly');
  console.error('  translate <tx> <ty>        - Move by tx, ty');
  console.error('  skewX <angle>              - Skew along X axis');
  console.error('  skewY <angle>              - Skew along Y axis');
  console.error('  flip <x|y|both>            - Flip horizontally/vertically');
  console.error('  reset                      - Remove all transforms');
  process.exit(1);
}

let svgContent = fs.readFileSync(file, 'utf8');

// Build the transform string
let transformStr = '';
switch (transform) {
  case 'rotate':
    if (args.length >= 3) {
      transformStr = `rotate(${args[0]} ${args[1]} ${args[2]})`;
    } else {
      transformStr = `rotate(${args[0] || 0})`;
    }
    break;
  case 'scale':
    if (args.length >= 2) {
      transformStr = `scale(${args[0]} ${args[1]})`;
    } else {
      transformStr = `scale(${args[0] || 1})`;
    }
    break;
  case 'translate':
    transformStr = `translate(${args[0] || 0} ${args[1] || 0})`;
    break;
  case 'skewX':
    transformStr = `skewX(${args[0] || 0})`;
    break;
  case 'skewY':
    transformStr = `skewY(${args[0] || 0})`;
    break;
  case 'flip':
    const axis = args[0] || 'x';
    if (axis === 'x') {
      transformStr = 'scale(-1 1)';
    } else if (axis === 'y') {
      transformStr = 'scale(1 -1)';
    } else {
      transformStr = 'scale(-1 -1)';
    }
    break;
  case 'reset':
    transformStr = null; // Special case: remove transform
    break;
  default:
    console.error(`Unknown transform: ${transform}`);
    process.exit(1);
}

// Parse selector
const [elementType, indexStr] = selector.split(':');
const targetIndex = indexStr !== undefined ? parseInt(indexStr, 10) : null;

// Build regex pattern
const elementPattern = elementType === 'all'
  ? /<(path|line|circle|rect|ellipse|polygon|g)\s/gi
  : new RegExp(`<${elementType}\\s`, 'gi');

const matches = [...svgContent.matchAll(elementPattern)];

if (matches.length === 0) {
  console.error(`No <${elementType}> elements found`);
  process.exit(1);
}

const indicesToModify = targetIndex !== null ? [targetIndex] : matches.map((_, i) => i);
let modifiedCount = 0;

// Process in reverse order
for (const idx of indicesToModify.sort((a, b) => b - a)) {
  if (idx < 0 || idx >= matches.length) continue;

  const match = matches[idx];
  const startPos = match.index;
  const tagName = elementType === 'all' ? match[1] : elementType;

  // Find end of element
  const selfClosingEnd = svgContent.indexOf('/>', startPos);
  const openTagEnd = svgContent.indexOf('>', startPos);
  const closingTagStart = svgContent.indexOf(`</${tagName}>`, startPos);

  let endPos;
  if (selfClosingEnd !== -1 && selfClosingEnd < openTagEnd + 1) {
    endPos = selfClosingEnd + 2;
  } else if (closingTagStart !== -1) {
    endPos = closingTagStart + `</${tagName}>`.length;
  } else {
    endPos = openTagEnd + 1;
  }

  let elementStr = svgContent.slice(startPos, endPos);
  const transformAttrRegex = /transform="([^"]*)"/i;

  if (transform === 'reset') {
    // Remove transform attribute
    elementStr = elementStr.replace(transformAttrRegex, '');
  } else if (transformAttrRegex.test(elementStr)) {
    // Append to existing transform
    elementStr = elementStr.replace(transformAttrRegex, (_, existing) => {
      return `transform="${existing} ${transformStr}"`;
    });
  } else {
    // Add new transform attribute
    const insertPos = elementStr.search(/\s*\/?>/);
    elementStr = elementStr.slice(0, insertPos) + ` transform="${transformStr}"` + elementStr.slice(insertPos);
  }

  svgContent = svgContent.slice(0, startPos) + elementStr + svgContent.slice(endPos);
  modifiedCount++;
}

fs.writeFileSync(file, svgContent);

if (transform === 'reset') {
  console.log(`Reset transforms on ${modifiedCount} ${elementType} element(s)`);
} else {
  console.log(`Applied ${transformStr} to ${modifiedCount} ${elementType} element(s)`);
}
