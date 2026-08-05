"use client";

import React from "react";
import { InvoiceData, DiscountType } from "@/lib/invoice/types";
import { calculateInvoiceTotals } from "@/lib/invoice/calculator";
import { formatCurrency } from "@/lib/invoice/currencies";
import { Input } from "@/components/ui/input";
import { Calculator, FileText, Landmark } from "lucide-react";

interface InvoiceSummaryCardProps {
  invoice: InvoiceData;
  onChangeInvoice: (updater: (prev: InvoiceData) => InvoiceData) => void;
}

export const InvoiceSummaryCard: React.FC<InvoiceSummaryCardProps> = ({
  invoice,
  onChangeInvoice,
}) => {
  const totals = calculateInvoiceTotals(invoice);

  const updateField = <K extends keyof InvoiceData>(
    field: K,
    value: InvoiceData[K]
  ) => {
    onChangeInvoice((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Financial Calculations Summary Box */}
      <div className="p-5 bg-zinc-50 border border-zinc-200/80 rounded-2xl space-y-3">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-200/60 pb-2">
          <Calculator className="w-4 h-4 text-orange-500" />
          <span>Financial Calculations Summary</span>
        </h4>

        {/* Global Discount Row */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="font-medium text-zinc-600">Global Discount:</span>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min="0"
              value={invoice.globalDiscount}
              onChange={(e) => updateField("globalDiscount", Math.max(0, Number(e.target.value)))}
              className="w-20 h-7 text-xs font-mono text-right bg-white"
            />
            <button
              type="button"
              onClick={() =>
                updateField(
                  "globalDiscountType",
                  invoice.globalDiscountType === "percentage" ? "amount" : "percentage"
                )
              }
              className="h-7 px-2 border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-bold rounded-lg cursor-pointer"
            >
              {invoice.globalDiscountType === "percentage" ? "%" : invoice.currency}
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between items-center text-xs font-medium text-zinc-600">
          <span>Subtotal:</span>
          <span className="font-mono font-bold text-zinc-900">
            {formatCurrency(totals.subtotal, invoice.currency)}
          </span>
        </div>

        {/* Total Discounts */}
        {totals.totalDiscount > 0 && (
          <div className="flex justify-between items-center text-xs font-medium text-emerald-600">
            <span>Total Discounts:</span>
            <span className="font-mono font-bold">
              -{formatCurrency(totals.totalDiscount, invoice.currency)}
            </span>
          </div>
        )}

        {/* Total Tax */}
        <div className="flex justify-between items-center text-xs font-medium text-zinc-600">
          <span>
            Total Tax ({invoice.taxMode === "inclusive" ? "Inclusive" : "Exclusive"}):
          </span>
          <span className="font-mono font-bold text-zinc-900">
            {formatCurrency(totals.totalTax, invoice.currency)}
          </span>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between items-center text-sm font-extrabold text-zinc-900 border-t border-zinc-200 pt-3">
          <span>Grand Total:</span>
          <span className="font-mono text-xl text-orange-600">
            {formatCurrency(totals.grandTotal, invoice.currency)}
          </span>
        </div>
      </div>

      {/* Payment Details & Notes Textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bank & Payment Details */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-zinc-500" />
            <span>Bank & Payment Details:</span>
          </label>
          <textarea
            rows={3}
            value={invoice.bankDetails}
            onChange={(e) => updateField("bankDetails", e.target.value)}
            placeholder="Bank Name: Chase Bank&#10;Account #: 1234 5678 9012&#10;Routing #: 987654321"
            className="w-full p-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-xs font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-500 leading-relaxed"
          />
        </div>

        {/* Invoice Notes / Terms */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            <span>Invoice Terms & Notes:</span>
          </label>
          <textarea
            rows={3}
            value={invoice.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Thank you for your business! Payment is due within 30 days."
            className="w-full p-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-xs font-sans text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-500 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
