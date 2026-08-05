export type InvoiceTemplate = "minimal" | "modern" | "professional";

export type TaxMode = "exclusive" | "inclusive";

export type DiscountType = "percentage" | "amount";

export type InvoiceStatus = "draft" | "outstanding" | "paid" | "overdue";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  discountType: DiscountType;
}

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  website: string;
  logoUrl: string | null;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  poNumber: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  currency: string;
  taxMode: TaxMode;
  globalDiscount: number;
  globalDiscountType: DiscountType;
  template: InvoiceTemplate;
  business: BusinessInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  notes: string;
  bankDetails: string;
}

export interface InvoiceTotals {
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  grandTotal: number;
}
