// Skill: Add an ellipse to an existing SVG
// Usage: node .claude/skills/add-ellipse/index.js <svg-file> <cx> <cy> <rx> <ry> <fill>
import { loadSvgFromString, saveSvg, loadSvg, ellipse } from '../../../src/index.js';

const [,, file, cx, cy, rx, ry, fill = '#E53935'] = process.argv;

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);
ellipse(canvas, Number(cx), Number(cy), Number(rx), Number(ry), { fill });
saveSvg(canvas, file);
console.log(`Added ellipse at (${cx},${cy}) rx=${rx} ry=${ry}`);
