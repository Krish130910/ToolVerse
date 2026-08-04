import { QRContentType, QRFormDataMap } from "./types";

/**
 * Encodes form data into standard QR payload string according to specification.
 */
export function generateQRPayload<T extends QRContentType>(
  type: T,
  formData: QRFormDataMap[T]
): string {
  switch (type) {
    case "url": {
      const data = formData as QRFormDataMap["url"];
      let url = (data.url || "").trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      return url;
    }

    case "wifi": {
      const data = formData as QRFormDataMap["wifi"];
      const ssid = escapeWifiString(data.ssid || "");
      const pass = escapeWifiString(data.password || "");
      const enc = data.encryption || "WPA";
      const hidden = data.hidden ? "true" : "false";
      return `WIFI:S:${ssid};T:${enc};P:${pass};H:${hidden};;`;
    }

    case "contact": {
      const data = formData as QRFormDataMap["contact"];
      const nameParts = (data.fullName || "").trim().split(" ");
      const lastName = nameParts.length > 1 ? nameParts.pop() : "";
      const firstName = nameParts.join(" ");

      const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${(data.fullName || "").trim()}`,
        `N:${lastName};${firstName};;;`,
      ];

      if (data.company?.trim()) vcard.push(`ORG:${data.company.trim()}`);
      if (data.phone?.trim()) vcard.push(`TEL;TYPE=CELL:${data.phone.trim()}`);
      if (data.email?.trim()) vcard.push(`EMAIL;TYPE=INTERNET:${data.email.trim()}`);
      if (data.website?.trim()) {
        let site = data.website.trim();
        if (!/^https?:\/\//i.test(site)) site = `https://${site}`;
        vcard.push(`URL:${site}`);
      }
      if (data.address?.trim()) vcard.push(`ADR:;;${data.address.trim()};;;;`);

      vcard.push("END:VCARD");
      return vcard.join("\n");
    }

    case "email": {
      const data = formData as QRFormDataMap["email"];
      const mailto = (data.email || "").trim();
      const params: string[] = [];
      if (data.subject?.trim()) params.push(`subject=${encodeURIComponent(data.subject.trim())}`);
      if (data.body?.trim()) params.push(`body=${encodeURIComponent(data.body.trim())}`);

      return params.length > 0 ? `mailto:${mailto}?${params.join("&")}` : `mailto:${mailto}`;
    }

    case "text": {
      const data = formData as QRFormDataMap["text"];
      return data.text || "";
    }

    case "phone": {
      const data = formData as QRFormDataMap["phone"];
      const phone = (data.phone || "").trim().replace(/[^\d+]/g, "");
      return `tel:${phone}`;
    }

    case "sms": {
      const data = formData as QRFormDataMap["sms"];
      const phone = (data.phone || "").trim().replace(/[^\d+]/g, "");
      const msg = data.message?.trim();
      return msg ? `smsto:${phone}:${msg}` : `smsto:${phone}`;
    }

    case "location": {
      const data = formData as QRFormDataMap["location"];
      const lat = (data.latitude || "").trim();
      const lng = (data.longitude || "").trim();
      return `geo:${lat},${lng}`;
    }

    case "upi": {
      const data = formData as QRFormDataMap["upi"];
      const pa = (data.upiId || "").trim();
      const pn = (data.payeeName || "").trim();
      const am = (data.amount || "").trim();
      const tn = (data.note || "").trim();

      const params: string[] = [`pa=${pa}`];
      if (pn) params.push(`pn=${encodeURIComponent(pn)}`);
      if (am) params.push(`am=${encodeURIComponent(am)}`);
      if (tn) params.push(`tn=${encodeURIComponent(tn)}`);
      params.push("cu=INR");

      return `upi://pay?${params.join("&")}`;
    }

    case "event": {
      const data = formData as QRFormDataMap["event"];
      const startIso = formatICalDate(data.startDate);
      const endIso = formatICalDate(data.endDate || data.startDate);

      const ical = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${(data.title || "").trim()}`,
      ];

      if (startIso) ical.push(`DTSTART:${startIso}`);
      if (endIso) ical.push(`DTEND:${endIso}`);
      if (data.location?.trim()) ical.push(`LOCATION:${data.location.trim()}`);
      if (data.description?.trim()) ical.push(`DESCRIPTION:${data.description.trim()}`);

      ical.push("END:VEVENT", "END:VCALENDAR");
      return ical.join("\n");
    }

    default:
      return "";
  }
}

/**
 * Provides realistic sample data for quick user testing.
 */
export function getSampleData<T extends QRContentType>(type: T): QRFormDataMap[T] {
  switch (type) {
    case "url":
      return { url: "https://toolverse.app" } as QRFormDataMap[T];
    case "wifi":
      return {
        ssid: "ToolVerse_Guest_WiFi",
        password: "FastSecurity2026",
        encryption: "WPA",
        hidden: false,
      } as QRFormDataMap[T];
    case "contact":
      return {
        fullName: "Krish Savaliya",
        company: "ToolVerse Engineering",
        phone: "+1 (555) 234-5678",
        email: "krish@example.com",
        website: "toolverse.app",
        address: "San Francisco, CA",
      } as QRFormDataMap[T];
    case "email":
      return {
        email: "krish@example.com",
        subject: "ToolVerse Inquiry & Feedback",
        body: "Hello Krish,\n\nI was testing the QR Code Generator tool on ToolVerse...",
      } as QRFormDataMap[T];
    case "text":
      return {
        text: "Welcome to ToolVerse - Modern, privacy-first client-side developer utility suite!",
      } as QRFormDataMap[T];
    case "phone":
      return { phone: "+15552345678" } as QRFormDataMap[T];
    case "sms":
      return {
        phone: "+15552345678",
        message: "Hi! I am using the QR Code Generator from ToolVerse.",
      } as QRFormDataMap[T];
    case "location":
      return {
        latitude: "37.7749",
        longitude: "-122.4194",
      } as QRFormDataMap[T];
    case "upi":
      return {
        upiId: "krish@upi",
        payeeName: "Krish Savaliya",
        amount: "499",
        note: "ToolVerse Pro Subscription",
      } as QRFormDataMap[T];
    case "event": {
      const now = new Date();
      const startStr = new Date(now.getTime() + 86400000).toISOString().slice(0, 16);
      const endStr = new Date(now.getTime() + 90000000).toISOString().slice(0, 16);
      return {
        title: "ToolVerse v2.0 Product Launch Event",
        startDate: startStr,
        endDate: endStr,
        location: "Virtual Stage / Online",
        description: "Join us for the live demonstration of 25+ browser utilities.",
      } as QRFormDataMap[T];
    }
  }
}

function escapeWifiString(str: string): string {
  return str.replace(/([\\;:,"])/g, "\\$1");
}

function formatICalDate(dateTimeStr: string): string {
  if (!dateTimeStr) return "";
  try {
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  } catch {
    return "";
  }
}
