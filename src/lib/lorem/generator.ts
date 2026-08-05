import { LoremOptions, LoremStats, OutputFormat } from "./types";
import { getWordlistByTheme, getThemePrefix } from "./wordlists";

/**
 * Mulberry32 Seeded Pseudo-Random Number Generator (PRNG)
 * Ensures deterministic generation when seed is provided.
 */
function createPRNG(seed: number | null) {
  if (seed === null || seed === undefined || isNaN(seed)) {
    return () => Math.random();
  }
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates Lorem Ipsum placeholder content according to options
 */
export function generateLorem(options: LoremOptions): string {
  const rng = createPRNG(options.seed);
  const words = getWordlistByTheme(options.theme);
  const count = Math.max(1, Math.min(100, options.count));

  const getRandomWord = () => words[Math.floor(rng() * words.length)];

  const makeSentence = (minWords = 6, maxWords = 14): string => {
    const len = Math.floor(rng() * (maxWords - minWords + 1)) + minWords;
    const sentenceWords: string[] = [];
    for (let i = 0; i < len; i++) {
      sentenceWords.push(getRandomWord());
    }
    if (options.includeFormatting && sentenceWords.length >= 5 && rng() > 0.6) {
      const idx = Math.floor(rng() * (sentenceWords.length - 2));
      if (options.format === "html") {
        sentenceWords[idx] = `<strong>${sentenceWords[idx]}</strong>`;
      } else if (options.format === "markdown") {
        sentenceWords[idx] = `**${sentenceWords[idx]}**`;
      }
    }
    const str = sentenceWords.join(" ");
    return str.charAt(0).toUpperCase() + str.slice(1) + ".";
  };

  let rawResult = "";

  // 1. WORDS MODE
  if (options.mode === "words") {
    const wordList: string[] = [];
    if (options.startWithLorem) {
      const prefixWords = getThemePrefix(options.theme).toLowerCase().split(" ");
      wordList.push(...prefixWords.slice(0, count));
    }
    while (wordList.length < count) {
      wordList.push(getRandomWord());
    }
    const resultWords = wordList.slice(0, count);
    const text = resultWords.join(" ");
    rawResult = text.charAt(0).toUpperCase() + text.slice(1);
    if (options.format === "html") {
      rawResult = `<p>${rawResult}</p>`;
    }
  }

  // 2. SENTENCES MODE
  else if (options.mode === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      if (i === 0 && options.startWithLorem) {
        sentences.push(getThemePrefix(options.theme) + ".");
      } else {
        sentences.push(makeSentence());
      }
    }
    if (options.format === "html") {
      rawResult = `<p>${sentences.join(" ")}</p>`;
    } else {
      rawResult = sentences.join(" ");
    }
  }

  // 3. PARAGRAPHS MODE
  else if (options.mode === "paragraphs") {
    const paragraphs: string[] = [];
    for (let p = 0; p < count; p++) {
      const sentenceCount = Math.floor(rng() * 4) + 3; // 3-6 sentences per paragraph
      const sList: string[] = [];

      if (p === 0 && options.startWithLorem) {
        sList.push(getThemePrefix(options.theme) + ".");
      }

      while (sList.length < sentenceCount) {
        sList.push(makeSentence());
      }

      const pText = sList.join(" ");

      if (options.format === "html") {
        const heading = options.addHeadings ? `<h2>${makeSentence(3, 6).replace(".", "")}</h2>\n` : "";
        paragraphs.push(`${heading}<p>${pText}</p>`);
      } else if (options.format === "markdown") {
        const heading = options.addHeadings ? `## ${makeSentence(3, 6).replace(".", "")}\n\n` : "";
        paragraphs.push(`${heading}${pText}`);
      } else {
        const heading = options.addHeadings ? `${makeSentence(3, 6).replace(".", "").toUpperCase()}\n` : "";
        paragraphs.push(`${heading}${pText}`);
      }
    }

    rawResult = paragraphs.join(options.format === "html" ? "\n\n" : "\n\n");
  }

  // 4. LIST MODES (UNORDERED / ORDERED)
  else if (options.mode === "list_unordered" || options.mode === "list_ordered") {
    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      const len = Math.floor(rng() * 6) + 4;
      const itemWords: string[] = [];
      for (let w = 0; w < len; w++) {
        itemWords.push(getRandomWord());
      }
      items.push(itemWords.join(" "));
    }

    if (options.format === "html") {
      const tag = options.mode === "list_ordered" ? "ol" : "ul";
      const listItems = items.map((it) => `  <li>${it.charAt(0).toUpperCase() + it.slice(1)}</li>`).join("\n");
      rawResult = `<${tag}>\n${listItems}\n</${tag}>`;
    } else if (options.format === "markdown") {
      rawResult = items
        .map((it, idx) => {
          const prefix = options.mode === "list_ordered" ? `${idx + 1}.` : "-";
          return `${prefix} ${it.charAt(0).toUpperCase() + it.slice(1)}`;
        })
        .join("\n");
    } else {
      rawResult = items
        .map((it, idx) => {
          const prefix = options.mode === "list_ordered" ? `${idx + 1}.` : "•";
          return `${prefix} ${it.charAt(0).toUpperCase() + it.slice(1)}`;
        })
        .join("\n");
    }
  }

  return rawResult;
}

/**
 * Calculates live text statistics (Word Count, Char Count, Paragraphs, Lines, Reading Time)
 */
export function calculateLoremStats(text: string): LoremStats {
  if (!text || !text.trim()) {
    return {
      wordCount: 0,
      charCountWithSpaces: 0,
      charCountWithoutSpaces: 0,
      paragraphCount: 0,
      lineCount: 0,
      readingTime: "0 sec",
    };
  }

  // Strip HTML tags for clean word & character counting
  const plainText = text.replace(/<[^>]*>/g, " ");

  const words = plainText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCountWithSpaces = plainText.length;
  const charCountWithoutSpaces = plainText.replace(/\s+/g, "").length;

  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const lineCount = lines.length;

  const paragraphCount = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  // Estimated reading time (~200 Words Per Minute)
  const seconds = Math.ceil((wordCount / 200) * 60);
  let readingTime = "0 sec";
  if (seconds < 60) {
    readingTime = `${seconds} sec`;
  } else {
    const mins = (seconds / 60).toFixed(1);
    readingTime = `${mins} min`;
  }

  return {
    wordCount,
    charCountWithSpaces,
    charCountWithoutSpaces,
    paragraphCount,
    lineCount,
    readingTime,
  };
}
