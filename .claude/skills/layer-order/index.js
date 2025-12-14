// Skill: Change layer order (z-index) of SVG elements
// Usage: node .claude/skills/layer-order/index.js <svg-file> <selector> <action>
import fs from 'fs';

const [,, file, selector, action] = process.argv;

if (!file || !selector || !action) {
  console.error('Usage: node index.js <svg-file> <selector> <action>');
  console.error('');
  console.error('Selectors:');
  console.error('  path:0         - First path (0-indexed)');
  console.error('  circle:2       - Third circle');
  console.error('  rect:-1        - Last rectangle');
  console.error('');
  console.error('Actions:');
  console.error('  front          - Bring to front (render last)');
  console.error('  back           - Send to back (render first, after background)');
  console.error('  up             - Move up one layer');
  console.error('  down           - Move down one layer');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg circle:0 front');
  console.error('  node index.js out.svg path:2 back');
  console.error('  node index.js out.svg rect:0 up');
  process.exit(1);
}

let svgContent = fs.readFileSync(file, 'utf8');

// Parse selector - must have index for layer operations
const [elementType, indexStr] = selector.split(':');
if (indexStr === undefined) {
  console.error('Selector must include index (e.g., path:0, circle:1)');
  process.exit(1);
}

let targetIndex = parseInt(indexStr, 10);

// Find all elements of this type
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
  // Find closing tag
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

// Remove element from current position
svgContent = svgContent.slice(0, startPos) + svgContent.slice(endPos);

// Find insertion point based on action
let insertPos = -1;
const closingSvg = svgContent.lastIndexOf('</svg>');

// Find all shape elements for positioning
const allShapesPattern = /<(path|line|circle|rect|ellipse|polygon|text|g)\s/gi;
const allShapes = [...svgContent.matchAll(allShapesPattern)];

switch (action) {
  case 'front':
    // Insert just before </svg>
    insertPos = closingSvg;
    break;

  case 'back':
    // Insert after first element (usually background rect)
    if (allShapes.length > 0) {
      // Find end of first shape
      const firstShape = allShapes[0];
      const firstTagName = firstShape[1];
      const firstStart = firstShape.index;
      const afterFirst = svgContent.slice(firstStart);
      const selfClose = afterFirst.match(/^<[^>]*\/>/);

      if (selfClose) {
        insertPos = firstStart + selfClose[0].length;
      } else {
        const closeTag = svgContent.indexOf(`</${firstTagName}>`, firstStart);
        insertPos = closeTag + `</${firstTagName}>`.length;
      }
    } else {
      // No shapes, insert at beginning after <svg> and <defs>
      const defsClose = svgContent.indexOf('</defs>');
      if (defsClose !== -1) {
        insertPos = defsClose + '</defs>'.length;
      } else {
        const svgOpen = svgContent.match(/<svg[^>]*>/);
        insertPos = svgOpen.index + svgOpen[0].length;
      }
    }
    break;

  case 'up':
    // Find next shape after original position and insert after it
    const shapesAfter = allShapes.filter(s => s.index > startPos);
    if (shapesAfter.length === 0) {
      console.log('Element is already at front');
      fs.writeFileSync(file, svgContent.slice(0, startPos) + elementStr + svgContent.slice(startPos));
      process.exit(0);
    }
    const nextShape = shapesAfter[0];
    const nextTagName = nextShape[1];
    const nextAfter = svgContent.slice(nextShape.index);
    const nextSelfClose = nextAfter.match(/^<[^>]*\/>/);

    if (nextSelfClose) {
      insertPos = nextShape.index + nextSelfClose[0].length;
    } else {
      const nextCloseTag = svgContent.indexOf(`</${nextTagName}>`, nextShape.index);
      insertPos = nextCloseTag + `</${nextTagName}>`.length;
    }
    break;

  case 'down':
    // Find shape before original position and insert before it
    const shapesBefore = allShapes.filter(s => s.index < startPos);
    if (shapesBefore.length <= 1) {
      console.log('Element is already at back (after background)');
      fs.writeFileSync(file, svgContent.slice(0, startPos) + elementStr + svgContent.slice(startPos));
      process.exit(0);
    }
    // Insert before the shape that was just before us
    insertPos = shapesBefore[shapesBefore.length - 1].index;
    break;

  default:
    console.error(`Unknown action: ${action}`);
    console.error('Valid actions: front, back, up, down');
    process.exit(1);
}

// Insert element at new position
svgContent = svgContent.slice(0, insertPos) + elementStr + svgContent.slice(insertPos);

fs.writeFileSync(file, svgContent);
console.log(`Moved ${elementType}:${indexStr} ${action}`);
