"use client";

import React, { useRef } from "react";
import { InvoiceData } from "@/lib/invoice/types";
import { calculateInvoiceTotals, calculateItemTotal, generateNextInvoiceNumber } from "@/lib/invoice/calculator";
import { formatCurrency } from "@/lib/invoice/currencies";
import { Button } from "@/components/ui/button";
import {
  Printer,
  Download,
  Copy,
  FileJson,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface InvoiceDocumentCardProps {
  invoice: InvoiceData;
  onChangeInvoice: (updater: (prev: InvoiceData) => InvoiceData) => void;
  onDuplicateInvoice: () => void;
}

export const InvoiceDocumentCard: React.FC<InvoiceDocumentCardProps> = ({
  invoice,
  onChangeInvoice,
  onDuplicateInvoice,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totals = calculateInvoiceTotals(invoice);

  // Print Invoice trigger
  const handlePrint = () => {
    window.print();
  };

  // Download PDF (triggers clean print-to-pdf or native download formatted strictly as `Invoice-INV-0001.pdf`)
  const handleDownloadPdf = () => {
    // We set document title temporarily so browser window.print() saves default filename as `Invoice-INV-0001.pdf`!
    const originalTitle = document.title;
    const filename = `Invoice-${invoice.invoiceNumber || "0001"}`;
    document.title = filename;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  // Export JSON backup file
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(invoice, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber || "backup"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup file
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed && parsed.invoiceNumber && Array.isArray(parsed.items)) {
          onChangeInvoice(() => parsed);
        } else {
          alert("Invalid invoice JSON structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar Header */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-500" />
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Live Document ({invoice.template.toUpperCase()} Template)
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Duplicate Invoice */}
          <button
            type="button"
            onClick={onDuplicateInvoice}
            title="Duplicate Invoice"
            className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5 text-zinc-500" />
            <span>Duplicate</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            title="Print Invoice"
            className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-500" />
            <span>Print</span>
          </button>

          {/* Download PDF Button */}
          <Button
            onClick={handleDownloadPdf}
            variant="default"
            size="default"
            className="text-xs font-bold gap-1.5 shadow-2xs bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Styled Printable Paper Invoice Document Container */}
      <div
        id="invoice-document-root"
        className={`bg-white border rounded-3xl p-8 sm:p-12 shadow-lg max-w-4xl mx-auto space-y-8 print:border-0 print:shadow-none print:p-0 print:max-w-none transition-all ${
          invoice.template === "minimal"
            ? "border-zinc-200 font-mono"
            : invoice.template === "professional"
            ? "border-zinc-300 font-serif"
            : "border-zinc-200/90 font-sans"
        }`}
      >
        {/* Template Header Bar */}
        <div className="flex justify-between items-start border-b border-zinc-200 pb-6">
          {/* Company Branding */}
          <div className="space-y-2 max-w-md">
            {invoice.business.logoUrl && (
              <img
                src={invoice.business.logoUrl}
                alt="Logo"
                className="h-12 w-auto object-contain mb-2"
              />
            )}
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              {invoice.business.name || "Your Business Name"}
            </h2>
            <div className="text-xs text-zinc-500 leading-relaxed">
              {invoice.business.address && <div>{invoice.business.address}</div>}
              {invoice.business.email && <div>Email: {invoice.business.email}</div>}
              {invoice.business.taxId && <div>Tax ID: {invoice.business.taxId}</div>}
            </div>
          </div>

          {/* Invoice Metadata */}
          <div className="text-right space-y-1">
            <div className="text-2xl font-black font-mono text-orange-600 tracking-wider">
              {invoice.invoiceNumber || "INV-0001"}
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              Issue Date: <strong>{invoice.issueDate || "N/A"}</strong>
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              Due Date: <strong>{invoice.dueDate || "N/A"}</strong>
            </div>
            <div className="pt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  invoice.status === "paid"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : invoice.status === "overdue"
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : invoice.status === "outstanding"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-zinc-100 text-zinc-700 border border-zinc-300"
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Billed To Section */}
        <div className="grid grid-cols-2 gap-6 bg-zinc-50/70 p-4 rounded-2xl border border-zinc-200/70 print:bg-transparent print:p-0 print:border-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Billed To:
            </span>
            <h4 className="text-base font-bold text-zinc-900">
              {invoice.client.name || "Client Name"}
            </h4>
            <div className="text-xs text-zinc-500 leading-relaxed">
              {invoice.client.address && <div>{invoice.client.address}</div>}
              {invoice.client.email && <div>Email: {invoice.client.email}</div>}
            </div>
          </div>

          {invoice.client.poNumber && (
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                PO / Reference #:
              </span>
              <div className="text-sm font-mono font-bold text-zinc-800">
                {invoice.client.poNumber}
              </div>
            </div>
          )}
        </div>

        {/* Line Items Table */}
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
              <th className="py-3">Description</th>
              <th className="py-3 text-center">Qty</th>
              <th className="py-3 text-right">Unit Price</th>
              <th className="py-3 text-right">Tax</th>
              <th className="py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {invoice.items.map((it) => {
              const lineTotal = calculateItemTotal(it, invoice.taxMode);
              return (
                <tr key={it.id} className="text-zinc-800">
                  <td className="py-3.5 font-semibold text-zinc-900">
                    {it.description || "Service Item"}
                  </td>
                  <td className="py-3.5 text-center font-mono">{it.quantity}</td>
                  <td className="py-3.5 text-right font-mono">
                    {formatCurrency(it.unitPrice, invoice.currency)}
                  </td>
                  <td className="py-3.5 text-right font-mono text-zinc-500">
                    {it.taxRate > 0 ? `${it.taxRate}%` : "-"}
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-zinc-900">
                    {formatCurrency(lineTotal, invoice.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Financial Summary */}
        <div className="flex justify-end pt-4 border-t border-zinc-200">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-zinc-900">
                {formatCurrency(totals.subtotal, invoice.currency)}
              </span>
            </div>

            {totals.totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Total Discount:</span>
                <span className="font-mono font-bold">
                  -{formatCurrency(totals.totalDiscount, invoice.currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-zinc-600">
              <span>Tax ({invoice.taxMode === "inclusive" ? "Inclusive" : "Exclusive"}):</span>
              <span className="font-mono font-bold text-zinc-900">
                {formatCurrency(totals.totalTax, invoice.currency)}
              </span>
            </div>

            <div className="flex justify-between font-extrabold text-base text-zinc-900 border-t border-zinc-200 pt-3">
              <span>Grand Total:</span>
              <span className="font-mono text-xl text-orange-600">
                {formatCurrency(totals.grandTotal, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Notes & Bank Info */}
        {(invoice.bankDetails || invoice.notes) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-200 pt-6 text-xs text-zinc-600 leading-relaxed">
            {invoice.bankDetails && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Payment Details:
                </span>
                <div className="whitespace-pre-line font-mono text-[11px] bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                  {invoice.bankDetails}
                </div>
              </div>
            )}

            {invoice.notes && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Notes & Terms:
                </span>
                <div className="whitespace-pre-line bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                  {invoice.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
