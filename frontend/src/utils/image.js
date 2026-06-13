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
export const compressImage = (base64Str, maxWidth = 600, maxHeight = 600, quality = 0.7) => {
  return new Promise((resolve) => {
    // If the input is not a base64 string or is already small, skip canvas processing
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

        // Calculate new dimensions preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        // Clear canvas and draw resized image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to compressed JPEG base64 string
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.error('Error during image canvas compression, falling back to original:', err);
        resolve(base64Str);
      }
    };
    img.onerror = (err) => {
      console.error('Failed to load image for compression, falling back to original:', err);
      resolve(base64Str);
    };
  });
};
