import crypto from "crypto";

const APPROVAL_SECRET = process.env.ADMIN_APPROVAL_SECRET || "toolverse-opencode-bot-default-secret";

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
 * Generates the full 1-click approval URL.
 */
export function getApprovalUrl(requestId: string, toolName: string): string {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
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
  const githubToken = process.env.GITHUB_TOKEN || process.env.GH_PAT;
  const githubRepo = process.env.GITHUB_REPO; // e.g. "owner/repo" or "Krish130910/ToolVerse"

  if (!githubToken || !githubRepo) {
    return {
      success: false,
      error: "GitHub integration unconfigured. (Set GITHUB_TOKEN & GITHUB_REPO in environment).",
    };
  }

  const [owner, repo] = githubRepo.split("/");
  if (!owner || !repo) {
    return { success: false, error: `Invalid GITHUB_REPO format '${githubRepo}'. Expected 'owner/repo'.` };
  }

  try {
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
      return { success: true };
    }

    const errorJson = await response.json().catch(() => ({}));
    return {
      success: false,
      error: errorJson.message || `GitHub API returned status ${response.status}`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to communicate with GitHub API." };
  }
}
