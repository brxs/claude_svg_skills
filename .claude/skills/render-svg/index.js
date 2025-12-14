// Skill: Render an SVG to PNG
// Usage: node .claude/skills/render-svg/index.js <svg-file>
import { renderSvgFileToPng } from '../../../src/index.js';

const [,, file] = process.argv;

const pngPath = await renderSvgFileToPng(file);
console.log(`Rendered: ${pngPath}`);
