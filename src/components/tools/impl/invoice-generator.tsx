"use client";

import React, { useState, useCallback } from "react";
import { InvoiceData } from "@/lib/invoice/types";
import { generateNextInvoiceNumber } from "@/lib/invoice/calculator";
import { InvoiceFormCard } from "./invoice-generator/InvoiceFormCard";
import { ItemsTableCard } from "./invoice-generator/ItemsTableCard";
import { InvoiceSummaryCard } from "./invoice-generator/InvoiceSummaryCard";
import { InvoiceDocumentCard } from "./invoice-generator/InvoiceDocumentCard";
import { Edit3, Eye } from "lucide-react";

const INITIAL_INVOICE: InvoiceData = {
  id: "inv-1",
  invoiceNumber: "INV-0001",
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  status: "outstanding",
  currency: "$",
  taxMode: "exclusive",
  globalDiscount: 0,
  globalDiscountType: "percentage",
  template: "modern",
  business: {
    name: "ToolVerse Solutions Inc.",
    email: "billing@toolverse.app",
    phone: "+1 (555) 234-5678",
    address: "100 Innovation Way, Suite 400, San Francisco, CA 94105",
    taxId: "US-987654321",
    website: "toolverse.app",
    logoUrl: null,
  },
  client: {
    name: "Acme Global Tech",
    email: "accounts@acmeglobal.com",
    phone: "+1 (555) 987-6543",
    address: "500 Enterprise Blvd, Floor 12, New York, NY 10001",
    poNumber: "PO-2026-889",
  },
  items: [
    {
      id: "item-1",
      description: "Web Application UI Design & Component Architecture",
      quantity: 1,
      unitPrice: 1500,
      taxRate: 18,
      discount: 0,
      discountType: "percentage",
    },
    {
      id: "item-2",
      description: "Client-Side Utility Suite Integration & Testing",
      quantity: 1,
      unitPrice: 850,
      taxRate: 18,
      discount: 50,
      discountType: "amount",
    },
  ],
  notes: "Thank you for partnering with ToolVerse! Payment is due within 14 days of invoice date.",
  bankDetails: "Bank: Silicon Valley Bank\nAccount #: 4598 1234 5678\nRouting #: 121141822",
};

export const InvoiceGeneratorTool: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData>(INITIAL_INVOICE);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  // Duplicate Invoice handler
  const handleDuplicateInvoice = useCallback(() => {
    setInvoice((prev) => {
      const nextNum = generateNextInvoiceNumber(prev.invoiceNumber);
      return {
        ...prev,
        id: Math.random().toString(36).substring(2, 9),
        invoiceNumber: nextNum,
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        status: "draft",
      };
    });
  }, []);

  return (
    <div className="space-y-8 w-full">
      {/* Mobile Screen View Switcher Tabs (Edit Form vs Document Preview) */}
      <div className="flex lg:hidden items-center justify-center gap-2 p-1.5 bg-zinc-100/90 rounded-2xl border border-zinc-200">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === "edit"
              ? "bg-white text-zinc-900 shadow-2xs"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Invoice Form</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === "preview"
              ? "bg-white text-zinc-900 shadow-2xs"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Document Preview</span>
        </button>
      </div>

      {/* Main 2-Column Desktop Grid / Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (Business, Client, Items, Summary) */}
        <div
          className={`lg:col-span-6 space-y-8 ${
            mobileTab === "edit" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Business & Client Form Card */}
          <InvoiceFormCard invoice={invoice} onChangeInvoice={setInvoice} />

          {/* Dynamic Items Table */}
          <ItemsTableCard
            items={invoice.items}
            currencySymbol={invoice.currency}
            taxMode={invoice.taxMode}
            onChangeItems={(items) => setInvoice((prev) => ({ ...prev, items }))}
          />

          {/* Calculations Summary & Notes Card */}
          <InvoiceSummaryCard invoice={invoice} onChangeInvoice={setInvoice} />
        </div>

        {/* Right Column: Live Styled Paper Document View */}
        <div
          className={`lg:col-span-6 lg:sticky lg:top-20 space-y-8 ${
            mobileTab === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <InvoiceDocumentCard
            invoice={invoice}
            onChangeInvoice={setInvoice}
            onDuplicateInvoice={handleDuplicateInvoice}
          />
        </div>
      </div>
    </div>
  );
};
