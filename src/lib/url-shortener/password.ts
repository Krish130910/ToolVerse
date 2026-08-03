// Password hashing using Node.js built-in crypto (pbkdf2) — no extra dependencies needed

import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

/**
 * Hashes a plain-text password with a random salt.
 * Returns a string in format: `salt:hash` (both hex encoded).
 */
export function hashPassword(plaintext: string): string {
  const salt = randomBytes(32).toString("hex");
  const hash = pbkdf2Sync(plaintext, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against a stored hash string.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyPassword(plaintext: string, stored: string): boolean {
  try {
    const [salt, storedHash] = stored.split(":");
    if (!salt || !storedHash) return false;
    const incoming = pbkdf2Sync(plaintext, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
    const a = Buffer.from(incoming, "hex");
    const b = Buffer.from(storedHash, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
