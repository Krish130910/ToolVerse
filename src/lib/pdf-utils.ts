import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";

/**
 * Validates whether a file is a PDF file and non-empty.
 */
export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file provided." };
  }
  if (file.size === 0) {
    return { valid: false, error: "File is empty (0 bytes)." };
  }
  if (file.type && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "Invalid file format. Please upload a valid PDF document." };
  }
  return { valid: true };
}

/**
 * Extracts page count and basic details from a PDF file.
 */
export async function getPdfDetails(file: File): Promise<{ pageCount: number; size: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return {
    pageCount: pdfDoc.getPageCount(),
    size: file.size,
  };
}

/**
 * Hex color helper (#RRGGBB -> rgb())
 */
function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return rgb(r, g, b);
}

/**
 * 1. Add Page Numbers to PDF
 */
export interface AddPageNumbersOptions {
  position: "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
  fontSize: number;
  color: string;
  startNumber: number;
  skipFirstPage: boolean;
  formatStr: string;
}

export async function addPageNumbersToPdf(
  file: File,
  options: AddPageNumbersOptions
): Promise<{ blob: Blob; filename: string; totalPages: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  const fontColor = hexToRgb(options.color || "#18181B");

  pages.forEach((page, idx) => {
    // Check if skipping first page
    if (options.skipFirstPage && idx === 0) {
      return;
    }

    const currentDisplayNumber = options.skipFirstPage
      ? options.startNumber + idx - 1
      : options.startNumber + idx;

    const text = options.formatStr
      .replace("{n}", String(currentDisplayNumber))
      .replace("{total}", String(options.skipFirstPage ? totalPages - 1 : totalPages));

    const textWidth = font.widthOfTextAtSize(text, options.fontSize);
    const textHeight = options.fontSize;

    const { width: pageWidth, height: pageHeight } = page.getSize();
    const margin = 24; // 24pt margin from edge

    let x = margin;
    let y = margin;

    // Determine X position
    if (options.position.includes("center")) {
      x = (pageWidth - textWidth) / 2;
    } else if (options.position.includes("right")) {
      x = pageWidth - textWidth - margin;
    }

    // Determine Y position
    if (options.position.includes("top")) {
      y = pageHeight - textHeight - margin;
    }

    page.drawText(text, {
      x,
      y,
      size: options.fontSize,
      font,
      color: fontColor,
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
  const filename = `numbered_${file.name}`;
  return { blob, filename, totalPages };
}

/**
 * 2. PDF Compressor
 */
export async function compressPdf(
  file: File,
  level: "extreme" | "recommended" | "less"
): Promise<{ blob: Blob; filename: string; originalSize: number; compressedSize: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Optimization strategy per level
  if (level === "extreme") {
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("");
    pdfDoc.setCreator("");
  }

  // Save with object streams compression enabled
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 100,
  });

  const compressedBlob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
  
  // Calculate size metrics accurately
  const finalSize = compressedBlob.size;
  
  return {
    blob: compressedBlob,
    filename: `compressed_${file.name}`,
    originalSize: file.size,
    compressedSize: finalSize,
  };
}

/**
 * 3. PDF Merger
 */
export async function mergePdfs(
  files: File[]
): Promise<{ blob: Blob; filename: string; totalMergedPages: number }> {
  if (files.length === 0) {
    throw new Error("No PDF files provided for merging.");
  }

  const mergedPdf = await PDFDocument.create();
  let totalMergedPages = 0;

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pageIndices = pdfDoc.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => mergedPdf.addPage(page));
    totalMergedPages += pageIndices.length;
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
  const filename = `merged_${Date.now()}.pdf`;

  return { blob, filename, totalMergedPages };
}

/**
 * Helper to parse page range input like "1-3, 5, 8-10" into zero-indexed page numbers.
 */
export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const pagesSet = new Set<number>();
  const parts = rangeStr.split(",").map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(totalPages, Math.max(start, end));
        for (let i = from; i <= to; i++) {
          pagesSet.add(i - 1); // 0-based
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        pagesSet.add(pageNum - 1); // 0-based
      }
    }
  }

  return Array.from(pagesSet).sort((a, b) => a - b);
}

/**
 * 4. PDF Splitter
 */
