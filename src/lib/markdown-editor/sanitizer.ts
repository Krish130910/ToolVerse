// Safe HTML Sanitizer for Markdown Rendering (XSS Protection)

/** Sanitizes HTML generated from Markdown or raw user HTML to prevent XSS payloads. */
export function sanitizeHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";
  if (typeof window === "undefined") return trimmed;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "text/html");

    // 1. Remove dangerous elements completely
    const dangerousTags = [
      "script",
      "object",
      "embed",
      "iframe",
      "applet",
      "base",
      "meta",
      "link",
      "style",
      "form",
    ];

    dangerousTags.forEach((tag) => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach((el) => el.parentNode?.removeChild(el));
    });

    // 2. Remove event handlers & unsafe protocols from all elements
    const allElements = doc.querySelectorAll("*");
    allElements.forEach((el) => {
      const attrsToRemove: string[] = [];

      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        const name = attr.name.toLowerCase();
        const value = attr.value.toLowerCase();

        // Strip inline event handlers (onload, onerror, onclick, etc.)
        if (name.startsWith("on")) {
          attrsToRemove.push(attr.name);
        }

        // Strip javascript: and dangerous data: URIs from links and images
        if (
          (name === "href" || name === "src" || name === "action") &&
          (value.includes("javascript:") || value.includes("data:text/html") || value.includes("vbscript:"))
        ) {
          attrsToRemove.push(attr.name);
        }
      }

      attrsToRemove.forEach((attrName) => el.removeAttribute(attrName));

      // Add target="_blank" and rel="noopener noreferrer" to external links safely
      if (el.tagName.toLowerCase() === "a") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    });

    return doc.body.innerHTML;
  } catch (err) {
    console.error("[Markdown HTML Sanitizer Error]:", err);
    // Fallback regex cleanup if DOMParser fails
    return trimmed
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  }
}
