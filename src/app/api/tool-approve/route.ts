import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApprovalToken, dispatchGitHubEvent } from "@/lib/bot-dispatch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  const toolName = searchParams.get("tool") || "";
  const token = searchParams.get("token") || "";

  if (!id || !toolName || !token) {
    return new NextResponse(
      renderApprovalHtml({
        success: false,
        title: "Invalid Approval Link",
        message: "Missing required parameters (id, tool, or token). Please check the link in your email.",
        toolName,
      }),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // 1. Verify HMAC Token
  const isValid = verifyApprovalToken(id, toolName, token);
  if (!isValid) {
    return new NextResponse(
      renderApprovalHtml({
        success: false,
        title: "Unauthorized / Expired Link",
        message: "Security signature verification failed. Ensure you are using the authentic link sent to your admin email.",
        toolName,
      }),
      { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // 2. Update Database Record Status
  try {
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("npg_placeholder")) {
      await prisma.toolRequest.updateMany({
        where: { id },
        data: { status: "Approved" },
      });
    }
  } catch (dbError) {
    console.warn("[Prisma DB Warning]: Failed to update tool request status:", dbError);
  }

  // 3. Dispatch Event to GitHub Workflow (OpenCode Tool Builder)
  const dispatchResult = await dispatchGitHubEvent("tool_approved", {
    requestId: id,
    toolName,
    approvedAt: new Date().toISOString(),
    approver: process.env.ADMIN_EMAIL || "admin",
  });

  const isGitHubConnected = dispatchResult.success;

  return new NextResponse(
    renderApprovalHtml({
      success: true,
      title: "Tool Request Approved! 🚀",
      message: isGitHubConnected
        ? `OpenCode Bot has been triggered on GitHub. It is currently synthesizing the new tool component, adding it to the registry, validating TypeScript compilation, and creating a Pull Request on branch 'feat/tool-${slugify(toolName)}'.`
        : `Tool '${toolName}' status updated to Approved. Note: GitHub dispatch was not delivered (${dispatchResult.error || "Check GITHUB_TOKEN & GITHUB_REPO"}).`,
      toolName,
      isGitHubConnected,
    }),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, toolName, token } = body;

    if (!verifyApprovalToken(id, toolName, token)) {
      return NextResponse.json({ success: false, error: "Invalid approval token." }, { status: 403 });
    }

    const dispatchResult = await dispatchGitHubEvent("tool_approved", {
      requestId: id,
      toolName,
      approvedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, dispatchResult });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderApprovalHtml({
  success,
  title,
  message,
  toolName,
  isGitHubConnected,
}: {
  success: boolean;
  title: string;
  message: string;
  toolName: string;
  isGitHubConnected?: boolean;
}): string {
  const accentColor = success ? "#ea580c" : "#e11d48";
  const bgBadge = success ? "#fff7ed" : "#fff1f2";
  const textBadge = success ? "#c2410c" : "#be123c";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ToolVerse OpenCode Bot</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #FAF8F5;
      color: #18181b;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      box-sizing: border-box;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e4e4e7;
      border-radius: 20px;
      padding: 40px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      background-color: ${bgBadge};
      color: ${textBadge};
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin: 0 0 12px 0;
      color: #09090b;
    }
    .tool-box {
      background: #f4f4f5;
      border-radius: 12px;
      padding: 12px 16px;
      font-family: monospace;
      font-size: 13px;
      color: #27272a;
      margin: 18px 0;
      word-break: break-all;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #52525b;
      margin: 0 0 24px 0;
    }
    .btn {
      display: inline-block;
      background-color: #09090b;
      color: #ffffff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      padding: 12px 24px;
      border-radius: 12px;
      transition: all 0.15s ease;
    }
    .btn:hover {
      background-color: #27272a;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">OpenCode Agent Bot</span>
    <h1>${title}</h1>
    ${toolName ? `<div class="tool-box">Target Tool: <strong>${toolName}</strong></div>` : ""}
    <p>${message}</p>
    <a href="/" class="btn">Return to ToolVerse</a>
  </div>
</body>
</html>`;
}
