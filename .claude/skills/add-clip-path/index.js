// Skill: Add clip path definitions to SVG files
// Usage: node .claude/skills/add-clip-path/index.js <svg-file> <shape> <id> [...args]
import fs from 'fs';

const [,, file, shape, id, ...args] = process.argv;

const validShapes = ['circle', 'rect', 'ellipse', 'polygon', 'path', 'inset'];

if (!file || !shape || !id) {
  console.error('Usage: node index.js <svg-file> <shape> <id> [...args]');
  console.error('');
  console.error('Shapes:');
  console.error('  circle <cx> <cy> <r>           - Circular clip');
  console.error('  ellipse <cx> <cy> <rx> <ry>    - Elliptical clip');
  console.error('  rect <x> <y> <width> <height> [rx] [ry] - Rectangular clip');
  console.error('  inset <top> <right> <bottom> <left> [rx] - Inset rectangle');
  console.error('  polygon <points>               - Polygon clip (e.g., "100,0 200,200 0,200")');
  console.error('  path <d>                       - Path clip (SVG path data)');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg circle clipCircle 200 200 100');
  console.error('  node index.js out.svg rect clipRect 50 50 300 300');
  console.error('  node index.js out.svg rect clipRounded 50 50 300 300 20 20');
  console.error('  node index.js out.svg inset clipInset 20 20 20 20');
  console.error('  node index.js out.svg ellipse clipOval 200 200 150 100');
  console.error('  node index.js out.svg polygon clipTriangle "200,50 350,350 50,350"');
  console.error('  node index.js out.svg path clipCustom "M100,100 L300,100 L200,300 Z"');
  console.error('');
  console.error('Apply with edit-element:');
  console.error('  node .claude/skills/edit-element/index.js out.svg rect clip-path "url(#clipCircle)"');
  process.exit(1);
}

if (!validShapes.includes(shape)) {
  console.error(`Unknown shape: ${shape}`);
  console.error(`Valid shapes: ${validShapes.join(', ')}`);
  process.exit(1);
}

let svgContent = fs.readFileSync(file, 'utf8');

// Build clip path content based on shape
let clipContent = '';

switch (shape) {
  case 'circle': {
    const [cx = '200', cy = '200', r = '100'] = args;
    clipContent = `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
    break;
  }

  case 'ellipse': {
    const [cx = '200', cy = '200', rx = '150', ry = '100'] = args;
    clipContent = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
    break;
  }

  case 'rect': {
    const [x = '0', y = '0', width = '400', height = '400', rx, ry] = args;
    clipContent = `<rect x="${x}" y="${y}" width="${width}" height="${height}"`;
    if (rx) clipContent += ` rx="${rx}"`;
    if (ry) clipContent += ` ry="${ry}"`;
    clipContent += '/>';
    break;
  }

  case 'inset': {
    // Inset from edges - calculate rect from canvas size
    const [top = '0', right = '0', bottom = '0', left = '0', rx] = args;
    // Try to get canvas size from viewBox or width/height
    const viewBoxMatch = svgContent.match(/viewBox="0 0 (\d+) (\d+)"/);
    const widthMatch = svgContent.match(/width="(\d+)"/);
    const heightMatch = svgContent.match(/height="(\d+)"/);

    const canvasWidth = viewBoxMatch ? parseInt(viewBoxMatch[1]) : (widthMatch ? parseInt(widthMatch[1]) : 400);
    const canvasHeight = viewBoxMatch ? parseInt(viewBoxMatch[2]) : (heightMatch ? parseInt(heightMatch[1]) : 400);

    const x = parseInt(left);
    const y = parseInt(top);
    const width = canvasWidth - parseInt(left) - parseInt(right);
    const height = canvasHeight - parseInt(top) - parseInt(bottom);

    clipContent = `<rect x="${x}" y="${y}" width="${width}" height="${height}"`;
    if (rx) clipContent += ` rx="${rx}" ry="${rx}"`;
    clipContent += '/>';
    break;
  }

  case 'polygon': {
    const [points = '200,0 400,400 0,400'] = args;
    clipContent = `<polygon points="${points}"/>`;
    break;
  }

  case 'path': {
    const [d = 'M0,0 L400,0 L400,400 L0,400 Z'] = args;
    clipContent = `<path d="${d}"/>`;
    break;
  }
}

// Build complete clipPath element
const clipPathEl = `<clipPath id="${id}">${clipContent}</clipPath>`;

// Find or create <defs> section
const defsMatch = svgContent.match(/<defs[^>]*>/i);
if (defsMatch) {
  const insertPos = defsMatch.index + defsMatch[0].length;
  svgContent = svgContent.slice(0, insertPos) + '\n' + clipPathEl + svgContent.slice(insertPos);
} else {
  const svgOpenMatch = svgContent.match(/<svg[^>]*>/i);
  if (svgOpenMatch) {
    const insertPos = svgOpenMatch.index + svgOpenMatch[0].length;
    svgContent = svgContent.slice(0, insertPos) + '\n<defs>\n' + clipPathEl + '\n</defs>' + svgContent.slice(insertPos);
  } else {
    console.error('Could not find <svg> tag');
    process.exit(1);
  }
}

fs.writeFileSync(file, svgContent);
console.log(`Added ${shape} clip path "${id}"`);
console.log(`Apply with: clip-path="url(#${id})"`);
