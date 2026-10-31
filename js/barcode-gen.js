// Barcode Generator Utility (Code 39 & SVG Barcode Renderer)
// Generates scannable barcodes for Chore Cards, Items, and On-Screen Display

class BarcodeGenerator {
  constructor() {
    // Code 39 encoding table (narrow = 1, wide = 2 or 3)
    // 0 = narrow space, 1 = narrow bar, 2 = wide bar, etc.
    // Each character is 9 elements: 5 bars, 4 spaces. 3 are wide.
    this.code39Map = {
      '0': 'bwbwbwBwB', '1': 'BwbwbWbwb', '2': 'bwBwbWbwb', '3': 'BwBwbWbwb',
      '4': 'bwbwBWbwb', '5': 'BwbwBWbwb', '6': 'bwBwBWbwb', '7': 'bwbwbWBwb',
      '8': 'BwbwbWBwb', '9': 'bwBwbWBwb', 'A': 'BwbwbwbWB', 'B': 'bwBwbwbWB',
      'C': 'BwBwbwbWB', 'D': 'bwbwBwbWB', 'E': 'BwbwBwbWB', 'F': 'bwBwBwbWB',
      'G': 'bwbwbwBWB', 'H': 'BwbwbwBWB', 'I': 'bwBwbwBWB', 'J': 'bwbwBwBWB',
      'K': 'BwbwbwbwB', 'L': 'bwBwbwbwB', 'M': 'BwBwbwbwB', 'N': 'bwbwBwbwB',
      'O': 'BwbwBwbwB', 'P': 'bwBwBwbwB', 'Q': 'bwbwbwBwB', 'R': 'BwbwbwBwB',
      'S': 'bwBwbwBwB', 'T': 'bwbwBwBwB', 'U': 'BWbwbwbwb', 'V': 'bWBwbwbwb',
      'W': 'BWBwbwbwb', 'X': 'bWbwBwbwb', 'Y': 'BWbwBwbwb', 'Z': 'bWBwBwbwb',
      '-': 'bWbwbwBwb', '.': 'BWbwbwBwb', ' ': 'bWBwbwBwb', '$': 'bWbWbWbwb',
      '/': 'bWbWbwbWb', '+': 'bWbwbWbWb', '%': 'bwbWbWbWb', '*': 'bWbwBwBwb'
    };
  }

  cleanText(text) {
    return text.toUpperCase().replace(/[^0-9A-Z\-\. \$\/\+\%]/g, '-');
  }

  // Generates SVG string for a given text
  generateSVG(rawText, options = {}) {
    const text = this.cleanText(rawText);
    const fullCode = `*${text}*`; // Code 39 requires start/stop delimiter '*'
    const barHeight = options.height || 64;
    const narrowWidth = options.narrowWidth || 2;
    const wideWidth = options.wideWidth || 5;
    const quietZone = options.quietZone !== undefined ? options.quietZone : 16;
    const showText = options.showText !== false;
    const foreground = options.foreground || '#1e293b';

    let totalWidth = quietZone * 2;
    const patterns = [];

    for (let i = 0; i < fullCode.length; i++) {
      const char = fullCode[i];
      const pattern = this.code39Map[char] || this.code39Map['-'];
      patterns.push(pattern);

      for (let j = 0; j < pattern.length; j++) {
        const symbol = pattern[j];
        const isBar = (j % 2 === 0);
        const isWide = (symbol === 'B' || symbol === 'W');
        totalWidth += isWide ? wideWidth : narrowWidth;
      }
      // Inter-character gap (narrow space)
      if (i < fullCode.length - 1) {
        totalWidth += narrowWidth;
      }
    }

    let svgHeight = barHeight + (showText ? 24 : 8);
    let currentX = quietZone;
    let rects = [];

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      for (let j = 0; j < pattern.length; j++) {
        const symbol = pattern[j];
        const isBar = (j % 2 === 0);
        const isWide = (symbol === 'B' || symbol === 'W');
        const width = isWide ? wideWidth : narrowWidth;

        if (isBar) {
          rects.push(`<rect x="${currentX}" y="4" width="${width}" height="${barHeight}" fill="${foreground}" />`);
        }
        currentX += width;
      }
      if (i < patterns.length - 1) {
        currentX += narrowWidth; // gap
      }
    }

    let textElement = '';
    if (showText) {
      textElement = `<text x="${totalWidth / 2}" y="${barHeight + 18}" font-family="ui-monospace, monospace, 'Courier New'" font-size="12" font-weight="bold" fill="${foreground}" text-anchor="middle" letter-spacing="2">${rawText}</text>`;
    }

    return `
      <svg class="barcode-svg" viewBox="0 0 ${totalWidth} ${svgHeight}" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <rect width="${totalWidth}" height="${svgHeight}" fill="#FFFFFF" rx="6" />
        ${rects.join('\n')}
        ${textElement}
      </svg>
    `;
  }

  // Render to a container element
  renderTo(element, rawText, options = {}) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.innerHTML = this.generateSVG(rawText, options);
    }
  }
}

window.barcodeGenerator = new BarcodeGenerator();

