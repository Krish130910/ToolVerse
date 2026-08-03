/**
 * Central Configuration Registry for AI Developer Tools
 * Adding a new AI tool requires creating 1 component and adding 1 entry here.
 */

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
  optionsSchema?: Array<{
    id: string;
    label: string;
    type: "select" | "text" | "toggle";
    defaultValue: string;
    options?: Array<{ label: string; value: string }>;
  }>;
}

export const AI_TOOLS_REGISTRY: Record<string, AIToolConfig> = {
  "ai-commit-message-generator": {
    id: "tool-27",
    name: "AI Commit Message Generator",
    slug: "ai-commit-message-generator",
    description: "Generate clean, conventional Git commit messages (feat, fix, docs, refactor) from code descriptions.",
    category: "AI Developer Tools",
    badge: "AI Tool",
    iconName: "Binary",
    gradient: "from-orange-500 to-amber-600",
    tags: ["AI", "Git", "Commits", "Conventional Commits", "DevOps"],
    systemPrompt: "You are a Git release engineer. Generate Conventional Commit messages (feat, fix, docs, refactor, perf, style, test, chore) with a concise summary line and bullet points.",
    defaultPrompt: "Added Resend email notification fallback and rate limiting middleware",
    optionsSchema: [
      {
        id: "type",
        label: "Commit Type",
        type: "select",
        defaultValue: "feat",
        options: [
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
        defaultValue: "api",
      },
    ],
  },
};
