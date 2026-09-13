import React from "react";

export type ToolCategory =
  | "AI Developer Tools"
  | "Developer Tools"
  | "Security & Crypto"
  | "Text & Markdown"
  | "CSS & UI Utilities"
  | "Image & Asset Tools"
  | "PDF Utilities"
  | "Converters & Formats"
  | "General Utilities";

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory | string;
  iconName: string;
  tags: string[];
  badge?: string;
  isLive: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  component?: React.ComponentType<any>;
}

export interface ToolComponentProps {
  tool?: ToolDefinition;
  className?: string;
}
