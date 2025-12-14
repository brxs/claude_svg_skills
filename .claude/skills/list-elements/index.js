// Skill: List and inspect SVG elements
// Usage: node .claude/skills/list-elements/index.js <svg-file> [filter] [options]
import fs from 'fs';

const [,, file, filter, ...options] = process.argv;

if (!file) {
  console.error('Usage: node index.js <svg-file> [filter] [options]');
  console.error('');
  console.error('Filter (optional):');
  console.error('  path           - Show only paths');
  console.error('  circle         - Show only circles');
  console.error('  defs           - Show definitions (gradients, filters, etc.)');
  console.error('  all            - Show all elements (default)');
  console.error('');
  console.error('Options:');
  console.error('  --verbose      - Show all attributes');
  console.error('  --summary      - Show only counts');
  console.error('  --tree         - Show hierarchy tree');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg');
  console.error('  node index.js out.svg path');
  console.error('  node index.js out.svg defs');
  console.error('  node index.js out.svg all --verbose');
  console.error('  node index.js out.svg --summary');
  process.exit(1);
}

const verbose = options.includes('--verbose');
const summary = options.includes('--summary');
const tree = options.includes('--tree');

let svgContent = fs.readFileSync(file, 'utf8');

// Get canvas info
const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
const widthMatch = svgContent.match(/width="(\d+)"/);
const heightMatch = svgContent.match(/height="(\d+)"/);

console.log('╔════════════════════════════════════════╗');
console.log('║           SVG STRUCTURE                ║');
console.log('╚════════════════════════════════════════╝');
console.log('');
console.log(`File: ${file}`);
if (widthMatch && heightMatch) {
  console.log(`Size: ${widthMatch[1]} × ${heightMatch[1]}`);
}
if (viewBoxMatch) {
  console.log(`ViewBox: ${viewBoxMatch[1]}`);
}
console.log('');

