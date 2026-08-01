"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const JwtDecoderTool: React.FC = () => {
  const [jwt, setJwt] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggSGFycmlzb24iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const decoded = useMemo(() => {
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        return { error: "Invalid JWT format. Must contain 3 dot-separated parts." };
      }

      const decodePart = (str: string) => {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(decodeURIComponent(Array.prototype.map.call(atob(base64), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
      };

      const header = decodePart(parts[0]);
      const payload = decodePart(parts[1]);

      let isExpired = false;
      let expDate = "";
      if (payload.exp) {
        const expTime = payload.exp * 1000;
        isExpired = Date.now() > expTime;
        expDate = new Date(expTime).toLocaleString();
      }

      return { header, payload, isExpired, expDate, signature: parts[2] };
    } catch (e: any) {
      return { error: `Failed to decode JWT: ${e.message}` };
    }
  }, [jwt]);

  return (
    <div className="space-y-6">
      {/* JWT Input Token Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-orange-500" />
          <span>Encoded JSON Web Token (JWT)</span>
        </h4>
        <textarea
          rows={4}
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          placeholder="Paste JWT string here..."
          className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-900 text-amber-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
        />
      </div>

      {/* Decoded Output Panels */}
      {decoded.error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{decoded.error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Header */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Header (Algorithm & Token Type)</h4>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(decoded.header, null, 2));
                  setCopiedHeader(true);
                  setTimeout(() => setCopiedHeader(false), 1500);
                }}
                variant="outline" size="sm" className="text-xs"
              >
                {copiedHeader ? "Copied!" : "Copy Header"}
              </Button>
            </div>
            <pre className="p-4 bg-zinc-900 text-rose-400 rounded-xl font-mono text-xs overflow-x-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Payload (Claims & User Data)</h4>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2));
                  setCopiedPayload(true);
                  setTimeout(() => setCopiedPayload(false), 1500);
                }}
                variant="outline" size="sm" className="text-xs"
              >
                {copiedPayload ? "Copied!" : "Copy Payload"}
              </Button>
            </div>
            <pre className="p-4 bg-zinc-900 text-purple-400 rounded-xl font-mono text-xs overflow-x-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>

            {decoded.expDate && (
              <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${decoded.isExpired ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {decoded.isExpired ? "Token Expired!" : "Token Valid"}
                </span>
                <span className="font-mono">{decoded.expDate}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
