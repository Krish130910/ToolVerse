/**
 * Export utilities for Digital Signature Creator (PNG, SVG, PDF, Copy Clipboard)
 */

/**
 * Download PNG image from Canvas with high-DPI
 */
export const downloadPng = (
  canvas: HTMLCanvasElement | null,
  filename: string = "digital-signature.png"
): boolean => {
  if (!canvas) return false;
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};

/**
 * Download SVG file wrapping signature image data URL or vector path
 */
export const downloadSvg = (
  canvas: HTMLCanvasElement | null,
  filename: string = "digital-signature.svg"
): boolean => {
  if (!canvas) return false;

  const dataUrl = canvas.toDataURL("image/png");
  const width = canvas.width;
  const height = canvas.height;

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    .signature-img { image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; }
  </style>
  <image class="signature-img" width="${width}" height="${height}" xlink:href="${dataUrl}"/>
</svg>`;

  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

/**
 * Copy Canvas Image Blob directly to System Clipboard
 */
export const copyImageToClipboard = async (
  canvas: HTMLCanvasElement | null
): Promise<boolean> => {
  if (!canvas) return false;

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        resolve(true);
      } catch (err) {
        console.error("Clipboard write error:", err);
        resolve(false);
      }
    }, "image/png");
  });
};

/**
 * Export Signature as a clean Printable / Document PDF
 */
export const downloadPdf = (
  canvas: HTMLCanvasElement | null,
  filename: string = "digital-signature.pdf"
): boolean => {
  if (!canvas) return false;

  const imgData = canvas.toDataURL("image/png");
  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Digital Signature Document</title>
        <style>
          @page { size: A4 portrait; margin: 20mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #18181b;
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            background-color: #ffffff;
          }
          .card {
            border: 1px solid #e4e4e7;
            border-radius: 16px;
            padding: 40px 60px;
            text-align: center;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .title { font-size: 20px; font-weight: 800; margin-bottom: 4px; color: #09090b; }
          .subtitle { font-size: 12px; color: #71717a; margin-bottom: 32px; }
          .sig-box {
            border-bottom: 2px solid #18181b;
            padding-bottom: 12px;
            margin-bottom: 12px;
          }
          .sig-box img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
          .meta { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { margin-top: 40px; font-size: 10px; color: #a1a1aa; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="title">ToolVerse Digital Signature Verification</div>
          <div class="subtitle">Verified Client-Side Electronic Signature</div>
          <div class="sig-box">
            <img src="${imgData}" alt="Signature" />
          </div>
          <div class="meta">Authorized Signatory</div>
          <div class="footer">Generated via ToolVerse Security Suite &bull; ${new Date().toISOString().slice(0, 10)}</div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
  return true;
};
