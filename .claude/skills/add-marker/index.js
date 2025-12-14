// Skill: Add marker definitions (arrows, dots, etc.) to SVG files
// Usage: node .claude/skills/add-marker/index.js <svg-file> <type> <id> [options]
import fs from 'fs';

const [,, file, type, id, ...options] = process.argv;

const validTypes = ['arrow', 'arrow-reverse', 'dot', 'square', 'diamond', 'circle-open'];

if (!file || !type || !id) {
  console.error('Usage: node index.js <svg-file> <type> <id> [options]');
  console.error('');
  console.error('Types:');
  console.error('  arrow          - Arrowhead pointing forward');
  console.error('  arrow-reverse  - Arrowhead pointing backward');
  console.error('  dot            - Filled circle');
  console.error('  circle-open    - Open circle (stroke only)');
  console.error('  square         - Filled square');
  console.error('  diamond        - Filled diamond');
  console.error('');
  console.error('Options:');
  console.error('  size=<n>       - Marker size (default: 6)');
  console.error('  fill=<color>   - Fill color (default: #000)');
  console.error('  stroke=<color> - Stroke color (default: none)');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg arrow arrowEnd');
  console.error('  node index.js out.svg dot point fill=#E53935 size=8');
  console.error('  node index.js out.svg arrow-reverse arrowStart fill=#1E88E5');
  console.error('');
  console.error('Apply to lines/paths with edit-element:');
  console.error('  node .claude/skills/edit-element/index.js out.svg line marker-end "url(#arrowEnd)"');
  console.error('  node .claude/skills/edit-element/index.js out.svg path marker-start "url(#arrowStart)"');
  process.exit(1);
}

if (!validTypes.includes(type)) {
  console.error(`Unknown marker type: ${type}`);
  console.error(`Valid types: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Parse options
const opts = {
  size: '6',
  fill: '#000',
  stroke: 'none'
};

for (const opt of options) {
  const eqIndex = opt.indexOf('=');
  if (eqIndex !== -1) {
    const key = opt.slice(0, eqIndex);
    const val = opt.slice(eqIndex + 1);
    opts[key] = val;
  }
}

const size = parseFloat(opts.size);
const half = size / 2;

let svgContent = fs.readFileSync(file, 'utf8');

// Build marker element based on type
let markerEl = '';
let refX = half;
let refY = half;
let shape = '';

switch (type) {
  case 'arrow':
    refX = size;
    refY = half;
    shape = `<path d="M0,0 L${size},${half} L0,${size} Z" fill="${opts.fill}" stroke="${opts.stroke}"/>`;
    break;

  case 'arrow-reverse':
    refX = 0;
    refY = half;
    shape = `<path d="M${size},0 L0,${half} L${size},${size} Z" fill="${opts.fill}" stroke="${opts.stroke}"/>`;
    break;

  case 'dot':
    shape = `<circle cx="${half}" cy="${half}" r="${half}" fill="${opts.fill}" stroke="${opts.stroke}"/>`;
    break;

  case 'circle-open':
    shape = `<circle cx="${half}" cy="${half}" r="${half - 1}" fill="none" stroke="${opts.fill}" stroke-width="1"/>`;
    break;

  case 'square':
    shape = `<rect x="0" y="0" width="${size}" height="${size}" fill="${opts.fill}" stroke="${opts.stroke}"/>`;
    break;

  case 'diamond':
    shape = `<path d="M${half},0 L${size},${half} L${half},${size} L0,${half} Z" fill="${opts.fill}" stroke="${opts.stroke}"/>`;
    break;
}

markerEl = `<marker id="${id}" markerWidth="${size}" markerHeight="${size}" refX="${refX}" refY="${refY}" orient="auto" markerUnits="strokeWidth">${shape}</marker>`;

// Find or create <defs> section
const defsMatch = svgContent.match(/<defs[^>]*>/i);
if (defsMatch) {
  // Insert after opening <defs> tag
  const insertPos = defsMatch.index + defsMatch[0].length;
  svgContent = svgContent.slice(0, insertPos) + '\n' + markerEl + svgContent.slice(insertPos);
} else {
  // Create <defs> section after opening <svg> tag
  const svgOpenMatch = svgContent.match(/<svg[^>]*>/i);
  if (svgOpenMatch) {
    const insertPos = svgOpenMatch.index + svgOpenMatch[0].length;
    svgContent = svgContent.slice(0, insertPos) + '\n<defs>\n' + markerEl + '\n</defs>' + svgContent.slice(insertPos);
  } else {
    console.error('Could not find <svg> tag');
    process.exit(1);
  }
}

fs.writeFileSync(file, svgContent);
console.log(`Added ${type} marker "${id}" (size: ${size}, fill: ${opts.fill})`);
console.log(`Apply with: marker-end="url(#${id})" or marker-start="url(#${id})"`);
