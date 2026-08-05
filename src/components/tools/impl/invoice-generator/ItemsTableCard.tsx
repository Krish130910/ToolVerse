"use client";

import React from "react";
import { InvoiceItem, DiscountType, TaxMode } from "@/lib/invoice/types";
import { calculateItemSubtotal, calculateItemTotal } from "@/lib/invoice/calculator";
import { formatCurrency } from "@/lib/invoice/currencies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Copy, ShoppingBag, Percent, DollarSign } from "lucide-react";

interface ItemsTableCardProps {
  items: InvoiceItem[];
  currencySymbol: string;
  taxMode: TaxMode;
  onChangeItems: (items: InvoiceItem[]) => void;
}

const TAX_PRESETS = [
  { label: "0% Tax", value: 0 },
  { label: "GST 18%", value: 18 },
  { label: "GST 5%", value: 5 },
  { label: "VAT 20%", value: 20 },
  { label: "VAT 10%", value: 10 },
];

export const ItemsTableCard: React.FC<ItemsTableCardProps> = ({
  items,
  currencySymbol,
  taxMode,
  onChangeItems,
}) => {
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substring(2, 9),
      description: "",
      quantity: 1,
      unitPrice: 100,
      taxRate: 0,
      discount: 0,
      discountType: "percentage",
    };
    onChangeItems([...items, newItem]);
  };

  const duplicateItem = (index: number) => {
    const target = items[index];
    if (!target) return;
    const clone: InvoiceItem = {
      ...target,
      id: Math.random().toString(36).substring(2, 9),
      description: `${target.description} (Copy)`,
    };
    const next = [...items];
    next.splice(index + 1, 0, clone);
    onChangeItems(next);
  };

  const removeItem = (id: string) => {
    onChangeItems(items.filter((item) => item.id !== id));
  };

  const updateItemField = <K extends keyof InvoiceItem>(
    id: string,
    field: K,
    value: InvoiceItem[K]
  ) => {
    onChangeItems(
      items.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-orange-500" />
          <span>Line Items ({items.length})</span>
        </h4>

        <Button
          onClick={addItem}
          size="sm"
          variant="outline"
          className="text-xs font-bold gap-1 cursor-pointer bg-white"
        >
          <Plus className="w-4 h-4 text-orange-500" />
          <span>Add Item</span>
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const lineTotal = calculateItemTotal(item, taxMode);

          return (
            <div
              key={item.id}
              className="p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-2xl space-y-3 hover:border-orange-300 transition-colors"
            >
              {/* Top Row: Description */}
              <div className="flex items-center gap-3">
                <Input
                  value={item.description}
                  onChange={(e) => updateItemField(item.id, "description", e.target.value)}
                  placeholder="Item Name or Description (e.g. Web UI Design Service)"
                  className="text-xs font-medium bg-white"
                />

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => duplicateItem(index)}
                    title="Duplicate Line Item"
                    className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl hover:bg-zinc-200/60 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    title="Delete Item"
                    className="p-2 text-zinc-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Row: Qty, Price, Tax Preset, Discount, Subtotal */}
              <div className="grid grid-cols-12 gap-3 items-center">
                {/* Quantity */}
                <div className="col-span-3 sm:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Qty</label>
                  <Input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItemField(item.id, "quantity", Math.max(0, Number(e.target.value)))
                    }
                    className="text-xs font-mono text-center bg-white"
                  />
                </div>

                {/* Price */}
                <div className="col-span-4 sm:col-span-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Unit Price</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItemField(item.id, "unitPrice", Math.max(0, Number(e.target.value)))
                    }
                    className="text-xs font-mono text-right bg-white"
                  />
                </div>

                {/* Tax Rate Preset */}
                <div className="col-span-5 sm:col-span-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Tax Preset</label>
                  <select
                    value={item.taxRate}
                    onChange={(e) => updateItemField(item.id, "taxRate", Number(e.target.value))}
                    className="w-full h-9 px-2 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:border-orange-500"
                  >
                    {TAX_PRESETS.map((t) => (
                      <option key={t.label} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount (% or $) */}
                <div className="col-span-6 sm:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase">Discount</label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min="0"
                      value={item.discount}
                      onChange={(e) =>
                        updateItemField(item.id, "discount", Math.max(0, Number(e.target.value)))
                      }
                      className="text-xs font-mono text-right bg-white rounded-r-none border-r-0"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateItemField(
                          item.id,
                          "discountType",
                          item.discountType === "percentage" ? "amount" : "percentage"
                        )
                      }
                      className="h-9 px-2 border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-r-xl cursor-pointer"
                    >
                      {item.discountType === "percentage" ? "%" : currencySymbol}
                    </button>
                  </div>
                </div>

                {/* Line Total Display */}
                <div className="col-span-6 sm:col-span-2 text-right">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Total</label>
                  <div className="text-xs font-mono font-bold text-zinc-900 pt-1">
                    {formatCurrency(lineTotal, currencySymbol)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
