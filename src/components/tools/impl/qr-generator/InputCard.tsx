"use client";

import React, { useMemo } from "react";
import { QRContentType, QRFormDataMap, ValidationResult } from "@/lib/qr/types";
import { getSampleData } from "@/lib/qr/encoding";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Zap,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Lock,
  Globe,
} from "lucide-react";

interface InputCardProps {
  selectedType: QRContentType;
  formDataMap: QRFormDataMap;
  onChangeFormData: <T extends QRContentType>(
    type: T,
    updater: (prev: QRFormDataMap[T]) => QRFormDataMap[T]
  ) => void;
  validation: ValidationResult;
  onClear: () => void;
}

export const InputCard: React.FC<InputCardProps> = ({
  selectedType,
  formDataMap,
  onChangeFormData,
  validation,
  onClear,
}) => {
  const handleLoadSample = () => {
    const sample = getSampleData(selectedType);
    onChangeFormData(selectedType, () => sample);
  };

  // Helper to handle geographic location acquisition
  const handleAcquireLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChangeFormData("location", (prev) => ({
            ...prev,
            latitude: pos.coords.latitude.toFixed(6),
            longitude: pos.coords.longitude.toFixed(6),
          }));
        },
        () => {
          alert("Unable to acquire your current geolocation.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-5">
      {/* Header with Title & Action Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900 capitalize tracking-tight flex items-center gap-2">
            <span>{selectedType} Details &amp; Payload</span>
          </h3>
          <p className="text-[11px] font-medium text-zinc-600">
            Fill in the fields to generate your instant QR code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoadSample}
            className="text-xs font-bold gap-1.5 text-orange-600 border-orange-200 bg-orange-50/50 hover:bg-orange-100/70 cursor-pointer shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Try Sample</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClear}
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      {/* Validation Message Display */}
      {!validation.isValid && validation.errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{validation.errorMessage}</span>
        </div>
      )}

      {/* Dynamic Form Content */}
      <div className="space-y-4">
        {selectedType === "url" && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              <span>Website URL <span className="text-rose-500">*</span></span>
            </label>
            <Input
              type="url"
              value={formDataMap.url.url}
              onChange={(e) =>
                onChangeFormData("url", (prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="e.g. https://toolverse.app"
              className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
            />
          </div>
        )}

        {selectedType === "wifi" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">
                Network Name (SSID) <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formDataMap.wifi.ssid}
                onChange={(e) =>
                  onChangeFormData("wifi", (prev) => ({ ...prev, ssid: e.target.value }))
                }
                placeholder="e.g. MyHomeWiFi_5G"
                className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Password</label>
              <Input
                type="password"
                value={formDataMap.wifi.password}
                onChange={(e) =>
                  onChangeFormData("wifi", (prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Wi-Fi Password (leave empty for open networks)"
                className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                disabled={formDataMap.wifi.encryption === "nopass"}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Security Encryption</label>
                <div className="flex items-center gap-1.5">
                  {(["WPA", "WEP", "nopass"] as const).map((enc) => (
                    <button
                      key={enc}
                      type="button"
                      onClick={() =>
                        onChangeFormData("wifi", (prev) => ({ ...prev, encryption: enc }))
                      }
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        formDataMap.wifi.encryption === enc
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                          : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {enc === "nopass" ? "Open (None)" : enc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="wifiHidden"
                  checked={formDataMap.wifi.hidden}
                  onChange={(e) =>
                    onChangeFormData("wifi", (prev) => ({ ...prev, hidden: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 cursor-pointer"
                />
                <label htmlFor="wifiHidden" className="text-xs font-semibold text-zinc-700 cursor-pointer select-none">
                  Hidden Network SSID
                </label>
              </div>
            </div>
          </div>
        )}

        {selectedType === "contact" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formDataMap.contact.fullName}
                  onChange={(e) =>
                    onChangeFormData("contact", (prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  placeholder="e.g. Krish Savaliya"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Company</label>
                <Input
                  value={formDataMap.contact.company}
                  onChange={(e) =>
                    onChangeFormData("contact", (prev) => ({ ...prev, company: e.target.value }))
                  }
                  placeholder="e.g. ToolVerse Solutions"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Phone Number</label>
                <Input
                  value={formDataMap.contact.phone}
                  onChange={(e) =>
                    onChangeFormData("contact", (prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="e.g. +1 555 234 5678"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Email Address</label>
                <Input
                  type="email"
                  value={formDataMap.contact.email}
                  onChange={(e) =>
                    onChangeFormData("contact", (prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="e.g. krish@example.com"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Website</label>
                <Input
                  value={formDataMap.contact.website}
                  onChange={(e) =>
                    onChangeFormData("contact", (prev) => ({ ...prev, website: e.target.value }))
                  }
                  placeholder="e.g. toolverse.app"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Address / City</label>
                <Input
                  value={formDataMap.contact.address}
                  onChange={(e) =>
                    onChangeFormData("contact", (prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="e.g. San Francisco, CA"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {selectedType === "email" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">
                Recipient Email (To) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="email"
                value={formDataMap.email.email}
                onChange={(e) =>
                  onChangeFormData("email", (prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="e.g. krish@example.com"
                className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Subject</label>
              <Input
                value={formDataMap.email.subject}
                onChange={(e) =>
                  onChangeFormData("email", (prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="e.g. ToolVerse Inquiry"
                className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Message Body</label>
              <textarea
                value={formDataMap.email.body}
                onChange={(e) =>
                  onChangeFormData("email", (prev) => ({ ...prev, body: e.target.value }))
                }
                placeholder="Type your message content here..."
                rows={3}
                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none"
              />
            </div>
          </div>
        )}

        {selectedType === "text" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700">
                Plain Text Content <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] font-mono text-zinc-500">
                {formDataMap.text.text.length} / 2500 chars
              </span>
            </div>
            <textarea
              value={formDataMap.text.text}
              onChange={(e) =>
                onChangeFormData("text", (prev) => ({ ...prev, text: e.target.value }))
              }
              placeholder="Paste or type any text content to convert into QR code..."
              rows={4}
              maxLength={2500}
              className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none font-mono"
            />
          </div>
        )}

        {selectedType === "phone" && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <Input
              type="tel"
              value={formDataMap.phone.phone}
              onChange={(e) =>
                onChangeFormData("phone", (prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="e.g. +1 555 234 5678"
              className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
            />
          </div>
        )}

        {selectedType === "sms" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">
                Recipient Phone Number <span className="text-rose-500">*</span>
              </label>
              <Input
                type="tel"
                value={formDataMap.sms.phone}
                onChange={(e) =>
                  onChangeFormData("sms", (prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="e.g. +1 555 234 5678"
                className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">SMS Message</label>
              <textarea
                value={formDataMap.sms.message}
                onChange={(e) =>
                  onChangeFormData("sms", (prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Type SMS text message..."
                rows={3}
                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none"
              />
            </div>
          </div>
        )}

        {selectedType === "location" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">
                  Latitude <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formDataMap.location.latitude}
                  onChange={(e) =>
                    onChangeFormData("location", (prev) => ({ ...prev, latitude: e.target.value }))
                  }
                  placeholder="e.g. 37.7749"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">
                  Longitude <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formDataMap.location.longitude}
                  onChange={(e) =>
                    onChangeFormData("location", (prev) => ({ ...prev, longitude: e.target.value }))
                  }
                  placeholder="e.g. -122.4194"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl font-mono"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAcquireLocation}
              className="w-full h-9 text-xs font-bold gap-1.5 border-dashed border-orange-300 text-orange-600 bg-orange-50/40 hover:bg-orange-100/50 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Use My Current Location</span>
            </Button>
          </div>
        )}

        {selectedType === "upi" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">
                UPI ID (VPA) <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formDataMap.upi.upiId}
                onChange={(e) =>
                  onChangeFormData("upi", (prev) => ({ ...prev, upiId: e.target.value }))
                }
                placeholder="e.g. krish@upi or 9876543210@paytm"
                className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Payee Name</label>
                <Input
                  value={formDataMap.upi.payeeName}
                  onChange={(e) =>
                    onChangeFormData("upi", (prev) => ({ ...prev, payeeName: e.target.value }))
                  }
                  placeholder="e.g. Krish Savaliya"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Amount in ₹ (Optional)</label>
                <Input
                  type="number"
                  value={formDataMap.upi.amount}
                  onChange={(e) =>
                    onChangeFormData("upi", (prev) => ({ ...prev, amount: e.target.value }))
                  }
                  placeholder="e.g. 499"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Note / Purpose</label>
              <Input
                value={formDataMap.upi.note}
                onChange={(e) =>
                  onChangeFormData("upi", (prev) => ({ ...prev, note: e.target.value }))
                }
                placeholder="e.g. Service Invoice Payment"
                className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
              />
            </div>
          </div>
        )}

        {selectedType === "event" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">
                Event Title <span className="text-rose-500">*</span>
              </label>
              <Input
                value={formDataMap.event.title}
                onChange={(e) =>
                  onChangeFormData("event", (prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Product Launch Webinar"
                className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">
                  Start Date &amp; Time <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="datetime-local"
                  value={formDataMap.event.startDate}
                  onChange={(e) =>
                    onChangeFormData("event", (prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">End Date &amp; Time</label>
                <Input
                  type="datetime-local"
                  value={formDataMap.event.endDate}
                  onChange={(e) =>
                    onChangeFormData("event", (prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Location</label>
              <Input
                value={formDataMap.event.location}
                onChange={(e) =>
                  onChangeFormData("event", (prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="e.g. Conference Room A or Zoom Link"
                className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Description</label>
              <textarea
                value={formDataMap.event.description}
                onChange={(e) =>
                  onChangeFormData("event", (prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Event agenda and extra details..."
                rows={2}
                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
