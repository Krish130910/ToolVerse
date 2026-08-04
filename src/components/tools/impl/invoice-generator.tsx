"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Printer,
  Download,
  Plus,
  Trash2,
  Building,
  User,
  DollarSign,
  FileText,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
}

export const InvoiceGeneratorTool: React.FC = () => {
  const [companyName, setCompanyName] = useState("ToolVerse Solutions Inc.");
  const [companyAddress, setCompanyAddress] = useState("100 Innovation Way, Suite 400");
  const [clientName, setClientName] = useState("Acme Global Tech");
  const [clientAddress, setClientAddress] = useState("500 Enterprise Blvd, CA");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [currency, setCurrency] = useState("$");
  const [discount, setDiscount] = useState(0);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Web Application UI Design & Prototyping", quantity: 1, price: 1500, tax: 10 },
    { id: "2", description: "Client-Side Utility Suite Integration", quantity: 1, price: 850, tax: 10 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), description: "New Utility Service", quantity: 1, price: 200, tax: 10 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const subtotal = items.reduce((acc, it) => acc + it.quantity * it.price, 0);
  const taxTotal = items.reduce((acc, it) => acc + (it.quantity * it.price * (it.tax / 100)), 0);
  const grandTotal = Math.max(0, subtotal + taxTotal - discount);

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Invoice Config Form */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-orange-500" />
            <span>Company & Client Details</span>
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-700">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-8 px-2 rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900"
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="₹">INR (₹)</option>
              <option value="¥">JPY (¥)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700">Your Business Details:</label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" className="text-xs" />
            <Input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Address" className="text-xs" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700">Client Details:</label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client Name" className="text-xs" />
            <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Client Address" className="text-xs" />
          </div>
        </div>
      </div>

      {/* Invoice Line Items Table */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Invoice Line Items</h4>
          <Button onClick={addItem} size="sm" variant="outline" className="text-xs font-bold gap-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
              <div className="col-span-5">
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Item Description"
                  className="text-xs bg-white"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  placeholder="Qty"
                  className="text-xs font-mono text-center bg-white"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                  placeholder="Price"
                  className="text-xs font-mono text-right bg-white"
                />
              </div>
              <div className="col-span-2 font-mono text-xs font-bold text-right text-zinc-900 pr-2">
                {currency}{(item.quantity * item.price).toFixed(2)}
              </div>
              <div className="col-span-1 text-right">
                <button onClick={() => removeItem(item.id)} className="text-zinc-400 hover:text-rose-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Template Live Sheet & Print Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" />
            <span>Live Professional Invoice Document</span>
          </h3>

          <Button onClick={printInvoice} variant="default" size="sm" className="text-xs font-bold gap-1.5 shadow-2xs">
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </Button>
        </div>

        {/* Paper Document Template */}
        <div className="bg-white border border-zinc-300 rounded-2xl p-8 shadow-md max-w-3xl mx-auto space-y-8 print:border-0 print:shadow-none">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-200 pb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-zinc-900">{companyName}</h2>
              <p className="text-xs text-zinc-500 mt-1">{companyAddress}</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-orange-600 uppercase font-mono">{invoiceNumber}</span>
              <p className="text-xs text-zinc-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Bill To */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Billed To:</span>
            <h4 className="text-base font-bold text-zinc-900">{clientName}</h4>
            <p className="text-xs text-zinc-500">{clientAddress}</p>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 uppercase text-[10px]">
                <th className="py-2">Description</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map((it) => (
                <tr key={it.id} className="text-zinc-800">
                  <td className="py-3 font-semibold">{it.description}</td>
                  <td className="py-3 text-center font-mono">{it.quantity}</td>
                  <td className="py-3 text-right font-mono">{currency}{it.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-mono font-bold">{currency}{(it.quantity * it.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="flex justify-end pt-4 border-t border-zinc-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal:</span>
                <span className="font-mono">{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Tax (Est.):</span>
                <span className="font-mono">{currency}{taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-zinc-900 border-t border-zinc-200 pt-2">
                <span>Grand Total:</span>
                <span className="font-mono text-orange-600">{currency}{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
