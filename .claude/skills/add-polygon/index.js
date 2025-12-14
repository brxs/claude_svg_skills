// Skill: Add a custom polygon to an existing SVG
// Usage: node .claude/skills/add-polygon/index.js <svg-file> <points> <fill>
// Points format: "x1,y1 x2,y2 x3,y3 ..."
import { loadSvgFromString, saveSvg, loadSvg, polygon } from '../../../src/index.js';

const [,, file, pointsStr, fill = '#E53935'] = process.argv;

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

// Parse points string "x1,y1 x2,y2 x3,y3" into [[x1,y1], [x2,y2], [x3,y3]]
const points = pointsStr.split(' ').map(p => p.split(',').map(Number));

polygon(canvas, points, { fill });
saveSvg(canvas, file);
console.log(`Added polygon with ${points.length} points`);
