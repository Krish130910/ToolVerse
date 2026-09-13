# 🤖 ToolVerse OpenCode GitHub Workflow Bot Setup Guide

Welcome to the automated **OpenCode ACP Tool Request Bot** for ToolVerse!

This system turns user tool requests into fully functioning, type-safe pull requests with human-in-the-loop email or issue approval.

---

## ⚡ How It Works (End-to-End Workflow)

```
[ User requests a new tool on ToolVerse ]
                   │
                   ▼
       (/api/request-tool)
       Saves to Database & Dispatches GitHub Triage Event
                   │
                   ▼
 1. 🤖 OpenCode Triage Bot Runs (.github/workflows/opencode-tool-triage.yml)
    - Checks existing tools in registry for duplicates
    - Evaluates technical feasibility (1-10)
    - Recommends category & component architecture
                   │
                   ▼
 2. 📧 Admin Receives Email with Analysis & 1-Click Approve Link
    - Also supports replying "/approve" on GitHub Issues
                   │
                   ▼
 3. 🚀 Admin Clicks Approve -> (/api/tool-approve)
    - Verifies cryptographic HMAC token
    - Dispatches "tool_approved" to GitHub
                   │
                   ▼
 4. 🔨 OpenCode Builder Bot Runs (.github/workflows/opencode-tool-builder.yml)
    - Synthesizes React TypeScript component in `src/components/tools/impl/`
    - Registers component in `src/tools/registry.tsx`
    - Registers metadata in `src/lib/data.ts`
    - Runs `npx tsc --noEmit` & `npm run build`
                   │
                   ▼
 5. 🔀 Automated Pull Request Opened on GitHub
    - Branch: `feat/tool-*`
    - Ready for final human review & 1-click merge!
```

---

## 🛠️ Step-by-Step Setup Instructions for Repository Owner

### Step 1: Add GitHub Repository Secrets
Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

Add the following secrets:

| Secret Name | Description | Example / Required |
|---|---|---|
| `OPENROUTER_API_KEY` | Your OpenRouter API key for AI triage and synthesis | `sk-or-v1-76cfe9bac...` |
| `OPENROUTER_MODEL` | Default AI model (Free tier router recommended) | `openrouter/free` |
| `GH_PAT` | GitHub Personal Access Token (with `repo` & `workflow` scopes) to allow actions to open PRs | `ghp_...` |
| `ADMIN_APPROVAL_SECRET` | Secret key used to sign 1-click email approval links | `any-random-long-secret-key` |
| `ADMIN_EMAIL` | The admin email address where approval links will be sent | `your-email@gmail.com` |

> 💡 **How to create a `GH_PAT`**:
> 1. Go to GitHub -> **Settings** -> **Developer Settings** -> **Personal Access Tokens (Tokens classic)**.
> 2. Generate a token with scopes: `repo`, `workflow`, `write:packages`.
> 3. Paste into GitHub Secrets as `GH_PAT`.

---

### Step 2: Configure Environment Variables in `.env.local`

On your hosting server (Vercel, Render, or local `.env.local`), configure:

```env
# ToolVerse AI Provider
AI_PROVIDER="openrouter"
OPENROUTER_API_KEY="sk-or-v1-..."
OPENROUTER_MODEL="openrouter/free"

# GitHub OpenCode Bot Dispatch
GITHUB_TOKEN="ghp_..."
GITHUB_REPO="your-github-username/ToolVerse"
ADMIN_APPROVAL_SECRET="your-secure-secret-phrase"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Email Notifications (Gmail SMTP)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-16-char-app-password"
ADMIN_EMAIL="your-email@gmail.com"
```

---

### Step 3: Enable GitHub Actions Workflow Permissions

1. Go to your GitHub Repository -> **Settings** -> **Actions** -> **General**.
2. Scroll to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Check the box **Allow GitHub Actions to create and approve pull requests**.
5. Click **Save**.

---

## 🧪 How to Test the Bot

### Method A: Test via Tool Request UI
1. Start your local dev server: `npm run dev`.
2. Go to `http://localhost:3000` and click **"Request a Tool"** in the footer or banner.
3. Submit a test tool request (e.g. *"JWT Payload Formatter"*).
4. Check your admin email for the notification with the 1-Click Approve Link.
5. Click the link: OpenCode Bot will trigger in GitHub Actions and open a Pull Request!

### Method B: Test Manually via GitHub Actions
1. Go to your GitHub repo -> **Actions** tab.
2. Select **"OpenCode Tool Triage & Feasibility Bot"** -> Click **Run workflow**.
3. Enter a tool name and description -> Click **Run**.
4. Check the step logs to see OpenCode evaluate the tool and generate the report!

---

## 📂 Generalized Tools Directory Structure

ToolVerse has been generalized into a modular architecture so OpenCode or human contributors can easily add new tools without merge conflicts:

```
src/
├── tools/
│   ├── types.ts          # Standard Tool interfaces
│   ├── registry.tsx      # Central dynamic tool registry
│   ├── template.tsx      # Standardized UI component template
│   └── README.md         # OpenCode Bot & developer instructions
├── components/tools/
│   ├── impl/             # Individual tool implementations (e.g. json-formatter.tsx)
│   └── live-tools-suite.tsx # Dynamic loader consuming registry.tsx
└── lib/
    ├── bot-dispatch.ts   # GitHub repository_dispatch & HMAC token helper
    └── data.ts           # Directory metadata list
```

---

## 🔒 Security Best Practices
- **HMAC Signatures**: 1-Click email approval links use HMAC-SHA256 signatures derived from `ADMIN_APPROVAL_SECRET`. Unauthorized users cannot forge approval requests.
- **Human-in-the-Loop**: The bot never commits directly to `main`. It always opens a **Pull Request** (`feat/tool-*`) with full type checks (`npx tsc --noEmit`) and build verification (`npm run build`) for you to review and merge safely.
