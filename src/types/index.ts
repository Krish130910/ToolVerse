export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string; // Tailored accent color class/hex
  toolCount: number;
}

export interface FeaturedTool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description?: string;
  categorySlug: string;
  categoryName: string;
  badgeText: string;
  isComingSoon: boolean;
  isLive?: boolean;
  actionKey?: string;
  iconName: string;
  gradient: string;
  tags?: string[];
  popular?: boolean;
}


export interface ValueProp {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge: string;
}
