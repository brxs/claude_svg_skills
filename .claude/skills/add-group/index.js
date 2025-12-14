// Skill: Group SVG elements together
// Usage: node .claude/skills/add-group/index.js <svg-file> <selector> <group-id> [options]
import fs from 'fs';

const [,, file, selector, groupId, ...options] = process.argv;

if (!file || !selector || !groupId) {
  console.error('Usage: node index.js <svg-file> <selector> <group-id> [options]');
  console.error('');
  console.error('Selectors:');
  console.error('  path           - Group all paths');
  console.error('  circle         - Group all circles');
  console.error('  path,circle    - Group all paths and circles');
  console.error('  path:0,path:1  - Group specific elements');
  console.error('  path:1-3       - Group range (indices 1, 2, 3)');
  console.error('  all            - Group all shape elements');
  console.error('');
  console.error('Options:');
  console.error('  transform=<value>    - Apply transform to group');
  console.error('  opacity=<0-1>        - Group opacity');
  console.error('  fill=<color>         - Default fill for group');
  console.error('  stroke=<color>       - Default stroke for group');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg path myGroup');
  console.error('  node index.js out.svg circle:0,circle:1 circleGroup');
  console.error('  node index.js out.svg path:0-2 pathGroup transform="rotate(45 200 200)"');
  console.error('  node index.js out.svg all everything opacity=0.5');
  process.exit(1);
}

// Parse options
const attrs = {};
for (const opt of options) {
  const eqIndex = opt.indexOf('=');
  if (eqIndex !== -1) {
    const key = opt.slice(0, eqIndex);
    const val = opt.slice(eqIndex + 1);
    attrs[key] = val;
  }
}

let svgContent = fs.readFileSync(file, 'utf8');

// Parse selector to get list of elements to group
const selectors = selector.split(',').map(s => s.trim());
const elementsToGroup = [];

for (const sel of selectors) {
  // Check for range syntax (e.g., path:1-3)
  const rangeMatch = sel.match(/^(\w+):(\d+)-(\d+)$/);
  if (rangeMatch) {
    const [, elemType, startIdx, endIdx] = rangeMatch;
    for (let i = parseInt(startIdx); i <= parseInt(endIdx); i++) {
      elementsToGroup.push({ type: elemType, index: i });
    }
    continue;
  }

  // Check for indexed selector (e.g., path:0)
  const indexMatch = sel.match(/^(\w+):(-?\d+)$/);
  if (indexMatch) {
    const [, elemType, idx] = indexMatch;
    elementsToGroup.push({ type: elemType, index: parseInt(idx) });
    continue;
  }

  // Type-only selector (e.g., path, circle, all)
  elementsToGroup.push({ type: sel, index: null });
}

// Find all matching elements
const allShapeTypes = ['path', 'line', 'circle', 'rect', 'ellipse', 'polygon', 'polyline', 'text'];

function findElements(content, elemType, targetIndex) {
  const types = elemType === 'all' ? allShapeTypes : [elemType];
  const results = [];

  for (const type of types) {
    const pattern = new RegExp(`<${type}\\s`, 'gi');
    const matches = [...content.matchAll(pattern)];

    matches.forEach((match, idx) => {
      if (targetIndex === null || idx === targetIndex || (targetIndex < 0 && idx === matches.length + targetIndex)) {
        // Find the full element
        const startPos = match.index;
        const afterStart = content.slice(startPos);

        // Check for self-closing
        const selfClosingMatch = afterStart.match(/^<[^>]*\/>/);
        if (selfClosingMatch) {
          results.push({
            start: startPos,
            end: startPos + selfClosingMatch[0].length,
            content: selfClosingMatch[0]
          });
        } else {
          // Find closing tag
          const closeTagRegex = new RegExp(`</${type}>`, 'i');
          const closeMatch = afterStart.match(closeTagRegex);
          if (closeMatch) {
            const endPos = startPos + closeMatch.index + closeMatch[0].length;
            results.push({
              start: startPos,
              end: endPos,
              content: content.slice(startPos, endPos)
            });
          }
        }
      }
    });
  }

  return results;
}

// Collect all elements to group
let allElements = [];
for (const { type, index } of elementsToGroup) {
  const found = findElements(svgContent, type, index);
  allElements.push(...found);
}

// Remove duplicates and sort by position (descending for safe removal)
allElements = allElements
  .filter((el, idx, arr) => arr.findIndex(e => e.start === el.start) === idx)
  .sort((a, b) => b.start - a.start);

if (allElements.length === 0) {
  console.error('No elements found matching selector');
  process.exit(1);
}

// Extract elements (in reverse order to maintain positions)
const extractedContents = [];
for (const el of allElements) {
  extractedContents.unshift(el.content);
  svgContent = svgContent.slice(0, el.start) + svgContent.slice(el.end);
}

// Build group element
let groupEl = `<g id="${groupId}"`;
for (const [key, val] of Object.entries(attrs)) {
  groupEl += ` ${key}="${val}"`;
}
groupEl += '>\n';
groupEl += extractedContents.join('\n');
groupEl += '\n</g>';

// Find insertion point (before </svg>)
const closingSvg = svgContent.lastIndexOf('</svg>');
svgContent = svgContent.slice(0, closingSvg) + groupEl + '\n' + svgContent.slice(closingSvg);

// Clean up empty lines
svgContent = svgContent.replace(/\n\s*\n\s*\n/g, '\n\n');

fs.writeFileSync(file, svgContent);
console.log(`Created group "${groupId}" with ${extractedContents.length} element(s)`);
