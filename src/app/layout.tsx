import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalLayout } from "@/components/layout/global-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ToolVerse — Essential Web & Developer Tools Platform",
  description:
    "A clean, privacy-first open tool suite for developers, designers, and creators. 100% client-side execution, zero ads, zero trackers.",
  keywords: [
    "developer tools",
    "JSON formatter",
    "password generator",
    "QR code generator",
    "JWT decoder",
    "image compressor",
    "client-side utilities",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark scroll-smooth`}>
      <body className="bg-[#09090B] text-[#FAFAFA] antialiased min-h-screen">
        <GlobalLayout>{children}</GlobalLayout>
      </body>
    </html>
  );
}
