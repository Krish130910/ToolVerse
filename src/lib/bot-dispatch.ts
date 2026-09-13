import crypto from "crypto";

const APPROVAL_SECRET = process.env.ADMIN_APPROVAL_SECRET || "toolverse-opencode-bot-default-secret";

/**
 * Dynamically resolves the authoritative application base URL across Vercel, custom domains, and local dev.
 */
export function resolveAppBaseUrl(request?: Request): string {
  // 1. If incoming request headers are provided, detect dynamically (Vercel / Production host)
  if (request) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost || request.headers.get("host");
    if (host && !host.includes("localhost")) {
      const proto = request.headers.get("x-forwarded-proto") || "https";
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  // 2. Explicitly configured NEXT_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  // 3. Vercel System Environment Variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  // 4. Request fallback
  if (request) {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    if (host) {
      const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
      return `${proto}://${host}`.replace(/\/$/, "");
    }
  }

  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

/**
 * Generates an HMAC-SHA256 signature for 1-click email approvals.
 */
export function generateApprovalToken(requestId: string, toolName: string): string {
  const data = `${requestId}:${toolName.trim().toLowerCase()}`;
  return crypto.createHmac("sha256", APPROVAL_SECRET).update(data).digest("hex");
}

/**
 * Validates the HMAC signature of an incoming approval request.
 */
export function verifyApprovalToken(requestId: string, toolName: string, token: string): boolean {
  if (!requestId || !toolName || !token) return false;
  const expected = generateApprovalToken(requestId, toolName);
  try {
    return crypto.timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

/**
 * Generates the full 1-click approval URL with dynamic base URL support.
 */
export function getApprovalUrl(requestId: string, toolName: string, customBaseUrl?: string): string {
  const appUrl = (customBaseUrl || resolveAppBaseUrl()).replace(/\/$/, "");
  const token = generateApprovalToken(requestId, toolName);
  const encodedTool = encodeURIComponent(toolName.trim());
  return `${appUrl}/api/tool-approve?id=${encodeURIComponent(requestId)}&tool=${encodedTool}&token=${token}`;
}

/**
 * Dispatches a GitHub Action workflow event via repository_dispatch API.
 */
export async function dispatchGitHubEvent(
  eventType: "tool_request" | "tool_approved",
  clientPayload: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  const githubToken = (process.env.GITHUB_TOKEN || process.env.GH_PAT)?.trim();
  const githubRepo = process.env.GITHUB_REPO?.trim(); // e.g. "owner/repo" or "Krish130910/ToolVerse"

  if (!githubToken || !githubRepo) {
    const missing = [];
    if (!githubToken) missing.push("GITHUB_TOKEN");
    if (!githubRepo) missing.push("GITHUB_REPO");
    return {
      success: false,
      error: `GitHub integration unconfigured. Missing: ${missing.join(", ")} in environment variables.`,
    };
  }

  const [owner, repo] = githubRepo.split("/");
  if (!owner || !repo) {
    return { success: false, error: `Invalid GITHUB_REPO format '${githubRepo}'. Expected 'owner/repo'.` };
  }

  try {
    console.log(`[GitHub Bot]: Dispatching event '${eventType}' to ${owner}/${repo}...`);
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
        "User-Agent": "ToolVerse-OpenCode-Bot",
      },
      body: JSON.stringify({
        event_type: eventType,
        client_payload: clientPayload,
      }),
    });

    if (response.status === 204 || response.ok) {
      console.log(`[GitHub Bot]: Successfully triggered repository_dispatch for '${eventType}' (Status: ${response.status})`);
      return { success: true };
    }

    const errorJson = await response.json().catch(() => ({}));
    const errorMsg = errorJson.message || `GitHub API returned status ${response.status}`;
    console.error(`[GitHub Bot Error]: Dispatch failed: ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
    };
  } catch (err: any) {
    console.error(`[GitHub Bot Error]: Network failure: ${err.message}`);
    return { success: false, error: err.message || "Failed to communicate with GitHub API." };
  }
}
