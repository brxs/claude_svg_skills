// Skill: Remove all SMIL animations from SVG
// Usage: node .claude/skills/remove-animations/index.js <svg-file>
import { loadSvgFromString, loadSvg, saveSvg } from '../../../src/index.js';

const [,, file] = process.argv;

if (!file) {
  console.error('Usage: node index.js <svg-file>');
  console.error('');
  console.error('Removes all SMIL animations from an SVG file:');
  console.error('  - <animate> elements');
  console.error('  - <animateTransform> elements');
  console.error('  - <animateMotion> elements');
  console.error('  - <set> elements');
  console.error('');
  console.error('Example:');
  console.error('  node index.js output/art.svg');
  process.exit(1);
}

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

let removeCount = 0;

// Animation element types to remove
const animationTypes = ['animate', 'animateTransform', 'animateMotion', 'set'];

for (const type of animationTypes) {
  const elements = canvas.find(type);
  removeCount += elements.length;
  elements.forEach(el => el.remove());
}

saveSvg(canvas, file);
console.log(`Removed ${removeCount} animation element(s)`);
