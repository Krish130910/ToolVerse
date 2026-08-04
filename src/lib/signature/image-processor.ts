/**
 * Image processing utilities for Upload Mode in Digital Signature Creator
 */

export interface ImageProcessOptions {
  removeBackground: boolean;
  threshold: number; // 0 - 255 (sensitivity for white background removal)
  inkColor: string; // custom recolor ink color if desired or keep original
  contrast: number; // -100 to 100
  brightness: number; // -100 to 100
}

/**
 * Process uploaded signature image on HTML5 canvas
 */
export async function processUploadedImage(
  imageSrc: string,
  options: ImageProcessOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas 2D context not available"));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Hex to RGB for custom ink color
      const hexToRgb = (hex: string) => {
        let cleanHex = hex.replace("#", "");
        if (cleanHex.length === 3) {
          cleanHex = cleanHex.split("").map((c) => c + c).join("");
        }
        const num = parseInt(cleanHex, 16);
        return {
          r: (num >> 16) & 255,
          g: (num >> 8) & 255,
          b: num & 255,
        };
      };

      const customRgb = options.inkColor ? hexToRgb(options.inkColor) : null;
      const thresholdLimit = options.threshold;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        let a = data[i + 3];

        // Apply Brightness & Contrast
        if (options.brightness !== 0 || options.contrast !== 0) {
          const factor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));
          r = factor * (r - 128) + 128 + options.brightness;
          g = factor * (g - 128) + 128 + options.brightness;
          b = factor * (b - 128) + 128 + options.brightness;

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }

        // Calculate luminance
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        // White / Light Background Removal
        if (options.removeBackground) {
          if (luminance >= thresholdLimit) {
            // Make transparent
            data[i + 3] = 0;
          } else {
            // It's part of the signature stroke
            if (customRgb) {
              data[i] = customRgb.r;
              data[i + 1] = customRgb.g;
              data[i + 2] = customRgb.b;
            }
            // Enhance opacity based on how dark the pixel was
            const alphaFactor = (thresholdLimit - luminance) / thresholdLimit;
            data[i + 3] = Math.min(255, Math.max(0, Math.floor(a * alphaFactor * 1.2)));
          }
        } else if (customRgb && luminance < thresholdLimit) {
          data[i] = customRgb.r;
          data[i + 1] = customRgb.g;
          data[i + 2] = customRgb.b;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });
}