// Shape elements to look for
const shapeTypes = ['rect', 'circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'text', 'image', 'use'];
const defTypes = ['linearGradient', 'radialGradient', 'filter', 'clipPath', 'mask', 'pattern', 'marker', 'symbol'];
const containerTypes = ['g', 'svg', 'defs'];

// Count elements
const counts = {};
const elements = [];

// Function to extract key attributes
function getKeyAttrs(tag, content) {
  const attrs = {};

  // Common attributes
  const idMatch = content.match(/id="([^"]*)"/);
  if (idMatch) attrs.id = idMatch[1];

  const fillMatch = content.match(/fill="([^"]*)"/);
  if (fillMatch && fillMatch[1] !== 'none') attrs.fill = fillMatch[1];

  const strokeMatch = content.match(/stroke="([^"]*)"/);
  if (strokeMatch && strokeMatch[1] !== 'none') attrs.stroke = strokeMatch[1];

  const opacityMatch = content.match(/opacity="([^"]*)"/);
  if (opacityMatch) attrs.opacity = opacityMatch[1];

  const transformMatch = content.match(/transform="([^"]*)"/);
  if (transformMatch) attrs.transform = transformMatch[1];

  const filterMatch = content.match(/filter="([^"]*)"/);
  if (filterMatch) attrs.filter = filterMatch[1];

  const clipPathMatch = content.match(/clip-path="([^"]*)"/);
  if (clipPathMatch) attrs.clipPath = clipPathMatch[1];

  // Type-specific attributes
  switch (tag) {
    case 'rect':
      const rx = content.match(/x="([^"]*)"/);
      const ry = content.match(/y="([^"]*)"/);
      const rw = content.match(/width="([^"]*)"/);
      const rh = content.match(/height="([^"]*)"/);
      if (rx) attrs.x = rx[1];
      if (ry) attrs.y = ry[1];
      if (rw) attrs.width = rw[1];
      if (rh) attrs.height = rh[1];
      break;

    case 'circle':
      const cx = content.match(/cx="([^"]*)"/);
      const cy = content.match(/cy="([^"]*)"/);
      const cr = content.match(/r="([^"]*)"/);
      if (cx) attrs.cx = cx[1];
      if (cy) attrs.cy = cy[1];
      if (cr) attrs.r = cr[1];
      break;

    case 'ellipse':
      const ex = content.match(/cx="([^"]*)"/);
      const ey = content.match(/cy="([^"]*)"/);
      const erx = content.match(/rx="([^"]*)"/);
      const ery = content.match(/ry="([^"]*)"/);
      if (ex) attrs.cx = ex[1];
      if (ey) attrs.cy = ey[1];
      if (erx) attrs.rx = erx[1];
      if (ery) attrs.ry = ery[1];
      break;

    case 'line':
      const lx1 = content.match(/x1="([^"]*)"/);
      const ly1 = content.match(/y1="([^"]*)"/);
      const lx2 = content.match(/x2="([^"]*)"/);
      const ly2 = content.match(/y2="([^"]*)"/);
      if (lx1) attrs.x1 = lx1[1];
      if (ly1) attrs.y1 = ly1[1];
      if (lx2) attrs.x2 = lx2[1];
      if (ly2) attrs.y2 = ly2[1];
      break;

    case 'text':
      const tx = content.match(/x="([^"]*)"/);
      const ty = content.match(/y="([^"]*)"/);
      const fontSize = content.match(/font-size="([^"]*)"/);
      if (tx) attrs.x = tx[1];
      if (ty) attrs.y = ty[1];
      if (fontSize) attrs.fontSize = fontSize[1];
      // Try to get text content
      const textContent = content.match(/>([^<]*)</);
      if (textContent) attrs.text = textContent[1].substring(0, 20) + (textContent[1].length > 20 ? '...' : '');
      break;

    case 'path':
      const d = content.match(/d="([^"]*)"/);
      if (d) attrs.d = d[1].substring(0, 30) + (d[1].length > 30 ? '...' : '');
      break;

    case 'use':
      const href = content.match(/href="([^"]*)"/);
      const ux = content.match(/x="([^"]*)"/);
      const uy = content.match(/y="([^"]*)"/);
      if (href) attrs.href = href[1];
      if (ux) attrs.x = ux[1];
      if (uy) attrs.y = uy[1];
      break;

    case 'linearGradient':
    case 'radialGradient':
      const stops = (content.match(/<stop/g) || []).length;
      attrs.stops = stops;
      break;

    case 'filter':
      const effects = content.match(/<fe\w+/g) || [];
      attrs.effects = effects.length;
      break;
  }

  return attrs;
}

// Find all elements
const allTypes = [...shapeTypes, ...defTypes, ...containerTypes];

for (const type of allTypes) {
  const pattern = new RegExp(`<${type}[\\s>]`, 'gi');
  const matches = [...svgContent.matchAll(pattern)];

  if (matches.length > 0) {
    counts[type] = matches.length;

    matches.forEach((match, idx) => {
      // Get the full opening tag or self-closing element
      const start = match.index;
      const tagEnd = svgContent.indexOf('>', start);
      const tagContent = svgContent.slice(start, tagEnd + 1);

      elements.push({
        type,
        index: idx,
        position: start,
        attrs: getKeyAttrs(type, tagContent)
      });
    });
  }
}

// Sort by position
elements.sort((a, b) => a.position - b.position);

// Summary mode
if (summary) {
  console.log('Element Counts:');
  console.log('─'.repeat(30));

  const shapes = shapeTypes.filter(t => counts[t]);
  const defs = defTypes.filter(t => counts[t]);
  const containers = containerTypes.filter(t => counts[t] && t !== 'svg');

  if (shapes.length) {
    console.log('\nShapes:');
    shapes.forEach(t => console.log(`  ${t}: ${counts[t]}`));
  }

  if (defs.length) {
    console.log('\nDefinitions:');
    defs.forEach(t => console.log(`  ${t}: ${counts[t]}`));
  }

  if (containers.length) {
    console.log('\nContainers:');
    containers.forEach(t => console.log(`  ${t}: ${counts[t]}`));
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0) - (counts.svg || 0);
  console.log(`\nTotal: ${total} elements`);
  process.exit(0);
}

