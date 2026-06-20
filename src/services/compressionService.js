import imageCompression from 'browser-image-compression'

/**
 * Advanced Core Compression Engine.
 * Handles standard images, SVG vector minification, cross-format conversion, 
 * and explicit custom width/height pixel constraints.
 */
export async function compressImage(file, options = {}) {
  const { 
    quality = 0.7, 
    maxSizeMB = 1, 
    onProgress, 
    outputFormat = 'original',
    customWidth = null,
    customHeight = null,
    lockAspectRatio = true
  } = options;

  const isSvg = file.type === 'image/svg+xml' || file.name.endsWith('.svg');
  
  // Explicitly map clean UI target formats to real browser MIME type headers
  let targetMimeType = file.type;
  if (outputFormat === 'jpeg') targetMimeType = 'image/jpeg';
  if (outputFormat === 'png') targetMimeType = 'image/png';
  if (outputFormat === 'webp') targetMimeType = 'image/webp';

  // =========================================================================
  // PIPELINE A: SVG CODES & VECTOR MANIPULATION ARCHITECTURE
  // =========================================================================
  if (isSvg) {
    if (onProgress) onProgress(20);
    const svgCodeText = await file.text();
    if (onProgress) onProgress(50);

    // Option A1: Keep format as SVG, perform vector source code minification
    if (outputFormat === 'original') {
      const minifiedSvg = svgCodeText
        .replace(/<!--[\s\S]*?-->/g, '') // Strip comment layers
        .replace(/>\s+</g, '><')          // Collapse empty whitespace gaps
        .trim();

      const blob = new Blob([minifiedSvg], { type: 'image/svg+xml' });
      if (onProgress) onProgress(100);
      return { blob };
    }

    // Option A2: Convert SVG into flat pixel raster arrays (PNG, JPEG, WebP)
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svgCodeText], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Compute crisp target canvas constraints based on custom layout inputs
        let finalWidth = customWidth || img.naturalWidth || 1024;
        let finalHeight = customHeight || img.naturalHeight || 768;

        if (lockAspectRatio && img.naturalWidth && img.naturalHeight) {
          if (customWidth && !customHeight) {
            finalHeight = Math.round((customWidth / img.naturalWidth) * img.naturalHeight);
          } else if (customHeight && !customWidth) {
            finalWidth = Math.round((customHeight / img.naturalHeight) * img.naturalWidth);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');

        // Paint a high-contrast white base layer background if converting to JPEG to prevent black errors
        if (outputFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, finalWidth, finalHeight);
        }

        if (onProgress) onProgress(80);
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (blob) {
            if (onProgress) onProgress(100);
            // CRITICAL FIXED BLOCK: Creates a pristine Blob shell mapping the raw binary array array, 
            // forcing the browser to read it as a raster file type header, avoiding XML tree text errors
            const forcedRasterBlob = new Blob([blob], { type: targetMimeType });
            resolve({ blob: forcedRasterBlob });
          } else {
            reject(new Error('Vector compilation canvas conversion fault.'));
          }
        }, targetMimeType, outputFormat === 'png' ? undefined : quality);
      };

      img.onerror = () => reject(new Error('Vector element raster parsing failure.'));
      img.src = url;
    });
  }

  // =========================================================================
  // PIPELINE B: MANUAL PIXEL DIMENSION RESOLUTION MANIPULATION OVERRIDES
  // =========================================================================
  if (customWidth || customHeight) {
    if (onProgress) onProgress(20);
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        let finalWidth = customWidth || img.naturalWidth;
        let finalHeight = customHeight || img.naturalHeight;

        if (lockAspectRatio && img.naturalWidth && img.naturalHeight) {
          if (customWidth && !customHeight) {
            finalHeight = Math.round((customWidth / img.naturalWidth) * img.naturalHeight);
          } else if (customHeight && !customWidth) {
            finalWidth = Math.round((customHeight / img.naturalHeight) * img.naturalWidth);
          }
        }

        if (onProgress) onProgress(50);
        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');

        if (targetMimeType === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, finalWidth, finalHeight);
        }

        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        URL.revokeObjectURL(url);
        if (onProgress) onProgress(80);

        canvas.toBlob((blob) => {
          if (blob) {
            if (onProgress) onProgress(100);
            const forcedRasterBlob = new Blob([blob], { type: targetMimeType });
            resolve({ blob: forcedRasterBlob });
          } else {
            reject(new Error('Canvas compilation breakdown.'));
          }
        }, targetMimeType, outputFormat === 'png' ? undefined : quality);
      };

      img.onerror = () => reject(new Error('Failed reading binary data track.'));
      img.src = url;
    });
  }

  // =========================================================================
  // PIPELINE C: STANDARD THIRD-PARTY LOSS ENGINES WORKERS (Fallback)
  // =========================================================================
  const workerOptions = {
    maxSizeMB,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: quality,
    fileType: targetMimeType,
    onProgress: onProgress ? (p) => onProgress(p) : undefined,
  };

  const compressed = await imageCompression(file, workerOptions);
  return { blob: compressed };
}

/**
 * Trigger an explicit clean file download inside client viewport contexts.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Download all completed files cleanly with matching output file extensions.
 */
export async function downloadAll(images) {
  const done = images.filter(img => img.status === 'done' && img.compressedBlob);
  for (const img of done) {
    const nameWithoutExt = img.file.name.replace(/\.[^/.]+$/, '');
    const currentMimeType = img.compressedBlob.type || img.file.type;
    const finalName = `${nameWithoutExt}_compressed.${getExt(currentMimeType)}`;
    
    downloadBlob(img.compressedBlob, finalName);
    await new Promise(r => setTimeout(r, 250)); // Multi-file trigger protection window cushions
  }
}

function getExt(mimeType) {
  const map = { 
    'image/jpeg': 'jpg', 
    'image/jpg': 'jpg', 
    'image/png': 'png', 
    'image/webp': 'webp',
    'image/svg+xml': 'svg' 
  };
  return map[mimeType] || 'jpg';
}

/**
 * Format raw file bytes to clean human-readable text strings.
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Calculate active compression saving metric percentages.
 */
export function calcReduction(original, compressed) {
  if (!original || !compressed) return 0;
  return Math.round((1 - compressed / original) * 100);
}
