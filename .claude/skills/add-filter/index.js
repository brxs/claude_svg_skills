// Skill: Add filter definitions (blur, shadow, glow, etc.) to SVG files
// Usage: node .claude/skills/add-filter/index.js <svg-file> <type> <id> [options]
import fs from 'fs';

const [,, file, type, id, ...options] = process.argv;

const validTypes = ['blur', 'drop-shadow', 'glow', 'inner-shadow', 'emboss', 'noise', 'saturate', 'grayscale', 'invert', 'sepia', 'brightness', 'contrast'];

if (!file || !type || !id) {
  console.error('Usage: node index.js <svg-file> <type> <id> [options]');
  console.error('');
  console.error('Types:');
  console.error('  blur           - Gaussian blur');
  console.error('  drop-shadow    - Drop shadow effect');
  console.error('  glow           - Outer glow effect');
  console.error('  inner-shadow   - Inner shadow effect');
  console.error('  emboss         - Embossed/raised effect');
  console.error('  noise          - Noise/grain texture');
  console.error('  grayscale      - Convert to grayscale');
  console.error('  sepia          - Sepia tone');
  console.error('  invert         - Invert colors');
  console.error('  saturate       - Adjust saturation');
  console.error('  brightness     - Adjust brightness');
  console.error('  contrast       - Adjust contrast');
  console.error('');
  console.error('Options (vary by type):');
  console.error('  amount=<n>     - Effect strength (default varies)');
  console.error('  color=<color>  - Color for shadow/glow (default: #000)');
  console.error('  dx=<n> dy=<n>  - Offset for shadows (default: 2, 2)');
  console.error('  opacity=<0-1>  - Effect opacity (default: 0.5)');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg blur softBlur amount=3');
  console.error('  node index.js out.svg drop-shadow shadow dx=4 dy=4 color=#000 opacity=0.3');
  console.error('  node index.js out.svg glow redGlow color=#E53935 amount=5');
  console.error('');
  console.error('Apply with edit-element:');
  console.error('  node .claude/skills/edit-element/index.js out.svg circle filter "url(#shadow)"');
  process.exit(1);
}

