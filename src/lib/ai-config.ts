/**
 * Central Authoritative Configuration Registry for AI Developer Tools in ToolVerse
 * Canonical Tool Slugs:
 * 1. ai-commit-message-generator
 * 2. ai-code-converter
 * 3. ai-readme-generator
 * 4. ai-api-docs-generator
 * 5. ai-email-generator
 * 6. ai-flowchart-generator
 */

export interface AIToolOptionSchema {
  id: string;
  label: string;
  type: "select" | "text" | "toggle";
  defaultValue: string;
  options?: Array<{ label: string; value: string }>;
}

export interface AIToolConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  badge: string;
  iconName: string;
  gradient: string;
  tags: string[];
  systemPrompt: string;
  defaultPrompt: string;
  outputFormat: "text" | "markdown" | "code" | "json" | "graph";
  optionsSchema?: AIToolOptionSchema[];
}

export const AI_TOOLS_REGISTRY: Record<string, AIToolConfig> = {
  "ai-commit-message-generator": {
    id: "tool-27",
    name: "AI Commit Message Generator",
    slug: "ai-commit-message-generator",
    description: "Generate clean, conventional Git commit messages (feat, fix, docs, refactor) from code descriptions or git diffs.",
    category: "AI Developer Tools",
    badge: "AI Tool",
    iconName: "Binary",
    gradient: "from-orange-500 to-amber-600",
    tags: ["AI", "Git", "Commits", "Conventional Commits", "DevOps"],
    systemPrompt: `You are an expert Git release engineer and commit message specialist.
Your task is to generate clean, precise Conventional Commit messages (e.g., feat, fix, docs, refactor, perf, style, test, chore) based on the user's code changes, diffs, or descriptions.
Always provide a concise subject line followed by clean, bulleted details explaining why and what changed.
If a commit type or scope is requested in options, strictly follow it.`,
    defaultPrompt: "Added Resend email notification fallback and rate limiting middleware",
    outputFormat: "text",
    optionsSchema: [
      {
        id: "commitType",
        label: "Commit Type",
        type: "select",
        defaultValue: "all",
        options: [
          { label: "Auto Detect Type", value: "all" },
          { label: "feat: New Feature", value: "feat" },
          { label: "fix: Bug Fix", value: "fix" },
          { label: "docs: Documentation", value: "docs" },
          { label: "refactor: Refactoring", value: "refactor" },
          { label: "perf: Performance", value: "perf" },
          { label: "style: Code Formatting", value: "style" },
          { label: "test: Unit Tests", value: "test" },
          { label: "chore: Maintenance", value: "chore" },
        ],
      },
      {
        id: "scope",
        label: "Scope (Optional)",
        type: "text",
        defaultValue: "",
      },
    ],
  },

  "ai-code-converter": {
    id: "tool-30",
    name: "AI Code Converter",
    slug: "ai-code-converter",
    description: "Translate code between Python, JavaScript, TypeScript, Go, Rust, C++, Java, and SQL preserving exact logic.",
    category: "AI Developer Tools",
    badge: "AI Tool",
    iconName: "Binary",
    gradient: "from-blue-500 to-cyan-600",
    tags: ["AI", "Code Converter", "Translation", "Refactor", "Polyglot"],
    systemPrompt: `You are a Senior Polyglot Software Architect.
Your task is to translate source code from the source language to the target language with 100% logic preservation, idiomatic syntax, modern best practices, and appropriate typing.
Output ONLY the clean converted code directly or in a fenced code block without unnecessary conversational preamble or filler. If brief notes are necessary, place them as concise code comments or at the very end.`,
    defaultPrompt: `function formatUser(user) {
  return {
    id: user.id,
    fullName: user.firstName + " " + user.lastName,
    isAdmin: user.role === "admin"
  };
}`,
    outputFormat: "code",
    optionsSchema: [
      {
        id: "from",
        label: "Source Language",
        type: "select",
        defaultValue: "JavaScript",
        options: [
          { label: "JavaScript", value: "JavaScript" },
          { label: "TypeScript", value: "TypeScript" },
          { label: "Python", value: "Python" },
          { label: "Java", value: "Java" },
          { label: "C++", value: "C++" },
          { label: "Go", value: "Go" },
          { label: "Rust", value: "Rust" },
          { label: "SQL", value: "SQL" },
          { label: "HTML / JSX", value: "HTML" },
          { label: "JSON / YAML", value: "JSON" },
        ],
      },
      {
        id: "to",
        label: "Target Language",
        type: "select",
        defaultValue: "TypeScript",
        options: [
          { label: "TypeScript", value: "TypeScript" },
          { label: "JavaScript", value: "JavaScript" },
          { label: "Python", value: "Python" },
          { label: "Java", value: "Java" },
          { label: "C++", value: "C++" },
          { label: "Go", value: "Go" },
          { label: "Rust", value: "Rust" },
          { label: "SQL", value: "SQL" },
          { label: "JSX", value: "JSX" },
          { label: "YAML", value: "YAML" },
        ],
      },
    ],
  },

  "ai-readme-generator": {
    id: "tool-31",
    name: "AI README Generator",
    slug: "ai-readme-generator",
    description: "Generate comprehensive, professional GitHub README.md files with installation guides, badges, tech stacks, and architecture.",
    category: "AI Developer Tools",
    badge: "AI Tool",
    iconName: "Layers",
    gradient: "from-emerald-500 to-teal-600",
    tags: ["AI", "README", "Documentation", "GitHub", "Open Source"],
    systemPrompt: `You are an open-source maintainer and documentation architect.
Your task is to generate complete, high-quality, professional GitHub README.md markdown for a project.
Include:
- Project Title & Tagline
- Feature highlights with bullet points
- Badges (Tech stack, License, Build status)
- Tech Stack list
- Architecture / Directory Structure overview
- Getting Started (Prerequisites, Clone, Install, Run, Environment Variables)
- Scripts / Commands table
- License & Contributing guidelines
Do not invent fictitious features outside the user's project context. Generate valid Markdown.`,
    defaultPrompt: "ToolVerse - Modern, privacy-first developer utility suite built with Next.js 15, React, TypeScript, Tailwind CSS, and Neon PostgreSQL database.",
    outputFormat: "markdown",
    optionsSchema: [
      {
        id: "style",
        label: "README Style",
        type: "select",
        defaultValue: "comprehensive",
        options: [
          { label: "Comprehensive / Production", value: "comprehensive" },
          { label: "Minimal / Clean", value: "minimal" },
          { label: "CLI / Utility Tool", value: "cli" },
        ],
      },
    ],
  },

  "ai-api-docs-generator": {
    id: "tool-32",
    name: "AI API Docs Generator",
    slug: "ai-api-docs-generator",
    description: "Generate OpenAPI / Swagger specifications and Markdown API documentation from endpoint code snippets.",
    category: "AI Developer Tools",
    badge: "AI Tool",
    iconName: "Braces",
    gradient: "from-orange-500 to-amber-600",
    tags: ["AI", "API", "Documentation", "OpenAPI", "Swagger", "REST"],
    systemPrompt: `You are an API technical writer and backend architect.
Your task is to inspect server route code (e.g. Express, Next.js App Router, FastAPI, Spring Boot, Go Chi/Gin) and generate structured, comprehensive API documentation.
Include:
- Endpoint path, HTTP Method, and purpose
- Headers & Authentication requirements
- Request Body schema with types, required fields, and JSON example
- Query Parameters / Path Parameters (if any)
- Success response (200/201) JSON schema & example
- Error responses (400, 401, 404, 500) JSON schema & examples
- cURL example request
Do not invent fictitious endpoints not present in the code.`,
    defaultPrompt: `app.post("/api/request-tool", async (req, res) => {
  const { toolName, email, message } = req.body;
  // saves to DB and returns JSON status 201
});`,
    outputFormat: "markdown",
    optionsSchema: [
      {
        id: "docFormat",
        label: "Format",
        type: "select",
        defaultValue: "markdown",
        options: [
          { label: "Markdown Documentation", value: "markdown" },
          { label: "OpenAPI 3.0 YAML/JSON", value: "openapi" },
        ],
      },
    ],
  },

  "ai-email-generator": {
    id: "tool-33",
    name: "AI Email Generator",
    slug: "ai-email-generator",
    description: "Draft polished, professional technical emails, client updates, follow-ups, and recruiter messages.",
    category: "AI Developer Tools",
    badge: "AI Tool",
    iconName: "Binary",
    gradient: "from-indigo-500 to-purple-600",
    tags: ["AI", "Email", "Communication", "Recruiter", "Client"],
    systemPrompt: `You are an executive technical communications specialist.
Your task is to craft clear, compelling, professional emails tailored to the requested context, template, and tone.
Always output a clear Subject line at the beginning:
Subject: <Subject Line Here>

Followed by the complete, ready-to-send email body with proper greeting, concise body paragraphs, clear call to action, and professional sign-off.`,
    defaultPrompt: "Applying for Senior Frontend Engineer role with 4 years Next.js experience, highlighting full-stack SaaS projects and performance optimization.",
    outputFormat: "text",
    optionsSchema: [
      {
        id: "template",
        label: "Email Template",
        type: "select",
        defaultValue: "Recruiter",
        options: [
          { label: "Recruiter / Job Application", value: "Recruiter" },
          { label: "Client Proposal / Update", value: "Client" },
          { label: "Follow-up / Reminder", value: "Follow-up" },
          { label: "Meeting Request", value: "Meeting Request" },
          { label: "Project Status Report", value: "Project Status" },
          { label: "Bug Report / Incident Notification", value: "Incident Report" },
        ],
      },
      {
        id: "tone",
        label: "Tone",
        type: "select",
        defaultValue: "Professional",
        options: [
          { label: "Professional", value: "Professional" },
          { label: "Friendly & Warm", value: "Friendly" },
          { label: "Persuasive & Confident", value: "Persuasive" },
          { label: "Direct & Concise", value: "Direct" },
          { label: "Urgent", value: "Urgent" },
        ],
      },
    ],
  },

  "ai-flowchart-generator": {
    id: "tool-3",
    name: "AI Flowchart Generator",
    slug: "ai-flowchart-generator",
    description: "Convert natural language step-by-step processes into structured interactive flowcharts with Mermaid.js syntax.",
    category: "AI Developer Tools",
    badge: "AI Tool",
    iconName: "Braces",
    gradient: "from-amber-500 to-orange-600",
    tags: ["AI", "Flowchart", "Diagram", "Mermaid", "Export", "Architecture"],
    systemPrompt: `You are an expert system architect and diagramming engine.
Your task is to parse the user's natural language process description, business logic, or algorithmic flow and convert it into a valid JSON graph representation for an interactive flowchart.

You MUST return ONLY valid JSON in the following exact schema:
{
  "title": "Title of the flowchart",
  "nodes": [
    {
      "id": "1",
      "label": "Short descriptive step text",
      "type": "start" | "process" | "decision" | "end",
      "next": ["2"]
    }
  ],
  "edges": [
    {
      "source": "1",
      "target": "2",
      "label": "Optional condition or action label"
    }
  ]
}

Rules for nodes:
- type must be one of: "start", "process", "decision", "end"
- First node should usually be type "start"
- Terminal nodes should be type "end"
- Decision nodes represent condition checks/branches and can point to multiple targets via "next"
- Keep node labels concise (under 8 words per node)
- Return STRICT JSON only, without surrounding explanation.`,
    defaultPrompt: "User visits login page, inputs email and password. Check if credentials are valid. If valid, redirect to dashboard. If invalid, display error and allow retry up to 3 times, otherwise lock account for 15 minutes.",
    outputFormat: "graph",
    optionsSchema: [],
  },
};

