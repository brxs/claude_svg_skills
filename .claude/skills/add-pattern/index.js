// Skill: Add pattern definitions for tiled/repeating fills
// Usage: node .claude/skills/add-pattern/index.js <svg-file> <type> <id> [options]
import fs from 'fs';

const [,, file, type, id, ...options] = process.argv;

const validTypes = ['dots', 'lines', 'grid', 'checkerboard', 'stripes', 'diagonal', 'crosshatch', 'zigzag', 'hexagons', 'triangles'];

if (!file || !type || !id) {
  console.error('Usage: node index.js <svg-file> <type> <id> [options]');
  console.error('');
  console.error('Types:');
  console.error('  dots         - Polka dot pattern');
  console.error('  lines        - Horizontal lines');
  console.error('  stripes      - Vertical stripes');
  console.error('  diagonal     - Diagonal lines');
  console.error('  grid         - Grid lines');
  console.error('  crosshatch   - Crosshatch pattern');
  console.error('  checkerboard - Checkerboard squares');
  console.error('  zigzag       - Zigzag lines');
  console.error('  hexagons     - Hexagon tiles');
  console.error('  triangles    - Triangle tiles');
  console.error('');
  console.error('Options:');
  console.error('  size=<n>        - Pattern tile size (default: 10)');
  console.error('  color=<color>   - Pattern color (default: #000)');
  console.error('  bg=<color>      - Background color (default: transparent)');
  console.error('  stroke=<n>      - Line stroke width (default: 1)');
  console.error('  angle=<deg>     - Rotation angle (for stripes/lines)');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg dots polkaDots size=20 color=#E53935');
  console.error('  node index.js out.svg stripes blueStripes size=10 color=#1E88E5 bg=#fff');
  console.error('  node index.js out.svg checkerboard checker size=25 color=#000 bg=#fff');
  console.error('');
  console.error('Apply with edit-element:');
  console.error('  node .claude/skills/edit-element/index.js out.svg rect fill "url(#polkaDots)"');
  process.exit(1);
}

