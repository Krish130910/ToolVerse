import {
  PasswordOptions,
  EntropyResult,
  PolicyCheck,
  CharBreakdown,
  StrengthRating,
} from "./types";
import {
  PASSPHRASE_WORDS,
  PHONETIC_CONSONANTS,
  PHONETIC_VOWELS,
  COMMON_WEAK_PATTERNS,
} from "./wordlist";

const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR_CHARS = /[il1Lo0O]/g;
const AMBIGUOUS_SYMBOLS = /[{}[\]()/\s'"`~,;:.<>]/g;

/**
 * Generate cryptographically secure random integers between 0 and max (exclusive)
 */
function getRandomInt(max: number): number {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/**
 * Main password generation function supporting Random, Pronounceable, and Passphrase modes.
 */
export function generatePassword(options: PasswordOptions): { password: string; warning: string | null } {
  if (options.mode === "passphrase") {
    return generatePassphrase(options);
  } else if (options.mode === "pronounceable") {
    return generatePronounceable(options);
  }

  // Random Mode
  let charPool = "";
  const pools: string[] = [];

  if (options.includeLowercase) {
    let set = LOWERCASE_CHARS;
    if (options.excludeSimilar) set = set.replace(SIMILAR_CHARS, "");
    if (set) {
      pools.push(set);
      charPool += set;
    }
  }

  if (options.includeUppercase) {
    let set = UPPERCASE_CHARS;
    if (options.excludeSimilar) set = set.replace(SIMILAR_CHARS, "");
    if (set) {
      pools.push(set);
      charPool += set;
    }
  }

  if (options.includeNumbers) {
    let set = NUMBER_CHARS;
    if (options.excludeSimilar) set = set.replace(SIMILAR_CHARS, "");
    if (set) {
      pools.push(set);
      charPool += set;
    }
  }

  if (options.includeSymbols) {
    let set = SYMBOL_CHARS;
    if (options.excludeAmbiguous) set = set.replace(AMBIGUOUS_SYMBOLS, "");
    if (set) {
      pools.push(set);
      charPool += set;
    }
  }

  if (!charPool || pools.length === 0) {
    return {
      password: "",
      warning: "Please select at least one character set to generate a password.",
    };
  }

  const length = Math.max(4, Math.min(128, options.length));
  const chars: string[] = [];

  // Guarantee at least one character from each selected pool if length permits
  for (let i = 0; i < pools.length && i < length; i++) {
    const pool = pools[i];
    chars.push(pool[getRandomInt(pool.length)]);
  }

  // Fill remaining characters from entire character pool
  while (chars.length < length) {
    chars.push(charPool[getRandomInt(charPool.length)]);
  }

  // Shuffle guaranteed characters using Fisher-Yates
  for (let i = chars.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    const temp = chars[i];
    chars[i] = chars[j];
    chars[j] = temp;
  }

  return { password: chars.join(""), warning: null };
}

/**
 * Generate pronounceable syllabic passwords (e.g. "Kov-Tep-92!")
 */
function generatePronounceable(options: PasswordOptions): { password: string; warning: string | null } {
  const length = Math.max(4, Math.min(128, options.length));
  let result = "";

  while (result.length < length) {
    const c = PHONETIC_CONSONANTS[getRandomInt(PHONETIC_CONSONANTS.length)];
    const v = PHONETIC_VOWELS[getRandomInt(PHONETIC_VOWELS.length)];
    let syllable = c + v;

    if (options.includeUppercase && (result.length === 0 || Math.random() > 0.5)) {
      syllable = syllable.charAt(0).toUpperCase() + syllable.slice(1);
    }
    result += syllable;
  }

  result = result.slice(0, length);

  // Append number / symbol if requested and length permits
  if (options.includeNumbers && length > 6) {
    const num = getRandomInt(100).toString().padStart(2, "0");
    result = result.slice(0, length - 2) + num;
  }

  if (options.includeSymbols && length > 8) {
    const syms = "!@#$%&*";
    const sym = syms[getRandomInt(syms.length)];
    result = result.slice(0, length - 1) + sym;
  }

  if (options.excludeSimilar) {
    result = result.replace(SIMILAR_CHARS, "x");
  }

  return { password: result, warning: null };
}

/**
 * Generate passphrase using curated dictionary (e.g. "correct-horse-battery-staple-94")
 */
function generatePassphrase(options: PasswordOptions): { password: string; warning: string | null } {
  const wordCount = Math.max(2, Math.min(10, options.wordCount || 4));
  const words: string[] = [];
  const separator = options.customSeparator !== undefined ? options.customSeparator : "-";

  for (let i = 0; i < wordCount; i++) {
    let word = PASSPHRASE_WORDS[getRandomInt(PASSPHRASE_WORDS.length)];
    if (options.includeUppercase && (i === 0 || Math.random() > 0.4)) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    words.push(word);
  }

  if (options.includeNumbers) {
    const randIdx = getRandomInt(words.length);
    words[randIdx] += getRandomInt(99).toString();
  }

  if (options.includeSymbols) {
    const syms = "!@#$%^&*";
    const randIdx = getRandomInt(words.length);
    words[randIdx] += syms[getRandomInt(syms.length)];
  }

  return { password: words.join(separator), warning: null };
}

/**
 * Calculate Shannon entropy (in bits) and crack time estimation
 */
export function calculateEntropy(options: PasswordOptions, password: string): EntropyResult {
  if (!password) {
    return {
      entropy: 0,
      poolSize: 0,
      strengthLabel: "Very Weak",
      strengthColor: "bg-rose-500",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
      crackTime: "Instant",
    };
  }

  let poolSize = 0;

  if (options.mode === "passphrase") {
    poolSize = PASSPHRASE_WORDS.length; // ~300 words
    const count = options.wordCount || 4;
    const entropy = Math.round(count * Math.log2(poolSize));
    return formatEntropyResult(entropy, poolSize);
  }

  let hasLower = false;
  let hasUpper = false;
  let hasNumber = false;
  let hasSymbol = false;

  for (const ch of password) {
    if (LOWERCASE_CHARS.includes(ch)) hasLower = true;
    else if (UPPERCASE_CHARS.includes(ch)) hasUpper = true;
    else if (NUMBER_CHARS.includes(ch)) hasNumber = true;
    else hasSymbol = true;
  }

  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 32;

  if (options.excludeSimilar) poolSize = Math.max(2, poolSize - 7);
  if (options.excludeAmbiguous) poolSize = Math.max(2, poolSize - 15);

  const entropy = Math.round(password.length * Math.log2(Math.max(2, poolSize)));

  return formatEntropyResult(entropy, poolSize);
}

function formatEntropyResult(entropy: number, poolSize: number): EntropyResult {
  let strengthLabel: StrengthRating = "Very Weak";
  let strengthColor = "bg-rose-500";
  let badgeBg = "bg-rose-50 text-rose-700 border-rose-200";

  if (entropy >= 100) {
    strengthLabel = "Extremely Secure";
    strengthColor = "bg-cyan-500";
    badgeBg = "bg-cyan-50 text-cyan-800 border-cyan-200";
  } else if (entropy >= 65) {
    strengthLabel = "Strong";
    strengthColor = "bg-emerald-500";
    badgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (entropy >= 45) {
    strengthLabel = "Moderate";
    strengthColor = "bg-amber-500";
    badgeBg = "bg-amber-50 text-amber-800 border-amber-200";
  } else if (entropy >= 28) {
    strengthLabel = "Weak";
    strengthColor = "bg-orange-500";
    badgeBg = "bg-orange-50 text-orange-800 border-orange-200";
  }

  const crackTime = estimateCrackTime(entropy);

  return {
    entropy,
    poolSize,
    strengthLabel,
    strengthColor,
    badgeBg,
    crackTime,
  };
}

/**
 * Estimate offline crack time based on 100 Billion hashes/sec offline GPU cracking
 */
function estimateCrackTime(entropy: number): string {
  if (entropy <= 25) return "Instant";
  const combinations = Math.pow(2, entropy);
  const hashesPerSec = 100_000_000_000; // 100 Billion guesses/sec
  const seconds = combinations / hashesPerSec;

  if (seconds < 1) return "< 1 second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;

  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1_000_000) return `${(years / 1000).toFixed(1)}k years`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} Million years`;
  if (years < 1_000_000_000_000) return `${(years / 1_000_000_000).toFixed(1)} Billion years`;
  return `${(years / 1_000_000_000_000).toFixed(1)} Trillion years`;
}

/**
 * Evaluate standard security policies against generated password
 */
export function evaluatePolicies(password: string): PolicyCheck[] {
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const noRepeats = !/(.)\1\1/.test(password);

  const isWeakPattern = COMMON_WEAK_PATTERNS.some((pattern) =>
    password.toLowerCase().includes(pattern)
  );

  return [
    { id: "len", label: "Length is at least 12 characters", passed: len >= 12 },
    { id: "cases", label: "Contains both Uppercase & Lowercase", passed: hasUpper && hasLower },
    { id: "num_sym", label: "Contains Numbers & Special Symbols", passed: hasNumber && hasSymbol },
    { id: "repeats", label: "No 3+ consecutive repeating characters", passed: noRepeats },
    { id: "dictionary", label: "Free from common weak dictionary words", passed: !isWeakPattern },
  ];
}

/**
 * Character distribution breakdown
 */
export function getCharBreakdown(password: string): CharBreakdown {
  let uppercase = 0;
  let lowercase = 0;
  let numbers = 0;
  let symbols = 0;

  for (const ch of password) {
    if (UPPERCASE_CHARS.includes(ch)) uppercase++;
    else if (LOWERCASE_CHARS.includes(ch)) lowercase++;
    else if (NUMBER_CHARS.includes(ch)) numbers++;
    else symbols++;
  }

  return {
    uppercase,
    lowercase,
    numbers,
    symbols,
    total: password.length,
  };
}

/**
 * Generate standard Wi-Fi QR Code string format
 */
export function generateWifiQrPayload(
  ssid: string,
  password: string,
  security: "WPA" | "WEP" | "nopass" = "WPA",
  hidden: boolean = false
): string {
  if (security === "nopass") {
    return `WIFI:S:${ssid};T:nopass;H:${hidden ? "true" : "false"};;`;
  }
  return `WIFI:S:${ssid};T:${security};P:${password};H:${hidden ? "true" : "false"};;`;
}
