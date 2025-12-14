// Skill: Add mask definitions for alpha/gradient masking
// Usage: node .claude/skills/add-mask/index.js <svg-file> <type> <id> [...args]
import fs from 'fs';

const [,, file, type, id, ...args] = process.argv;

const validTypes = ['circle', 'rect', 'ellipse', 'radial-fade', 'linear-fade', 'vignette'];

if (!file || !type || !id) {
  console.error('Usage: node index.js <svg-file> <type> <id> [...args]');
  console.error('');
  console.error('Shape masks (hard edge):');
  console.error('  circle <cx> <cy> <r>           - Circular mask');
  console.error('  rect <x> <y> <width> <height>  - Rectangular mask');
  console.error('  ellipse <cx> <cy> <rx> <ry>    - Elliptical mask');
  console.error('');
  console.error('Gradient masks (soft edge):');
  console.error('  radial-fade [cx] [cy] [r]      - Fade from center outward');
  console.error('  linear-fade [angle]            - Directional fade');
  console.error('  vignette [inset] [softness]    - Soft edge vignette');
  console.error('');
  console.error('Options (append to any command):');
  console.error('  invert=true                    - Invert the mask');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg circle spotlight 200 200 100');
  console.error('  node index.js out.svg radial-fade centerFade');
  console.error('  node index.js out.svg linear-fade topFade 90');
  console.error('  node index.js out.svg vignette soft 30 50');
  console.error('');
  console.error('Apply with edit-element:');
  console.error('  node .claude/skills/edit-element/index.js out.svg rect mask "url(#spotlight)"');
  process.exit(1);
}

if (!validTypes.includes(type)) {
  console.error(`Unknown mask type: ${type}`);
  console.error(`Valid types: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Parse options from args
const opts = {};
const positionalArgs = [];

for (const arg of args) {
  if (arg.includes('=')) {
    const [key, val] = arg.split('=');
    opts[key] = val;
  } else {
    positionalArgs.push(arg);
  }
}

let svgContent = fs.readFileSync(file, 'utf8');

// Get canvas dimensions for defaults
const viewBoxMatch = svgContent.match(/viewBox="0 0 (\d+) (\d+)"/);
const widthMatch = svgContent.match(/width="(\d+)"/);
const heightMatch = svgContent.match(/height="(\d+)"/);

const canvasWidth = viewBoxMatch ? parseInt(viewBoxMatch[1]) : (widthMatch ? parseInt(widthMatch[1]) : 400);
const canvasHeight = viewBoxMatch ? parseInt(viewBoxMatch[2]) : (heightMatch ? parseInt(heightMatch[1]) : 400);
const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;

// Build mask content
let maskContent = '';
let needsGradient = false;
let gradientDef = '';
const gradientId = `${id}-gradient`;

switch (type) {
  case 'circle': {
    const [cx = centerX, cy = centerY, r = '100'] = positionalArgs;
    maskContent = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/>`;
    break;
  }

  case 'rect': {
    const [x = '0', y = '0', width = canvasWidth, height = canvasHeight] = positionalArgs;
    maskContent = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="white"/>`;
    break;
  }

  case 'ellipse': {
    const [cx = centerX, cy = centerY, rx = '150', ry = '100'] = positionalArgs;
    maskContent = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="white"/>`;
    break;
  }

  case 'radial-fade': {
    const [cx = centerX, cy = centerY, r = Math.min(canvasWidth, canvasHeight) / 2] = positionalArgs;
    needsGradient = true;

    if (opts.invert === 'true') {
      gradientDef = `<radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="black"/>
    <stop offset="100%" stop-color="white"/>
  </radialGradient>`;
    } else {
      gradientDef = `<radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="white"/>
    <stop offset="100%" stop-color="black"/>
  </radialGradient>`;
    }

    maskContent = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${gradientId})"/>`;
    break;
  }

  case 'linear-fade': {
    const [angle = '0'] = positionalArgs;
    needsGradient = true;

    // Convert angle to gradient coordinates
    const angleRad = (parseFloat(angle) * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const x1 = Math.round(50 - cos * 50);
    const y1 = Math.round(50 - sin * 50);
    const x2 = Math.round(50 + cos * 50);
    const y2 = Math.round(50 + sin * 50);

    if (opts.invert === 'true') {
      gradientDef = `<linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
    <stop offset="0%" stop-color="black"/>
    <stop offset="100%" stop-color="white"/>
  </linearGradient>`;
    } else {
      gradientDef = `<linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
    <stop offset="0%" stop-color="white"/>
    <stop offset="100%" stop-color="black"/>
  </linearGradient>`;
    }

    maskContent = `<rect x="0" y="0" width="${canvasWidth}" height="${canvasHeight}" fill="url(#${gradientId})"/>`;
    break;
  }

  case 'vignette': {
    const [inset = '20', softness = '30'] = positionalArgs;
    const insetVal = parseFloat(inset);
    const softnessVal = parseFloat(softness);

    needsGradient = true;

    // Calculate inner and outer radii for vignette
    const outerRadius = Math.sqrt(centerX * centerX + centerY * centerY);
    const innerOffset = (100 - softnessVal) / 100;

    if (opts.invert === 'true') {
      gradientDef = `<radialGradient id="${gradientId}" cx="50%" cy="50%" r="70%">
    <stop offset="${innerOffset * 100}%" stop-color="black"/>
    <stop offset="100%" stop-color="white"/>
  </radialGradient>`;
    } else {
      gradientDef = `<radialGradient id="${gradientId}" cx="50%" cy="50%" r="70%">
    <stop offset="${innerOffset * 100}%" stop-color="white"/>
    <stop offset="100%" stop-color="black"/>
  </radialGradient>`;
    }

    // Use inset to create padding effect
    maskContent = `<rect x="${insetVal}" y="${insetVal}" width="${canvasWidth - insetVal * 2}" height="${canvasHeight - insetVal * 2}" fill="url(#${gradientId})"/>`;
    break;
  }
}

// Build complete mask element
const maskEl = `<mask id="${id}">${maskContent}</mask>`;

// Find or create <defs> section
const defsMatch = svgContent.match(/<defs[^>]*>/i);
if (defsMatch) {
  const insertPos = defsMatch.index + defsMatch[0].length;
  const toInsert = needsGradient ? '\n' + gradientDef + '\n' + maskEl : '\n' + maskEl;
  svgContent = svgContent.slice(0, insertPos) + toInsert + svgContent.slice(insertPos);
} else {
  const svgOpenMatch = svgContent.match(/<svg[^>]*>/i);
  if (svgOpenMatch) {
    const insertPos = svgOpenMatch.index + svgOpenMatch[0].length;
    const defsContent = needsGradient ? gradientDef + '\n' + maskEl : maskEl;
    svgContent = svgContent.slice(0, insertPos) + '\n<defs>\n' + defsContent + '\n</defs>' + svgContent.slice(insertPos);
  } else {
    console.error('Could not find <svg> tag');
    process.exit(1);
  }
}

fs.writeFileSync(file, svgContent);
console.log(`Added ${type} mask "${id}"`);
console.log(`Apply with: mask="url(#${id})"`);
