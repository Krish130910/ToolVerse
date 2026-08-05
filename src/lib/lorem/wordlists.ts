import { LoremTheme } from "./types";

export const CLASSIC_WORDS: string[] = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis",
  "unde", "omnis", "iste", "natus", "error", "voluptatem", "accusantium",
  "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa",
  "quae", "ab", "illo", "inventore", "veritatis", "architecto", "beatae", "vitae",
  "dicta", "explicabo", "nemo", "ipsam", "voluptas", "aspernatur", "odit", "aut",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi", "nesciunt"
];

export const DEVELOPER_WORDS: string[] = [
  "react", "typescript", "nextjs", "javascript", "graphql", "node", "express",
  "api", "endpoint", "websocket", "docker", "kubernetes", "microservices",
  "serverless", "database", "postgres", "prisma", "redis", "cache", "async",
  "await", "promise", "component", "state", "props", "hook", "refactor",
  "git", "commit", "branch", "merge", "deploy", "ci-cd", "pipeline", "vite",
  "webpack", "tailwind", "css", "flexbox", "grid", "json", "rest", "payload",
  "authentication", "jwt", "oauth", "security", "encryption", "buffer", "stream",
  "performance", "latency", "benchmark", "closure", "prototype", "module",
  "bundle", "tree-shaking", "hydration", "ssr", "ssg", "csr", "middleware",
  "router", "schema", "query", "mutation", "subscription", "frontend", "backend",
  "fullstack", "devops", "cloud", "aws", "vercel", "github", "lint", "prettier"
];

export const STARTUP_WORDS: string[] = [
  "synergy", "pivot", "disruption", "freemium", "monetize", "runway", "mvp",
  "pitch-deck", "unicorn", "series-a", "venture", "capital", "bootstrap",
  "saas", "b2b", "b2c", "traction", "retention", "churn", "growth-hacking",
  "funnel", "conversion", "onboarding", "scalability", "leverage", "ecosystem",
  "stakeholder", "bandwidth", "roi", "kpi", "okr", "metrics", "analytics",
  "value-prop", "product-market-fit", "early-adopter", "roadmap", "agile",
  "scrum", "sprint", "velocity", "deliverable", "benchmark", "paradigm-shift",
  "thought-leader", "game-changer", "low-hanging-fruit", "omnichannel", "vertical",
  "customer-acquisition", "cac", "ltv", "margin", "valuation", "exit-strategy"
];

export const AI_WORDS: string[] = [
  "neural-network", "transformer", "attention-mechanism", "latent-space",
  "fine-tuning", "prompt-engineering", "large-language-model", "embedding",
  "vector-database", "inference", "zero-shot", "few-shot", "hyperparameter",
  "backpropagation", "loss-function", "gradient-descent", "overfitting",
  "tokenization", "context-window", "diffusion", "rag", "retrieval-augmented",
  "deep-learning", "agentic-ai", "hallucination", "alignment", "reinforcement",
  "rlhf", "semantic-search", "classifier", "encoder", "decoder", "multimodal",
  "generative-ai", "bias", "temperature", "top-p", "weights", "biases",
  "perceptron", "convolutional", "recurrent", "tensor", "gpu-cluster", "tpu"
];

export const ENGLISH_WORDS: string[] = [
  "mountain", "river", "forest", "whisper", "horizon", "sunlight", "journey",
  "harmony", "breeze", "adventure", "meadow", "starlight", "canvas", "echo",
  "twilight", "shadow", "reflection", "galaxy", "ocean", "solitude", "serenity",
  "clarity", "courage", "discovery", "melody", "rhythm", "freedom", "wanderlust",
  "tranquility", "wonder", "radiance", "compass", "voyage", "silence", "harvest",
  "autumn", "blossom", "shelter", "passage", "crest", "infinite", "tapestry"
];

export function getWordlistByTheme(theme: LoremTheme): string[] {
  switch (theme) {
    case "developer":
      return DEVELOPER_WORDS;
    case "startup":
      return STARTUP_WORDS;
    case "ai":
      return AI_WORDS;
    case "english":
      return ENGLISH_WORDS;
    case "classic":
    default:
      return CLASSIC_WORDS;
  }
}

export function getThemePrefix(theme: LoremTheme): string {
  switch (theme) {
    case "developer":
      return "React typescript nextjs graphql api node websocket docker";
    case "startup":
      return "Synergy pivot disruption freemium saas runway mvp pitch deck";
    case "ai":
      return "Neural network transformer latent space fine-tuning prompt engineering";
    case "english":
      return "Mountain river forest whisper horizon sunlight journey harmony";
    case "classic":
    default:
      return "Lorem ipsum dolor sit amet consectetur adipiscing elit";
  }
}
