// Skill: Add gradient definitions to SVG files
// Usage: node .claude/skills/add-gradient/index.js <svg-file> <type> <id> <colors> [options]
import fs from 'fs';

const [,, file, type, id, colors, ...options] = process.argv;

if (!file || !type || !id || !colors) {
  console.error('Usage: node index.js <svg-file> <type> <id> <colors> [options]');
  console.error('');
  console.error('Types:');
  console.error('  linear    - Linear gradient');
  console.error('  radial    - Radial gradient');
  console.error('');
  console.error('Colors: Comma-separated color values');
  console.error('  "#ff0000,#0000ff"           - Two colors, evenly distributed');
  console.error('  "#ff0000@0,#00ff00@50,#0000ff@100" - With explicit stop positions (%)');
  console.error('');
  console.error('Options for linear:');
  console.error('  angle=<degrees>             - Gradient angle (default: 0 = left to right)');
  console.error('  x1=<0-100> y1=<0-100>       - Start point as percentage');
  console.error('  x2=<0-100> y2=<0-100>       - End point as percentage');
  console.error('');
  console.error('Options for radial:');
  console.error('  cx=<0-100> cy=<0-100>       - Center point as percentage (default: 50,50)');
  console.error('  r=<0-100>                   - Radius as percentage (default: 50)');
  console.error('  fx=<0-100> fy=<0-100>       - Focal point as percentage');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg linear grad1 "#E53935,#1E88E5"');
  console.error('  node index.js out.svg linear grad2 "#ff0,#f00" angle=90');
  console.error('  node index.js out.svg radial grad3 "#fff,#000"');
  console.error('  node index.js out.svg linear grad4 "#E53935@0,#FDD835@50,#1E88E5@100"');
  console.error('');
  console.error('Apply with edit-element:');
  console.error('  node .claude/skills/edit-element/index.js out.svg circle fill "url(#grad1)"');
  process.exit(1);
}

// Parse options
const opts = {};
for (const opt of options) {
  const eqIndex = opt.indexOf('=');
  if (eqIndex !== -1) {
    const key = opt.slice(0, eqIndex);
    const val = opt.slice(eqIndex + 1);
    opts[key] = val;
  }
}

// Parse colors and stops
const colorStops = colors.split(',').map((c, i, arr) => {
  const atIndex = c.indexOf('@');
  if (atIndex !== -1) {
    return {
      color: c.slice(0, atIndex),
      offset: c.slice(atIndex + 1)
    };
  }
  // Evenly distribute if no explicit position
  const offset = Math.round((i / (arr.length - 1)) * 100);
  return { color: c, offset: offset.toString() };
});

let svgContent = fs.readFileSync(file, 'utf8');

// Build gradient element
let gradientEl = '';

if (type === 'linear') {
  // Calculate x1, y1, x2, y2 from angle or use explicit values
  let x1 = opts.x1 || '0';
  let y1 = opts.y1 || '0';
  let x2 = opts.x2 || '100';
  let y2 = opts.y2 || '0';

  if (opts.angle !== undefined) {
    const angle = parseFloat(opts.angle);
    const rad = (angle * Math.PI) / 180;
    // Convert angle to gradient vector
    // 0 = left to right, 90 = top to bottom
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    x1 = Math.round(50 - cos * 50).toString();
    y1 = Math.round(50 - sin * 50).toString();
    x2 = Math.round(50 + cos * 50).toString();
    y2 = Math.round(50 + sin * 50).toString();
  }

  gradientEl = `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">`;
  for (const stop of colorStops) {
    gradientEl += `<stop offset="${stop.offset}%" stop-color="${stop.color}"/>`;
  }
  gradientEl += '</linearGradient>';

} else if (type === 'radial') {
  const cx = opts.cx || '50';
  const cy = opts.cy || '50';
  const r = opts.r || '50';
  const fx = opts.fx;
  const fy = opts.fy;

  gradientEl = `<radialGradient id="${id}" cx="${cx}%" cy="${cy}%" r="${r}%"`;
  if (fx !== undefined) gradientEl += ` fx="${fx}%"`;
  if (fy !== undefined) gradientEl += ` fy="${fy}%"`;
  gradientEl += '>';
  for (const stop of colorStops) {
    gradientEl += `<stop offset="${stop.offset}%" stop-color="${stop.color}"/>`;
  }
  gradientEl += '</radialGradient>';

} else {
  console.error(`Unknown gradient type: ${type}`);
  process.exit(1);
}

// Find or create <defs> section
const defsMatch = svgContent.match(/<defs[^>]*>/i);
if (defsMatch) {
  // Insert after opening <defs> tag
  const insertPos = defsMatch.index + defsMatch[0].length;
  svgContent = svgContent.slice(0, insertPos) + '\n' + gradientEl + svgContent.slice(insertPos);
} else {
  // Create <defs> section after opening <svg> tag
  const svgOpenMatch = svgContent.match(/<svg[^>]*>/i);
  if (svgOpenMatch) {
    const insertPos = svgOpenMatch.index + svgOpenMatch[0].length;
    svgContent = svgContent.slice(0, insertPos) + '\n<defs>\n' + gradientEl + '\n</defs>' + svgContent.slice(insertPos);
  } else {
    console.error('Could not find <svg> tag');
    process.exit(1);
  }
}

fs.writeFileSync(file, svgContent);
console.log(`Added ${type} gradient "${id}" with ${colorStops.length} color stops`);
console.log(`Apply with: fill="url(#${id})" or stroke="url(#${id})"`);
