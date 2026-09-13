# ToolVerse Modular Tools Framework

This directory defines the modular architecture that enables **OpenCode ACP**, autonomous AI agents, and developers to easily create, test, and register new tools in ToolVerse without merge conflicts or manual layout wiring.

---

## How to Add a New Tool (3 Steps)

### Step 1: Create Component
Create a new file in `src/components/tools/impl/<slug>.tsx` using the pattern in `src/tools/template.tsx`.

```tsx
"use client";
import React, { useState } from "react";
// Implement your tool logic and UI
export const MyNewTool: React.FC = () => { ... };
```

### Step 2: Register in Tools Registry
Add your tool to `src/tools/registry.ts`:

```typescript
import { MyNewTool } from "@/components/tools/impl/my-new-tool";

export const TOOLS_COMPONENT_REGISTRY = {
  // ...
  "my-new-tool": MyNewTool,
};
```

### Step 3: Add Metadata
Add the tool entry to `FEATURED_TOOLS` in `src/lib/data.ts`:

```typescript
{
  id: "tool-xx",
  name: "My New Tool",
  slug: "my-new-tool",
  category: "Developer Tools",
  description: "Short description of what the tool does.",
  iconName: "Code2",
  tags: ["Utility", "Formatting"],
  isLive: true,
  isNew: true,
}
```

---

## Architectural Guidelines for OpenCode Bot
1. **Client-Side First**: Whenever possible, compute transformations directly in browser JavaScript/Web APIs to maintain user privacy and zero server latency.
2. **AI-Assisted Tools**: If the tool requires LLM inference, use the standard AI endpoint `/api/ai` with payload `{ tool: slug, prompt, options }`.
3. **Responsive UI**: Follow the split 2-column layout (Inputs on the left, dark-mode preview terminal on the right).
4. **Zero Compilation Errors**: Always run `npx tsc --noEmit` to verify type integrity before committing.