if (!validTypes.includes(type)) {
  console.error(`Unknown pattern type: ${type}`);
  console.error(`Valid types: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Parse options
const opts = {
  size: '10',
  color: '#000',
  bg: 'transparent',
  stroke: '1',
  angle: '0'
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
const color = opts.color;
const bg = opts.bg;
const strokeWidth = parseFloat(opts.stroke);

let svgContent = fs.readFileSync(file, 'utf8');

// Build pattern content based on type
let patternContent = '';
let patternWidth = size;
let patternHeight = size;

// Add background if not transparent
const bgRect = bg !== 'transparent' ? `<rect width="${patternWidth}" height="${patternHeight}" fill="${bg}"/>` : '';

switch (type) {
  case 'dots': {
    const radius = size / 5;
    patternContent = bgRect + `<circle cx="${half}" cy="${half}" r="${radius}" fill="${color}"/>`;
    break;
  }

  case 'lines': {
    patternHeight = size;
    patternWidth = size;
    patternContent = bgRect + `<line x1="0" y1="${half}" x2="${size}" y2="${half}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    break;
  }

  case 'stripes': {
    patternContent = bgRect + `<rect x="0" y="0" width="${half}" height="${size}" fill="${color}"/>`;
    break;
  }

  case 'diagonal': {
    // Diagonal lines need larger pattern to tile properly
    patternContent = bgRect +
      `<line x1="0" y1="0" x2="${size}" y2="${size}" stroke="${color}" stroke-width="${strokeWidth}"/>` +
      `<line x1="${-size}" y1="0" x2="${size}" y2="${size * 2}" stroke="${color}" stroke-width="${strokeWidth}"/>` +
      `<line x1="0" y1="${-size}" x2="${size * 2}" y2="${size}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    break;
  }

  case 'grid': {
    patternContent = bgRect +
      `<line x1="${half}" y1="0" x2="${half}" y2="${size}" stroke="${color}" stroke-width="${strokeWidth}"/>` +
      `<line x1="0" y1="${half}" x2="${size}" y2="${half}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    break;
  }

  case 'crosshatch': {
    patternContent = bgRect +
      `<line x1="0" y1="0" x2="${size}" y2="${size}" stroke="${color}" stroke-width="${strokeWidth}"/>` +
      `<line x1="${size}" y1="0" x2="0" y2="${size}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    break;
  }

  case 'checkerboard': {
    patternWidth = size * 2;
    patternHeight = size * 2;
    const bgFull = bg !== 'transparent' ? `<rect width="${patternWidth}" height="${patternHeight}" fill="${bg}"/>` : '';
    patternContent = bgFull +
      `<rect x="0" y="0" width="${size}" height="${size}" fill="${color}"/>` +
      `<rect x="${size}" y="${size}" width="${size}" height="${size}" fill="${color}"/>`;
    break;
  }

  case 'zigzag': {
    patternWidth = size * 2;
    const quarter = size / 4;
    patternContent = bgRect +
      `<polyline points="0,${half} ${half},${quarter} ${size},${half} ${size * 1.5},${quarter} ${size * 2},${half}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    patternHeight = size;
    patternWidth = size * 2;
    // Update bgRect for new dimensions
    if (bg !== 'transparent') {
      patternContent = `<rect width="${patternWidth}" height="${patternHeight}" fill="${bg}"/>` +
        `<polyline points="0,${half} ${half},${quarter} ${size},${half} ${size * 1.5},${quarter} ${size * 2},${half}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    }
    break;
  }

  case 'hexagons': {
    // Hexagon pattern
    const h = size * Math.sqrt(3) / 2;
    patternWidth = size * 1.5;
    patternHeight = h * 2;
    const hexBg = bg !== 'transparent' ? `<rect width="${patternWidth}" height="${patternHeight}" fill="${bg}"/>` : '';
    // Draw hexagon outline
    const hex = `<polygon points="${size/4},0 ${size*3/4},0 ${size},${h} ${size*3/4},${h*2} ${size/4},${h*2} 0,${h}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    patternContent = hexBg + hex;
    break;
  }

  case 'triangles': {
    patternWidth = size;
    patternHeight = size * Math.sqrt(3) / 2;
    const triBg = bg !== 'transparent' ? `<rect width="${patternWidth}" height="${patternHeight}" fill="${bg}"/>` : '';
    patternContent = triBg +
      `<polygon points="0,${patternHeight} ${half},0 ${size},${patternHeight}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    break;
  }
}

// Build complete pattern element
let patternEl = `<pattern id="${id}" width="${patternWidth}" height="${patternHeight}" patternUnits="userSpaceOnUse"`;

// Add rotation if specified
if (opts.angle !== '0') {
  patternEl += ` patternTransform="rotate(${opts.angle})"`;
}

patternEl += `>${patternContent}</pattern>`;

// Find or create <defs> section
const defsMatch = svgContent.match(/<defs[^>]*>/i);
if (defsMatch) {
  const insertPos = defsMatch.index + defsMatch[0].length;
  svgContent = svgContent.slice(0, insertPos) + '\n' + patternEl + svgContent.slice(insertPos);
} else {
  const svgOpenMatch = svgContent.match(/<svg[^>]*>/i);
  if (svgOpenMatch) {
    const insertPos = svgOpenMatch.index + svgOpenMatch[0].length;
    svgContent = svgContent.slice(0, insertPos) + '\n<defs>\n' + patternEl + '\n</defs>' + svgContent.slice(insertPos);
  } else {
    console.error('Could not find <svg> tag');
    process.exit(1);
  }
}

fs.writeFileSync(file, svgContent);
console.log(`Added ${type} pattern "${id}" (size: ${size})`);
console.log(`Apply with: fill="url(#${id})"`);
