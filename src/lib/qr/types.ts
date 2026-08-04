export type QRContentType =
  | "url"
  | "wifi"
  | "contact"
  | "email"
  | "text"
  | "phone"
  | "sms"
  | "location"
  | "upi"
  | "event";

export interface UrlFormData {
  url: string;
}

export interface WifiFormData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface ContactFormData {
  fullName: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface EmailFormData {
  email: string;
  subject?: string;
  body?: string;
}

export interface TextFormData {
  text: string;
}

export interface PhoneFormData {
  phone: string;
}

export interface SmsFormData {
  phone: string;
  message?: string;
}

export interface LocationFormData {
  latitude: string;
  longitude: string;
}

export interface UpiFormData {
  upiId: string;
  payeeName?: string;
  amount?: string;
  note?: string;
}

export interface EventFormData {
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
  description?: string;
}

export type QRFormDataMap = {
  url: UrlFormData;
  wifi: WifiFormData;
  contact: ContactFormData;
  email: EmailFormData;
  text: TextFormData;
  phone: PhoneFormData;
  sms: SmsFormData;
  location: LocationFormData;
  upi: UpiFormData;
  event: EventFormData;
};

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
export type ModuleShape = "square" | "rounded" | "circle";

export interface QRCustomization {
  size: number; // e.g. 150, 250, 400, 600
  margin: number; // 0, 1, 2, 4
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  errorCorrectionLevel: ErrorCorrectionLevel;
  moduleShape: ModuleShape;
  logoUrl: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface QRScanQuality {
  score: number; // 0 to 100
  label: string; // "Excellent", "Good", "Fair", "Low Contrast"
  color: string; // Tailwind color class
}

export interface QRMetadata {
  type: QRContentType;
  typeLabel: string;
  characterCount: number;
  errorCorrection: ErrorCorrectionLevel;
  scanQuality: QRScanQuality;
  encodingSize: string;
  payload: string;
}

export interface ContentTypeOption {
  id: QRContentType;
  title: string;
  shortDesc: string;
  iconName: string;
}
