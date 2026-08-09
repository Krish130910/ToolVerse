// Client-Side Safe SVG Sanitizer (XSS & Script Payload Filter)

/** Sanitizes raw SVG code to eliminate XSS vectors, scripts, and dangerous attributes. */
export function sanitizeSvg(svgCode: string): string {
  const trimmed = svgCode.trim();
  if (!trimmed) return "";
  if (typeof window === "undefined") return trimmed;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "image/svg+xml");

    // Check for parser errors before sanitizing
    if (doc.querySelector("parsererror")) {
      return trimmed;
    }

    // 1. Remove dangerous tags
    const dangerousTags = [
      "script",
      "object",
      "embed",
      "iframe",
      "applet",
      "base",
      "meta",
      "link",
    ];

    dangerousTags.forEach((tag) => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach((el) => el.parentNode?.removeChild(el));
    });

    // 2. Remove event handlers & unsafe protocols from all elements
    const allElements = doc.querySelectorAll("*");
    allElements.forEach((el) => {
      // Collect attributes to remove
      const attrsToRemove: string[] = [];

      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        const name = attr.name.toLowerCase();
        const value = attr.value.toLowerCase();

        // Remove inline event handlers (e.g., onload, onerror, onclick, onmouseover)
        if (name.startsWith("on")) {
          attrsToRemove.push(attr.name);
        }

        // Remove javascript: and data: pseudo-protocols in href/xlink:href/src/action
        if (
          (name === "href" || name === "xlink:href" || name === "src" || name === "action") &&
          (value.includes("javascript:") || value.includes("data:text/html") || value.includes("vbscript:"))
        ) {
          attrsToRemove.push(attr.name);
        }
      }

      attrsToRemove.forEach((attrName) => el.removeAttribute(attrName));
    });

    // 3. Clean up <style> tag contents
    const styleTags = doc.querySelectorAll("style");
    styleTags.forEach((styleEl) => {
      let css = styleEl.textContent || "";
      // Strip dangerous CSS expressions, behavior, and javascript URLs
      css = css.replace(/expression\s*\([^)]*\)/gi, "");
      css = css.replace(/behavior\s*:[^;}]*/gi, "");
      css = css.replace(/url\s*\(\s*["']?javascript:[^)]*\)/gi, "");
      styleEl.textContent = css;
    });

    // Serialize back to clean XML string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (err) {
    console.error("[SVG Sanitizer Error]:", err);
    // Fallback: Basic regex cleanup if DOMParser fails
    return trimmed
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  }
}
