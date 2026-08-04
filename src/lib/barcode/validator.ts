import { BarcodeFormat, FormatConfig, ValidationResult } from "./types";

export const BARCODE_FORMATS: FormatConfig[] = [
  {
    id: "CODE128",
    name: "CODE 128",
    category: "General",
    description: "High-density alphanumeric format supporting full printable ASCII.",
    defaultSample: "TOOLVERSE-2026",
    jsBarcodeFormat: "CODE128",
    maxLength: 80,
    placeholder: "Enter printable ASCII text...",
  },
  {
    id: "CODE39",
    name: "CODE 39",
    category: "General",
    description: "Supports uppercase letters (A-Z), numbers (0-9), and symbols (- . $ / + % space).",
    defaultSample: "CODE39-TEST",
    jsBarcodeFormat: "CODE39",
    maxLength: 40,
    placeholder: "Enter uppercase letters or numbers...",
  },
  {
    id: "EAN13",
    name: "EAN-13",
    category: "Retail",
    description: "International Article Number standard used on retail packaging.",
    defaultSample: "9780201379624",
    jsBarcodeFormat: "EAN13",
    exactLength: 13,
    placeholder: "Enter 13 numeric digits...",
  },
  {
    id: "EAN8",
    name: "EAN-8",
    category: "Retail",
    description: "Compact retail barcode standard for smaller products.",
    defaultSample: "96385074",
    jsBarcodeFormat: "EAN8",
    exactLength: 8,
    placeholder: "Enter 8 numeric digits...",
  },
  {
    id: "UPC",
    name: "UPC-A",
    category: "Retail",
    description: "Universal Product Code standard widely used in retail.",
    defaultSample: "012345678905",
    jsBarcodeFormat: "UPC",
    exactLength: 12,
    placeholder: "Enter 12 numeric digits...",
  },
  {
    id: "ITF14",
    name: "ITF-14",
    category: "Logistics",
    description: "Interleaved 2 of 5 format used for master packaging & shipping cartons.",
    defaultSample: "10012345678902",
    jsBarcodeFormat: "ITF14",
    exactLength: 14,
    placeholder: "Enter 14 numeric digits...",
  },
];

export const getFormatConfig = (format: BarcodeFormat): FormatConfig => {
  return BARCODE_FORMATS.find((f) => f.id === format) || BARCODE_FORMATS[0];
};

export const validateBarcode = (value: string, format: BarcodeFormat): ValidationResult => {
  const config = getFormatConfig(format);
  const trimmed = value.trim();
  const count = trimmed.length;

  if (!trimmed) {
    return {
      isValid: false,
      message: `Please enter a value for ${config.name}.`,
      characterCount: 0,
      expectedCount: config.exactLength,
      isExactLength: Boolean(config.exactLength),
    };
  }

  switch (format) {
    case "CODE128": {
      const isAscii = /^[\x20-\x7E]+$/.test(trimmed);
      if (!isAscii) {
        return {
          isValid: false,
          message: "❌ CODE128 only supports printable ASCII characters.",
          characterCount: count,
          isExactLength: false,
        };
      }
      return {
        isValid: true,
        message: "✓ Valid CODE128 format ready.",
        characterCount: count,
        isExactLength: false,
      };
    }

    case "CODE39": {
      const isCode39 = /^[0-9A-Z\-.\ \$\/\+\%]+$/.test(trimmed);
      if (!isCode39) {
        return {
          isValid: false,
          message: "❌ Code39 only supports uppercase letters (A-Z), numbers (0-9), and symbols - . $ / + % [space].",
          characterCount: count,
          isExactLength: false,
        };
      }
      return {
        isValid: true,
        message: "✓ Valid CODE39 format ready.",
        characterCount: count,
        isExactLength: false,
      };
    }

    case "EAN13": {
      const isNumeric = /^[0-9]+$/.test(trimmed);
      if (!isNumeric) {
        return {
          isValid: false,
          message: "❌ EAN-13 requires numeric digits only.",
          characterCount: count,
          expectedCount: 13,
          isExactLength: true,
        };
      }
      if (count !== 13) {
        return {
          isValid: false,
          message: `❌ EAN-13 requires exactly 13 digits (currently ${count}).`,
          characterCount: count,
          expectedCount: 13,
          isExactLength: true,
        };
      }
      return {
        isValid: true,
        message: "✓ Valid EAN-13 barcode ready.",
        characterCount: count,
        expectedCount: 13,
        isExactLength: true,
      };
    }

    case "EAN8": {
      const isNumeric = /^[0-9]+$/.test(trimmed);
      if (!isNumeric) {
        return {
          isValid: false,
          message: "❌ EAN-8 requires numeric digits only.",
          characterCount: count,
          expectedCount: 8,
          isExactLength: true,
        };
      }
      if (count !== 8) {
        return {
          isValid: false,
          message: `❌ EAN-8 requires exactly 8 digits (currently ${count}).`,
          characterCount: count,
          expectedCount: 8,
          isExactLength: true,
        };
      }
      return {
        isValid: true,
        message: "✓ Valid EAN-8 barcode ready.",
        characterCount: count,
        expectedCount: 8,
        isExactLength: true,
      };
    }

    case "UPC": {
      const isNumeric = /^[0-9]+$/.test(trimmed);
      if (!isNumeric) {
        return {
          isValid: false,
          message: "❌ UPC-A requires numeric digits only.",
          characterCount: count,
          expectedCount: 12,
          isExactLength: true,
        };
      }
      if (count !== 12) {
        return {
          isValid: false,
          message: `❌ UPC-A requires exactly 12 digits (currently ${count}).`,
          characterCount: count,
          expectedCount: 12,
          isExactLength: true,
        };
      }
      return {
        isValid: true,
        message: "✓ Valid UPC-A barcode ready.",
        characterCount: count,
        expectedCount: 12,
        isExactLength: true,
      };
    }

    case "ITF14": {
      const isNumeric = /^[0-9]+$/.test(trimmed);
      if (!isNumeric) {
        return {
          isValid: false,
          message: "❌ ITF-14 requires numeric digits only.",
          characterCount: count,
          expectedCount: 14,
          isExactLength: true,
        };
      }
      if (count !== 14) {
        return {
          isValid: false,
          message: `❌ ITF-14 requires exactly 14 digits (currently ${count}).`,
          characterCount: count,
          expectedCount: 14,
          isExactLength: true,
        };
      }
      return {
        isValid: true,
        message: "✓ Valid ITF-14 barcode ready.",
        characterCount: count,
        expectedCount: 14,
        isExactLength: true,
      };
    }

    default:
      return {
        isValid: false,
        message: "Unsupported barcode format.",
        characterCount: count,
        isExactLength: false,
      };
  }
};
