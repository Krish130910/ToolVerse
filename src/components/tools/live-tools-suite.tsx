"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  RefreshCw,
  Braces,
  KeyRound,
  QrCode,
  Lock,
  Binary,
  Code2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Download
} from "lucide-react";

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

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Tool Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-100 no-scrollbar">
        <button
          onClick={() => setActiveTab("json-formatter")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "json-formatter"
              ? "bg-orange-500 text-white font-bold shadow-xs"
              : "bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200/90 hover:border-orange-300"
          }`}
        >
          <Braces className="w-4 h-4 text-orange-500" />
          JSON Formatter
        </button>

        <button
          onClick={() => setActiveTab("password-generator")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "password-generator"
              ? "bg-orange-500 text-white font-bold shadow-xs"
              : "bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200/90 hover:border-orange-300"
          }`}
        >
          <KeyRound className="w-4 h-4 text-orange-500" />
          Password Generator
        </button>

        <button
          onClick={() => setActiveTab("qr-generator")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "qr-generator"
              ? "bg-orange-500 text-white font-bold shadow-xs"
              : "bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200/90 hover:border-orange-300"
          }`}
        >
          <QrCode className="w-4 h-4 text-orange-500" />
          QR Generator
        </button>

        <button
          onClick={() => setActiveTab("jwt-decoder")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "jwt-decoder"
              ? "bg-orange-500 text-white font-bold shadow-xs"
              : "bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200/90 hover:border-orange-300"
          }`}
        >
          <Lock className="w-4 h-4 text-orange-500" />
          JWT Decoder
        </button>

        <button
          onClick={() => setActiveTab("uuid-generator")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "uuid-generator"
              ? "bg-orange-500 text-white font-bold shadow-xs"
              : "bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200/90 hover:border-orange-300"
          }`}
        >
          <Binary className="w-4 h-4 text-orange-500" />
          UUID Generator
        </button>

        <button
          onClick={() => setActiveTab("base64-encoder")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "base64-encoder"
              ? "bg-orange-500 text-white font-bold shadow-xs"
              : "bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200/90 hover:border-orange-300"
          }`}
        >
          <Code2 className="w-4 h-4 text-orange-500" />
          Base64 Encoder
        </button>
      </div>

      {/* Active Tool View */}
      {activeTab === "json-formatter" && <JsonFormatterTool />}
      {activeTab === "password-generator" && <PasswordGeneratorTool />}
      {activeTab === "qr-generator" && <QrGeneratorTool />}
      {activeTab === "jwt-decoder" && <JwtDecoderTool />}
      {activeTab === "base64-tool" && <Base64Tool />}
      {activeTab === "text-converter" && <TextConverterTool />}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TOOL 1: JSON Formatter & Minifier                                          */
/* -------------------------------------------------------------------------- */
const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState<string>(
    '{"name":"ToolVerse","version":1.0,"features":["client-side","zero-ads","fast"],"active":true}'
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Braces className="w-5 h-5 text-sky-400" />
            JSON Formatter & Minifier
          </h3>
          <p className="text-xs text-zinc-400">
            Paste JSON payload to validate syntax, format with spacing, or minify.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleFormat}>
            Beautify
          </Button>
          <Button size="sm" variant="outline" onClick={handleMinify}>
            Minify
          </Button>
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Invalid JSON Syntax: {error}</span>
        </div>
      )}

      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError(null);
        }}
        placeholder="Paste your JSON here..."
        className="w-full h-64 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TOOL 2: Password Generator                                                 */
