import { QRContentType, QRFormDataMap, ValidationResult, QRScanQuality } from "./types";

/**
 * Validates form data according to specific rules for each QR type.
 */
export function validateQRForm<T extends QRContentType>(
  type: T,
  formData: QRFormDataMap[T]
): ValidationResult {
  switch (type) {
    case "url": {
      const data = formData as QRFormDataMap["url"];
      const url = (data.url || "").trim();
      if (!url) {
        return { isValid: false, errorMessage: "Please enter a website URL." };
      }
      // Relaxed URL match (allows www.domain.com or https://domain.com)
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=#]*)?$/i;
      if (!urlPattern.test(url)) {
        return { isValid: false, errorMessage: "Please enter a valid web URL (e.g., https://example.com)." };
      }
      return { isValid: true };
    }

    case "wifi": {
      const data = formData as QRFormDataMap["wifi"];
      if (!(data.ssid || "").trim()) {
        return { isValid: false, errorMessage: "Please enter the Wi-Fi Network Name (SSID)." };
      }
      if (data.encryption !== "nopass" && !(data.password || "").trim()) {
        return { isValid: false, errorMessage: "Password is required for WPA/WEP networks." };
      }
      return { isValid: true };
    }

    case "contact": {
      const data = formData as QRFormDataMap["contact"];
      if (!(data.fullName || "").trim()) {
        return { isValid: false, errorMessage: "Full Name is required for contact vCard." };
      }
      if (data.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        return { isValid: false, errorMessage: "Please enter a valid contact email address." };
      }
      return { isValid: true };
    }

    case "email": {
      const data = formData as QRFormDataMap["email"];
      const email = (data.email || "").trim();
      if (!email) {
        return { isValid: false, errorMessage: "Recipient Email Address is required." };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { isValid: false, errorMessage: "Please enter a valid email address (e.g. user@domain.com)." };
      }
      return { isValid: true };
    }

    case "text": {
      const data = formData as QRFormDataMap["text"];
      if (!(data.text || "").trim()) {
        return { isValid: false, errorMessage: "Please enter some text content." };
      }
      if (data.text.length > 2500) {
        return { isValid: false, errorMessage: "Text exceeds maximum capacity of 2500 characters." };
      }
      return { isValid: true };
    }

    case "phone": {
      const data = formData as QRFormDataMap["phone"];
      const phone = (data.phone || "").trim();
      if (!phone) {
        return { isValid: false, errorMessage: "Phone Number is required." };
      }
      if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{4,16}$/.test(phone)) {
        return { isValid: false, errorMessage: "Please enter a valid phone number with digits and optional + country code." };
      }
      return { isValid: true };
    }

    case "sms": {
      const data = formData as QRFormDataMap["sms"];
      const phone = (data.phone || "").trim();
      if (!phone) {
        return { isValid: false, errorMessage: "Phone Number for SMS recipient is required." };
      }
      if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{4,16}$/.test(phone)) {
        return { isValid: false, errorMessage: "Please enter a valid recipient phone number." };
      }
      return { isValid: true };
    }

    case "location": {
      const data = formData as QRFormDataMap["location"];
      const lat = parseFloat(data.latitude || "");
      const lng = parseFloat(data.longitude || "");
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return { isValid: false, errorMessage: "Latitude must be a valid number between -90 and 90." };
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return { isValid: false, errorMessage: "Longitude must be a valid number between -180 and 180." };
      }
      return { isValid: true };
    }

    case "upi": {
      const data = formData as QRFormDataMap["upi"];
      const upiId = (data.upiId || "").trim();
      if (!upiId) {
        return { isValid: false, errorMessage: "UPI Virtual Payment Address (VPA) is required." };
      }
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        return { isValid: false, errorMessage: "Please enter a valid UPI ID (e.g., name@bank or 9876543210@paytm)." };
      }
      if (data.amount?.trim()) {
        const amt = parseFloat(data.amount.trim());
        if (isNaN(amt) || amt <= 0) {
          return { isValid: false, errorMessage: "Amount must be a positive number if provided." };
        }
      }
      return { isValid: true };
    }

    case "event": {
      const data = formData as QRFormDataMap["event"];
      if (!(data.title || "").trim()) {
        return { isValid: false, errorMessage: "Event Title is required." };
      }
      if (!data.startDate) {
        return { isValid: false, errorMessage: "Event Start Date & Time is required." };
      }
      if (data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
        return { isValid: false, errorMessage: "Event End Date must be after Start Date." };
      }
      return { isValid: true };
    }

    default:
      return { isValid: true };
  }
}

/**
 * Calculates contrast score and scan quality evaluation based on QR foreground and background colors.
 */
export function calculateScanQuality(fgColor: string, bgColor: string, transparentBg: boolean): QRScanQuality {
  if (transparentBg) {
    return {
      score: 95,
      label: "Transparent Canvas",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    };
  }

  const fgLuminance = getLuminance(fgColor);
  const bgLuminance = getLuminance(bgColor);

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);

  if (ratio >= 7) {
    return {
      score: 100,
      label: "Excellent Contrast",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    };
  } else if (ratio >= 4.5) {
    return {
      score: 85,
      label: "Good Contrast",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    };
  } else if (ratio >= 3) {
    return {
      score: 60,
      label: "Fair Contrast",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    };
  } else {
    return {
      score: 30,
      label: "Low Contrast Warning",
      color: "text-rose-600 bg-rose-50 border-rose-200",
    };
  }
}

function getLuminance(hexColor: string): number {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2) || "00", 16) / 255;
  const g = parseInt(hex.substring(2, 4) || "00", 16) / 255;
  const b = parseInt(hex.substring(4, 6) || "00", 16) / 255;

  const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
