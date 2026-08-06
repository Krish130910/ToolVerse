import { DocumentStats } from "./types";

/**
 * Format raw byte size into human readable string (e.g. 1.25 KB, 4.5 MB)
 */
export function formatByteSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Calculate detailed document statistics in real time
 */
export function calculateDocumentStats(content: string): DocumentStats {
  if (!content) {
    return {
      characterCount: 0,
      lineCount: 0,
      wordCount: 0,
      byteSize: 0,
      formattedSize: "0 Bytes",
    };
  }

  const characterCount = content.length;
  const lineCount = content.split("\n").length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  
  // Calculate byte size in UTF-8
  const byteSize = new Blob([content]).size;
  const formattedSize = formatByteSize(byteSize);

  return {
    characterCount,
    lineCount,
    wordCount,
    byteSize,
    formattedSize,
  };
}

/**
 * Non-blocking async execution wrapper using requestIdleCallback / setTimeout
 * to keep UI 60fps responsive even for 100,000+ character documents.
 */
export async function runAsyncConversion<T>(fn: () => T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        try {
          resolve(fn());
        } catch (err) {
          reject(err);
        }
      });
    } else {
      setTimeout(() => {
        try {
          resolve(fn());
        } catch (err) {
          reject(err);
        }
      }, 0);
    }
  });
}