export async function splitPdf(
  file: File,
  mode: "all" | "range",
  rangeStr: string
): Promise<{ blob: Blob; filename: string; extractedPageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();

  const zip = new JSZip();
  const baseName = file.name.replace(/\.pdf$/i, "");

  let targetIndices: number[] = [];

  if (mode === "all") {
    targetIndices = Array.from({ length: totalPages }, (_, i) => i);
  } else {
    targetIndices = parsePageRanges(rangeStr, totalPages);
    if (targetIndices.length === 0) {
      throw new Error(`Invalid page range or out-of-bounds page numbers. Total pages: ${totalPages}`);
    }
  }

  // If extracting individual pages
  if (mode === "all" || targetIndices.length > 1) {
    for (let i = 0; i < targetIndices.length; i++) {
      const pageIndex = targetIndices[i];
      const singleDoc = await PDFDocument.create();
      const [copiedPage] = await singleDoc.copyPages(srcPdf, [pageIndex]);
      singleDoc.addPage(copiedPage);
      const singleBytes = await singleDoc.save();
      zip.file(`${baseName}_page_${pageIndex + 1}.pdf`, singleBytes);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    return {
      blob: zipBlob,
      filename: `${baseName}_split_pages.zip`,
      extractedPageCount: targetIndices.length,
    };
  } else {
    // Single page extraction
    const pageIndex = targetIndices[0];
    const singleDoc = await PDFDocument.create();
    const [copiedPage] = await singleDoc.copyPages(srcPdf, [pageIndex]);
    singleDoc.addPage(copiedPage);
    const singleBytes = await singleDoc.save();
    const pdfBlob = new Blob([singleBytes as unknown as BlobPart], { type: "application/pdf" });
    return {
      blob: pdfBlob,
      filename: `${baseName}_page_${pageIndex + 1}.pdf`,
      extractedPageCount: 1,
    };
  }
}

/**
 * 5. PDF to Multiple Pages (N-Up Imposition)
 */
export interface NUpOptions {
  gridMode: "2-up" | "4-up" | "6-up" | "8-up";
  orientation: "portrait" | "landscape";
  margin: "compact" | "standard" | "wide";
}

export async function arrangeNUpPdf(
  file: File,
  options: NUpOptions
): Promise<{ blob: Blob; filename: string; totalSheets: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pageCount = srcPdf.getPageCount();

  const outPdf = await PDFDocument.create();

  // Standard A4 dimensions in points (72 points per inch)
  const isLandscape = options.orientation === "landscape";
  const sheetWidth = isLandscape ? 841.89 : 595.28;
  const sheetHeight = isLandscape ? 595.28 : 841.89;

  // Determine grid columns & rows
  let cols = 2;
  let rows = 1;
  if (options.gridMode === "2-up") {
    cols = isLandscape ? 2 : 1;
    rows = isLandscape ? 1 : 2;
  } else if (options.gridMode === "4-up") {
    cols = 2;
    rows = 2;
  } else if (options.gridMode === "6-up") {
    cols = isLandscape ? 3 : 2;
    rows = isLandscape ? 2 : 3;
  } else if (options.gridMode === "8-up") {
    cols = isLandscape ? 4 : 2;
    rows = isLandscape ? 2 : 4;
  }

  const pagesPerSheet = cols * rows;

  // Margin setting
  const padding = options.margin === "compact" ? 12 : options.margin === "wide" ? 36 : 24;

  const availableWidth = sheetWidth - padding * 2;
  const availableHeight = sheetHeight - padding * 2;

  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;

  // Embed pages from source PDF
  const embeddedPages = await outPdf.embedPdf(srcPdf, srcPdf.getPageIndices());

  let sheetCount = 0;

  for (let i = 0; i < pageCount; i += pagesPerSheet) {
    sheetCount++;
    const sheet = outPdf.addPage([sheetWidth, sheetHeight]);

    for (let j = 0; j < pagesPerSheet && i + j < pageCount; j++) {
      const pageIdx = i + j;
      const embeddedPage = embeddedPages[pageIdx];
      const { width: origW, height: origH } = embeddedPage;

      // Calculate column and row index
      const colIdx = j % cols;
      const rowIdx = Math.floor(j / cols);

      // Fit inside cell maintaining aspect ratio
      const scaleX = (cellWidth - 8) / origW;
      const scaleY = (cellHeight - 8) / origH;
      const scale = Math.min(scaleX, scaleY);

      const drawWidth = origW * scale;
      const drawHeight = origH * scale;

      // Center within cell
      const cellLeft = padding + colIdx * cellWidth;
      const cellTop = sheetHeight - padding - (rowIdx + 1) * cellHeight; // PDF coordinates start from bottom-left

      const x = cellLeft + (cellWidth - drawWidth) / 2;
      const y = cellTop + (cellHeight - drawHeight) / 2;

      sheet.drawPage(embeddedPage, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  const pdfBytes = await outPdf.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
  const filename = `nup_${options.gridMode}_${file.name}`;

  return { blob, filename, totalSheets: sheetCount };
}
