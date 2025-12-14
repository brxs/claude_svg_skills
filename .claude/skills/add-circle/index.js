// Skill: Add a circle to an existing SVG
// Usage: node .claude/skills/add-circle/index.js <svg-file> <cx> <cy> <radius> <fill>
import { loadSvgFromString, saveSvg, loadSvg, circle } from '../../../src/index.js';

const [,, file, cx, cy, radius, fill = '#E53935'] = process.argv;

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);
circle(canvas, Number(cx), Number(cy), Number(radius), { fill });
saveSvg(canvas, file);
console.log(`Added circle at (${cx}, ${cy}) r=${radius}`);
