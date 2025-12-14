// Skill: Add text that follows a path
// Usage: node .claude/skills/add-textPath/index.js <svg-file> <mode> <text> [...args] [options]
import fs from 'fs';

const [,, file, mode, text, ...args] = process.argv;

const validModes = ['path', 'circle', 'arc', 'wave'];

if (!file || !mode || !text) {
  console.error('Usage: node index.js <svg-file> <mode> <text> [...args] [options]');
  console.error('');
  console.error('Modes:');
  console.error('  path <path-id>              - Follow existing path by ID');
  console.error('  circle <cx> <cy> <r>        - Text around a circle');
  console.error('  arc <cx> <cy> <r> <start> <end> - Text along an arc (degrees)');
  console.error('  wave <y> <amplitude> <freq> - Wavy text');
  console.error('');
  console.error('Options:');
  console.error('  font-size=<n>               - Font size (default: 16)');
  console.error('  fill=<color>                - Text color (default: #000)');
  console.error('  font-family=<name>          - Font family (default: sans-serif)');
  console.error('  font-weight=<n>             - Font weight');
  console.error('  letter-spacing=<n>          - Letter spacing');
  console.error('  offset=<n>                  - Start offset along path (default: 0)');
  console.error('  side=<left|right>           - Which side of path (default: left)');
  console.error('  id=<id>                     - ID for the text element');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg path "Follow me" myPathId');
  console.error('  node index.js out.svg circle "Around the circle" 200 200 100');
  console.error('  node index.js out.svg arc "Curved text" 200 200 120 180 360');
  console.error('  node index.js out.svg wave "Wavy text here" 200 20 0.05');
  console.error('  node index.js out.svg circle "Styled" 200 200 80 font-size=24 fill=#E53935');
  process.exit(1);
}

if (!validModes.includes(mode)) {
  console.error(`Unknown mode: ${mode}`);
  console.error(`Valid modes: ${validModes.join(', ')}`);
  process.exit(1);
}

// Parse options and positional args
const opts = {
  'font-size': '16',
  'fill': '#000',
  'font-family': 'sans-serif',
  'offset': '0'
};
const positionalArgs = [];

for (const arg of args) {
  if (arg.includes('=')) {
    const eqIdx = arg.indexOf('=');
    const key = arg.slice(0, eqIdx);
    const val = arg.slice(eqIdx + 1);
    opts[key] = val;
  } else {
    positionalArgs.push(arg);
  }
}

let svgContent = fs.readFileSync(file, 'utf8');

// Get canvas dimensions
const viewBoxMatch = svgContent.match(/viewBox="0 0 (\d+) (\d+)"/);
const widthMatch = svgContent.match(/width="(\d+)"/);
const canvasWidth = viewBoxMatch ? parseInt(viewBoxMatch[1]) : (widthMatch ? parseInt(widthMatch[1]) : 400);

// Generate unique ID for path if needed
const pathId = opts.id ? `${opts.id}-path` : `textPath-${Date.now()}`;
let pathDef = '';
let useExistingPath = false;

switch (mode) {
  case 'path': {
    // Use existing path
    const existingPathId = positionalArgs[0];
    if (!existingPathId) {
      console.error('path mode requires a path ID argument');
      process.exit(1);
    }
    useExistingPath = true;
    break;
  }

  case 'circle': {
    const [cx = '200', cy = '200', r = '100'] = positionalArgs;
    const radius = parseFloat(r);
    const centerX = parseFloat(cx);
    const centerY = parseFloat(cy);

    // Create circular path (two arcs)
    pathDef = `<path id="${pathId}" d="M ${centerX - radius},${centerY} A ${radius},${radius} 0 1,1 ${centerX + radius},${centerY} A ${radius},${radius} 0 1,1 ${centerX - radius},${centerY}" fill="none" stroke="none"/>`;
    break;
  }

  case 'arc': {
    const [cx = '200', cy = '200', r = '100', startAngle = '0', endAngle = '180'] = positionalArgs;
    const radius = parseFloat(r);
    const centerX = parseFloat(cx);
    const centerY = parseFloat(cy);
    const start = (parseFloat(startAngle) - 90) * Math.PI / 180; // -90 to start from top
    const end = (parseFloat(endAngle) - 90) * Math.PI / 180;

    const x1 = centerX + radius * Math.cos(start);
    const y1 = centerY + radius * Math.sin(start);
    const x2 = centerX + radius * Math.cos(end);
    const y2 = centerY + radius * Math.sin(end);

    const largeArc = Math.abs(parseFloat(endAngle) - parseFloat(startAngle)) > 180 ? 1 : 0;

    pathDef = `<path id="${pathId}" d="M ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2}" fill="none" stroke="none"/>`;
    break;
  }

  case 'wave': {
    const [y = '200', amplitude = '20', frequency = '0.05'] = positionalArgs;
    const yPos = parseFloat(y);
    const amp = parseFloat(amplitude);
    const freq = parseFloat(frequency);

    // Generate wavy path
    let d = `M 0,${yPos}`;
    for (let x = 0; x <= canvasWidth; x += 5) {
      const waveY = yPos + amp * Math.sin(x * freq * Math.PI * 2);
      d += ` L ${x},${waveY.toFixed(2)}`;
    }

    pathDef = `<path id="${pathId}" d="${d}" fill="none" stroke="none"/>`;
    break;
  }
}

// Build text element with textPath
const refId = useExistingPath ? positionalArgs[0] : pathId;

let textEl = `<text`;
if (opts.id) textEl += ` id="${opts.id}"`;
textEl += ` font-size="${opts['font-size']}" fill="${opts.fill}" font-family="${opts['font-family']}"`;
if (opts['font-weight']) textEl += ` font-weight="${opts['font-weight']}"`;
if (opts['letter-spacing']) textEl += ` letter-spacing="${opts['letter-spacing']}"`;
textEl += `>`;

textEl += `<textPath href="#${refId}"`;
if (opts.offset !== '0') textEl += ` startOffset="${opts.offset}"`;
if (opts.side) textEl += ` side="${opts.side}"`;
textEl += `>${text}</textPath>`;
textEl += `</text>`;

// Add path definition to defs if needed
if (pathDef) {
  const defsMatch = svgContent.match(/<defs[^>]*>/i);
  if (defsMatch) {
    const insertPos = defsMatch.index + defsMatch[0].length;
    svgContent = svgContent.slice(0, insertPos) + '\n' + pathDef + svgContent.slice(insertPos);
  } else {
    const svgOpenMatch = svgContent.match(/<svg[^>]*>/i);
    if (svgOpenMatch) {
      const insertPos = svgOpenMatch.index + svgOpenMatch[0].length;
      svgContent = svgContent.slice(0, insertPos) + '\n<defs>\n' + pathDef + '\n</defs>' + svgContent.slice(insertPos);
    }
  }
}

// Add text element before </svg>
const closingSvg = svgContent.lastIndexOf('</svg>');
svgContent = svgContent.slice(0, closingSvg) + textEl + '\n' + svgContent.slice(closingSvg);

fs.writeFileSync(file, svgContent);

if (useExistingPath) {
  console.log(`Added text along path "#${refId}"`);
} else {
  console.log(`Added ${mode} text path "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`);
}
