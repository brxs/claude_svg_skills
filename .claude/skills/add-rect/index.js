// Skill: Add a rectangle to an existing SVG
// Usage: node .claude/skills/add-rect/index.js <svg-file> <x> <y> <width> <height> <fill>
import { loadSvgFromString, saveSvg, loadSvg, rectangle } from '../../../src/index.js';

const [,, file, x, y, w, h, fill = '#1E88E5'] = process.argv;

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);
rectangle(canvas, Number(x), Number(y), Number(w), Number(h), { fill });
saveSvg(canvas, file);
console.log(`Added rect at (${x}, ${y}) ${w}x${h}`);
