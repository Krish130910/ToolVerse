export const FAVORITES_KEY = "toolverse_favs";
export const FAVORITES_EVENT = "toolverse_favs_updated";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
  } catch {}
}

export function toggleFavoriteTool(toolId: string): string[] {
  const current = getFavorites();
  const updated = current.includes(toolId)
    ? current.filter((id) => id !== toolId)
    : [...current, toolId];
  saveFavorites(updated);
  return updated;
}
