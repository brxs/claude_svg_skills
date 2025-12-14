// Skill: Add SMIL animations to existing SVG elements
// Usage: node .claude/skills/add-animation/index.js <svg-file> <selector> <type> <values> <duration> [options]
import fs from 'fs';

const [,, file, selector, type, values, duration, ...options] = process.argv;

if (!file || !selector || !type || !values || !duration) {
  console.error('Usage: node index.js <svg-file> <selector> <type> <values> <duration> [options]');
  console.error('');
  console.error('Types:');
  console.error('  opacity <values>           - Animate opacity (e.g., "1;0.5;1")');
  console.error('  stroke-opacity <values>    - Animate stroke opacity');
  console.error('  fill-opacity <values>      - Animate fill opacity');
  console.error('  stroke-width <values>      - Animate stroke width');
  console.error('  stroke-dashoffset <values> - Animate dash offset for flowing effect');
  console.error('  rotate <to-angle>          - Rotate animation');
  console.error('  scale <values>             - Scale animation (e.g., "1;1.2;1")');
  console.error('  translate <values>         - Translate animation (e.g., "0,0;10,5;0,0")');
  console.error('');
  console.error('Options:');
  console.error('  repeat=<n|indefinite>      - Repeat count (default: indefinite)');
  console.error('  ease=<linear|ease-in|ease-out|ease-in-out>');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js out.svg path:0 opacity "1;0.5;1" 3s');
  console.error('  node index.js out.svg path stroke-dashoffset "0;20" 2s');
  console.error('  node index.js out.svg circle:0 rotate 360 5s repeat=indefinite');
  process.exit(1);
}

// Parse options
let repeatCount = 'indefinite';
let calcMode = null;
let keySplines = null;

for (const opt of options) {
  const [key, val] = opt.split('=');
  if (key === 'repeat') repeatCount = val;
  if (key === 'ease') {
    if (val === 'linear') {
      calcMode = 'linear';
    } else if (val === 'ease-in') {
      calcMode = 'spline';
      keySplines = '0.42 0 1 1';
    } else if (val === 'ease-out') {
      calcMode = 'spline';
      keySplines = '0 0 0.58 1';
    } else if (val === 'ease-in-out') {
      calcMode = 'spline';
      keySplines = '0.42 0 0.58 1';
    }
  }
}

let svgContent = fs.readFileSync(file, 'utf8');

// Build animation element
let animationEl = '';
const transformTypes = ['rotate', 'scale', 'translate', 'skewX', 'skewY'];

if (transformTypes.includes(type)) {
  // Use animateTransform for transform animations
  if (type === 'rotate') {
    // Rotation: values is the end angle, animate from 0 to that value
    animationEl = `<animateTransform attributeName="transform" type="rotate" from="0" to="${values}" dur="${duration}" repeatCount="${repeatCount}"`;
  } else {
    // Scale/translate: values like "1;1.2;1" or "0,0;10,5;0,0"
    animationEl = `<animateTransform attributeName="transform" type="${type}" values="${values}" dur="${duration}" repeatCount="${repeatCount}"`;
  }
  if (calcMode) animationEl += ` calcMode="${calcMode}"`;
  if (keySplines) animationEl += ` keySplines="${keySplines}"`;
  animationEl += ' additive="sum"/>';
} else {
  // Use animate for attribute animations
  animationEl = `<animate attributeName="${type}" values="${values}" dur="${duration}" repeatCount="${repeatCount}"`;
  if (calcMode) animationEl += ` calcMode="${calcMode}"`;
  if (keySplines) animationEl += ` keySplines="${keySplines}"`;
  animationEl += '/>';
}

// Parse selector
const [elementType, indexStr] = selector.split(':');
const targetIndex = indexStr !== undefined ? parseInt(indexStr, 10) : null;

// Build regex pattern
const elementPattern = elementType === 'all'
  ? /<(path|line|circle|rect|ellipse|polygon|g|text)\s/gi
  : new RegExp(`<${elementType}\\s`, 'gi');

const matches = [...svgContent.matchAll(elementPattern)];

if (matches.length === 0) {
  console.error(`No <${elementType}> elements found`);
  process.exit(1);
}

const indicesToModify = targetIndex !== null ? [targetIndex] : matches.map((_, i) => i);
let modifiedCount = 0;

// Process in reverse order
for (const idx of indicesToModify.sort((a, b) => b - a)) {
  if (idx < 0 || idx >= matches.length) continue;

  const match = matches[idx];
  const startPos = match.index;
  const tagName = elementType === 'all' ? match[1] : elementType;

  // Find end of opening tag or self-closing
  let searchPos = startPos;
  let depth = 0;
  let insertPos = -1;
  let isSelfClosing = false;

  // Find the end of the opening tag
  const openTagEnd = svgContent.indexOf('>', startPos);
  const selfClosingCheck = svgContent.slice(startPos, openTagEnd + 1);

  if (selfClosingCheck.endsWith('/>')) {
    // Self-closing tag - need to convert to open/close
    isSelfClosing = true;
    insertPos = openTagEnd - 1; // Position before />
  } else {
    // Find closing tag - insert just before it
    const closingTag = `</${tagName}>`;
    const closingPos = svgContent.indexOf(closingTag, openTagEnd);
    if (closingPos !== -1) {
      insertPos = closingPos;
    } else {
      // Fallback: insert after opening tag
      insertPos = openTagEnd + 1;
    }
  }

  if (isSelfClosing) {
    // Convert self-closing to open/close with animation inside
    const beforeClose = svgContent.slice(0, insertPos);
    const afterClose = svgContent.slice(insertPos + 2); // Skip />
    svgContent = beforeClose + `>${animationEl}</${tagName}>` + afterClose;
  } else {
    // Insert animation before closing tag
    svgContent = svgContent.slice(0, insertPos) + animationEl + svgContent.slice(insertPos);
  }

  modifiedCount++;
}

fs.writeFileSync(file, svgContent);
console.log(`Added ${type} animation to ${modifiedCount} ${elementType} element(s)`);
