// Code 39 Barcode SVG Generator for Starbook Kids

class BarcodeGenerator {
  constructor() {
    this.CODE39_MAP = {
      '0': 'bwbwbwBwb', '1': 'BwbwbwbwB', '2': 'bwBwbwbwB', '3': 'BwBwbwbwb',
      '4': 'bwbwBwbwB', '5': 'BwbwBwbwb', '6': 'bwBwBwbwb', '7': 'bwbwbwBwB',
      '8': 'BwbwbwBwb', '9': 'bwBwbwBwb', 'A': 'BwbwbwbWb', 'B': 'bwBwbwbWb',
      'C': 'BwBwbwbwb', 'D': 'bwbwBwbWb', 'E': 'BwbwBwbwb', 'F': 'bwBwBwbwb',
      'G': 'bwbwbwBWb', 'H': 'BwbwbwBwb', 'I': 'bwBwbwBwb', 'J': 'bwbwBwBwb',
      'K': 'BwbwbwbwB', 'L': 'bwBwbwbwB', 'M': 'BwBwbwbwb', 'N': 'bwbwBwbwB',
      'O': 'BwbwBwbwb', 'P': 'bwBwBwbwb', 'Q': 'bwbwbwBwB', 'R': 'BwbwbwBwb',
      'S': 'bwBwbwBwb', 'T': 'bwbwBwBwb', 'U': 'BwbwbwbwB', 'V': 'bwBwbwbwB',
      'W': 'BwBwbwbwb', 'X': 'bwbwBwbwB', 'Y': 'BwbwBwbwb', 'Z': 'bwBwBwbwb',
      '-': 'bwbwbwbwB', '.': 'Bwbwbwbwb', ' ': 'bwBwbwbwb', '$': 'bwbwbwbwb',
      '/': 'bwbwbwbwb', '+': 'bwbwbwbwb', '%': 'bwbwbwbwb', '*': 'bwbwBwBwb'
    };
  }

  generateSVG(text, options = {}) {
    const width = options.width || 220;
    const height = options.height || 70;
    const cleanText = (text || 'STAR-01').toUpperCase().replace(/[^A-Z0-9\-\.\ \$\/\+\%\*]/g, '-');
    const fullText = `*${cleanText}*`;

    let pattern = '';
    for (let char of fullText) {
      pattern += (this.CODE39_MAP[char] || this.CODE39_MAP['-']) + 'w';
    }

    let totalModules = 0;
    for (let p of pattern) {
      totalModules += (p === 'B' || p === 'W') ? 3 : 1;
    }

    const unitWidth = (width - 20) / totalModules;
    let x = 10;
    let rects = '';

    for (let p of pattern) {
      const isBlack = (p === 'b' || p === 'B');
      const w = ((p === 'B' || p === 'W') ? 3 : 1) * unitWidth;

      if (isBlack) {
        rects += `<rect x="${x.toFixed(2)}" y="6" width="${w.toFixed(2)}" height="${height - 24}" fill="#0f172a" rx="1" />`;
      }
      x += w;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">
        <rect width="${width}" height="${height}" fill="#ffffff" rx="8" />
        ${rects}
        <text x="${(width / 2).toFixed(2)}" y="${height - 4}" font-family="'Courier New', monospace" font-size="10" font-weight="800" text-anchor="middle" fill="#334155" letter-spacing="1.5">${cleanText}</text>
      </svg>
    `;
  }
}

export const barcodeGenerator = new BarcodeGenerator();
if (typeof window !== 'undefined') {
  window.barcodeGenerator = barcodeGenerator;
}

