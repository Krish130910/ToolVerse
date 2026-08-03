// Rate limiter — sliding window in-memory (per IP, server-side)
// 10 requests per 5 minutes per IP

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const LIMIT = 10;

export function checkUrlShortenerRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= LIMIT) return false;
  record.count += 1;
  return true;
}
