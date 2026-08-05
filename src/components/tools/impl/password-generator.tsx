"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  PasswordOptions,
  PasswordHistoryItem,
  PasswordMode,
} from "@/lib/password/types";
import {
  generatePassword,
  calculateEntropy,
  evaluatePolicies,
  getCharBreakdown,
} from "@/lib/password/generator";
import { ResultCard } from "./password-generator/ResultCard";
import { OptionsCard } from "./password-generator/OptionsCard";
import { StrengthCard } from "./password-generator/StrengthCard";
import { HistoryCard } from "./password-generator/HistoryCard";
import { WifiQrModal } from "./password-generator/WifiQrModal";

const INITIAL_OPTIONS: PasswordOptions = {
  mode: "random",
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
  customSeparator: "-",
  wordCount: 4,
  autoCopy: false,
};

export const PasswordGeneratorTool: React.FC = () => {
  const [options, setOptions] = useState<PasswordOptions>(INITIAL_OPTIONS);
  const [password, setPassword] = useState<string>("");
  const [warning, setWarning] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<PasswordHistoryItem[]>([]);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Generate password action with history deduplication
  const handleGenerate = useCallback(
    (opts: PasswordOptions, isUserAction: boolean = false) => {
      const res = generatePassword(opts);
      setPassword(res.password);
      setWarning(res.warning);

      if (res.password && !res.warning) {
        const entropyRes = calculateEntropy(opts, res.password);
        const newItem: PasswordHistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          password: res.password,
          timestamp: Date.now(),
          mode: opts.mode,
          strength: entropyRes.strengthLabel,
        };

        // Deduplicate consecutive passwords in session history
        setHistory((prev) => {
          if (prev.length > 0 && prev[0].password === res.password) {
            return prev;
          }
          return [newItem, ...prev.slice(0, 9)];
        });

        // Auto-copy to clipboard if enabled and triggered by user or option change
        if (opts.autoCopy && isUserAction && typeof navigator !== "undefined") {
          navigator.clipboard.writeText(res.password).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }
    },
    []
  );

  // Auto-generate password on options change
  useEffect(() => {
    handleGenerate(options, false);
  }, [options, handleGenerate]);

  // Global Spacebar key shortcut for one-click regeneration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const activeEl = document.activeElement;
        const isInputFocused =
          activeEl &&
          (activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.tagName === "SELECT" ||
            activeEl.getAttribute("contenteditable") === "true");

        if (!isInputFocused) {
          e.preventDefault();
          handleGenerate(options, true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, handleGenerate]);

  // Copy password to clipboard
  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Download password as TXT file with rich metadata
  const handleDownload = () => {
    if (!password) return;
    const fileContent = [
      `==================================================`,
      `TOOLVERSE SECURE PASSWORD EXPORT`,
      `==================================================`,
      `Password:        ${password}`,
      `Generation Mode: ${options.mode.toUpperCase()}`,
      `Length:          ${password.length} characters`,
      `Entropy:         ${entropyResult.entropy} bits (${entropyResult.strengthLabel})`,
      `Crack Time Est.: ${entropyResult.crackTime}`,
      `Generated At:    ${new Date().toISOString()}`,
      `==================================================`,
    ].join("\n");

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `password-${password.length}chars.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate live entropy & analysis metrics
  const entropyResult = useMemo(() => {
    return calculateEntropy(options, password);
  }, [options, password]);

  // Evaluate password policy checklist
  const policies = useMemo(() => {
    return evaluatePolicies(password);
  }, [password]);

  // Calculate character distribution
  const breakdown = useMemo(() => {
    return getCharBreakdown(password);
  }, [password]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Main Generated Result Banner */}
      <ResultCard
        password={password}
        warning={warning}
        copied={copied}
        autoCopy={options.autoCopy}
        onAutoCopyToggle={(enabled) =>
          setOptions((prev) => ({ ...prev, autoCopy: enabled }))
        }
        onCopy={handleCopy}
        onRegenerate={() => handleGenerate(options, true)}
        onDownload={handleDownload}
        onOpenQrModal={() => setIsQrModalOpen(true)}
      />

      {/* 2. Responsive 2-Column Grid: Controls & Strength Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Options Card */}
        <div className="lg:col-span-7 space-y-8">
          <OptionsCard options={options} onChangeOptions={setOptions} />

          {/* Session History */}
          <HistoryCard
            history={history}
            onCopyItem={(pw) => {
              navigator.clipboard.writeText(pw);
            }}
            onRestoreItem={(pw) => {
              setPassword(pw);
            }}
            onClearHistory={() => setHistory([])}
          />
        </div>

        {/* Right Column: Security Analysis & Policy Checklist */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-8">
          <StrengthCard
            entropyResult={entropyResult}
            policies={policies}
            breakdown={breakdown}
          />
        </div>
      </div>

      {/* Wi-Fi QR Code Modal */}
      <WifiQrModal
        isOpen={isQrModalOpen}
        password={password}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
};
