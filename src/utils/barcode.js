/**
 * Generate a simple barcode representation
 * This is a simplified barcode generator for display purposes
 * In production, you would use a proper barcode library like jsbarcode
 */

export const generateBarcode = (orderId) => {
  // Convert order ID to a barcode-like pattern
  // This is a simple visual representation
  // For production, use a library like jsbarcode or generate actual barcode images
  
  const code = orderId.replace(/[^0-9]/g, '').padStart(12, '0');
  
  // Return a pattern that looks like a barcode
  return {
    code: code,
    pattern: code.split('').map((digit, index) => {
      // Create varying bar widths based on digit
      const width = parseInt(digit) % 3 + 1;
      return { digit, width };
    }),
  };
};

/**
 * Generate barcode SVG (simplified version)
 */
export const generateBarcodeSVG = (orderId, width = 200, height = 50) => {
  const barcode = generateBarcode(orderId);
  const barWidth = width / barcode.pattern.length;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  barcode.pattern.forEach((bar, index) => {
    const x = index * barWidth;
    const barHeight = height * (0.5 + (parseInt(bar.digit) % 5) / 10);
    const y = (height - barHeight) / 2;
    
    svg += `<rect x="${x}" y="${y}" width="${barWidth * bar.width}" height="${barHeight}" fill="black"/>`;
  });
  
  svg += `</svg>`;
  
  return svg;
};

/**
 * Generate barcode as data URL for use in img tags
 */
export const generateBarcodeDataURL = (orderId) => {
  const svg = generateBarcodeSVG(orderId);
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
};

