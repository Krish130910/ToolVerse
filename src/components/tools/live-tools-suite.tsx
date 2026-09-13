"use client";

import React, { useState, useEffect } from "react";
import { getToolComponent } from "@/tools/registry";

interface LiveToolsSuiteProps {
  initialTool?: string;
  onClose?: () => void;
}

export const LiveToolsSuite: React.FC<LiveToolsSuiteProps> = ({
  initialTool = "json-formatter",
}) => {
  const [activeTab, setActiveTab] = useState(initialTool);

  useEffect(() => {
    if (initialTool) {
      setActiveTab(initialTool);
    }
  }, [initialTool]);

  const ToolComponent = getToolComponent(activeTab);

  return (
    <div className="w-full">
      <ToolComponent />
    </div>
  );
};
