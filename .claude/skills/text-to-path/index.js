// Skill: Convert text elements to paths for plotter/CNC output
// Usage: node .claude/skills/text-to-path/index.js <svg-file> <font-file> [options]
import { loadSvgFromString, loadSvg, saveSvg } from '../../../src/index.js';
import opentype from 'opentype.js';

const [,, file, fontFile, ...options] = process.argv;

if (!file || !fontFile) {
  console.error('Usage: node index.js <svg-file> <font-file> [options]');
  console.error('');
  console.error('Arguments:');
  console.error('  svg-file   - SVG file to process');
  console.error('  font-file  - TTF or OTF font file');
  console.error('');
  console.error('Options:');
  console.error('  stroke-only   - Output stroked paths (for single-line plotting)');
  console.error('  fill-only     - Output filled paths (default, for outline fonts)');
  console.error('  stroke=<width> - Set stroke width for stroke-only mode');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js output/art.svg fonts/Arial.ttf');
  console.error('  node index.js output/art.svg fonts/Hershey.ttf stroke-only');
  console.error('  node index.js output/art.svg fonts/font.otf stroke=0.5');
  process.exit(1);
}

// Parse options
const strokeOnly = options.includes('stroke-only');
const fillOnly = options.includes('fill-only') || !strokeOnly;
let strokeWidth = 1;
const strokeOpt = options.find(o => o.startsWith('stroke='));
if (strokeOpt) strokeWidth = parseFloat(strokeOpt.split('=')[1]);

// Load font
let font;
try {
  font = opentype.loadSync(fontFile);
} catch (err) {
  console.error(`Error loading font: ${err.message}`);
  process.exit(1);
}

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

let convertCount = 0;
let textPathCount = 0;

// Helper to get computed text attributes
function getTextAttrs(textEl) {
  return {
    x: parseFloat(textEl.attr('x')) || 0,
    y: parseFloat(textEl.attr('y')) || 0,
    fontSize: parseFloat(textEl.attr('font-size')) || 16,
    fill: textEl.attr('fill') || '#000000',
    stroke: textEl.attr('stroke'),
    strokeWidth: textEl.attr('stroke-width'),
    textAnchor: textEl.attr('text-anchor') || 'start',
    fontWeight: textEl.attr('font-weight'),
    letterSpacing: parseFloat(textEl.attr('letter-spacing')) || 0,
    transform: textEl.attr('transform')
  };
}

// Parse SVG path data into segments
function parsePathData(d) {
  const commands = [];
  const regex = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
  let match;

  while ((match = regex.exec(d)) !== null) {
    const cmd = match[1];
    const args = match[2].trim().split(/[\s,]+/).filter(s => s).map(Number);
    commands.push({ cmd, args });
  }

  return commands;
}

// Get point on cubic bezier at t
function cubicBezier(t, p0, p1, p2, p3) {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
  };
}

// Get tangent angle on cubic bezier at t
function cubicBezierTangent(t, p0, p1, p2, p3) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;

  const dx = 3 * mt2 * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t2 * (p3.x - p2.x);
  const dy = 3 * mt2 * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t2 * (p3.y - p2.y);

  return Math.atan2(dy, dx);
}

// Get point on arc - simplified for circular arcs
function arcPoint(cx, cy, r, angle) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  };
}

