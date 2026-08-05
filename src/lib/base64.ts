/**
 * Production-Grade Base64 Encoder / Decoder Utility Module
 * 
 * Supports full UTF-8 spectrum: English, numbers, special characters,
 * emojis, multi-line strings, and international Unicode characters.
 */

export interface Base64Result {
  success: boolean;
  output: string;
  error?: string;
  byteSize?: number;
  charCount?: number;
}

/**
 * Encodes a plain text string into Base64 using UTF-8 byte encoding.
 */
export function encodeBase64(
  text: string,
  options: { urlSafe?: boolean; dataUri?: boolean; mimeType?: string } = {}
): Base64Result {
  if (!text) {
    return { success: true, output: "", byteSize: 0, charCount: 0 };
  }

  try {
    const bytes = new TextEncoder().encode(text);
    const chunkSize = 0x8000; // 32KB chunks to prevent max call stack overflow
    const chunks: string[] = [];

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
    }

    let base64 = btoa(chunks.join(""));

    if (options.urlSafe) {
      base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    if (options.dataUri) {
      const mime = options.mimeType || "text/plain;charset=utf-8";
      base64 = `data:${mime};base64,${base64}`;
    }

    const outputBytes = new TextEncoder().encode(base64).length;

    return {
      success: true,
      output: base64,
      byteSize: outputBytes,
      charCount: base64.length,
    };
  } catch (err: any) {
    return {
      success: false,
      output: "",
      error: `Encoding error: ${err?.message || "Failed to encode input text."}`,
      byteSize: 0,
      charCount: 0,
    };
  }
}

/**
 * Decodes a Base64 string into plain text using UTF-8 byte decoding.
 * Gracefully rejects invalid Base64 input and non-UTF-8 payload.
 */
export function decodeBase64(input: string): Base64Result {
  if (!input || !input.trim()) {
    return { success: true, output: "", byteSize: 0, charCount: 0 };
  }

  // Remove whitespace and newlines
  let cleaned = input.replace(/\s+/g, "");

  // Auto-strip Data URI header if present (e.g. data:text/plain;base64,...)
  if (cleaned.toLowerCase().startsWith("data:") && cleaned.includes(",")) {
    cleaned = cleaned.substring(cleaned.indexOf(",") + 1);
  }

  // Normalize URL-Safe Base64 (- and _ back to + and /)
  if (cleaned.includes("-") || cleaned.includes("_")) {
    cleaned = cleaned.replace(/-/g, "+").replace(/_/g, "/");
  }

  // Reject strings containing invalid Base64 characters
  if (!/^[A-Za-z0-9+/=]*$/.test(cleaned)) {
    return {
      success: false,
      output: "",
      error: "Invalid Base64 string. Please enter a valid Base64 encoded value.",
      byteSize: 0,
      charCount: 0,
    };
  }

  // Validate Base64 length mod 4
  const mod = cleaned.length % 4;
  if (mod === 1) {
    return {
      success: false,
      output: "",
      error: "Invalid Base64 string. Please enter a valid Base64 encoded value.",
      byteSize: 0,
      charCount: 0,
    };
  } else if (mod === 2) {
    cleaned += "==";
  } else if (mod === 3) {
    cleaned += "=";
  }

  try {
    const binaryStr = atob(cleaned);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // Decode UTF-8 bytes to text with fatal mode enabled to catch corrupt bytes
    try {
      const decodedText = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      const decodedBytes = new TextEncoder().encode(decodedText).length;

      return {
        success: true,
        output: decodedText,
        byteSize: decodedBytes,
        charCount: decodedText.length,
      };
    } catch {
      return {
        success: false,
        output: "",
        error: "Invalid Base64 string. Please enter a valid Base64 encoded value.",
        byteSize: 0,
        charCount: 0,
      };
    }
  } catch {
    return {
      success: false,
      output: "",
      error: "Invalid Base64 string. Please enter a valid Base64 encoded value.",
      byteSize: 0,
      charCount: 0,
    };
  }
}
