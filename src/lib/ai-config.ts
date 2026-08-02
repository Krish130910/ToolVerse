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
  "ai-regex-generator": {
    id: "tool-26",
    name: "AI Regex Generator",
    slug: "ai-regex-generator",
    description: "Convert plain English into regular expressions with part-by-part explanations and live test playground.",
    category: "AI Developer Tools",
    badge: "AI Tool",
    iconName: "Braces",
    gradient: "from-orange-500 to-amber-600",
    tags: ["AI", "Regex", "Pattern", "Validation", "Dev"],
    systemPrompt: "You are an expert Regular Expression architect. Generate a clean regex pattern matching the user requirement, explain each component step-by-step, and provide a test string playground.",
    defaultPrompt: "Extract valid email addresses with domain verification",
    optionsSchema: [
      {
        id: "testString",
        label: "Test String Playground (Optional)",
        type: "text",
        defaultValue: "Contact us at support@toolverse.dev or admin@domain.co.uk",
      },
    ],
  },
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
  "ai-code-explainer": {
    id: "tool-28",
    name: "AI Code Explainer",
    slug: "ai-code-explainer",
    description: "Paste any complex code snippet and get line-by-line breakdowns in Beginner or Advanced mode.",
    category: "AI Developer Tools",
    badge: "AI Tool",
    iconName: "Braces",
    gradient: "from-orange-500 to-amber-600",
    tags: ["AI", "Code Analysis", "Learning", "Syntax", "Explanation"],
    systemPrompt: "You are an expert computer science professor. Analyze the provided code snippet, provide a high-level summary, key concepts, and line-by-line breakdown tailored to the requested mode.",
    defaultPrompt: `const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};`,
    optionsSchema: [
      {
        id: "mode",
        label: "Explanation Depth",
        type: "select",
        defaultValue: "beginner",
        options: [
          { label: "Beginner Mode", value: "beginner" },
          { label: "Advanced Mode", value: "advanced" },
        ],
      },
    ],
  },
};
