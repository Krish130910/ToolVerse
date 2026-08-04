import { JWTValidationResult, JWTSample, JWTStatus } from "./types";

/**
 * Robust Base64URL string decoding with UTF-8 support
 */
export function decodeBase64Url(str: string): string {
  try {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if missing
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    // Decode base64 to binary string
    const binaryStr = atob(base64);
    // Convert to UTF-8
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch (err) {
    throw new Error("Invalid Base64URL encoding");
  }
}

/**
 * Format Unix Timestamp to human-readable date & local string
 */
export function formatUnixTimestamp(timestamp: number): string {
  try {
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return "Invalid Date";
    return `${date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })} ${date.toLocaleTimeString("en-US")}`;
  } catch {
    return "Invalid Date";
  }
}

/**
 * Calculate time remaining from now until Unix timestamp
 */
export function calculateTimeRemaining(expTimestamp: number): { remaining: string; isExpired: boolean; isExpiringSoon: boolean } {
  const now = Date.now();
  const expMs = expTimestamp * 1000;
  const diffMs = expMs - now;

  if (diffMs <= 0) {
    const pastSec = Math.abs(Math.floor(diffMs / 1000));
    return {
      remaining: `Expired ${formatDuration(pastSec)} ago`,
      isExpired: true,
      isExpiringSoon: false,
    };
  }

  const sec = Math.floor(diffMs / 1000);
  const isExpiringSoon = sec < 900; // < 15 minutes
  return {
    remaining: `Expires in ${formatDuration(sec)}`,
    isExpired: false,
    isExpiringSoon,
  };
}

/**
 * Calculate token age since iat timestamp
 */
export function calculateTokenAge(iatTimestamp: number): string {
  const now = Date.now();
  const iatMs = iatTimestamp * 1000;
  const diffSec = Math.floor((now - iatMs) / 1000);

  if (diffSec < 0) {
    return `Issued in future (${formatDuration(Math.abs(diffSec))})`;
  }
  return `${formatDuration(diffSec)} ago`;
}

function formatDuration(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (parts.length === 0 || seconds > 0) parts.push(`${seconds}s`);

  return parts.slice(0, 2).join(" ");
}

/**
 * Comprehensive JWT Parser & Validator
 */
export function parseJWT(rawJwt: string): JWTValidationResult {
  const trimmed = rawJwt.trim();
  const parts = trimmed.split(".");

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!trimmed) {
    return {
      status: "malformed",
      statusLabel: "Empty Token",
      header: null,
      payload: null,
      rawHeader: "",
      rawPayload: "",
      signature: "",
      parts: [],
      errors: ["Please enter or paste a JWT string."],
      warnings: [],
      claims: { isExpired: false, isExpiringSoon: false },
    };
  }

  if (parts.length !== 3) {
    return {
      status: "malformed",
      statusLabel: "Invalid Structure",
      header: null,
      payload: null,
      rawHeader: parts[0] || "",
      rawPayload: parts[1] || "",
      signature: parts[2] || "",
      parts,
      errors: [
        `JWT must consist of exactly 3 dot-separated parts (Header.Payload.Signature). Found ${parts.length} part(s).`,
      ],
      warnings: [],
      claims: { isExpired: false, isExpiringSoon: false },
    };
  }

  let headerObj: Record<string, any> | null = null;
  let payloadObj: Record<string, any> | null = null;
  let rawHeader = "";
  let rawPayload = "";

  // 1. Decode Header
  try {
    rawHeader = decodeBase64Url(parts[0]);
    headerObj = JSON.parse(rawHeader);
  } catch (err: any) {
    errors.push(`Header parsing failed: ${err?.message || "Invalid JSON or Base64URL"}`);
  }

  // 2. Decode Payload
  try {
    rawPayload = decodeBase64Url(parts[1]);
    payloadObj = JSON.parse(rawPayload);
  } catch (err: any) {
    errors.push(`Payload parsing failed: ${err?.message || "Invalid JSON or Base64URL"}`);
  }

  if (errors.length > 0) {
    return {
      status: "malformed",
      statusLabel: "Malformed Token",
      header: headerObj,
      payload: payloadObj,
      rawHeader,
      rawPayload,
      signature: parts[2],
      parts,
      errors,
      warnings: [],
      claims: { isExpired: false, isExpiringSoon: false },
    };
  }

  // 3. Claims Analysis
  const alg = headerObj?.alg;
  const typ = headerObj?.typ;
  const sub = payloadObj?.sub;
  const iss = payloadObj?.iss;
  const aud = payloadObj?.aud;
  const iat = typeof payloadObj?.iat === "number" ? payloadObj.iat : undefined;
  const nbf = typeof payloadObj?.nbf === "number" ? payloadObj.nbf : undefined;
  const exp = typeof payloadObj?.exp === "number" ? payloadObj.exp : undefined;

  let isExpired = false;
  let isExpiringSoon = false;
  let timeRemaining: string | undefined;
  let tokenAge: string | undefined;

  if (exp !== undefined) {
    const timeInfo = calculateTimeRemaining(exp);
    isExpired = timeInfo.isExpired;
    isExpiringSoon = timeInfo.isExpiringSoon;
    timeRemaining = timeInfo.remaining;
  }

  if (iat !== undefined) {
    tokenAge = calculateTokenAge(iat);
  }

  // Check warnings
  if (alg === "none") {
    warnings.push("Algorithm 'none' is insecure and unauthenticated.");
  }
  if (!sub) {
    warnings.push("Missing 'sub' (subject) claim.");
  }
  if (!exp) {
    warnings.push("Missing 'exp' (expiration time) claim — token never expires.");
  }
  if (isExpiringSoon && !isExpired) {
    warnings.push("Token is expiring soon (less than 15 minutes remaining).");
  }
  if (iat && exp && iat > exp) {
    errors.push("Invalid timestamp sequence: 'iat' (issued at) is greater than 'exp' (expiration).");
  }
  if (nbf && Date.now() < nbf * 1000) {
    warnings.push("Token is not active yet ('nbf' is in the future).");
  }

  let status: JWTStatus = "valid";
  let statusLabel = "Active & Valid";

  if (errors.length > 0) {
    status = "malformed";
    statusLabel = "Malformed Claims";
  } else if (isExpired) {
    status = "expired";
    statusLabel = "Token Expired";
  } else if (warnings.length > 0) {
    status = "warning";
    statusLabel = isExpiringSoon ? "Expiring Soon" : "Valid with Warnings";
  }

  return {
    status,
    statusLabel,
    header: headerObj,
    payload: payloadObj,
    rawHeader,
    rawPayload,
    signature: parts[2],
    parts,
    errors,
    warnings,
    claims: {
      alg,
      typ,
      sub,
      iss,
      aud,
      iat,
      iatFormatted: iat ? formatUnixTimestamp(iat) : undefined,
      nbf,
      nbfFormatted: nbf ? formatUnixTimestamp(nbf) : undefined,
      exp,
      expFormatted: exp ? formatUnixTimestamp(exp) : undefined,
      isExpired,
      isExpiringSoon,
      timeRemaining,
      tokenAge,
    },
  };
}

