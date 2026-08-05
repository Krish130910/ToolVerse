import {
  InvoiceData,
  InvoiceItem,
  InvoiceTotals,
  TaxMode,
} from "./types";

/**
 * Calculates raw subtotal for a single line item before tax/discount
 */
export function calculateItemSubtotal(item: InvoiceItem): number {
  const qty = Math.max(0, item.quantity || 0);
  const price = Math.max(0, item.unitPrice || 0);
  return qty * price;
}

/**
 * Calculates line discount amount
 */
export function calculateItemDiscount(item: InvoiceItem): number {
  const subtotal = calculateItemSubtotal(item);
  const discountVal = Math.max(0, item.discount || 0);

  if (item.discountType === "percentage") {
    return (subtotal * Math.min(100, discountVal)) / 100;
  }
  return Math.min(subtotal, discountVal);
}

/**
 * Calculates line tax amount (supporting Tax Exclusive vs Tax Inclusive modes)
 */
export function calculateItemTax(item: InvoiceItem, taxMode: TaxMode): number {
  const subtotal = calculateItemSubtotal(item);
  const discount = calculateItemDiscount(item);
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxRate = Math.max(0, item.taxRate || 0);

  if (taxRate <= 0) return 0;

  if (taxMode === "inclusive") {
    // Inclusive Tax: Tax = TaxableAmount - (TaxableAmount / (1 + Rate/100))
    return taxableAmount - taxableAmount / (1 + taxRate / 100);
  }
  // Exclusive Tax: Tax = TaxableAmount * (Rate/100)
  return (taxableAmount * taxRate) / 100;
}

/**
 * Calculates final line total
 */
export function calculateItemTotal(item: InvoiceItem, taxMode: TaxMode): number {
  const subtotal = calculateItemSubtotal(item);
  const discount = calculateItemDiscount(item);
  const tax = calculateItemTax(item, taxMode);

  if (taxMode === "inclusive") {
    return Math.max(0, subtotal - discount);
  }
  return Math.max(0, subtotal - discount + tax);
}

/**
 * Calculates global invoice financial totals
 */
export function calculateInvoiceTotals(invoice: InvoiceData): InvoiceTotals {
  let rawSubtotal = 0;
  let lineTaxTotal = 0;
  let lineDiscountTotal = 0;

  for (const item of invoice.items) {
    const itemSub = calculateItemSubtotal(item);
    const itemDisc = calculateItemDiscount(item);
    const itemTax = calculateItemTax(item, invoice.taxMode);

    rawSubtotal += itemSub;
    lineDiscountTotal += itemDisc;
    lineTaxTotal += itemTax;
  }

  // Calculate global discount
  let globalDiscAmount = 0;
  const taxableSubtotal = Math.max(0, rawSubtotal - lineDiscountTotal);
  const globalDiscVal = Math.max(0, invoice.globalDiscount || 0);

  if (invoice.globalDiscountType === "percentage") {
    globalDiscAmount = (taxableSubtotal * Math.min(100, globalDiscVal)) / 100;
  } else {
    globalDiscAmount = Math.min(taxableSubtotal, globalDiscVal);
  }

  const totalDiscount = lineDiscountTotal + globalDiscAmount;
  const totalTax = lineTaxTotal;

  let grandTotal = 0;
  if (invoice.taxMode === "inclusive") {
    grandTotal = Math.max(0, rawSubtotal - totalDiscount);
  } else {
    grandTotal = Math.max(0, rawSubtotal - totalDiscount + totalTax);
  }

  return {
    subtotal: rawSubtotal,
    totalTax,
    totalDiscount,
    grandTotal,
  };
}

/**
 * Calculates due date based on issue date and Net days (15, 30, 60)
 */
export function calculateDueDate(issueDateStr: string, netDays: 15 | 30 | 60): string {
  try {
    const date = new Date(issueDateStr || Date.now());
    date.setDate(date.getDate() + netDays);
    return date.toISOString().slice(0, 10);
  } catch {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + netDays);
    return fallback.toISOString().slice(0, 10);
  }
}

/**
 * Auto-increments invoice number string (e.g. "INV-0001" -> "INV-0002")
 */
export function generateNextInvoiceNumber(currentNum: string = "INV-0001"): string {
  const match = currentNum.match(/^(.*?)(\d+)$/);
  if (!match) return "INV-0002";
  const prefix = match[1] || "INV-";
  const numStr = match[2];
  const nextNum = parseInt(numStr, 10) + 1;
  return `${prefix}${nextNum.toString().padStart(numStr.length, "0")}`;
}