// Convert path to sampled points with tangent angles
function samplePath(pathData, numSamples = 500) {
  const commands = parsePathData(pathData);
  const points = [];
  let currentX = 0, currentY = 0;
  let startX = 0, startY = 0;

  for (const { cmd, args } of commands) {
    switch (cmd) {
      case 'M':
        currentX = args[0];
        currentY = args[1];
        startX = currentX;
        startY = currentY;
        break;

      case 'm':
        currentX += args[0];
        currentY += args[1];
        startX = currentX;
        startY = currentY;
        break;

      case 'L':
        for (let i = 0; i < args.length; i += 2) {
          const x = args[i], y = args[i + 1];
          const angle = Math.atan2(y - currentY, x - currentX);
          const dist = Math.hypot(x - currentX, y - currentY);
          const steps = Math.max(2, Math.ceil(dist / 2));

          for (let j = 0; j <= steps; j++) {
            const t = j / steps;
            points.push({
              x: currentX + t * (x - currentX),
              y: currentY + t * (y - currentY),
              angle
            });
          }
          currentX = x;
          currentY = y;
        }
        break;

      case 'l':
        for (let i = 0; i < args.length; i += 2) {
          const x = currentX + args[i], y = currentY + args[i + 1];
          const angle = Math.atan2(y - currentY, x - currentX);
          const dist = Math.hypot(x - currentX, y - currentY);
          const steps = Math.max(2, Math.ceil(dist / 2));

          for (let j = 0; j <= steps; j++) {
            const t = j / steps;
            points.push({
              x: currentX + t * (x - currentX),
              y: currentY + t * (y - currentY),
              angle
            });
          }
          currentX = x;
          currentY = y;
        }
        break;

      case 'C':
        for (let i = 0; i < args.length; i += 6) {
          const p0 = { x: currentX, y: currentY };
          const p1 = { x: args[i], y: args[i + 1] };
          const p2 = { x: args[i + 2], y: args[i + 3] };
          const p3 = { x: args[i + 4], y: args[i + 5] };

          for (let j = 0; j <= 50; j++) {
            const t = j / 50;
            const pt = cubicBezier(t, p0, p1, p2, p3);
            const angle = cubicBezierTangent(t, p0, p1, p2, p3);
            points.push({ ...pt, angle });
          }

          currentX = p3.x;
          currentY = p3.y;
        }
        break;

      case 'c':
        for (let i = 0; i < args.length; i += 6) {
          const p0 = { x: currentX, y: currentY };
          const p1 = { x: currentX + args[i], y: currentY + args[i + 1] };
          const p2 = { x: currentX + args[i + 2], y: currentY + args[i + 3] };
          const p3 = { x: currentX + args[i + 4], y: currentY + args[i + 5] };

          for (let j = 0; j <= 50; j++) {
            const t = j / 50;
            const pt = cubicBezier(t, p0, p1, p2, p3);
            const angle = cubicBezierTangent(t, p0, p1, p2, p3);
            points.push({ ...pt, angle });
          }

          currentX = p3.x;
          currentY = p3.y;
        }
        break;

      case 'A':
      case 'a': {
        // Arc command - parse and convert to points
        const isRelative = cmd === 'a';
        for (let i = 0; i < args.length; i += 7) {
          const rx = args[i];
          const ry = args[i + 1];
          const xRot = args[i + 2] * Math.PI / 180;
          const largeArc = args[i + 3];
          const sweep = args[i + 4];
          let endX = args[i + 5];
          let endY = args[i + 6];

          if (isRelative) {
            endX += currentX;
            endY += currentY;
          }

          // Simplified: treat as circular arc
          const r = (rx + ry) / 2;
          const midX = (currentX + endX) / 2;
          const midY = (currentY + endY) / 2;

          // Approximate center
          const dx = endX - currentX;
          const dy = endY - currentY;
          const chord = Math.hypot(dx, dy);

          // Handle semicircle case where chord equals diameter
          if (chord <= r * 2 + 0.001) {
            const hSquared = r * r - (chord / 2) * (chord / 2);
            const h = hSquared > 0 ? Math.sqrt(hSquared) : 0;
            const perpX = -dy / chord;
            const perpY = dx / chord;

            const centerX = midX + (sweep === largeArc ? -1 : 1) * h * perpX;
            const centerY = midY + (sweep === largeArc ? -1 : 1) * h * perpY;

            const startAngle = Math.atan2(currentY - centerY, currentX - centerX);
            const endAngle = Math.atan2(endY - centerY, endX - centerX);

            let angleDiff = endAngle - startAngle;
            if (sweep && angleDiff < 0) angleDiff += 2 * Math.PI;
            if (!sweep && angleDiff > 0) angleDiff -= 2 * Math.PI;

            const steps = Math.max(20, Math.abs(Math.ceil(angleDiff * r / 2)));
            for (let j = 0; j <= steps; j++) {
              const t = j / steps;
              const angle = startAngle + t * angleDiff;
              const pt = arcPoint(centerX, centerY, r, angle);
              const tangentAngle = angle + (sweep ? Math.PI / 2 : -Math.PI / 2);
              points.push({ x: pt.x, y: pt.y, angle: tangentAngle });
            }
          }

          currentX = endX;
          currentY = endY;
        }
        break;
      }

      case 'Z':
      case 'z':
        if (currentX !== startX || currentY !== startY) {
          const angle = Math.atan2(startY - currentY, startX - currentX);
          points.push({ x: startX, y: startY, angle });
        }
        currentX = startX;
        currentY = startY;
        break;
    }
  }

  return points;
}

