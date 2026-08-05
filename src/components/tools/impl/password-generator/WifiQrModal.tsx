"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { generateWifiQrPayload } from "@/lib/password/generator";
import { Button } from "@/components/ui/button";
import { QrCode, X, Download, Wifi, Lock } from "lucide-react";

interface WifiQrModalProps {
  isOpen: boolean;
  password: string;
  onClose: () => void;
}

export const WifiQrModal: React.FC<WifiQrModalProps> = ({
  isOpen,
  password,
  onClose,
}) => {
  const [ssid, setSsid] = useState("MyHomeWiFi");
  const [security, setSecurity] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [hidden, setHidden] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const payload = generateWifiQrPayload(ssid, password, security, hidden);
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: "#18181B", // Zinc 900
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code Error:", err));
  }, [isOpen, ssid, password, security, hidden]);

  if (!isOpen) return null;

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `wifi-qr-${ssid || "network"}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900">Wi-Fi QR Code Export</h3>
            <p className="text-xs text-zinc-500">Scan with mobile camera to connect automatically</p>
          </div>
        </div>

        {/* QR Preview Box */}
        <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Wi-Fi QR Code"
              className="w-48 h-48 rounded-xl shadow-xs border border-zinc-200 bg-white"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-zinc-400 font-mono">
              Generating QR...
            </div>
          )}
        </div>

        {/* Inputs Form */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-800">Network Name (SSID):</label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="e.g. Home_Network"
              className="w-full h-9 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-800">Security Type:</label>
              <select
                value={security}
                onChange={(e) => setSecurity(e.target.value as any)}
                className="w-full h-9 px-2 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-500"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None (Open)</option>
              </select>
            </div>

            <div className="space-y-1 flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer h-9 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700">
                <input
                  type="checkbox"
                  checked={hidden}
                  onChange={(e) => setHidden(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500 accent-orange-500"
                />
                <span>Hidden Network</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-bold">
            Close
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadQr}
            className="text-xs font-bold gap-1.5 shadow-2xs bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
