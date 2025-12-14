// Canvas management
export { createCanvas, getSvgString, loadSvgFromString } from './canvas.js';

// Shape primitives
export {
  circle,
  rectangle,
  polygon,
  regularPolygon,
  line,
  polyline,
  ellipse,
  path
} from './shapes.js';

// Pattern generators
export {
  grid,
  concentricCircles,
  radialPattern,
  checkerboard,
  spiralPattern,
  hexGrid
} from './patterns.js';

// Transformations
export {
  rotate,
  scale,
  translate,
  skew,
  flip,
  group,
  move,
  center,
  resetTransform
} from './transforms.js';

// Colors and gradients
export {
  PALETTES,
  randomFromPalette,
  pickColors,
  linearGradient,
  radialGradient,
  createPattern,
  hexToRgb,
  rgbToHex,
  lerpColor,
  colorScale
} from './colors.js';

// File I/O
export {
  getProjectRoot,
  getOutputPath,
  saveSvg,
  loadSvg,
  fileExists,
  timestampedFilename
} from './io.js';

// Rendering (SVG to PNG)
export {
  renderToBuffer,
  renderSvgStringToBuffer,
  renderToPng,
  renderSvgFileToPng,
  saveAndRender
} from './render.js';
