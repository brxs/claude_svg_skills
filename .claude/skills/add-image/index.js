// Skill: Add embedded images to SVG files
// Usage: node .claude/skills/add-image/index.js <svg-file> <image-src> <x> <y> <width> <height> [options]
import fs from 'fs';
import path from 'path';

const [,, file, imageSrc, x, y, width, height, ...options] = process.argv;

if (!file || !imageSrc || x === undefined || y === undefined || !width || !height) {
  console.error('Usage: node index.js <svg-file> <image-src> <x> <y> <width> <height> [options]');
  console.error('');
  console.error('Arguments:');
  console.error('  image-src      - Path to image file or URL');
  console.error('  x, y           - Position');
  console.error('  width, height  - Dimensions');
  console.error('');
  console.error('Options:');
  console.error('  preserve=<none|xMidYMid|xMinYMin|...> - Aspect ratio (default: xMidYMid)');
  console.error('  meet|slice     - Scale mode (default: meet)');
  console.error('  opacity=<0-1>  - Image opacity');
  console.error('  id=<id>        - Element ID');
  console.error('  clip-path=<url(#id)> - Apply clip path');
  console.error('  mask=<url(#id)>      - Apply mask');
  console.error('  filter=<url(#id)>    - Apply filter');
  console.error('  embed=true     - Embed as base64 data URI');
  console.error('');
  console.error('Preserve Aspect Ratio:');
  console.error('  none           - Stretch to fill (ignore aspect ratio)');
  console.error('  xMidYMid       - Center (default)');
  console.error('  xMinYMin       - Top-left');
  console.error('  xMaxYMax       - Bottom-right');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg photo.jpg 50 50 200 150');
  console.error('  node index.js out.svg logo.png 0 0 100 100 preserve=none');
  console.error('  node index.js out.svg bg.jpg 0 0 400 400 opacity=0.5');
  console.error('  node index.js out.svg icon.png 10 10 50 50 embed=true');
  process.exit(1);
}

// Parse options
const opts = {
  preserve: 'xMidYMid',
  mode: 'meet'
};

for (const opt of options) {
  if (opt === 'meet' || opt === 'slice') {
    opts.mode = opt;
  } else if (opt.includes('=')) {
    const eqIdx = opt.indexOf('=');
    const key = opt.slice(0, eqIdx);
    const val = opt.slice(eqIdx + 1);
    opts[key] = val;
  }
}

let svgContent = fs.readFileSync(file, 'utf8');

// Determine image href
let imageHref = imageSrc;

// Handle embedding as base64
if (opts.embed === 'true' && !imageSrc.startsWith('http') && !imageSrc.startsWith('data:')) {
  try {
    const imagePath = path.isAbsolute(imageSrc) ? imageSrc : path.resolve(path.dirname(file), imageSrc);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');

    // Determine MIME type from extension
    const ext = path.extname(imageSrc).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp'
    };
    const mimeType = mimeTypes[ext] || 'image/png';

    imageHref = `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.error(`Warning: Could not embed image: ${err.message}`);
    console.error('Using path reference instead.');
  }
}

// Build preserveAspectRatio attribute
let preserveAspectRatio = '';
if (opts.preserve === 'none') {
  preserveAspectRatio = 'none';
} else {
  preserveAspectRatio = `${opts.preserve} ${opts.mode}`;
}

// Build image element
let imageEl = `<image href="${imageHref}" x="${x}" y="${y}" width="${width}" height="${height}"`;

imageEl += ` preserveAspectRatio="${preserveAspectRatio}"`;

if (opts.id) imageEl += ` id="${opts.id}"`;
if (opts.opacity) imageEl += ` opacity="${opts.opacity}"`;
if (opts['clip-path']) imageEl += ` clip-path="${opts['clip-path']}"`;
if (opts.mask) imageEl += ` mask="${opts.mask}"`;
if (opts.filter) imageEl += ` filter="${opts.filter}"`;

imageEl += '/>';

// Insert before </svg>
const closingSvg = svgContent.lastIndexOf('</svg>');
if (closingSvg === -1) {
  console.error('Could not find closing </svg> tag');
  process.exit(1);
}

svgContent = svgContent.slice(0, closingSvg) + imageEl + '\n' + svgContent.slice(closingSvg);

fs.writeFileSync(file, svgContent);

const embedded = imageHref.startsWith('data:') ? ' (embedded)' : '';
console.log(`Added image at (${x}, ${y}) ${width}×${height}${embedded}`);