if (!validTypes.includes(type)) {
  console.error(`Unknown filter type: ${type}`);
  console.error(`Valid types: ${validTypes.join(', ')}`);
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

let svgContent = fs.readFileSync(file, 'utf8');

// Build filter element based on type
let filterContent = '';

switch (type) {
  case 'blur': {
    const amount = opts.amount || '2';
    filterContent = `<feGaussianBlur in="SourceGraphic" stdDeviation="${amount}"/>`;
    break;
  }

  case 'drop-shadow': {
    const dx = opts.dx || '2';
    const dy = opts.dy || '2';
    const amount = opts.amount || '2';
    const color = opts.color || '#000';
    const opacity = opts.opacity || '0.5';
    filterContent = `
    <feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${amount}" flood-color="${color}" flood-opacity="${opacity}"/>`;
    break;
  }

  case 'glow': {
    const amount = opts.amount || '3';
    const color = opts.color || '#fff';
    const opacity = opts.opacity || '0.8';
    filterContent = `
    <feGaussianBlur in="SourceAlpha" stdDeviation="${amount}" result="blur"/>
    <feFlood flood-color="${color}" flood-opacity="${opacity}" result="color"/>
    <feComposite in="color" in2="blur" operator="in" result="glow"/>
    <feMerge>
      <feMergeNode in="glow"/>
      <feMergeNode in="glow"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>`;
    break;
  }

  case 'inner-shadow': {
    const dx = opts.dx || '2';
    const dy = opts.dy || '2';
    const amount = opts.amount || '2';
    const color = opts.color || '#000';
    const opacity = opts.opacity || '0.5';
    filterContent = `
    <feOffset dx="${dx}" dy="${dy}"/>
    <feGaussianBlur stdDeviation="${amount}" result="offset-blur"/>
    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
    <feFlood flood-color="${color}" flood-opacity="${opacity}" result="color"/>
    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
    <feComposite operator="over" in="shadow" in2="SourceGraphic"/>`;
    break;
  }

  case 'emboss': {
    const amount = opts.amount || '1';
    filterContent = `
    <feConvolveMatrix order="3" kernelMatrix="-2 -1 0 -1 1 1 0 1 2" preserveAlpha="true"/>
    <feComponentTransfer>
      <feFuncR type="linear" slope="${amount}" intercept="0.5"/>
      <feFuncG type="linear" slope="${amount}" intercept="0.5"/>
      <feFuncB type="linear" slope="${amount}" intercept="0.5"/>
    </feComponentTransfer>`;
    break;
  }

  case 'noise': {
    const amount = opts.amount || '0.3';
    const freq = opts.freq || '0.7';
    filterContent = `
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="${parseFloat(amount) * 10}" xChannelSelector="R" yChannelSelector="G"/>`;
    break;
  }

  case 'grayscale': {
    const amount = opts.amount || '1';
    const a = parseFloat(amount);
    const r = 0.2126 + 0.7874 * (1 - a);
    const g = 0.7152 - 0.7152 * (1 - a);
    const b = 0.0722 - 0.0722 * (1 - a);
    filterContent = `
    <feColorMatrix type="matrix" values="${r} ${g} ${b} 0 0 ${0.2126 - 0.2126 * (1-a)} ${0.7152 + 0.2848 * (1-a)} ${0.0722 - 0.0722 * (1-a)} 0 0 ${0.2126 - 0.2126 * (1-a)} ${0.7152 - 0.7152 * (1-a)} ${0.0722 + 0.9278 * (1-a)} 0 0 0 0 0 1 0"/>`;
    break;
  }

  case 'sepia': {
    const amount = opts.amount || '1';
    const a = parseFloat(amount);
    filterContent = `
    <feColorMatrix type="matrix" values="${0.393 + 0.607 * (1-a)} ${0.769 - 0.769 * (1-a)} ${0.189 - 0.189 * (1-a)} 0 0 ${0.349 - 0.349 * (1-a)} ${0.686 + 0.314 * (1-a)} ${0.168 - 0.168 * (1-a)} 0 0 ${0.272 - 0.272 * (1-a)} ${0.534 - 0.534 * (1-a)} ${0.131 + 0.869 * (1-a)} 0 0 0 0 0 1 0"/>`;
    break;
  }

  case 'invert': {
    const amount = opts.amount || '1';
    const a = parseFloat(amount);
    const slope = 1 - 2 * a;
    const intercept = a;
    filterContent = `
    <feComponentTransfer>
      <feFuncR type="linear" slope="${slope}" intercept="${intercept}"/>
      <feFuncG type="linear" slope="${slope}" intercept="${intercept}"/>
      <feFuncB type="linear" slope="${slope}" intercept="${intercept}"/>
    </feComponentTransfer>`;
    break;
  }

  case 'saturate': {
    const amount = opts.amount || '2';
    filterContent = `<feColorMatrix type="saturate" values="${amount}"/>`;
    break;
  }

  case 'brightness': {
    const amount = opts.amount || '1.5';
    filterContent = `
    <feComponentTransfer>
      <feFuncR type="linear" slope="${amount}"/>
      <feFuncG type="linear" slope="${amount}"/>
      <feFuncB type="linear" slope="${amount}"/>
    </feComponentTransfer>`;
    break;
  }

  case 'contrast': {
    const amount = opts.amount || '1.5';
    const a = parseFloat(amount);
    const intercept = -(0.5 * a) + 0.5;
    filterContent = `
    <feComponentTransfer>
      <feFuncR type="linear" slope="${a}" intercept="${intercept}"/>
      <feFuncG type="linear" slope="${a}" intercept="${intercept}"/>
      <feFuncB type="linear" slope="${a}" intercept="${intercept}"/>
    </feComponentTransfer>`;
    break;
  }
}

// Build complete filter element with overflow visible for effects that extend beyond bounds
const filterEl = `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%">${filterContent}
</filter>`;

// Find or create <defs> section
const defsMatch = svgContent.match(/<defs[^>]*>/i);
if (defsMatch) {
  const insertPos = defsMatch.index + defsMatch[0].length;
  svgContent = svgContent.slice(0, insertPos) + '\n' + filterEl + svgContent.slice(insertPos);
} else {
  const svgOpenMatch = svgContent.match(/<svg[^>]*>/i);
  if (svgOpenMatch) {
    const insertPos = svgOpenMatch.index + svgOpenMatch[0].length;
    svgContent = svgContent.slice(0, insertPos) + '\n<defs>\n' + filterEl + '\n</defs>' + svgContent.slice(insertPos);
  } else {
    console.error('Could not find <svg> tag');
    process.exit(1);
  }
}

fs.writeFileSync(file, svgContent);
console.log(`Added ${type} filter "${id}"`);
console.log(`Apply with: filter="url(#${id})"`);
