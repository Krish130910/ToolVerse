// Parse User-Agent, referrer, and IP headers for analytics tracking

export interface VisitAnalytics {
  country: string | null;
  browser: string | null;
  device: string | null;
  os: string | null;
  referrer: string | null;
}

/** Extract country from Cloudflare/Vercel/Neon headers */
export function getCountry(headers: Headers): string | null {
  return (
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    headers.get("x-country") ||
    null
  );
}

/** Parse browser from User-Agent string */
export function parseBrowser(ua: string): string {
  if (!ua) return "Unknown";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/MSIE|Trident/i.test(ua)) return "IE";
  return "Other";
}

/** Parse operating system from User-Agent string */
export function parseOS(ua: string): string {
  if (!ua) return "Unknown";
  if (/Windows NT/i.test(ua)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return "Linux";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/CrOS/i.test(ua)) return "ChromeOS";
  return "Other";
}

/** Parse device type from User-Agent string */
export function parseDevice(ua: string): string {
  if (!ua) return "Unknown";
  if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    if (/iPad/i.test(ua)) return "Tablet";
    return "Mobile";
  }
  return "Desktop";
}

/** Clean referrer URL down to hostname */
export function parseReferrer(referrer: string | null): string | null {
  if (!referrer || referrer.trim() === "") return null;
  try {
    const url = new URL(referrer);
    return url.hostname || null;
  } catch {
    return null;
  }
}

/** Aggregate all visit analytics from a request */
export function extractVisitAnalytics(headers: Headers): VisitAnalytics {
  const ua = headers.get("user-agent") || "";
  const referrer = headers.get("referer") || headers.get("referrer") || null;
  return {
    country: getCountry(headers),
    browser: parseBrowser(ua),
    device: parseDevice(ua),
    os: parseOS(ua),
    referrer: parseReferrer(referrer),
  };
}
