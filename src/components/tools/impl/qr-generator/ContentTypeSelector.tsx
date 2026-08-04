"use client";

import React from "react";
import { QRContentType, ContentTypeOption } from "@/lib/qr/types";
import {
  Globe,
  Wifi,
  User,
  Mail,
  Type,
  Phone,
  MessageSquare,
  MapPin,
  CreditCard,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

interface ContentTypeSelectorProps {
  selectedType: QRContentType;
  onSelectType: (type: QRContentType) => void;
}

export const CONTENT_TYPE_OPTIONS: ContentTypeOption[] = [
  {
    id: "url",
    title: "URL",
    shortDesc: "Website Link",
    iconName: "Globe",
  },
  {
    id: "wifi",
    title: "WiFi",
    shortDesc: "Network Login",
    iconName: "Wifi",
  },
  {
    id: "contact",
    title: "Contact",
    shortDesc: "vCard Details",
    iconName: "User",
  },
  {
    id: "email",
    title: "Email",
    shortDesc: "Mailto Draft",
    iconName: "Mail",
  },
  {
    id: "text",
    title: "Text",
    shortDesc: "Plain Message",
    iconName: "Type",
  },
  {
    id: "phone",
    title: "Phone",
    shortDesc: "Direct Dial",
    iconName: "Phone",
  },
  {
    id: "sms",
    title: "SMS",
    shortDesc: "Text Message",
    iconName: "MessageSquare",
  },
  {
    id: "location",
    title: "Location",
    shortDesc: "GPS Coordinates",
    iconName: "MapPin",
  },
  {
    id: "upi",
    title: "UPI",
    shortDesc: "Payment VPA",
    iconName: "CreditCard",
  },
  {
    id: "event",
    title: "Event",
    shortDesc: "Calendar Invite",
    iconName: "Calendar",
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-5 h-5" />,
  Wifi: <Wifi className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Type: <Type className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
};

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, type: QRContentType) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectType(type);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
          Content Type <span className="text-orange-500">*</span>
        </label>
        <span className="text-[11px] font-semibold text-zinc-600">
          Select payload type
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="QR Code Content Type Selector"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {CONTENT_TYPE_OPTIONS.map((option) => {
          const isSelected = selectedType === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectType(option.id)}
              onKeyDown={(e) => handleKeyDown(e, option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-center group h-24 select-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
                isSelected
                  ? "bg-gradient-to-b from-orange-500 to-orange-600 text-white border-orange-500 shadow-md shadow-orange-500/25 ring-2 ring-orange-500/30"
                  : "bg-white text-zinc-700 border-zinc-200/90 hover:border-orange-300 hover:bg-orange-50/40 hover:text-orange-600 shadow-2xs"
              }`}
            >
              <div
                className={`mb-1.5 p-2 rounded-xl transition-colors ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-zinc-100 text-zinc-600 group-hover:bg-orange-100 group-hover:text-orange-600"
                }`}
              >
                {ICON_MAP[option.iconName]}
              </div>

              <span className="text-xs font-bold tracking-tight">
                {option.title}
              </span>
              <span
                className={`text-[10px] font-medium leading-none mt-0.5 ${
                  isSelected ? "text-orange-100" : "text-zinc-600"
                }`}
              >
                {option.shortDesc}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
