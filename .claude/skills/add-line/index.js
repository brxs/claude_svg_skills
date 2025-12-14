// Skill: Add a line to an existing SVG
// Usage: node .claude/skills/add-line/index.js <svg-file> <x1> <y1> <x2> <y2> <stroke> <width>
import { loadSvgFromString, saveSvg, loadSvg, line } from '../../../src/index.js';

const [,, file, x1, y1, x2, y2, stroke = '#212121', width = 2] = process.argv;

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);
line(canvas, Number(x1), Number(y1), Number(x2), Number(y2), {
  stroke: { color: stroke, width: Number(width) }
});
saveSvg(canvas, file);
console.log(`Added line (${x1},${y1}) to (${x2},${y2})`);
