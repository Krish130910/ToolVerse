export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", symbol: "$", name: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", name: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", name: "GBP (£) - British Pound" },
  { code: "INR", symbol: "₹", name: "INR (₹) - Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "JPY (¥) - Japanese Yen" },
  { code: "CAD", symbol: "CA$", name: "CAD (CA$) - Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "AUD (A$) - Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "CHF (CHF) - Swiss Franc" },
  { code: "AED", symbol: "AED", name: "AED (AED) - UAE Dirham" },
  { code: "SGD", symbol: "S$", name: "SGD (S$) - Singapore Dollar" },
];

export function formatCurrency(amount: number, symbol: string = "$"): string {
  const safeAmount = isNaN(amount) || !isFinite(amount) ? 0 : amount;
  const formatted = Math.abs(safeAmount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sign = safeAmount < 0 ? "-" : "";
  return `${sign}${symbol}${formatted}`;
}