// Calculate cumulative distances along path
function calculatePathDistances(points) {
  const distances = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    distances.push(distances[i - 1] + Math.hypot(dx, dy));
  }
  return distances;
}

// Get point at specific distance along path
function getPointAtDistance(points, distances, targetDist) {
  if (targetDist <= 0) return points[0];
  if (targetDist >= distances[distances.length - 1]) return points[points.length - 1];

  for (let i = 1; i < distances.length; i++) {
    if (distances[i] >= targetDist) {
      const t = (targetDist - distances[i - 1]) / (distances[i] - distances[i - 1]);
      return {
        x: points[i - 1].x + t * (points[i].x - points[i - 1].x),
        y: points[i - 1].y + t * (points[i].y - points[i - 1].y),
        angle: points[i].angle
      };
    }
  }

  return points[points.length - 1];
}

// Convert text to path data
function textToPathData(text, attrs) {
  // Get the path from opentype
  const otPath = font.getPath(text, 0, 0, attrs.fontSize, {
    letterSpacing: attrs.letterSpacing / attrs.fontSize
  });

  // Get bounding box for text anchor adjustment
  const bbox = otPath.getBoundingBox();
  const width = bbox.x2 - bbox.x1;

  // Adjust x based on text-anchor
  let xOffset = attrs.x;
  if (attrs.textAnchor === 'middle') {
    xOffset -= width / 2;
  } else if (attrs.textAnchor === 'end') {
    xOffset -= width;
  }

  // Get path at correct position
  const positionedPath = font.getPath(text, xOffset, attrs.y, attrs.fontSize, {
    letterSpacing: attrs.letterSpacing / attrs.fontSize
  });

  return positionedPath.toPathData(2);
}

// Convert text on path to individual character paths
function textOnPathToPathData(text, refPathData, attrs, startOffset = 0) {
  const points = samplePath(refPathData);
  const distances = calculatePathDistances(points);
  const totalLength = distances[distances.length - 1];

  // Calculate start position based on offset
  let currentDist = startOffset * totalLength / 100;

  const pathDatas = [];
  const letterSpacing = attrs.letterSpacing || 0;

  for (const char of text) {
    if (char === ' ') {
      // Space - just advance
      const spaceWidth = attrs.fontSize * 0.3;
      currentDist += spaceWidth + letterSpacing;
      continue;
    }

    // Get glyph for character
    const glyph = font.charToGlyph(char);
    if (!glyph) continue;

    // Get glyph path at origin
    const glyphPath = glyph.getPath(0, 0, attrs.fontSize);
    const glyphData = glyphPath.toPathData(2);

    if (!glyphData) continue;

    // Get glyph metrics
    const glyphWidth = (glyph.advanceWidth / font.unitsPerEm) * attrs.fontSize;

    // Get position on path for center of character
    const pt = getPointAtDistance(points, distances, currentDist + glyphWidth / 2);

    if (pt) {
      // Transform glyph path: translate and rotate
      const angle = pt.angle * 180 / Math.PI;
      const transform = `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)}) rotate(${angle.toFixed(2)}) translate(${(-glyphWidth / 2).toFixed(2)}, ${(attrs.fontSize * 0.3).toFixed(2)})`;

      pathDatas.push({ d: glyphData, transform });
    }

    currentDist += glyphWidth + letterSpacing;
  }

  return pathDatas;
}

