// Skill: Add text elements to existing SVG files
// Usage: node .claude/skills/add-text/index.js <svg-file> <x> <y> <text> [options]
import fs from 'fs';

const [,, file, x, y, text, ...options] = process.argv;

if (!file || !x || !y || !text) {
  console.error('Usage: node index.js <svg-file> <x> <y> <text> [options]');
  console.error('');
  console.error('Options:');
  console.error('  font-size=<size>           - Font size (default: 16)');
  console.error('  font-family=<family>       - Font family (default: sans-serif)');
  console.error('  fill=<color>               - Text color (default: #000)');
  console.error('  opacity=<0-1>              - Text opacity (default: 1)');
  console.error('  text-anchor=<start|middle|end> - Horizontal alignment (default: start)');
  console.error('  dominant-baseline=<auto|middle|hanging> - Vertical alignment');
  console.error('  font-weight=<normal|bold|100-900> - Font weight');
  console.error('  font-style=<normal|italic> - Font style');
  console.error('  rotate=<angle>             - Rotate text by angle degrees');
  console.error('  letter-spacing=<value>     - Space between letters');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg 200 200 "Hello World"');
  console.error('  node index.js out.svg 100 50 "Title" font-size=24 font-weight=bold');
  console.error('  node index.js out.svg 200 200 "Centered" text-anchor=middle fill=#E53935');
  process.exit(1);
}

// Parse options
const attrs = {
  'font-size': '16',
  'font-family': 'sans-serif',
  'fill': '#000'
};

for (const opt of options) {
  const eqIndex = opt.indexOf('=');
  if (eqIndex !== -1) {
    const key = opt.slice(0, eqIndex);
    const val = opt.slice(eqIndex + 1);
    attrs[key] = val;
  }
}

let svgContent = fs.readFileSync(file, 'utf8');

// Build text element
let textEl = `<text x="${x}" y="${y}"`;

// Add all attributes
for (const [key, val] of Object.entries(attrs)) {
  textEl += ` ${key}="${val}"`;
}

// Handle rotation if specified
if (attrs.rotate) {
  textEl += ` transform="rotate(${attrs.rotate} ${x} ${y})"`;
}

textEl += `>${text}</text>`;

// Find closing </svg> tag and insert before it
const closingSvgIndex = svgContent.lastIndexOf('</svg>');
if (closingSvgIndex === -1) {
  console.error('Could not find closing </svg> tag');
  process.exit(1);
}

svgContent = svgContent.slice(0, closingSvgIndex) + textEl + '\n' + svgContent.slice(closingSvgIndex);

fs.writeFileSync(file, svgContent);
console.log(`Added text "${text}" at (${x}, ${y})`);
