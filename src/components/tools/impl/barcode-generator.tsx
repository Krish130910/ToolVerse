"use client";

import React, { useState, useMemo, useCallback } from "react";
import { BarcodeFormat, CustomizationOptions } from "@/lib/barcode/types";
import { validateBarcode, getFormatConfig } from "@/lib/barcode/validator";
import { InputCard } from "./barcode-generator/input-card";
import { CustomizationCard } from "./barcode-generator/customization-card";
import { PreviewCard } from "./barcode-generator/preview-card";

const DEFAULT_OPTIONS: CustomizationOptions = {
  width: 2,
  height: 80,
  margin: 10,
  fontSize: 14,
  displayValue: true,
  lineColor: "#18181B",
  background: "#FFFFFF",
  transparentBackground: false,
};

export const BarcodeGeneratorTool: React.FC = () => {
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const formatConfig = getFormatConfig(format);

  const [value, setValue] = useState<string>(formatConfig.defaultSample);
  const [options, setOptions] = useState<CustomizationOptions>(DEFAULT_OPTIONS);

  // Validate barcode value against selected format using memoization
  const validation = useMemo(() => {
    return validateBarcode(value, format);
  }, [value, format]);

  // Handle format switch - automatically set sample value if empty or invalid for previous format
  const handleFormatChange = useCallback((newFormat: BarcodeFormat) => {
    setFormat(newFormat);
    const newConfig = getFormatConfig(newFormat);
    setValue(newConfig.defaultSample);
  }, []);

  const handleLoadSample = useCallback(() => {
    const config = getFormatConfig(format);
    setValue(config.defaultSample);
  }, [format]);

  const handleReset = useCallback(() => {
    const config = getFormatConfig(format);
    setValue(config.defaultSample);
    setOptions(DEFAULT_OPTIONS);
  }, [format]);

  return (
    <div className="space-y-4 w-full">
      {/* CARD 1: Input & Format Selection */}
      <InputCard
        value={value}
        format={format}
        validation={validation}
        onValueChange={setValue}
        onFormatChange={handleFormatChange}
        onLoadSample={handleLoadSample}
      />

      {/* Grid containing CARD 2 (Customization) and CARD 3 (Preview) - Stretched to equal height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* CARD 2: Customization (50% width) */}
        <CustomizationCard options={options} onChange={setOptions} />

        {/* CARD 3: Preview (50% width, matching height) */}
        <PreviewCard
          value={value}
          format={format}
          validation={validation}
          options={options}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};
