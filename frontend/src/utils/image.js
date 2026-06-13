/**
 * Compresses an image data URL (base64) using HTML5 Canvas.
 * Resizes the image to fit within maxWidth and maxHeight, preserving aspect ratio,
 * and exports as a JPEG with the specified quality.
 *
 * @param {string} base64Str - The input base64 data URL.
 * @param {number} maxWidth - The maximum width in pixels.
 * @param {number} maxHeight - The maximum height in pixels.
 * @param {number} quality - JPEG compression quality (0.0 to 1.0).
 * @returns {Promise<string>} - Resolves to the compressed base64 JPEG data URL.
 */
export const compressImage = (base64Str, maxWidth = 500, maxHeight = 500, quality = 0.65) => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:')) {
      return resolve(base64Str);
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.error('Image compression failed, using original:', err);
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

/**
 * Creates a tiny thumbnail for use in list/card views.
 * Target: ~200x200px at very low quality for minimal payload size.
 *
 * @param {string} base64Str - The input base64 data URL.
 * @returns {Promise<string>} - Tiny thumbnail base64 JPEG.
 */
export const createThumbnail = (base64Str) => {
  return compressImage(base64Str, 200, 200, 0.45);
};
