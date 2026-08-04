"use client";

import React from "react";
import { JWTValidationResult } from "@/lib/jwt/types";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertCircle,
  ShieldAlert,
  Info,
  Calendar,
  KeyRound,
  UserCheck,
  Building,
} from "lucide-react";

interface SummaryCardProps {
  result: JWTValidationResult;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ result }) => {
  const { status, statusLabel, claims, errors, warnings } = result;

  const getStatusBadge = () => {
    switch (status) {
      case "valid":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
        };
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-800",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        };
      case "expired":
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-800",
          icon: <Clock className="w-5 h-5 text-rose-600" />,
        };
      case "malformed":
      default:
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-800",
          icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-5">
      {/* Status Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border ${badge.bg} shadow-xs flex items-center justify-center`}>
            {badge.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">
                {statusLabel}
              </h3>
            </div>
            <p className="text-[11px] font-medium text-zinc-500">
              Token summary &amp; standard claims analysis.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-[10px] font-mono text-zinc-500 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Signature verification skipped (No secret key)</span>
        </div>
      </div>

      {/* Errors & Warnings Callouts */}
      {errors.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Malformed Token Errors:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] pl-1">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Claims Warnings:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] pl-1">
            {warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Claims Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Algorithm */}
        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Algorithm (alg)
          </span>
          <span className="text-xs font-mono font-extrabold text-zinc-900 block truncate mt-0.5">
            {claims.alg || "—"}
          </span>
        </div>

        {/* Token Type */}
        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Type (typ)
          </span>
          <span className="text-xs font-mono font-extrabold text-zinc-900 block truncate mt-0.5">
            {claims.typ || "JWT"}
          </span>
        </div>

        {/* Token Age */}
        <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Token Age
          </span>
          <span className="text-xs font-mono font-extrabold text-zinc-900 block truncate mt-0.5">
            {claims.tokenAge || "—"}
          </span>
        </div>

        {/* Time Remaining */}
        <div
          className={`p-3 rounded-2xl border ${
            claims.isExpired
              ? "bg-rose-50 border-rose-200 text-rose-700"
              : claims.isExpiringSoon
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
            Time Remaining
          </span>
          <span className="text-xs font-mono font-extrabold block truncate mt-0.5">
            {claims.timeRemaining || "No Expiration"}
          </span>
        </div>
      </div>

      {/* Detailed Claims Details Table */}
      <div className="border border-zinc-200 rounded-2xl overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-100/70 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              <th className="py-2.5 px-4">Standard Claim</th>
              <th className="py-2.5 px-4">Claim Key</th>
              <th className="py-2.5 px-4">Value / Local Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-mono text-zinc-800">
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-zinc-700">Subject</td>
              <td className="py-2.5 px-4 text-orange-600 font-bold">sub</td>
              <td className="py-2.5 px-4 truncate max-w-xs">{claims.sub || "—"}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-zinc-700">Issuer</td>
              <td className="py-2.5 px-4 text-orange-600 font-bold">iss</td>
              <td className="py-2.5 px-4 truncate max-w-xs">{claims.iss || "—"}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-zinc-700">Audience</td>
              <td className="py-2.5 px-4 text-orange-600 font-bold">aud</td>
              <td className="py-2.5 px-4 truncate max-w-xs">
                {Array.isArray(claims.aud) ? claims.aud.join(", ") : claims.aud || "—"}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-zinc-700">Issued At</td>
              <td className="py-2.5 px-4 text-orange-600 font-bold">iat</td>
              <td className="py-2.5 px-4">
                {claims.iat ? (
                  <div>
                    <span className="font-bold">{claims.iatFormatted}</span>
                    <span className="text-zinc-400 text-[10px] ml-2">({claims.iat})</span>
                  </div>
                ) : (
                  "—"
                )}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-zinc-700">Not Before</td>
              <td className="py-2.5 px-4 text-orange-600 font-bold">nbf</td>
              <td className="py-2.5 px-4">
                {claims.nbf ? (
                  <div>
                    <span className="font-bold">{claims.nbfFormatted}</span>
                    <span className="text-zinc-400 text-[10px] ml-2">({claims.nbf})</span>
                  </div>
                ) : (
                  "—"
                )}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-zinc-700">Expiration Time</td>
              <td className="py-2.5 px-4 text-orange-600 font-bold">exp</td>
              <td className="py-2.5 px-4">
                {claims.exp ? (
                  <div>
                    <span
                      className={`font-bold ${
                        claims.isExpired ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {claims.expFormatted}
                    </span>
                    <span className="text-zinc-400 text-[10px] ml-2">({claims.exp})</span>
                  </div>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
