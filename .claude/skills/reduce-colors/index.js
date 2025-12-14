// Skill: Reduce number of colors in SVG by merging similar colors
// Usage: node .claude/skills/reduce-colors/index.js <svg-file> [options]
import { loadSvgFromString, loadSvg, saveSvg } from '../../../src/index.js';

const [,, file, ...options] = process.argv;

if (!file) {
  console.error('Usage: node index.js <svg-file> [options]');
  console.error('');
  console.error('Options:');
  console.error('  threshold=<n>  - Color distance threshold (0-255, default: 50)');
  console.error('  max=<n>        - Maximum number of output colors');
  console.error('  palette=<name> - Map to predefined palette (basic, grayscale, warm, cool)');
  console.error('  stroke-only    - Only reduce stroke colors');
  console.error('  fill-only      - Only reduce fill colors');
  console.error('');
  console.error('Examples:');
  console.error('  node index.js output/art.svg threshold=60');
  console.error('  node index.js output/art.svg max=8');
  console.error('  node index.js output/art.svg palette=basic');
  process.exit(1);
}

// Parse options
let threshold = 50;
let maxColors = null;
let paletteName = null;
const strokeOnly = options.includes('stroke-only');
const fillOnly = options.includes('fill-only');

for (const opt of options) {
  if (opt.startsWith('threshold=')) {
    threshold = parseInt(opt.split('=')[1]);
  } else if (opt.startsWith('max=')) {
    maxColors = parseInt(opt.split('=')[1]);
  } else if (opt.startsWith('palette=')) {
    paletteName = opt.split('=')[1];
  }
}

// Predefined palettes
const palettes = {
  basic: ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  grayscale: ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff'],
  warm: ['#000000', '#ffffff', '#ff0000', '#ff6600', '#ffcc00', '#ff3366', '#cc3300'],
  cool: ['#000000', '#ffffff', '#0000ff', '#0066ff', '#00ccff', '#6600ff', '#00ff99'],
  earth: ['#000000', '#ffffff', '#8b4513', '#a0522d', '#deb887', '#2e8b57', '#556b2f'],
  neon: ['#000000', '#ffffff', '#ff00ff', '#00ffff', '#ff0066', '#66ff00', '#ffff00']
};

// Parse hex color to RGB
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  };
}

// RGB to hex
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

// Calculate color distance (Euclidean in RGB space)
function colorDistance(c1, c2) {
  const rgb1 = typeof c1 === 'string' ? hexToRgb(c1) : c1;
  const rgb2 = typeof c2 === 'string' ? hexToRgb(c2) : c2;

  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

// Normalize color to 6-digit hex
function normalizeColor(color) {
  if (!color || color === 'none' || color === 'transparent') return null;
  if (String(color).startsWith('url(')) return null;

  const colorStr = String(color).toLowerCase().trim();

  const colorNames = {
    black: '#000000', white: '#ffffff', red: '#ff0000',
    green: '#008000', blue: '#0000ff', yellow: '#ffff00',
    cyan: '#00ffff', magenta: '#ff00ff', gray: '#808080',
    grey: '#808080', orange: '#ffa500', pink: '#ffc0cb',
    purple: '#800080', brown: '#a52a2a'
  };

  if (colorNames[colorStr]) return colorNames[colorStr];

  if (/^#[0-9a-f]{3}$/i.test(colorStr)) {
    return '#' + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2] + colorStr[3] + colorStr[3];
  }

  if (/^#[0-9a-f]{6}$/i.test(colorStr)) {
    return colorStr;
  }

  const rgbMatch = colorStr.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  return null;
}

// Find nearest color in palette
function findNearestPaletteColor(color, palette) {
  let nearest = palette[0];
  let minDist = Infinity;

  for (const pc of palette) {
    const dist = colorDistance(color, pc);
    if (dist < minDist) {
      minDist = dist;
      nearest = pc;
    }
  }

  return nearest;
}

