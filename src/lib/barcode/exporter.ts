export const exportSvg = (svgElement: SVGSVGElement | null, filename: string): boolean => {
  if (!svgElement) return false;
  try {
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    if (!svgString.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${filename}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
};

export const exportPng = (
  svgElement: SVGSVGElement | null,
  filename: string,
  backgroundColor: string,
  isTransparent: boolean
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!svgElement) {
      resolve(false);
      return;
    }

    try {
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgElement);

      if (!svgString.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URLObj = window.URL || window.webkitURL || window;
      const svgUrl = URLObj.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const bbox = svgElement.getBoundingClientRect();
        const scale = 3; // 3x ultra-high-resolution canvas for crisp PNG
        const width = (bbox.width || 400) * scale;
        const height = (bbox.height || 150) * scale;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URLObj.revokeObjectURL(svgUrl);
          resolve(false);
          return;
        }

        if (!isTransparent) {
          ctx.fillStyle = backgroundColor || "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.clearRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);
        URLObj.revokeObjectURL(svgUrl);

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(false);
            return;
          }
          const pngUrl = URLObj.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = `${filename}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URLObj.revokeObjectURL(pngUrl);
          resolve(true);
        }, "image/png");
      };

      img.onerror = () => {
        URLObj.revokeObjectURL(svgUrl);
        resolve(false);
      };

      img.src = svgUrl;
    } catch {
      resolve(false);
    }
  });
};

export const printBarcode = (
  svgElement: SVGSVGElement | null,
  value: string,
  formatName: string
): void => {
  if (!svgElement) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const printWindow = window.open("", "_blank", "width=700,height=500");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Barcode - ${value}</title>
        <style>
          body {
            margin: 0;
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #FAF8F5;
            color: #18181B;
          }
          .barcode-card {
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            padding: 40px 56px;
            text-align: center;
            background: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
            max-width: 90%;
          }
          .format-badge {
            display: inline-block;
            background: #FFF7ED;
            color: #EA580C;
            border: 1px solid #FFEDD5;
            border-radius: 9999px;
            padding: 4px 14px;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 0.02em;
          }
          .barcode-container {
            margin: 16px 0;
            display: flex;
            justify-content: center;
          }
          .value-label {
            margin-top: 16px;
            font-size: 14px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            color: #71717A;
          }
          .value-string {
            color: #18181B;
            font-weight: 700;
          }
          svg {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div class="barcode-card">
          <div class="format-badge">${formatName}</div>
          <div class="barcode-container">${svgString}</div>
          <div class="value-label">Content: <span class="value-string">${value}</span></div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
