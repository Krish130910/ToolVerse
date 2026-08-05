export type PasswordMode = "random" | "pronounceable" | "passphrase";

export interface PasswordOptions {
  mode: PasswordMode;
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  customSeparator: string;
  wordCount: number;
  autoCopy: boolean;
}

export type StrengthRating = "Very Weak" | "Weak" | "Moderate" | "Strong" | "Extremely Secure";

export interface EntropyResult {
  entropy: number;
  poolSize: number;
  strengthLabel: StrengthRating;
  strengthColor: string;
  badgeBg: string;
  crackTime: string;
}

export interface PolicyCheck {
  id: string;
  label: string;
  passed: boolean;
}

export interface CharBreakdown {
  uppercase: number;
  lowercase: number;
  numbers: number;
  symbols: number;
  total: number;
}

export interface PasswordHistoryItem {
  id: string;
  password: string;
  timestamp: number;
  mode: PasswordMode;
  strength: StrengthRating;
}

export interface WifiQRConfig {
  ssid: string;
  security: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}
