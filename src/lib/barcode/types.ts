export type BarcodeFormat = "CODE128" | "CODE39" | "EAN13" | "EAN8" | "UPC" | "ITF14";

export interface FormatConfig {
  id: BarcodeFormat;
  name: string;
  category: "General" | "Retail" | "Logistics";
  description: string;
  defaultSample: string;
  jsBarcodeFormat: string;
  maxLength?: number;
  exactLength?: number;
  placeholder: string;
}

export interface CustomizationOptions {
  width: number;
  height: number;
  margin: number;
  fontSize: number;
  displayValue: boolean;
  lineColor: string;
  background: string;
  transparentBackground: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  characterCount: number;
  expectedCount?: number;
  isExactLength: boolean;
}

export interface ThemePreset {
  id: string;
  name: string;
  lineColor: string;
  background: string;
  transparentBackground: boolean;
}