/* -------------------------------------------------------------------------- */
const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState(16);
  const [incUpper, setIncUpper] = useState(true);
  const [incLower, setIncLower] = useState(true);
  const [incNums, setIncNums] = useState(true);
  const [incSyms, setIncSyms] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = "";
    if (incLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (incUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (incNums) chars += "0123456789";
    if (incSyms) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setPassword("");
      return;
    }

    let res = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      res += chars[array[i] % chars.length];
    }
    setPassword(res);
  };

  useEffect(() => {
    generatePassword();
  }, [length, incUpper, incLower, incNums, incSyms]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score += 2;
    if (length >= 16) score += 1;
    if (incUpper) score++;
    if (incLower) score++;
    if (incNums) score++;
    if (incSyms) score++;

    if (score <= 3) return { label: "Weak", color: "text-red-400 bg-red-500/10 border-red-500/30" };
    if (score <= 5) return { label: "Good", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
    return { label: "Strong", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
  };

  const strength = getStrength();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-emerald-400" />
          Cryptographic Password Generator
        </h3>
        <p className="text-xs text-zinc-400">
          Uses browser-native `crypto.getRandomValues()` for secure password generation.
        </p>
      </div>

      {/* Output Display */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
        <input
          type="text"
          readOnly
          value={password}
          className="w-full bg-transparent text-sm sm:text-base font-mono text-zinc-100 focus:outline-none"
        />
        <Badge variant="outline" className={`shrink-0 ${strength.color}`}>
          {strength.label}
        </Badge>
        <Button size="sm" variant="secondary" onClick={handleCopy}>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </Button>
        <Button size="sm" variant="ghost" onClick={generatePassword}>
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-300">
            <span>Password Length</span>
            <span className="font-mono font-bold text-white">{length}</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-zinc-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={incUpper}
              onChange={(e) => setIncUpper(e.target.checked)}
              className="rounded accent-white"
            />
            <span>Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={incLower}
              onChange={(e) => setIncLower(e.target.checked)}
              className="rounded accent-white"
            />
            <span>Lowercase (a-z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={incNums}
              onChange={(e) => setIncNums(e.target.checked)}
              className="rounded accent-white"
            />
            <span>Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={incSyms}
              onChange={(e) => setIncSyms(e.target.checked)}
              className="rounded accent-white"
            />
            <span>Symbols (!@#$)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TOOL 3: QR Code Generator                                                  */
/* -------------------------------------------------------------------------- */
const QrGeneratorTool: React.FC = () => {
  const [text, setText] = useState("https://toolverse.dev");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-amber-400" />
          QR Code Generator
        </h3>
        <p className="text-xs text-zinc-400">
          Generate clean QR codes instantly in browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-3">
          <label className="text-xs text-zinc-400">Content / URL</label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type URL or text..."
          />
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-xl border border-zinc-800">
          {/* Simple Canvas / SVG QR Visual Mock */}
          <div className="w-36 h-36 bg-white p-3 rounded-lg flex items-center justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                text || "https://toolverse.dev"
              )}`}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 font-mono">Live Browser QR</p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TOOL 4: JWT Inspector & Decoder                                            */
/* -------------------------------------------------------------------------- */
const JwtDecoderTool: React.FC = () => {
  const [jwtToken, setJwtToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.signature"
  );
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jwtToken.trim()) {
      setHeader("");
      setPayload("");
      setError(null);
      return;
    }

    try {
      const parts = jwtToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format (must have 3 dot-separated parts)");
      }

      const decodedHeader = atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"));
      const decodedPayload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));

      setHeader(JSON.stringify(JSON.parse(decodedHeader), null, 2));
      setPayload(JSON.stringify(JSON.parse(decodedPayload), null, 2));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [jwtToken]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-400" />
          JWT Decoder & Inspector
        </h3>
        <p className="text-xs text-zinc-400">
          Decode JWT Header and Payload client-side without sending tokens to any server.
        </p>
      </div>

      <textarea
        value={jwtToken}
        onChange={(e) => setJwtToken(e.target.value)}
        placeholder="Paste JWT token string..."
        className="w-full h-24 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Header</label>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-sky-400 overflow-x-auto h-48">
            {header || "// Header output"}
          </pre>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Payload</label>
          <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 overflow-x-auto h-48">
            {payload || "// Payload output"}
          </pre>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TOOL 5: Base64 Encoder & Decoder                                          */
/* -------------------------------------------------------------------------- */
const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello ToolVerse!");
  const [copied, setCopied] = useState(false);

  const getOutput = () => {
    try {
      if (mode === "encode") {
        return btoa(input);
      } else {
        return atob(input);
      }
    } catch {
      return "Error: Invalid input for decoding";
    }
  };

  const output = getOutput();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Binary className="w-5 h-5 text-violet-400" />
            Base64 Encoder & Decoder
          </h3>
          <p className="text-xs text-zinc-400">Convert strings to Base64 and vice versa.</p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
              mode === "encode" ? "bg-white text-black font-semibold" : "text-zinc-400"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
              mode === "decode" ? "bg-white text-black font-semibold" : "text-zinc-400"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter text to ${mode}...`}
          className="w-full h-44 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />

        <div className="relative">
          <textarea
            readOnly
            value={output}
            className="w-full h-44 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            className="absolute top-3 right-3"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* TOOL 6: Text Converter & Word Counter                                      */
/* -------------------------------------------------------------------------- */
const TextConverterTool: React.FC = () => {
  const [text, setText] = useState("Build fast, privacy-first web utilities with ToolVerse.");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const lines = text ? text.split("\n").length : 0;

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toTitle = () =>
    setText(
      text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-teal-400" />
          Text Case & Metrics Analyzer
        </h3>
        <p className="text-xs text-zinc-400">Analyze text metrics and convert string case.</p>
      </div>

      {/* Metrics Bar */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
        <div>
          Words: <span className="font-mono font-bold text-white">{words}</span>
        </div>
        <div>
          Characters: <span className="font-mono font-bold text-white">{chars}</span>
        </div>
        <div>
          Lines: <span className="font-mono font-bold text-white">{lines}</span>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-40 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={toUpper}>
          UPPERCASE
        </Button>
        <Button size="sm" variant="secondary" onClick={toLower}>
          lowercase
        </Button>
        <Button size="sm" variant="secondary" onClick={toTitle}>
          Title Case
        </Button>
        <Button size="sm" variant="outline" onClick={() => setText("")}>
          Clear
        </Button>
      </div>
    </div>
  );
};
