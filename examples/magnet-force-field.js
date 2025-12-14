import {
  createCanvas,
  rectangle,
  path,
  circle,
  saveSvg,
  getOutputPath
} from '../src/index.js';

const canvas = createCanvas(600, 400, '#1a1a2e');

// Magnet dimensions
const magnetWidth = 80;
const magnetHeight = 120;
const magnetGap = 200;
const centerY = 200;

// Left magnet position (N pole facing right)
const leftMagnetX = 100;
// Right magnet position (S pole facing left)
const rightMagnetX = 600 - 100 - magnetWidth;

// Draw left magnet - North pole (red) on right side
rectangle(canvas, leftMagnetX, centerY - magnetHeight / 2, magnetWidth / 2, magnetHeight, {
  fill: '#3b82f6' // Blue - South
});
rectangle(canvas, leftMagnetX + magnetWidth / 2, centerY - magnetHeight / 2, magnetWidth / 2, magnetHeight, {
  fill: '#ef4444' // Red - North
});

// Draw right magnet - South pole (blue) on left side
rectangle(canvas, rightMagnetX, centerY - magnetHeight / 2, magnetWidth / 2, magnetHeight, {
  fill: '#3b82f6' // Blue - South
});
rectangle(canvas, rightMagnetX + magnetWidth / 2, centerY - magnetHeight / 2, magnetWidth / 2, magnetHeight, {
  fill: '#ef4444' // Red - North
});

// Add pole labels
const addText = (canvas, x, y, text, color) => {
  const t = canvas.text(text);
  t.font({ size: 24, weight: 'bold', family: 'Arial' });
  t.fill(color);
  t.center(x, y);
  return t;
};

addText(canvas, leftMagnetX + magnetWidth / 4, centerY, 'S', '#ffffff');
addText(canvas, leftMagnetX + 3 * magnetWidth / 4, centerY, 'N', '#ffffff');
addText(canvas, rightMagnetX + magnetWidth / 4, centerY, 'S', '#ffffff');
addText(canvas, rightMagnetX + 3 * magnetWidth / 4, centerY, 'N', '#ffffff');

// Field line parameters
const startX = leftMagnetX + magnetWidth; // Right edge of left magnet
const endX = rightMagnetX; // Left edge of right magnet
const midX = (startX + endX) / 2;

// Draw magnetic field lines between N and S poles (attraction)
const fieldLineOffsets = [0, 25, 50, -25, -50];
const fieldLineColors = ['#22d3ee', '#06b6d4', '#0891b2', '#06b6d4', '#0891b2'];

fieldLineOffsets.forEach((offset, i) => {
  const y = centerY + offset;
  const curveHeight = Math.abs(offset) * 0.3 + 5;

  // Straight-ish lines between attractive poles (N to S)
  const pathData = `M ${startX} ${y} C ${startX + 40} ${y - curveHeight}, ${endX - 40} ${y - curveHeight}, ${endX} ${y}`;

  path(canvas, pathData, {
    fill: 'none',
    stroke: { color: fieldLineColors[i], width: 2, opacity: 0.8 }
  });
});

// Draw field lines curving around the outside of magnets
const outerFieldLines = [
  // Top curves from left N pole
  { startY: centerY - 50, endY: centerY - 50, curve: -80 },
  { startY: centerY - 40, endY: centerY - 40, curve: -120 },
  { startY: centerY - 30, endY: centerY - 30, curve: -160 },
  // Bottom curves from left N pole
  { startY: centerY + 50, endY: centerY + 50, curve: 80 },
  { startY: centerY + 40, endY: centerY + 40, curve: 120 },
  { startY: centerY + 30, endY: centerY + 30, curve: 160 },
];

outerFieldLines.forEach((line, i) => {
  const pathData = `M ${startX} ${line.startY} C ${midX} ${line.startY + line.curve}, ${midX} ${line.endY + line.curve}, ${endX} ${line.endY}`;

  path(canvas, pathData, {
    fill: 'none',
    stroke: { color: '#22d3ee', width: 1.5, opacity: 0.6 }
  });
});

// Draw repulsion field lines going outward from like poles
// Left magnet S pole (left side) - lines going left and curving
const leftOuterLines = [-40, -20, 0, 20, 40];
leftOuterLines.forEach((offset) => {
  const y = centerY + offset;
  const pathData = `M ${leftMagnetX} ${y} C ${leftMagnetX - 60} ${y + offset * 0.5}, ${leftMagnetX - 80} ${y + offset * 1.5}, ${leftMagnetX - 50} ${y + offset * 2.5}`;

  path(canvas, pathData, {
    fill: 'none',
    stroke: { color: '#818cf8', width: 1.5, opacity: 0.5 }
  });
});

// Right magnet N pole (right side) - lines going right and curving
leftOuterLines.forEach((offset) => {
  const y = centerY + offset;
  const pathData = `M ${rightMagnetX + magnetWidth} ${y} C ${rightMagnetX + magnetWidth + 60} ${y + offset * 0.5}, ${rightMagnetX + magnetWidth + 80} ${y + offset * 1.5}, ${rightMagnetX + magnetWidth + 50} ${y + offset * 2.5}`;

  path(canvas, pathData, {
    fill: 'none',
    stroke: { color: '#818cf8', width: 1.5, opacity: 0.5 }
  });
});

// Add small arrows/dots to indicate field direction
const arrowPositions = [
  { x: midX - 30, y: centerY },
  { x: midX, y: centerY },
  { x: midX + 30, y: centerY },
  { x: midX, y: centerY - 25 },
  { x: midX, y: centerY + 25 },
];

arrowPositions.forEach(pos => {
  circle(canvas, pos.x, pos.y, 3, { fill: '#fbbf24' });
});

// Add title
const title = canvas.text('Magnetic Force Field');
title.font({ size: 18, weight: 'bold', family: 'Arial' });
title.fill('#ffffff');
title.center(300, 30);

// Save
const filepath = getOutputPath('magnet-force-field.svg');
saveSvg(canvas, filepath);
console.log(`Saved: ${filepath}`);