// Filter elements
let displayElements = elements.filter(e => e.type !== 'svg');

if (filter && filter !== 'all' && !filter.startsWith('--')) {
  if (filter === 'defs') {
    displayElements = elements.filter(e => defTypes.includes(e.type));
  } else {
    displayElements = elements.filter(e => e.type === filter);
  }
}

// Display elements
if (filter === 'defs' || (!filter && defTypes.some(t => counts[t]))) {
  const defsElements = elements.filter(e => defTypes.includes(e.type));
  if (defsElements.length > 0) {
    console.log('┌─ DEFINITIONS ─────────────────────────┐');
    defsElements.forEach(el => {
      const attrStr = Object.entries(el.attrs)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      console.log(`│ ${el.type}${el.attrs.id ? '#' + el.attrs.id : ''}`);
      if (verbose && attrStr) {
        console.log(`│   ${attrStr}`);
      }
    });
    console.log('└' + '─'.repeat(40) + '┘');
    console.log('');
  }
}

if (filter !== 'defs') {
  const shapeElements = displayElements.filter(e => shapeTypes.includes(e.type) || e.type === 'g');

  if (shapeElements.length > 0) {
    console.log('┌─ ELEMENTS ─────────────────────────────┐');

    // Track counts per type for indexing
    const typeIndices = {};

    shapeElements.forEach(el => {
      if (!typeIndices[el.type]) typeIndices[el.type] = 0;
      const idx = typeIndices[el.type]++;

      let line = `│ ${el.type}:${idx}`;

      if (el.attrs.id) {
        line += ` #${el.attrs.id}`;
      }

      // Add key info based on type
      if (el.type === 'circle' && el.attrs.cx) {
        line += ` (${el.attrs.cx}, ${el.attrs.cy}) r=${el.attrs.r}`;
      } else if (el.type === 'rect' && el.attrs.x) {
        line += ` (${el.attrs.x}, ${el.attrs.y}) ${el.attrs.width}×${el.attrs.height}`;
      } else if (el.type === 'line') {
        line += ` (${el.attrs.x1},${el.attrs.y1})→(${el.attrs.x2},${el.attrs.y2})`;
      } else if (el.type === 'text' && el.attrs.text) {
        line += ` "${el.attrs.text}"`;
      } else if (el.type === 'use' && el.attrs.href) {
        line += ` → ${el.attrs.href}`;
      }

      // Add fill/stroke info
      const style = [];
      if (el.attrs.fill && el.attrs.fill !== '#000') style.push(`fill:${el.attrs.fill}`);
      if (el.attrs.stroke) style.push(`stroke:${el.attrs.stroke}`);
      if (el.attrs.opacity) style.push(`opacity:${el.attrs.opacity}`);

      if (style.length && !verbose) {
        line += ` [${style.join(', ')}]`;
      }

      console.log(line);

      if (verbose) {
        const attrStr = Object.entries(el.attrs)
          .filter(([k]) => !['id'].includes(k))
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
        if (attrStr) {
          console.log(`│   ${attrStr}`);
        }
      }
    });

    console.log('└' + '─'.repeat(40) + '┘');
  }
}

// Show selector hints
console.log('');
console.log('Selectors for other skills:');
Object.keys(counts)
  .filter(t => shapeTypes.includes(t) || t === 'g')
  .forEach(t => {
    if (counts[t] === 1) {
      console.log(`  ${t}:0`);
    } else if (counts[t] > 1) {
      console.log(`  ${t}:0 ... ${t}:${counts[t] - 1}`);
    }
  });
