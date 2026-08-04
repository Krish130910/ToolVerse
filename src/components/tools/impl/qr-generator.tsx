"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  QRContentType,
  QRFormDataMap,
  QRCustomization,
  ValidationResult,
} from "@/lib/qr/types";
import { generateQRPayload, getSampleData } from "@/lib/qr/encoding";
import { validateQRForm } from "@/lib/qr/validation";
import { ContentTypeSelector, CONTENT_TYPE_OPTIONS } from "./qr-generator/ContentTypeSelector";
import { InputCard } from "./qr-generator/InputCard";
import { CustomizationCard } from "./qr-generator/CustomizationCard";
import { PreviewCard } from "./qr-generator/PreviewCard";

const INITIAL_CUSTOMIZATION: QRCustomization = {
  size: 400,
  margin: 2,
  fgColor: "#EA580C", // ToolVerse primary warm orange
  bgColor: "#FFFFFF",
  transparentBg: false,
  errorCorrectionLevel: "M",
  moduleShape: "square",
  logoUrl: null,
};

export const QrGeneratorTool: React.FC = () => {
  const [selectedType, setSelectedType] = useState<QRContentType>("url");

  // State map holding inputs for all 10 QR content types
  const [formDataMap, setFormDataMap] = useState<QRFormDataMap>({
    url: { url: "https://toolverse.app" },
    wifi: { ssid: "ToolVerse_WiFi", password: "FastSecurity2026", encryption: "WPA", hidden: false },
    contact: { fullName: "Krish Savaliya", company: "ToolVerse Engineering", phone: "+1 555 234 5678", email: "krish@example.com", website: "toolverse.app", address: "San Francisco, CA" },
    email: { email: "krish@example.com", subject: "ToolVerse Inquiry", body: "Hello, I am testing the QR utility." },
    text: { text: "Welcome to ToolVerse QR Generator - Modern, privacy-first developer utility." },
    phone: { phone: "+15552345678" },
    sms: { phone: "+15552345678", message: "Hello from ToolVerse QR Code!" },
    location: { latitude: "37.7749", longitude: "-122.4194" },
    upi: { upiId: "krish@upi", payeeName: "Krish Savaliya", amount: "499", note: "ToolVerse Pro" },
    event: { title: "ToolVerse Product Launch", startDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), endDate: new Date(Date.now() + 90000000).toISOString().slice(0, 16), location: "Virtual Stage", description: "Live demonstration of 25+ browser utilities." },
  });

  const [customization, setCustomization] = useState<QRCustomization>(INITIAL_CUSTOMIZATION);

  // Handle updating specific form data for any content type
  const handleChangeFormData = useCallback(
    <T extends QRContentType>(
      type: T,
      updater: (prev: QRFormDataMap[T]) => QRFormDataMap[T]
    ) => {
      setFormDataMap((prev) => ({
        ...prev,
        [type]: updater(prev[type]),
      }));
    },
    []
  );

  // Compute live validation result
  const validation: ValidationResult = useMemo(() => {
    return validateQRForm(selectedType, formDataMap[selectedType]);
  }, [selectedType, formDataMap]);

  // Compute live payload string
  const payload: string = useMemo(() => {
    return generateQRPayload(selectedType, formDataMap[selectedType]);
  }, [selectedType, formDataMap]);

  const selectedTypeOption = useMemo(() => {
    return CONTENT_TYPE_OPTIONS.find((o) => o.id === selectedType);
  }, [selectedType]);

  const handleClearCurrentForm = () => {
    handleChangeFormData(selectedType, () => getEmptyFormData(selectedType));
  };

  const handleResetAll = () => {
    setSelectedType("url");
    setCustomization(INITIAL_CUSTOMIZATION);
    setFormDataMap({
      url: { url: "" },
      wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
      contact: { fullName: "", company: "", phone: "", email: "", website: "", address: "" },
      email: { email: "", subject: "", body: "" },
      text: { text: "" },
      phone: { phone: "" },
      sms: { phone: "", message: "" },
      location: { latitude: "", longitude: "" },
      upi: { upiId: "", payeeName: "", amount: "", note: "" },
      event: { title: "", startDate: "", endDate: "", location: "", description: "" },
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP SECTION: Content Type Selector (Grid: 5 col desktop, 3 col tablet, 2 col mobile) */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs">
        <ContentTypeSelector
          selectedType={selectedType}
          onSelectType={(type) => setSelectedType(type)}
        />
      </div>

      {/* 2. THREE-CARD RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT / MIDDLE COLUMN: Card 1 (Input Form) + Card 2 (Customization) */}
        <div className="lg:col-span-7 space-y-8">
          {/* CARD 1: Input & QR Type Details Form */}
          <InputCard
            selectedType={selectedType}
            formDataMap={formDataMap}
            onChangeFormData={handleChangeFormData}
            validation={validation}
            onClear={handleClearCurrentForm}
          />

          {/* CARD 2: Customization & Styling Controls */}
          <CustomizationCard
            customization={customization}
            onChangeCustomization={setCustomization}
          />
        </div>

        {/* RIGHT COLUMN: Card 3 (Live Preview & Export) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <PreviewCard
            payload={payload}
            selectedType={selectedType}
            selectedTypeLabel={selectedTypeOption?.title || selectedType}
            customization={customization}
            validation={validation}
            onResetAll={handleResetAll}
          />
        </div>
      </div>
    </div>
  );
};

function getEmptyFormData<T extends QRContentType>(type: T): QRFormDataMap[T] {
  switch (type) {
    case "url":
      return { url: "" } as QRFormDataMap[T];
    case "wifi":
      return { ssid: "", password: "", encryption: "WPA", hidden: false } as QRFormDataMap[T];
    case "contact":
      return { fullName: "", company: "", phone: "", email: "", website: "", address: "" } as QRFormDataMap[T];
    case "email":
      return { email: "", subject: "", body: "" } as QRFormDataMap[T];
    case "text":
      return { text: "" } as QRFormDataMap[T];
    case "phone":
      return { phone: "" } as QRFormDataMap[T];
    case "sms":
      return { phone: "", message: "" } as QRFormDataMap[T];
    case "location":
      return { latitude: "", longitude: "" } as QRFormDataMap[T];
    case "upi":
      return { upiId: "", payeeName: "", amount: "", note: "" } as QRFormDataMap[T];
    case "event":
      return { title: "", startDate: "", endDate: "", location: "", description: "" } as QRFormDataMap[T];
  }
}
