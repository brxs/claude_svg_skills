// Skill: Initialize a new canvas
// Usage: node .claude/skills/init-canvas/index.js <width> <height> <background> <output>
import { createCanvas, saveSvg } from '../../../src/index.js';

const [,, width = 500, height = 809, bg = '#FAFAFA', output = 'output/canvas.svg'] = process.argv;

const canvas = createCanvas(Number(width), Number(height), bg);
saveSvg(canvas, output);
console.log(`Created: ${output}`);
