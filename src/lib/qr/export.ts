import { QRMetadata } from "./types";

/**
 * Downloads canvas contents as PNG image file.
 */
export function downloadPng(canvas: HTMLCanvasElement | null, filename: string = "toolverse-qr.png"): boolean {
  if (!canvas) return false;
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error("Failed to download PNG:", err);
    return false;
  }
}

/**
 * Converts canvas image into downloadable SVG format wrapper.
 */
export function downloadSvg(canvas: HTMLCanvasElement | null, filename: string = "toolverse-qr.svg"): boolean {
  if (!canvas) return false;
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const width = canvas.width;
    const height = canvas.height;

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image href="${dataUrl}" x="0" y="0" width="${width}" height="${height}" />
</svg>`;

    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error("Failed to download SVG:", err);
    return false;
  }
}

/**
 * Copies the QR code canvas image directly into the user's system clipboard as a PNG blob.
 */
export async function copyImageToClipboard(canvas: HTMLCanvasElement | null): Promise<boolean> {
  if (!canvas) return false;
  try {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob }),
          ]);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, "image/png");
    });
  } catch (err) {
    console.error("Failed to copy image to clipboard:", err);
    return false;
  }
}

/**
 * Copies text payload string to system clipboard.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Opens browser print dialog specifically showing the QR code canvas and payload metadata.
 */
export function printQrCode(canvas: HTMLCanvasElement | null, metadata: QRMetadata): boolean {
  if (!canvas) return false;
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    if (!printWindow) return false;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ToolVerse</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
            .container { border: 2px solid #ea580c; padding: 40px; border-radius: 24px; max-width: 480px; }
            img { max-width: 320px; height: auto; margin-bottom: 20px; }
            h2 { margin: 0 0 10px 0; color: #18181b; }
            p { color: #52525b; font-size: 14px; margin: 4px 0; word-break: break-all; }
            .badge { display: inline-block; background: #fff7ed; color: #ea580c; padding: 4px 12px; border-radius: 999px; font-weight: bold; font-size: 12px; margin-bottom: 16px; border: 1px solid #ffedd5; }
            .footer { margin-top: 20px; font-size: 11px; color: #a1a1aa; border-top: 1px solid #e4e4e7; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="badge">ToolVerse Utility Suite</div>
            <h2>QR Code (${metadata.typeLabel})</h2>
            <img src="${dataUrl}" alt="QR Code" />
            <p><strong>Payload:</strong> ${escapeHtml(metadata.payload)}</p>
            <p><strong>ECC Level:</strong> ${metadata.errorCorrection} | <strong>Size:</strong> ${metadata.characterCount} Chars</p>
            <div class="footer">Generated using ToolVerse QR Utility - Client Side &amp; Secure</div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    return true;
  } catch (err) {
    console.error("Failed to print QR code:", err);
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