// Process text elements
function processTextElements() {
  const textElements = canvas.find('text');

  textElements.forEach(textEl => {
    // Get text content - handle both direct text and textPath
    let textContent = '';
    const textPathEl = textEl.findOne('textPath');

    if (textPathEl) {
      // Text on path
      const href = textPathEl.attr('href') || textPathEl.attr('xlink:href');
      if (!href) {
        console.warn('textPath missing href attribute');
        return;
      }

      const pathId = href.replace('#', '');
      const refPath = canvas.findOne(`#${pathId}`);

      if (!refPath) {
        console.warn(`Referenced path #${pathId} not found`);
        return;
      }

      const pathData = refPath.attr('d');
      if (!pathData) {
        console.warn(`Path #${pathId} has no d attribute`);
        return;
      }

      // Get text content from textPath
      const node = textPathEl.node;
      textContent = node.textContent ? node.textContent.trim() : '';

      if (!textContent) return;

      // Get attributes from parent text element and textPath
      const attrs = {
        fontSize: parseFloat(textEl.attr('font-size')) || parseFloat(textPathEl.attr('font-size')) || 16,
        fill: textEl.attr('fill') || textPathEl.attr('fill') || '#000000',
        stroke: textEl.attr('stroke') || textPathEl.attr('stroke'),
        strokeWidth: textEl.attr('stroke-width') || textPathEl.attr('stroke-width'),
        letterSpacing: parseFloat(textEl.attr('letter-spacing')) || parseFloat(textPathEl.attr('letter-spacing')) || 0
      };

      // Get start offset if specified
      const startOffset = parseFloat(textPathEl.attr('startOffset')) || 0;

      try {
        const charPaths = textOnPathToPathData(textContent, pathData, attrs, startOffset);

        // Create a group for all character paths
        const group = canvas.group();

        charPaths.forEach(({ d, transform }) => {
          const pathEl = group.path(d);

          if (strokeOnly) {
            pathEl.fill('none');
            pathEl.stroke(attrs.fill || '#000000');
            pathEl.attr('stroke-width', strokeWidth);
          } else {
            pathEl.fill(attrs.fill || '#000000');
            pathEl.stroke('none');
          }

          pathEl.attr('transform', transform);
        });

        // Insert group before text and remove text
        textEl.before(group);
        textEl.remove();

        textPathCount++;
        convertCount++;
      } catch (err) {
        console.warn(`Could not convert textPath "${textContent}": ${err.message}`);
      }

      return;
    }

    // Get direct text content
    const node = textEl.node;
    if (node.textContent) {
      textContent = node.textContent.trim();
    }

    if (!textContent) return;

    const attrs = getTextAttrs(textEl);

    try {
      const pathData = textToPathData(textContent, attrs);

      if (!pathData) return;

      // Create path element
      const pathEl = canvas.path(pathData);

      // Apply styling
      if (strokeOnly) {
        pathEl.fill('none');
        pathEl.stroke(attrs.fill || '#000000');
        pathEl.attr('stroke-width', strokeWidth);
      } else {
        pathEl.fill(attrs.fill || '#000000');
        if (attrs.stroke) {
          pathEl.stroke(attrs.stroke);
          pathEl.attr('stroke-width', attrs.strokeWidth || 1);
        } else {
          pathEl.stroke('none');
        }
      }

      // Apply transform if present
      if (attrs.transform) {
        pathEl.attr('transform', attrs.transform);
      }

      // Insert path before text and remove text
      textEl.before(pathEl);
      textEl.remove();

      convertCount++;
    } catch (err) {
      console.warn(`Could not convert text "${textContent}": ${err.message}`);
    }
  });
}

processTextElements();

saveSvg(canvas, file);
console.log(`Converted ${convertCount} text element(s) to paths${textPathCount > 0 ? ` (including ${textPathCount} textPath)` : ''}`);