// Cluster colors by similarity
function clusterColors(colors, threshold) {
  const clusters = [];
  const colorCounts = new Map();

  // Count occurrences
  for (const color of colors) {
    colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
  }

  // Sort by frequency (most common first)
  const sortedColors = [...colorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(e => e[0]);

  for (const color of sortedColors) {
    let addedToCluster = false;

    for (const cluster of clusters) {
      if (colorDistance(color, cluster.representative) <= threshold) {
        cluster.colors.push(color);
        addedToCluster = true;
        break;
      }
    }

    if (!addedToCluster) {
      clusters.push({
        representative: color,
        colors: [color]
      });
    }
  }

  return clusters;
}

// Limit to max colors by merging smallest clusters
function limitClusters(clusters, maxColors) {
  while (clusters.length > maxColors) {
    // Find two closest clusters
    let minDist = Infinity;
    let mergeI = 0, mergeJ = 1;

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const dist = colorDistance(clusters[i].representative, clusters[j].representative);
        if (dist < minDist) {
          minDist = dist;
          mergeI = i;
          mergeJ = j;
        }
      }
    }

    // Merge clusters (keep the larger one as representative)
    const sizeI = clusters[mergeI].colors.length;
    const sizeJ = clusters[mergeJ].colors.length;

    if (sizeI >= sizeJ) {
      clusters[mergeI].colors.push(...clusters[mergeJ].colors);
      clusters.splice(mergeJ, 1);
    } else {
      clusters[mergeJ].colors.push(...clusters[mergeI].colors);
      clusters.splice(mergeI, 1);
    }
  }

  return clusters;
}

const svgContent = loadSvg(file);
const canvas = loadSvgFromString(svgContent);

// Collect all colors
const allColors = [];

function collectColors(el) {
  const tagName = el.node?.nodeName?.toLowerCase();
  if (['defs', 'style', 'linearGradient', 'radialGradient', 'filter', 'pattern'].includes(tagName)) {
    return;
  }

  if (!fillOnly) {
    const stroke = normalizeColor(el.attr('stroke'));
    if (stroke) allColors.push(stroke);
  }

  if (!strokeOnly) {
    const fill = normalizeColor(el.attr('fill'));
    if (fill) allColors.push(fill);
  }

  if (el.children) {
    el.children().forEach(child => collectColors(child));
  }
}

canvas.children().forEach(child => collectColors(child));

const uniqueColors = [...new Set(allColors)];
console.log(`Found ${uniqueColors.length} unique color(s)`);

// Build color mapping
let colorMapping = new Map();

if (paletteName && palettes[paletteName]) {
  // Map to palette
  const palette = palettes[paletteName];
  for (const color of uniqueColors) {
    colorMapping.set(color, findNearestPaletteColor(color, palette));
  }
  console.log(`Mapped to ${paletteName} palette (${palette.length} colors)`);
} else {
  // Cluster similar colors
  let clusters = clusterColors(uniqueColors, threshold);

  if (maxColors && clusters.length > maxColors) {
    clusters = limitClusters(clusters, maxColors);
  }

  // Build mapping from clusters
  for (const cluster of clusters) {
    for (const color of cluster.colors) {
      colorMapping.set(color, cluster.representative);
    }
  }

  console.log(`Reduced to ${clusters.length} color(s) (threshold: ${threshold})`);
}

// Apply color mapping
let changeCount = 0;

function applyMapping(el) {
  const tagName = el.node?.nodeName?.toLowerCase();
  if (['defs', 'style', 'linearGradient', 'radialGradient', 'filter', 'pattern'].includes(tagName)) {
    return;
  }

  if (!fillOnly) {
    const stroke = normalizeColor(el.attr('stroke'));
    if (stroke && colorMapping.has(stroke) && colorMapping.get(stroke) !== stroke) {
      el.attr('stroke', colorMapping.get(stroke));
      changeCount++;
    }
  }

  if (!strokeOnly) {
    const fill = normalizeColor(el.attr('fill'));
    if (fill && colorMapping.has(fill) && colorMapping.get(fill) !== fill) {
      el.attr('fill', colorMapping.get(fill));
      changeCount++;
    }
  }

  if (el.children) {
    el.children().forEach(child => applyMapping(child));
  }
}

canvas.children().forEach(child => applyMapping(child));

saveSvg(canvas, file);

// Show final colors
const finalColors = [...new Set([...colorMapping.values()])];
console.log(`Output colors: ${finalColors.join(', ')}`);
console.log(`Changed ${changeCount} color attribute(s)`);