/**
 * Sample JWTs for testing
 */
export const JWT_SAMPLES: JWTSample[] = [
  {
    id: "standard-auth",
    name: "Standard HS256 Auth Token",
    description: "Valid authentication token with user ID, email, role, and expiration.",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOTE4MjczNjQiLCJuYW1lIjoiS3Jpc2ggU2F2YWxpeWEiLCJlbWFpbCI6ImtyaXNoQGV4YW1wbGUuY29tIiwicm9sZSI6ImRldmVsb3BlciIsImlzcyI6ImF1dGgudG9vbHZlcnNlLmFwcCIsImF1ZCI6ImFwaS50b29sdmVyc2UuYXBwIiwiaWF0IjoxNzA0MDY3MjAwLCJleHAiOjE5OTE2NjQwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  },
  {
    id: "expired-token",
    name: "Expired Token",
    description: "Token whose expiration timestamp (exp) has passed.",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMDAxMiIsIm5hbWUiOiJUZXN0IFVzZXIiLCJpc3MiOiJhdXRoLnRvb2x2ZXJzZS5hcHAiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTUwMn0.48y2Rz831hM-rWJ06WlJtG6P1sXp72H6u54J9b4b4b4",
  },
  {
    id: "rs256-asymmetric",
    name: "RS256 Asymmetric Key Token",
    description: "RSA-SHA256 token with key ID (kid) in header and OAuth scopes in payload.",
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtleS0yMDI2LTAxIn0.eyJzdWIiOiJhdXRoMHw5ODc2NTQzMjEiLCJpc3MiOiJodHRwczovL2F1dGgudG9vbHZlcnNlLmlvLyIsImF1ZCI6Imh0dHBzOi8vYXBpLnRvb2x2ZXJzZS5pbyIsInNjb3BlIjoicmVhZDp1dGlscyB3cml0ZTp1dGlscyIsImlhdCI6MTcwNDA2NzIwMCwiZXhwIjoxOTkxNjY0MDAwLCJqdGkiOiJqdGktYWJjLTEyMyJ9.sig_sample_rs256",
  },
];
