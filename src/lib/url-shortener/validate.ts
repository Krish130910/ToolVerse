// URL validation, domain verification, alias sanitization, and reserved route protection

import dns from "dns";

export const RESERVED_ALIASES = new Set([
  "api", "about", "tools", "categories", "explore", "contact",
  "changelog", "robots.txt", "sitemap.xml", "favicon.ico",
  "_next", "static", "public", "admin", "login", "register",
  "dashboard", "home", "index", "404", "500", "health",
]);

/** Validates a URL format and returns the normalised URL or throws ValidationError. */
export function validateAndNormalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new ValidationError("Please enter a valid URL.");
  }

  // 1. Reject unsupported URL schemes explicitly (javascript:, data:, file:, ftp:, etc.)
  if (/^(javascript|data|file|ftp|vbscript|mailto|tel|ssh|blob):/i.test(trimmed)) {
    throw new ValidationError("Unsupported URL scheme.");
  }

  // 2. Reject incomplete URLs (e.g. "https://", "http://", "https:///", "https:", "http:")
  if (
    /^https?:\/\/\s*$/i.test(trimmed) ||
    /^https?:\/\/\/+$/i.test(trimmed) ||
    trimmed === "https:" ||
    trimmed === "http:" ||
    trimmed === "https://" ||
    trimmed === "http://"
  ) {
    throw new ValidationError("Please enter a valid URL.");
  }

  // 3. Normalise protocol
  let normalised = trimmed;
  if (!/^https?:\/\//i.test(normalised)) {
    // If it contains an unhandled scheme colon like "custom:foo", reject scheme
    if (/^[a-z0-9+.-]+:/i.test(normalised)) {
      throw new ValidationError("Unsupported URL scheme.");
    }
    normalised = `https://${normalised}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalised);
  } catch {
    throw new ValidationError("Please enter a valid URL.");
  }

  // 4. Protocol check - allow only http: and https:
  if (!["http:", "https:"].includes(parsed.protocol.toLowerCase())) {
    throw new ValidationError("Unsupported URL scheme.");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!hostname || hostname === "https" || hostname === "http") {
    throw new ValidationError("Please enter a valid URL.");
  }

  // 5. Reject loopback, localhost, and local private domains
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local")
  ) {
    throw new ValidationError("Private or loopback URLs are not allowed.");
  }

  // 6. Must have a valid hostname structure
  if (!hostname.includes(".") || hostname.length < 4 || hostname.startsWith(".") || hostname.endsWith(".")) {
    throw new ValidationError("Please enter a valid URL.");
  }

  return normalised;
}

/** Verify that the domain actually exists and resolves in public DNS */
export async function verifyDomainExists(urlStr: string): Promise<string | null> {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();

    // Reserved / invalid TLD check (e.g. .invalid, .test, .example, .localhost)
    const invalidTlds = [".invalid", ".test", ".example", ".localhost", ".local"];
    if (invalidTlds.some((tld) => hostname.endsWith(tld))) {
      return "Domain could not be resolved.";
    }

    // Server-side DNS resolution lookup
    try {
      await dns.promises.lookup(hostname);
      return null; // Domain exists and resolved successfully
    } catch (dnsError: unknown) {
      const errCode = (dnsError as { code?: string })?.code;
      console.error(`[DNS Resolution Failed for ${hostname}]:`, errCode || dnsError);
      
      if (errCode === "ENOTFOUND" || errCode === "NXDOMAIN" || errCode === "SERVFAIL") {
        return "This domain does not exist.";
      }
      return "Domain could not be resolved.";
    }
  } catch (err) {
    console.error(`[Domain Verification Error for ${urlStr}]:`, err);
    return "Domain could not be resolved.";
  }
}

/** Sanitises and validates a custom alias. */
export function sanitizeAlias(raw: string): string {
  const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (cleaned.length < 3) {
    throw new ValidationError("Custom alias must be at least 3 characters.");
  }
  if (cleaned.length > 40) {
    throw new ValidationError("Custom alias must be 40 characters or fewer.");
  }
  if (RESERVED_ALIASES.has(cleaned)) {
    throw new ValidationError(`"${cleaned}" is a reserved alias and cannot be used.`);
  }
  return cleaned;
}

/** Generates a cryptographically random short code. */
export function generateShortCode(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/** Sanitises a plain text string to prevent XSS / injection. */
export function sanitizeText(raw: unknown, maxLength = 255): string {
  if (typeof raw !== "string") return "";
  return raw
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, "");
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
