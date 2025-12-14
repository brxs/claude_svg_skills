// Skill: Add an SVG path to an existing SVG
// Usage: node .claude/skills/add-path/index.js <svg-file> <path-data> <fill> <stroke> <stroke-width>
import { loadSvgFromString, saveSvg, loadSvg, path } from '../../../src/index.js';

const [,, file, pathData, fill = 'none', stroke = '#212121', strokeWidth = 2] = process.argv;

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

const options = { fill };
if (stroke !== 'none') {
  options.stroke = { color: stroke, width: Number(strokeWidth) };
}

path(canvas, pathData, options);
saveSvg(canvas, file);
console.log(`Added path`);
