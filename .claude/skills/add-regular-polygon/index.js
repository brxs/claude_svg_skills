// Skill: Add a regular polygon (triangle, hexagon, etc.) to an existing SVG
// Usage: node .claude/skills/add-regular-polygon/index.js <svg-file> <cx> <cy> <radius> <sides> <fill>
import { loadSvgFromString, saveSvg, loadSvg, regularPolygon } from '../../../src/index.js';

const [,, file, cx, cy, radius, sides, fill = '#E53935'] = process.argv;

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);
regularPolygon(canvas, Number(cx), Number(cy), Number(radius), Number(sides), { fill });
saveSvg(canvas, file);
const names = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon', 8: 'octagon' };
console.log(`Added ${names[sides] || sides + '-gon'} at (${cx},${cy}) r=${radius}`);
