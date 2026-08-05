"use client";

import React, { useRef } from "react";
import {
  InvoiceData,
  InvoiceTemplate,
  TaxMode,
  InvoiceStatus,
} from "@/lib/invoice/types";
import { CURRENCY_OPTIONS } from "@/lib/invoice/currencies";
import { calculateDueDate, generateNextInvoiceNumber } from "@/lib/invoice/calculator";
import { Input } from "@/components/ui/input";
import {
  Building2,
  User,
  FileText,
  Upload,
  Trash2,
  Calendar,
  Sparkles,
  Layers,
  DollarSign,
} from "lucide-react";

interface InvoiceFormCardProps {
  invoice: InvoiceData;
  onChangeInvoice: (updater: (prev: InvoiceData) => InvoiceData) => void;
}

const TEMPLATE_OPTIONS: { id: InvoiceTemplate; label: string; desc: string }[] = [
  { id: "modern", label: "Modern SaaS", desc: "Orange accent, sleek cards" },
  { id: "minimal", label: "Minimalist", desc: "Clean monochrome dividers" },
  { id: "professional", label: "Professional", desc: "Executive corporate layout" },
];

export const InvoiceFormCard: React.FC<InvoiceFormCardProps> = ({
  invoice,
  onChangeInvoice,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const updateBusiness = (field: string, value: string) => {
    onChangeInvoice((prev) => ({
      ...prev,
      business: { ...prev.business, [field]: value },
    }));
  };

  const updateClient = (field: string, value: string) => {
    onChangeInvoice((prev) => ({
      ...prev,
      client: { ...prev.client, [field]: value },
    }));
  };

  const updateInvoice = <K extends keyof InvoiceData>(
    field: K,
    value: InvoiceData[K]
  ) => {
    onChangeInvoice((prev) => ({ ...prev, [field]: value }));
  };

  // Logo upload handler
  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      onChangeInvoice((prev) => ({
        ...prev,
        business: { ...prev.business, logoUrl: dataUri },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleApplyNetDays = (days: 15 | 30 | 60) => {
    const due = calculateDueDate(invoice.issueDate, days);
    updateInvoice("dueDate", due);
  };

  const handleAutoInvoiceNum = () => {
    const nextNum = generateNextInvoiceNumber(invoice.invoiceNumber);
    updateInvoice("invoiceNumber", nextNum);
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6">
      {/* 1. Template & Currency Selector Header */}
      <div className="space-y-4 border-b border-zinc-100 pb-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            <span>Invoice Template & Currency</span>
          </h3>

          {/* Status Badge Selector */}
          <select
            value={invoice.status}
            onChange={(e) => updateInvoice("status", e.target.value as InvoiceStatus)}
            className="h-8 px-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold capitalize text-zinc-900 focus:outline-none focus:border-orange-500"
          >
            <option value="draft">Draft</option>
            <option value="outstanding">Outstanding</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Template Selector Pills */}
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATE_OPTIONS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => updateInvoice("template", t.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                invoice.template === t.id
                  ? "border-orange-500 bg-orange-50/50 shadow-2xs"
                  : "border-zinc-200/90 bg-zinc-50/50 hover:bg-zinc-50 text-zinc-600"
              }`}
            >
              <div className="text-xs font-bold text-zinc-900">{t.label}</div>
              <div className="text-[10px] text-zinc-500 truncate">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Currency & Tax Mode Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Currency:</label>
            <select
              value={invoice.currency}
              onChange={(e) => updateInvoice("currency", e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-500"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.code} value={c.symbol}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Tax Mode:</label>
            <div className="flex items-center gap-1 p-1 bg-zinc-100/80 rounded-xl">
              <button
                type="button"
                onClick={() => updateInvoice("taxMode", "exclusive")}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  invoice.taxMode === "exclusive"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Tax Exclusive (+ Tax)
              </button>
              <button
                type="button"
                onClick={() => updateInvoice("taxMode", "inclusive")}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                  invoice.taxMode === "inclusive"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Tax Inclusive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Business Profile & Logo Upload */}
      <div className="space-y-4 border-b border-zinc-100 pb-5">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-orange-500" />
          <span>Your Business Profile</span>
        </h4>

        {/* Drag and Drop Logo Uploader */}
        <div className="flex items-center gap-4">
          {invoice.business.logoUrl ? (
            <div className="relative group w-20 h-20 rounded-2xl border border-zinc-200 p-1 bg-white shrink-0 overflow-hidden">
              <img
                src={invoice.business.logoUrl}
                alt="Company Logo"
                className="w-full h-full object-contain rounded-xl"
              />
              <button
                type="button"
                onClick={() => updateBusiness("logoUrl", "")}
                title="Remove Logo"
                className="absolute inset-0 bg-zinc-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => logoInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleLogoUpload(e.dataTransfer.files[0]);
                }
              }}
              className="w-full border-2 border-dashed border-zinc-200 hover:border-orange-400 bg-zinc-50 hover:bg-orange-50/20 rounded-2xl p-4 text-center cursor-pointer transition-colors space-y-1"
            >
              <Upload className="w-5 h-5 mx-auto text-zinc-400" />
              <div className="text-xs font-bold text-zinc-700">Upload Company Logo</div>
              <p className="text-[10px] text-zinc-400">Drag & drop or click (PNG, JPG, SVG)</p>
            </div>
          )}

          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]);
            }}
            className="hidden"
          />
        </div>

        {/* Business Text Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            value={invoice.business.name}
            onChange={(e) => updateBusiness("name", e.target.value)}
            placeholder="Company Name *"
            className="text-xs"
          />
          <Input
            value={invoice.business.email}
            onChange={(e) => updateBusiness("email", e.target.value)}
            placeholder="Business Email"
            className="text-xs"
          />
          <Input
            value={invoice.business.address}
            onChange={(e) => updateBusiness("address", e.target.value)}
            placeholder="Business Address"
            className="text-xs"
          />
          <Input
            value={invoice.business.taxId}
            onChange={(e) => updateBusiness("taxId", e.target.value)}
            placeholder="Tax ID / VAT / GST Number"
            className="text-xs"
          />
        </div>
      </div>

      {/* 3. Client Profile */}
      <div className="space-y-4 border-b border-zinc-100 pb-5">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-orange-500" />
          <span>Client / Customer Details</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            value={invoice.client.name}
            onChange={(e) => updateClient("name", e.target.value)}
            placeholder="Client Name *"
            className="text-xs"
          />
          <Input
            value={invoice.client.email}
            onChange={(e) => updateClient("email", e.target.value)}
            placeholder="Client Email"
            className="text-xs"
          />
          <Input
            value={invoice.client.address}
            onChange={(e) => updateClient("address", e.target.value)}
            placeholder="Client Billing Address"
            className="text-xs"
          />
          <Input
            value={invoice.client.poNumber}
            onChange={(e) => updateClient("poNumber", e.target.value)}
            placeholder="PO / Reference Number"
            className="text-xs"
          />
        </div>
      </div>

      {/* 4. Invoice Number & Net Due Date Calculator */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>Invoice Details & Dates</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Invoice Number */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-600">Invoice Number:</label>
            <div className="flex items-center gap-1.5">
              <Input
                value={invoice.invoiceNumber}
                onChange={(e) => updateInvoice("invoiceNumber", e.target.value)}
                placeholder="INV-0001"
                className="text-xs font-mono font-bold"
              />
              <button
                type="button"
                onClick={handleAutoInvoiceNum}
                title="Auto Increment Invoice #"
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-xs shrink-0 cursor-pointer"
              >
                +1
              </button>
            </div>
          </div>

          {/* Issue Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-600">Issue Date:</label>
            <Input
              type="date"
              value={invoice.issueDate}
              onChange={(e) => updateInvoice("issueDate", e.target.value)}
              className="text-xs font-mono"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-600">Due Date:</label>
            <Input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateInvoice("dueDate", e.target.value)}
              className="text-xs font-mono"
            />
          </div>
        </div>

        {/* Due Date Calculator Presets */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-zinc-400 mr-1">Net Term Presets:</span>
          {([15, 30, 60] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => handleApplyNetDays(days)}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Net {days}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
