// Skill: Add <use> elements to reference/reuse existing SVG elements
// Usage: node .claude/skills/add-use/index.js <svg-file> <ref-id> <x> <y> [options]
import fs from 'fs';

const [,, file, refId, x, y, ...options] = process.argv;

if (!file || !refId || x === undefined || y === undefined) {
  console.error('Usage: node index.js <svg-file> <ref-id> <x> <y> [options]');
  console.error('');
  console.error('Arguments:');
  console.error('  ref-id         - ID of element to reference (without #)');
  console.error('  x, y           - Position offset for the instance');
  console.error('');
  console.error('Options:');
  console.error('  width=<n>      - Override width');
  console.error('  height=<n>     - Override height');
  console.error('  transform=<v>  - Apply transform');
  console.error('  opacity=<0-1>  - Instance opacity');
  console.error('  fill=<color>   - Override fill (if element supports)');
  console.error('  stroke=<color> - Override stroke');
  console.error('  id=<id>        - Give this instance an ID');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg myCircle 100 100');
  console.error('  node index.js out.svg myShape 200 200 transform="rotate(45)"');
  console.error('  node index.js out.svg icon 50 50 width=30 height=30');
  console.error('');
  console.error('First, give an element an ID with edit-element:');
  console.error('  node .claude/skills/edit-element/index.js out.svg circle:0 id myCircle');
  console.error('');
  console.error('Or create a symbol in defs:');
  console.error('  node .claude/skills/add-symbol/index.js out.svg circle:0 mySymbol');
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

// Verify the referenced element exists
const refPattern = new RegExp(`id=["']${refId}["']`, 'i');
if (!refPattern.test(svgContent)) {
  console.error(`Warning: No element with id="${refId}" found in SVG`);
  console.error('The <use> element will be created but may not display correctly.');
  console.error('');
  console.error('To add an ID to an existing element:');
  console.error(`  node .claude/skills/edit-element/index.js ${file} <selector> id ${refId}`);
}

// Build <use> element
let useEl = `<use href="#${refId}" x="${x}" y="${y}"`;

// Add optional attributes
for (const [key, val] of Object.entries(attrs)) {
  useEl += ` ${key}="${val}"`;
}

useEl += '/>';

// Insert before </svg>
const closingSvg = svgContent.lastIndexOf('</svg>');
if (closingSvg === -1) {
  console.error('Could not find closing </svg> tag');
  process.exit(1);
}

svgContent = svgContent.slice(0, closingSvg) + useEl + '\n' + svgContent.slice(closingSvg);

fs.writeFileSync(file, svgContent);
console.log(`Added <use> referencing "#${refId}" at (${x}, ${y})`);
