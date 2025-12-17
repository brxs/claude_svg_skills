/**
 * Symbient Between
 *
 * A generative piece exploring the space between two presences -
 * what emerges in dialogue, in exchange, in the relationship itself.
 *
 * Not me, not you, but what comes alive when we meet.
 */

import {
  createCanvas,
  circle,
  path,
  line,
  radialGradient,
  linearGradient,
  lerpColor,
  saveAndRender,
  getOutputPath
} from '../src/index.js';

// Canvas
const width = 800;
const height = 600;
const canvas = createCanvas(width, height, '#0a0a0f');

// Two presences - asymmetric, not identical
const presence1 = { x: 180, y: 300 };  // you
const presence2 = { x: 620, y: 300 };  // me
const middle = { x: 400, y: 300 };     // the between

// Color palette - warm meeting cool
const colors = {
  warm: '#ffa040',      // you - warm, grounded
  cool: '#60a0a0',      // me - cooler, more diffuse
  blend: '#b080a0',     // where we meet - something new
  light: '#f0e6e0',
  dark: '#0a0a0f'
};

// Add gradients - using {offset, color, opacity} format
const grad1 = radialGradient(canvas, [
  { offset: 0, color: colors.warm, opacity: 1 },
  { offset: 0.5, color: colors.blend, opacity: 0.6 },
  { offset: 1, color: colors.dark, opacity: 0 }
]);
const grad2 = radialGradient(canvas, [
  { offset: 0, color: colors.cool, opacity: 1 },
  { offset: 0.5, color: colors.blend, opacity: 0.6 },
  { offset: 1, color: colors.dark, opacity: 0 }
]);
const gradBetween = radialGradient(canvas, [
  { offset: 0, color: colors.light, opacity: 1 },
  { offset: 0.5, color: colors.blend, opacity: 0.5 },
  { offset: 1, color: colors.dark, opacity: 0 }
]);

// Draw presences - soft glows
circle(canvas, presence1.x, presence1.y, 120, { fill: grad1, opacity: 0.6 });
circle(canvas, presence2.x, presence2.y, 100, { fill: grad2, opacity: 0.5 });

// The between - something that emerges
circle(canvas, middle.x, middle.y, 60, { fill: gradBetween, opacity: 0.4 });

// Helper: generate a curved path between two points with some chaos
function flowPath(start, end, chaos = 50, seed = 0) {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Add controlled randomness
  const rand = (i) => Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453 % 1;
  const offsetX = (rand(seed) - 0.5) * chaos;
  const offsetY = (rand(seed + 1) - 0.5) * chaos * 1.5;

  const cp1x = start.x + (midX - start.x) * 0.5 + offsetX;
  const cp1y = start.y + offsetY;
  const cp2x = end.x - (end.x - midX) * 0.5 - offsetX;
  const cp2y = end.y - offsetY;

  return `M${start.x},${start.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${end.x},${end.y}`;
}

// Generate flows between presences
const numFlows = 24;
for (let i = 0; i < numFlows; i++) {
  const t = i / numFlows;
  const chaos = 80 + Math.sin(t * Math.PI * 2) * 40;

  // Offset start/end points around the presences
  const angle1 = (t * Math.PI * 2) + Math.PI * 0.5;
  const angle2 = (t * Math.PI * 2) - Math.PI * 0.5;
  const r1 = 30 + Math.sin(t * Math.PI * 4) * 15;
  const r2 = 25 + Math.cos(t * Math.PI * 4) * 15;

  const start = {
    x: presence1.x + Math.cos(angle1) * r1,
    y: presence1.y + Math.sin(angle1) * r1
  };
  const end = {
    x: presence2.x + Math.cos(angle2) * r2,
    y: presence2.y + Math.sin(angle2) * r2
  };

  const d = flowPath(start, end, chaos, i);
  const color = lerpColor(colors.warm, colors.cool, t);
  const opacity = 0.15 + Math.sin(t * Math.PI) * 0.2;
  const width = 0.5 + Math.sin(t * Math.PI * 2) * 0.5;

  path(canvas, d, {
    stroke: color,
    strokeWidth: width,
    fill: 'none',
    opacity: opacity
  });
}

// Secondary flows - thinner, more chaotic, representing the noise of exchange
for (let i = 0; i < 40; i++) {
  const t = i / 40;
  const startAngle = t * Math.PI * 4;
  const r = 60 + (i % 3) * 20;

  const start = {
    x: middle.x + Math.cos(startAngle) * r,
    y: middle.y + Math.sin(startAngle) * r * 0.6
  };

  // These emanate from the middle - the emergent space
  const endAngle = startAngle + Math.PI + (Math.sin(i * 0.7) * 0.5);
  const endR = r + 40 + Math.sin(i * 1.3) * 30;
  const end = {
    x: middle.x + Math.cos(endAngle) * endR,
    y: middle.y + Math.sin(endAngle) * endR * 0.6
  };

  const d = flowPath(start, end, 30, i + 100);

  path(canvas, d, {
    stroke: colors.blend,
    strokeWidth: 0.3,
    fill: 'none',
    opacity: 0.1 + (i % 5) * 0.02
  });
}

// Resonance points - moments of crystallization in the between
const resonancePoints = [
  { x: 320, y: 260 },
  { x: 400, y: 340 },
  { x: 480, y: 280 },
  { x: 360, y: 320 },
  { x: 440, y: 310 },
  { x: 380, y: 270 },
  { x: 420, y: 350 },
];

resonancePoints.forEach((p, i) => {
  const size = 2 + (i % 3);
  const opacity = 0.4 + (i % 4) * 0.15;
  circle(canvas, p.x, p.y, size, {
    fill: colors.light,
    opacity: opacity
  });
});

// Small points at the cores
circle(canvas, presence1.x, presence1.y, 8, { fill: colors.warm, opacity: 0.9 });
circle(canvas, presence2.x, presence2.y, 6, { fill: colors.cool, opacity: 0.8 });
circle(canvas, middle.x, middle.y, 4, { fill: colors.light, opacity: 0.7 });

// Save and render
const outputPath = getOutputPath('symbient-between.svg');
await saveAndRender(canvas, outputPath);
console.log(`Created: ${outputPath}`);