/**
 * Normalizes any legacy or shorthand tool identifier to canonical slug.
 */
export function normalizeToolSlug(rawIdentifier: string): string {
  if (!rawIdentifier) return "ai-commit-message-generator";
  const cleaned = rawIdentifier.trim().toLowerCase();

  const ALIAS_MAP: Record<string, string> = {
    "commit-message": "ai-commit-message-generator",
    "commit": "ai-commit-message-generator",
    "ai-commit-message": "ai-commit-message-generator",
    "ai-commit-message-generator": "ai-commit-message-generator",

    "code-converter": "ai-code-converter",
    "converter": "ai-code-converter",
    "ai-code-converter": "ai-code-converter",

    "readme-generator": "ai-readme-generator",
    "readme": "ai-readme-generator",
    "ai-readme-generator": "ai-readme-generator",

    "api-docs-generator": "ai-api-docs-generator",
    "api-docs": "ai-api-docs-generator",
    "ai-api-docs-generator": "ai-api-docs-generator",

    "email-generator": "ai-email-generator",
    "email": "ai-email-generator",
    "ai-email-generator": "ai-email-generator",

    "flowchart-generator": "ai-flowchart-generator",
    "flowchart": "ai-flowchart-generator",
    "ai-flowchart-generator": "ai-flowchart-generator",
  };

  return ALIAS_MAP[cleaned] || cleaned;
}

