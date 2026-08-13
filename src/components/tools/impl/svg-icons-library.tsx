"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Copy,
  Check,
  Download,
  Star,
  Grid,
  List,
  Code,
  // Arrows
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft,
  RefreshCw,
  Repeat,
  RotateCw,
  RotateCcw,
  Move,
  CornerDownRight,
  CornerUpRight,
  ArrowRightLeft,
  Compass,
  Navigation,
  // Navigation
  Home,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  MapPin,
  Map,
  Globe,
  Anchor,
  Route,
  Navigation2,
  Locate,
  LocateFixed,
  Waypoints,
  Signpost,
  // UI
  Zap,
  Heart,
  QrCode,
  Filter,
  Sliders,
  Settings,
  Eye,
  EyeOff,
  Sun,
  Moon,
  MousePointer,
  Plus,
  Minus,
  MoreHorizontal,
  MoreVertical,
  LayoutGrid,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Crosshair,
  Layers,
  // Development
  Code2,
  Terminal,
  Binary,
  Braces,
  Database,
  Cpu,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Bug,
  FolderCode,
  FileCode,
  Server,
  HardDrive,
  Webhook,
  Boxes,
  FileJson,
  // Technology
  Smartphone,
  Tablet,
  Monitor,
  Laptop,
  Tv,
  Radio,
  Headphones,
  Mic,
  Wifi,
  Bluetooth,
  BatteryCharging,
  Battery,
  Power,
  Plug,
  Signal,
  Router,
  Usb,
  // Files
  FileText,
  FileSpreadsheet,
  FileImage,
  FilePlus,
  FileMinus,
  FileCheck,
  FileX,
  Folder,
  FolderPlus,
  FolderMinus,
  Archive,
  FileArchive,
  Save,
  File,
  Files,
  Clipboard,
  Paperclip,
  // Media
  Film,
  Video,
  Music,
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
  Camera,
  Image as ImageIcon,
  ImagePlus,
  Disc,
  Cast,
  // Communication
  Mail,
  Phone,
  PhoneCall,
  PhoneOff,
  MessageSquare,
  Send,
  Bell,
  BellOff,
  AtSign,
  MessageCircle,
  Share2,
  Share,
  Inbox,
  MessageSquarePlus,
  Voicemail,
  Megaphone,
  // Social
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Bookmark,
  Award,
  Crown,
  Trophy,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Sparkles,
  // Security
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  Unlock,
  Fingerprint,
  Shield,
  Key,
  ScanFace,
  ShieldX,
  LockKeyhole,
  // Business
  CreditCard,
  ShoppingCart,
  ShoppingBag,
  DollarSign,
  Wallet,
  Banknote,
  Tag,
  Percent,
  TrendingUp,
  TrendingDown,
  Receipt,
  Coins,
  Package,
  Truck,
  Gift,
  Briefcase,
  Building,
  Store,
  BarChart3,
  PieChart,
  // Weather
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Umbrella,
  Thermometer,
  Snowflake,
  Droplets,
  Sunrise,
  Sunset,
  // Shapes
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Box,
  // Miscellaneous
  HelpCircle,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Calendar,
  Upload,
  Wand2,
  Flame,
  Target,
  Lightbulb,
  Puzzle,
} from "lucide-react";

// Brand Icon React Components
const createBrandIcon = (svgContent: string) => {
  const BrandComp: React.FC<{ size?: number; color?: string; strokeWidth?: number }> = ({
    size = 24,
    color = "currentColor",
    strokeWidth = 2,
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
  return BrandComp;
};

const GithubIcon = createBrandIcon(`<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>`);
const TwitterIcon = createBrandIcon(`<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>`);
const FacebookIcon = createBrandIcon(`<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`);
const InstagramIcon = createBrandIcon(`<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>`);
const LinkedinIcon = createBrandIcon(`<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>`);
const YoutubeIcon = createBrandIcon(`<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/>`);
const ChromeIcon = createBrandIcon(`<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/>`);
const FigmaIcon = createBrandIcon(`<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/>`);
const SlackIcon = createBrandIcon(`<rect width="3" height="8" x="13" y="2" rx="1.5"/><path d="M19 8.5V10h1.5a1.5 1.5 0 1 0 0-3H19v1.5z"/><rect width="3" height="8" x="8" y="14" rx="1.5"/><path d="M5 15.5V14H3.5a1.5 1.5 0 1 0 0 3H5v-1.5z"/><rect width="8" height="3" x="14" y="13" rx="1.5"/><path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 3 0V19h-1.5z"/><rect width="8" height="3" x="2" y="8" rx="1.5"/><path d="M8.5 5H10V3.5a1.5 1.5 0 1 0-3 0V5h1.5z"/>`);
const DribbbleIcon = createBrandIcon(`<circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/>`);
const GitlabIcon = createBrandIcon(`<path d="m22 13.29-1.42-4.37a.8.8 0 0 0-.25-.38.8.8 0 0 0-.44-.13.8.8 0 0 0-.43.12.8.8 0 0 0-.27.37l-2.06 6.35H8.88L6.82 8.9a.8.8 0 0 0-.27-.37.8.8 0 0 0-.43-.12.8.8 0 0 0-.44.13.8.8 0 0 0-.25.38L4 13.29a1 1 0 0 0 .36 1.13l7.19 5.37a1 1 0 0 0 1.1 0l7.19-5.37a1 1 0 0 0 .36-1.13Z"/>`);

export type IconCategory =
  | "Arrows"
  | "Navigation"
  | "UI"
  | "Development"
  | "Technology"
  | "Files"
  | "Media"
  | "Communication"
  | "Social"
  | "Security"
  | "Business"
  | "Weather"
  | "Brands"
  | "Shapes"
  | "Miscellaneous";

export interface IconDef {
  id: string;
  name: string;
  category: IconCategory;
  tags: string[];
  svgContent: string;
  IconComponent: React.ComponentType<any>;
}

const COLOR_PRESETS = [
  { label: "Orange", value: "#F97316" },
  { label: "Emerald", value: "#10B981" },
  { label: "Blue", value: "#3B82F6" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Rose", value: "#F43F5E" },
  { label: "Dark", value: "#18181B" },
];

export const ICONS_COLLECTION: IconDef[] = [
  // --- ARROWS ---
  { id: "arrow-up", name: "ArrowUp", category: "Arrows", tags: ["arrow", "up", "top", "direction"], svgContent: `<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>`, IconComponent: ArrowUp },
  { id: "arrow-down", name: "ArrowDown", category: "Arrows", tags: ["arrow", "down", "bottom", "direction"], svgContent: `<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>`, IconComponent: ArrowDown },
  { id: "arrow-left", name: "ArrowLeft", category: "Arrows", tags: ["arrow", "left", "back", "previous"], svgContent: `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`, IconComponent: ArrowLeft },
  { id: "arrow-right", name: "ArrowRight", category: "Arrows", tags: ["arrow", "right", "next", "forward"], svgContent: `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`, IconComponent: ArrowRight },
  { id: "arrow-up-right", name: "ArrowUpRight", category: "Arrows", tags: ["arrow", "up", "right", "external", "link"], svgContent: `<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>`, IconComponent: ArrowUpRight },
  { id: "arrow-up-left", name: "ArrowUpLeft", category: "Arrows", tags: ["arrow", "up", "left"], svgContent: `<line x1="17" y1="17" x2="7" y2="7"/><polyline points="7 17 7 7 17 7"/>`, IconComponent: ArrowUpLeft },
  { id: "arrow-down-right", name: "ArrowDownRight", category: "Arrows", tags: ["arrow", "down", "right"], svgContent: `<line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/>`, IconComponent: ArrowDownRight },
  { id: "arrow-down-left", name: "ArrowDownLeft", category: "Arrows", tags: ["arrow", "down", "left"], svgContent: `<line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/>`, IconComponent: ArrowDownLeft },
  { id: "refresh-cw", name: "RefreshCw", category: "Arrows", tags: ["refresh", "rotate", "reload", "loop"], svgContent: `<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>`, IconComponent: RefreshCw },
  { id: "repeat", name: "Repeat", category: "Arrows", tags: ["repeat", "loop", "cycle"], svgContent: `<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>`, IconComponent: Repeat },
  { id: "rotate-cw", name: "RotateCw", category: "Arrows", tags: ["rotate", "clockwise", "redo"], svgContent: `<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>`, IconComponent: RotateCw },
  { id: "rotate-ccw", name: "RotateCcw", category: "Arrows", tags: ["rotate", "counterclockwise", "undo"], svgContent: `<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>`, IconComponent: RotateCcw },
  { id: "move", name: "Move", category: "Arrows", tags: ["move", "drag", "pan", "arrows"], svgContent: `<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>`, IconComponent: Move },
  { id: "corner-down-right", name: "CornerDownRight", category: "Arrows", tags: ["corner", "down", "right"], svgContent: `<polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/>`, IconComponent: CornerDownRight },
  { id: "corner-up-right", name: "CornerUpRight", category: "Arrows", tags: ["corner", "up", "right"], svgContent: `<polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>`, IconComponent: CornerUpRight },
  { id: "arrow-right-left", name: "ArrowRightLeft", category: "Arrows", tags: ["swap", "switch", "transfer"], svgContent: `<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>`, IconComponent: ArrowRightLeft },
  { id: "compass", name: "Compass", category: "Arrows", tags: ["compass", "direction", "location"], svgContent: `<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>`, IconComponent: Compass },
  { id: "navigation", name: "Navigation", category: "Arrows", tags: ["navigation", "gps", "pointer"], svgContent: `<polygon points="3 11 22 2 13 21 11 13 3 11"/>`, IconComponent: Navigation },

  // --- NAVIGATION ---
  { id: "home", name: "Home", category: "Navigation", tags: ["home", "house", "main", "dashboard"], svgContent: `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`, IconComponent: Home },
  { id: "menu", name: "Menu", category: "Navigation", tags: ["menu", "hamburger", "bars"], svgContent: `<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>`, IconComponent: Menu },
  { id: "x", name: "X", category: "Navigation", tags: ["close", "cancel", "x", "dismiss"], svgContent: `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`, IconComponent: X },
  { id: "chevron-right", name: "ChevronRight", category: "Navigation", tags: ["chevron", "right", "next"], svgContent: `<path d="m9 18 6-6-6-6"/>`, IconComponent: ChevronRight },
  { id: "chevron-left", name: "ChevronLeft", category: "Navigation", tags: ["chevron", "left", "previous"], svgContent: `<path d="m15 18-6-6 6-6"/>`, IconComponent: ChevronLeft },
  { id: "chevron-up", name: "ChevronUp", category: "Navigation", tags: ["chevron", "up", "top"], svgContent: `<path d="m18 15-6-6-6 6"/>`, IconComponent: ChevronUp },
  { id: "chevron-down", name: "ChevronDown", category: "Navigation", tags: ["chevron", "down", "dropdown"], svgContent: `<path d="m6 9 6 6 6-6"/>`, IconComponent: ChevronDown },
  { id: "external-link", name: "ExternalLink", category: "Navigation", tags: ["external", "link", "new tab"], svgContent: `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`, IconComponent: ExternalLink },
  { id: "map-pin", name: "MapPin", category: "Navigation", tags: ["pin", "location", "map", "marker"], svgContent: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`, IconComponent: MapPin },
  { id: "map", name: "Map", category: "Navigation", tags: ["map", "location", "travel", "gps"], svgContent: `<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>`, IconComponent: Map },
  { id: "globe", name: "Globe", category: "Navigation", tags: ["globe", "web", "internet", "world"], svgContent: `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`, IconComponent: Globe },
  { id: "anchor", name: "Anchor", category: "Navigation", tags: ["anchor", "sea", "boat", "ship"], svgContent: `<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>`, IconComponent: Anchor },
  { id: "route", name: "Route", category: "Navigation", tags: ["route", "path", "directions", "road"], svgContent: `<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>`, IconComponent: Route },
  { id: "navigation-2", name: "Navigation2", category: "Navigation", tags: ["gps", "arrow", "direction"], svgContent: `<polygon points="12 2 19 21 12 17 5 21 12 2"/>`, IconComponent: Navigation2 },
  { id: "locate", name: "Locate", category: "Navigation", tags: ["locate", "gps", "find", "center"], svgContent: `<line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><circle cx="12" cy="12" r="7"/>`, IconComponent: Locate },
  { id: "locate-fixed", name: "LocateFixed", category: "Navigation", tags: ["target", "location", "gps", "fixed"], svgContent: `<line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/>`, IconComponent: LocateFixed },
  { id: "waypoints", name: "Waypoints", category: "Navigation", tags: ["waypoints", "nodes", "points", "route"], svgContent: `<circle cx="12" cy="4.5" r="2.5"/><path d="m10.2 6.3-3.9 3.9"/><circle cx="4.5" cy="12" r="2.5"/><path d="M7 12h10"/><circle cx="19.5" cy="12" r="2.5"/><path d="m13.8 17.7 3.9-3.9"/><circle cx="12" cy="19.5" r="2.5"/>`, IconComponent: Waypoints },
  { id: "signpost", name: "Signpost", category: "Navigation", tags: ["sign", "signpost", "guide", "info"], svgContent: `<path d="M12 3v3"/><path d="M18.5 6H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h13.5l3.5-3z"/><path d="M12 14v7"/><path d="M5.5 14H19a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5.5L2 17z"/>`, IconComponent: Signpost },

  // --- UI ---
  { id: "zap", name: "Zap", category: "UI", tags: ["fast", "zap", "lightning", "energy"], svgContent: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`, IconComponent: Zap },
  { id: "heart", name: "Heart", category: "UI", tags: ["heart", "like", "favorite", "love"], svgContent: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`, IconComponent: Heart },
  { id: "qrcode", name: "QrCode", category: "UI", tags: ["qr", "barcode", "scan"], svgContent: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`, IconComponent: QrCode },
  { id: "search", name: "Search", category: "UI", tags: ["search", "find", "lookup", "magnifier"], svgContent: `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`, IconComponent: Search },
  { id: "filter", name: "Filter", category: "UI", tags: ["filter", "funnel", "sort"], svgContent: `<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>`, IconComponent: Filter },
  { id: "sliders", name: "Sliders", category: "UI", tags: ["sliders", "controls", "settings", "adjust"], svgContent: `<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>`, IconComponent: Sliders },
  { id: "settings", name: "Settings", category: "UI", tags: ["settings", "cog", "gear", "options"], svgContent: `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`, IconComponent: Settings },
  { id: "eye", name: "Eye", category: "UI", tags: ["eye", "view", "preview", "visible"], svgContent: `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`, IconComponent: Eye },
  { id: "eye-off", name: "EyeOff", category: "UI", tags: ["eye", "hidden", "password", "hide"], svgContent: `<path d="9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>`, IconComponent: EyeOff },
  { id: "sun", name: "Sun", category: "UI", tags: ["sun", "light", "day", "mode"], svgContent: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`, IconComponent: Sun },
  { id: "moon", name: "Moon", category: "UI", tags: ["moon", "dark", "night", "mode"], svgContent: `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`, IconComponent: Moon },
  { id: "mouse-pointer", name: "MousePointer", category: "UI", tags: ["mouse", "cursor", "pointer"], svgContent: `<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/>`, IconComponent: MousePointer },
  { id: "plus", name: "Plus", category: "UI", tags: ["add", "plus", "new", "create"], svgContent: `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`, IconComponent: Plus },
  { id: "minus", name: "Minus", category: "UI", tags: ["minus", "remove", "subtract"], svgContent: `<line x1="5" y1="12" x2="19" y2="12"/>`, IconComponent: Minus },
  { id: "more-horizontal", name: "MoreHorizontal", category: "UI", tags: ["dots", "more", "options"], svgContent: `<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>`, IconComponent: MoreHorizontal },
  { id: "more-vertical", name: "MoreVertical", category: "UI", tags: ["dots", "more", "options", "vertical"], svgContent: `<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>`, IconComponent: MoreVertical },
  { id: "layout-grid", name: "LayoutGrid", category: "UI", tags: ["grid", "layout", "cards"], svgContent: `<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>`, IconComponent: LayoutGrid },
  { id: "maximize2", name: "Maximize2", category: "UI", tags: ["expand", "fullscreen"], svgContent: `<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>`, IconComponent: Maximize2 },
  { id: "minimize2", name: "Minimize2", category: "UI", tags: ["exit", "fullscreen", "minimize"], svgContent: `<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/>`, IconComponent: Minimize2 },
  { id: "sliders-horizontal", name: "SlidersHorizontal", category: "UI", tags: ["tune", "sliders", "filter"], svgContent: `<line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/><line x1="21" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="3" y2="12"/><line x1="21" y1="20" x2="16" y2="20"/><line x1="12" y1="20" x2="3" y2="20"/><line x1="14" y1="2" x2="14" y2="6"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="16" y1="18" x2="16" y2="22"/>`, IconComponent: SlidersHorizontal },
  { id: "toggle-left", name: "ToggleLeft", category: "UI", tags: ["switch", "off", "toggle"], svgContent: `<rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="8" cy="12" r="2"/>`, IconComponent: ToggleLeft },
  { id: "toggle-right", name: "ToggleRight", category: "UI", tags: ["switch", "on", "toggle"], svgContent: `<rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/>`, IconComponent: ToggleRight },
  { id: "crosshair", name: "Crosshair", category: "UI", tags: ["target", "crosshair", "aim", "center"], svgContent: `<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>`, IconComponent: Crosshair },
  { id: "layers", name: "Layers", category: "UI", tags: ["layers", "stack", "group"], svgContent: `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`, IconComponent: Layers },

  // --- DEVELOPMENT ---
  { id: "code2", name: "Code2", category: "Development", tags: ["code", "developer", "brackets"], svgContent: `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`, IconComponent: Code2 },
  { id: "terminal", name: "Terminal", category: "Development", tags: ["terminal", "cli", "shell"], svgContent: `<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>`, IconComponent: Terminal },
  { id: "binary", name: "Binary", category: "Development", tags: ["binary", "bytes", "code"], svgContent: `<rect x="14" y="4" width="4" height="6" rx="2"/><rect x="6" y="14" width="4" height="6" rx="2"/><path d="M6 4h4v6H6z"/><path d="M14 14h4v6h-4z"/>`, IconComponent: Binary },
  { id: "braces", name: "Braces", category: "Development", tags: ["braces", "json", "object"], svgContent: `<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>`, IconComponent: Braces },
  { id: "database", name: "Database", category: "Development", tags: ["database", "sql", "storage"], svgContent: `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>`, IconComponent: Database },
  { id: "cpu", name: "Cpu", category: "Development", tags: ["cpu", "chip", "hardware"], svgContent: `<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>`, IconComponent: Cpu },
  { id: "git-branch", name: "GitBranch", category: "Development", tags: ["git", "branch", "vcs"], svgContent: `<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>`, IconComponent: GitBranch },
  { id: "git-commit", name: "GitCommit", category: "Development", tags: ["git", "commit", "version"], svgContent: `<circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="22.95" y2="12"/>`, IconComponent: GitCommit },
  { id: "git-merge", name: "GitMerge", category: "Development", tags: ["git", "merge", "pull"], svgContent: `<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 9v12"/><path d="M6 9a9 9 0 0 0 9 9"/>`, IconComponent: GitMerge },
  { id: "git-pull-request", name: "GitPullRequest", category: "Development", tags: ["git", "pr", "pull request"], svgContent: `<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>`, IconComponent: GitPullRequest },
  { id: "bug", name: "Bug", category: "Development", tags: ["bug", "debug", "issue"], svgContent: `<rect width="8" height="14" x="8" y="6" rx="4"/><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/><path d="m10 4 1-2"/><path d="m14 4-1-2"/>`, IconComponent: Bug },
  { id: "folder-code", name: "FolderCode", category: "Development", tags: ["folder", "code", "files"], svgContent: `<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><polyline points="10 11 8 13 10 15"/><polyline points="14 11 16 13 14 15"/>`, IconComponent: FolderCode },
  { id: "file-code", name: "FileCode", category: "Development", tags: ["file", "code", "source"], svgContent: `<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 13 8 15 10 17"/><polyline points="14 13 16 15 14 17"/>`, IconComponent: FileCode },
  { id: "server", name: "Server", category: "Development", tags: ["server", "host", "backend"], svgContent: `<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>`, IconComponent: Server },
  { id: "hard-drive", name: "HardDrive", category: "Development", tags: ["disk", "storage", "ssd"], svgContent: `<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>`, IconComponent: HardDrive },
  { id: "webhook", name: "Webhook", category: "Development", tags: ["webhook", "api", "event"], svgContent: `<path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.22-.97-2.75a4 4 0 0 1 3.52-6.42c.7 0 1.4.2 2 .57"/><path d="m12 6 5.8 3.14c.96.53 1.38 1.74.85 2.7a4 4 0 0 1 .58 7.37"/>`, IconComponent: Webhook },
  { id: "boxes", name: "Boxes", category: "Development", tags: ["boxes", "containers", "modules"], svgContent: `<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 4.74-2.85"/><path d="M7 16.5v5.17"/><path d="M14.97 2.92A2 2 0 0 0 14 4.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71V4.63a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0z"/><path d="m19 6.5-4.74-2.85"/><path d="m19 6.5 4.74-2.85"/><path d="M19 6.5v5.17"/><path d="M14.97 12.92A2 2 0 0 0 14 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0z"/><path d="m19 16.5-4.74-2.85"/><path d="m19 16.5 4.74-2.85"/><path d="M19 16.5v5.17"/>`, IconComponent: Boxes },
  { id: "file-json", name: "FileJson", category: "Development", tags: ["file", "json", "data"], svgContent: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 12a1 1 0 0 1 1 1v1a1 1 0 0 0 1 1 1 1 0 0 0-1 1v1a1 1 0 0 1-1 1"/>`, IconComponent: FileJson },

  // --- TECHNOLOGY ---
  { id: "smartphone", name: "Smartphone", category: "Technology", tags: ["mobile", "phone", "device"], svgContent: `<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>`, IconComponent: Smartphone },
  { id: "tablet", name: "Tablet", category: "Technology", tags: ["ipad", "tablet", "device"], svgContent: `<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>`, IconComponent: Tablet },
  { id: "monitor", name: "Monitor", category: "Technology", tags: ["screen", "desktop", "display"], svgContent: `<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>`, IconComponent: Monitor },
  { id: "laptop", name: "Laptop", category: "Technology", tags: ["computer", "laptop", "pc"], svgContent: `<path d="M20 16V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11m16 0s1 0 1 2-.5 2-2.5 2h-15c-2 0-2.5 0-2.5-2s1-2 1-2m16 0H4"/>`, IconComponent: Laptop },
  { id: "tv", name: "Tv", category: "Technology", tags: ["tv", "television", "screen"], svgContent: `<rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>`, IconComponent: Tv },
  { id: "radio", name: "Radio", category: "Technology", tags: ["radio", "fm", "audio", "antenna"], svgContent: `<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9c3.9 3.9 3.9 10.3 0 14.2"/>`, IconComponent: Radio },
  { id: "headphones", name: "Headphones", category: "Technology", tags: ["audio", "headset", "music"], svgContent: `<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>`, IconComponent: Headphones },
  { id: "mic", name: "Mic", category: "Technology", tags: ["mic", "microphone", "audio", "record"], svgContent: `<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>`, IconComponent: Mic },
  { id: "wifi", name: "Wifi", category: "Technology", tags: ["wifi", "network", "signal"], svgContent: `<path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>`, IconComponent: Wifi },
  { id: "bluetooth", name: "Bluetooth", category: "Technology", tags: ["bluetooth", "wireless"], svgContent: `<path d="m7 7 10 10-5 5V2l5 5L7 17"/>`, IconComponent: Bluetooth },
  { id: "battery-charging", name: "BatteryCharging", category: "Technology", tags: ["battery", "power", "charge"], svgContent: `<path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/><path d="m11 7-3 5h4l-3 5"/><line x1="22" x2="22" y1="11" y2="13"/>`, IconComponent: BatteryCharging },
  { id: "battery", name: "Battery", category: "Technology", tags: ["battery", "energy", "power"], svgContent: `<rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/>`, IconComponent: Battery },
  { id: "power", name: "Power", category: "Technology", tags: ["power", "on", "off", "turn"], svgContent: `<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77 0"/>`, IconComponent: Power },
  { id: "plug", name: "Plug", category: "Technology", tags: ["plug", "power", "electricity"], svgContent: `<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>`, IconComponent: Plug },
  { id: "signal", name: "Signal", category: "Technology", tags: ["signal", "network", "cellular"], svgContent: `<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 20V4"/>`, IconComponent: Signal },
  { id: "router", name: "Router", category: "Technology", tags: ["router", "modem", "wifi"], svgContent: `<rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6.01 18H6"/><path d="M10.01 18H10"/><path d="M15 10v4"/><path d="M17.84 7.17a6 6 0 0 0-8.68 0"/><path d="M20.66 4.34a10 10 0 0 0-14.32 0"/>`, IconComponent: Router },
  { id: "usb", name: "Usb", category: "Technology", tags: ["usb", "port", "cable"], svgContent: `<circle cx="10" cy="7" r="1"/><circle cx="4" cy="20" r="1"/><path d="M4.7 19.3 19 5"/><path d="m21 3-3 1 2 2Z"/><path d="M9.26 7.68 5 12v2"/><path d="m10 14 5 2 3.5-3.5"/>`, IconComponent: Usb },

  // --- FILES ---
  { id: "file-text", name: "FileText", category: "Files", tags: ["file", "document", "notes"], svgContent: `<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`, IconComponent: FileText },
  { id: "file-spreadsheet", name: "FileSpreadsheet", category: "Files", tags: ["excel", "csv", "table"], svgContent: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M12 9v10"/>`, IconComponent: FileSpreadsheet },
  { id: "file-image", name: "FileImage", category: "Files", tags: ["file", "image", "picture"], svgContent: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="12" r="1"/><path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"/>`, IconComponent: FileImage },
  { id: "file-plus", name: "FilePlus", category: "Files", tags: ["file", "new", "add"], svgContent: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M12 12v6"/>`, IconComponent: FilePlus },
  { id: "file-minus", name: "FileMinus", category: "Files", tags: ["file", "remove", "subtract"], svgContent: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/>`, IconComponent: FileMinus },
  { id: "file-check", name: "FileCheck", category: "Files", tags: ["file", "done", "valid"], svgContent: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>`, IconComponent: FileCheck },
  { id: "file-x", name: "FileX", category: "Files", tags: ["file", "delete", "error"], svgContent: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m14.5 12.5-5 5"/><path d="m9.5 12.5 5 5"/>`, IconComponent: FileX },
  { id: "folder", name: "Folder", category: "Files", tags: ["folder", "directory"], svgContent: `<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>`, IconComponent: Folder },
  { id: "folder-plus", name: "FolderPlus", category: "Files", tags: ["folder", "new", "create"], svgContent: `<path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2z"/>`, IconComponent: FolderPlus },
  { id: "folder-minus", name: "FolderMinus", category: "Files", tags: ["folder", "remove"], svgContent: `<path d="M9 13h6"/><path d="M20 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2z"/>`, IconComponent: FolderMinus },
  { id: "archive", name: "Archive", category: "Files", tags: ["zip", "box", "archive", "storage"], svgContent: `<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>`, IconComponent: Archive },
  { id: "file-archive", name: "FileArchive", category: "Files", tags: ["zip", "rar", "file", "compress"], svgContent: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><circle cx="10" cy="12" r="1"/><path d="M10 15v3"/>`, IconComponent: FileArchive },
  { id: "save", name: "Save", category: "Files", tags: ["save", "disk", "floppy"], svgContent: `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>`, IconComponent: Save },
  { id: "file", name: "File", category: "Files", tags: ["file", "document", "page"], svgContent: `<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>`, IconComponent: File },
  { id: "files", name: "Files", category: "Files", tags: ["files", "documents", "batch"], svgContent: `<path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 12v8a2 2 0 0 0 2 2h10"/>`, IconComponent: Files },
  { id: "clipboard", name: "Clipboard", category: "Files", tags: ["copy", "clipboard", "paste"], svgContent: `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>`, IconComponent: Clipboard },
  { id: "paperclip", name: "Paperclip", category: "Files", tags: ["attachment", "paperclip", "file"], svgContent: `<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>`, IconComponent: Paperclip },

  // --- MEDIA ---
  { id: "film", name: "Film", category: "Media", tags: ["film", "movie", "video"], svgContent: `<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M17 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>`, IconComponent: Film },
  { id: "video", name: "Video", category: "Media", tags: ["video", "camera", "stream"], svgContent: `<polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>`, IconComponent: Video },
  { id: "music", name: "Music", category: "Media", tags: ["music", "audio", "song"], svgContent: `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`, IconComponent: Music },
  { id: "volume-2", name: "Volume2", category: "Media", tags: ["sound", "volume", "loud"], svgContent: `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`, IconComponent: Volume2 },
  { id: "volume-1", name: "Volume1", category: "Media", tags: ["sound", "audio", "medium"], svgContent: `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`, IconComponent: Volume1 },
  { id: "volume-x", name: "VolumeX", category: "Media", tags: ["mute", "silent", "sound off"], svgContent: `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>`, IconComponent: VolumeX },
  { id: "play", name: "Play", category: "Media", tags: ["play", "start", "media"], svgContent: `<polygon points="5 3 19 12 5 21 5 3"/>`, IconComponent: Play },
  { id: "pause", name: "Pause", category: "Media", tags: ["pause", "stop", "hold"], svgContent: `<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>`, IconComponent: Pause },
  { id: "camera", name: "Camera", category: "Media", tags: ["camera", "photo", "snapshot"], svgContent: `<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>`, IconComponent: Camera },
  { id: "image", name: "Image", category: "Media", tags: ["picture", "photo", "asset"], svgContent: `<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>`, IconComponent: ImageIcon },
  { id: "image-plus", name: "ImagePlus", category: "Media", tags: ["image", "add", "upload"], svgContent: `<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" y1="5" x2="22" y2="5"/><line x1="19" y1="2" x2="19" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>`, IconComponent: ImagePlus },
  { id: "disc", name: "Disc", category: "Media", tags: ["cd", "dvd", "disc", "record"], svgContent: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>`, IconComponent: Disc },
  { id: "cast", name: "Cast", category: "Media", tags: ["cast", "stream", "chromecast"], svgContent: `<path d="M2 8a10 10 0 0 1 10-10"/><path d="M2 12a6 6 0 0 1 6-6"/><path d="M2 16a2 2 0 0 1 2-2"/><line x1="2" y1="20" x2="2.01" y2="20"/>`, IconComponent: Cast },

  // --- COMMUNICATION ---
  { id: "mail", name: "Mail", category: "Communication", tags: ["email", "message", "inbox"], svgContent: `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`, IconComponent: Mail },
  { id: "phone", name: "Phone", category: "Communication", tags: ["phone", "call", "contact"], svgContent: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`, IconComponent: Phone },
  { id: "phone-call", name: "PhoneCall", category: "Communication", tags: ["phone", "calling", "ring"], svgContent: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/>`, IconComponent: PhoneCall },
  { id: "phone-off", name: "PhoneOff", category: "Communication", tags: ["phone", "decline", "off"], svgContent: `<line x1="2" y1="2" x2="22" y2="22"/><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67"/>`, IconComponent: PhoneOff },
  { id: "message-square", name: "MessageSquare", category: "Communication", tags: ["chat", "comment"], svgContent: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`, IconComponent: MessageSquare },
  { id: "send", name: "Send", category: "Communication", tags: ["send", "paper plane"], svgContent: `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`, IconComponent: Send },
  { id: "bell", name: "Bell", category: "Communication", tags: ["bell", "notification"], svgContent: `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`, IconComponent: Bell },
  { id: "bell-off", name: "BellOff", category: "Communication", tags: ["bell", "mute", "off"], svgContent: `<path d="M8.7 3A6 6 0 0 1 18 8c0 2.3.6 4.4 1.6 6.1L3 3l16 16"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`, IconComponent: BellOff },
  { id: "at-sign", name: "AtSign", category: "Communication", tags: ["at", "email", "mention"], svgContent: `<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>`, IconComponent: AtSign },
  { id: "message-circle", name: "MessageCircle", category: "Communication", tags: ["chat", "bubble"], svgContent: `<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>`, IconComponent: MessageCircle },
  { id: "share-2", name: "Share2", category: "Communication", tags: ["share", "social"], svgContent: `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>`, IconComponent: Share2 },
  { id: "share", name: "Share", category: "Communication", tags: ["share", "export"], svgContent: `<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>`, IconComponent: Share },
  { id: "inbox", name: "Inbox", category: "Communication", tags: ["inbox", "mail", "received"], svgContent: `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>`, IconComponent: Inbox },
  { id: "message-square-plus", name: "MessageSquarePlus", category: "Communication", tags: ["chat", "new"], svgContent: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="12" y1="7" x2="12" y2="13"/>`, IconComponent: MessageSquarePlus },
  { id: "voicemail", name: "Voicemail", category: "Communication", tags: ["audio", "voicemail"], svgContent: `<circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><line x1="6" y1="16" x2="18" y2="16"/>`, IconComponent: Voicemail },
  { id: "megaphone", name: "Megaphone", category: "Communication", tags: ["announcement", "loud"], svgContent: `<path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>`, IconComponent: Megaphone },

  // --- SOCIAL ---
  { id: "user", name: "User", category: "Social", tags: ["user", "person", "profile"], svgContent: `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`, IconComponent: User },
  { id: "users", name: "Users", category: "Social", tags: ["users", "group", "team"], svgContent: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`, IconComponent: Users },
  { id: "user-plus", name: "UserPlus", category: "Social", tags: ["user", "add", "invite"], svgContent: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>`, IconComponent: UserPlus },
  { id: "user-minus", name: "UserMinus", category: "Social", tags: ["user", "remove"], svgContent: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="16" y1="11" x2="22" y2="11"/>`, IconComponent: UserMinus },
  { id: "user-check", name: "UserCheck", category: "Social", tags: ["user", "verified"], svgContent: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>`, IconComponent: UserCheck },
  { id: "user-x", name: "UserX", category: "Social", tags: ["user", "ban", "block"], svgContent: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="22" y2="13"/><line x1="22" y1="8" x2="17" y2="13"/>`, IconComponent: UserX },
  { id: "star", name: "Star", category: "Social", tags: ["star", "favorite", "rate"], svgContent: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`, IconComponent: Star },
  { id: "bookmark", name: "Bookmark", category: "Social", tags: ["bookmark", "save"], svgContent: `<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>`, IconComponent: Bookmark },
  { id: "award", name: "Award", category: "Social", tags: ["award", "badge", "trophy"], svgContent: `<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>`, IconComponent: Award },
  { id: "crown", name: "Crown", category: "Social", tags: ["crown", "king", "vip"], svgContent: `<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>`, IconComponent: Crown },
  { id: "trophy", name: "Trophy", category: "Social", tags: ["trophy", "winner", "prize"], svgContent: `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>`, IconComponent: Trophy },
  { id: "thumbs-up", name: "ThumbsUp", category: "Social", tags: ["like", "up", "approve"], svgContent: `<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88z"/>`, IconComponent: ThumbsUp },
  { id: "thumbs-down", name: "ThumbsDown", category: "Social", tags: ["dislike", "down"], svgContent: `<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88z"/>`, IconComponent: ThumbsDown },
  { id: "smile", name: "Smile", category: "Social", tags: ["smile", "happy", "emoji"], svgContent: `<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>`, IconComponent: Smile },
  { id: "sparkles", name: "Sparkles", category: "Social", tags: ["magic", "stars", "sparkle"], svgContent: `<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>`, IconComponent: Sparkles },

  // --- SECURITY ---
  { id: "shield-check", name: "ShieldCheck", category: "Security", tags: ["shield", "security", "check"], svgContent: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 12 14 22 4"/>`, IconComponent: ShieldCheck },
  { id: "shield-alert", name: "ShieldAlert", category: "Security", tags: ["shield", "warning", "alert"], svgContent: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`, IconComponent: ShieldAlert },
  { id: "key-round", name: "KeyRound", category: "Security", tags: ["key", "pass", "auth"], svgContent: `<path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4L2 18z"/><circle cx="16.5" cy="7.5" r=".5"/>`, IconComponent: KeyRound },
  { id: "lock", name: "Lock", category: "Security", tags: ["lock", "auth", "privacy"], svgContent: `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`, IconComponent: Lock },
  { id: "unlock", name: "Unlock", category: "Security", tags: ["unlock", "open"], svgContent: `<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>`, IconComponent: Unlock },
  { id: "fingerprint", name: "Fingerprint", category: "Security", tags: ["biometric", "security"], svgContent: `<path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5A8.5 8.5 0 0 1 3.5 12C3.5 7.3 7.3 3.5 12 3.5a8.5 8.5 0 0 1 7 3.6"/><path d="M12 7a5 5 0 0 0-5 5c0 3 1.5 5 2.5 6.5"/><path d="M12 11a1 1 0 0 1 1 1v4"/>`, IconComponent: Fingerprint },
  { id: "shield", name: "Shield", category: "Security", tags: ["shield", "protection"], svgContent: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`, IconComponent: Shield },
  { id: "key", name: "Key", category: "Security", tags: ["key", "passkey"], svgContent: `<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>`, IconComponent: Key },
  { id: "scan-face", name: "ScanFace", category: "Security", tags: ["face id", "scan"], svgContent: `<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>`, IconComponent: ScanFace },
  { id: "shield-x", name: "ShieldX", category: "Security", tags: ["shield", "block", "error"], svgContent: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m14.5 9.5-5 5"/><path d="m9.5 9.5 5 5"/>`, IconComponent: ShieldX },
  { id: "lock-keyhole", name: "LockKeyhole", category: "Security", tags: ["lock", "keyhole", "privacy"], svgContent: `<circle cx="12" cy="16" r="1"/><rect width="18" height="12" x="3" y="10" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/>`, IconComponent: LockKeyhole },

  // --- BUSINESS & FINANCE ---
  { id: "credit-card", name: "CreditCard", category: "Business", tags: ["card", "payment", "bank"], svgContent: `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`, IconComponent: CreditCard },
  { id: "shopping-cart", name: "ShoppingCart", category: "Business", tags: ["cart", "buy", "store"], svgContent: `<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>`, IconComponent: ShoppingCart },
  { id: "shopping-bag", name: "ShoppingBag", category: "Business", tags: ["bag", "store", "shop"], svgContent: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>`, IconComponent: ShoppingBag },
  { id: "dollar-sign", name: "DollarSign", category: "Business", tags: ["dollar", "money", "cash"], svgContent: `<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`, IconComponent: DollarSign },
  { id: "wallet", name: "Wallet", category: "Business", tags: ["wallet", "money", "crypto"], svgContent: `<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v4a1 1 0 0 1-1 1H4a2 2 0 0 1-2-2V7"/>`, IconComponent: Wallet },
  { id: "banknote", name: "Banknote", category: "Business", tags: ["bill", "cash", "money"], svgContent: `<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><line x1="6" x2="6.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="12" y2="12"/>`, IconComponent: Banknote },
  { id: "tag", name: "Tag", category: "Business", tags: ["tag", "price", "label"], svgContent: `<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5"/>`, IconComponent: Tag },
  { id: "percent", name: "Percent", category: "Business", tags: ["percent", "sale", "discount"], svgContent: `<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>`, IconComponent: Percent },
  { id: "trending-up", name: "TrendingUp", category: "Business", tags: ["chart", "growth", "up"], svgContent: `<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>`, IconComponent: TrendingUp },
  { id: "trending-down", name: "TrendingDown", category: "Business", tags: ["chart", "loss", "down"], svgContent: `<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>`, IconComponent: TrendingDown },
  { id: "receipt", name: "Receipt", category: "Business", tags: ["receipt", "bill", "invoice"], svgContent: `<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 6v12"/>`, IconComponent: Receipt },
  { id: "coins", name: "Coins", category: "Business", tags: ["coins", "money", "gold"], svgContent: `<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>`, IconComponent: Coins },
  { id: "package", name: "Package", category: "Business", tags: ["box", "delivery", "shipping"], svgContent: `<path d="M16.5 9.4 7.55 4.24a2 2 0 0 0-2.05 0l-3 1.73a2 2 0 0 0-1 1.73v10.6a2 2 0 0 0 1 1.73l3 1.73a2 2 0 0 0 2.05 0l8.95-5.16a2 2 0 0 0 1-1.73V11.13a2 2 0 0 0-1-1.73Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>`, IconComponent: Package },
  { id: "truck", name: "Truck", category: "Business", tags: ["truck", "shipping", "delivery"], svgContent: `<rect width="12" height="9" x="1" y="8" rx="2"/><polygon points="13 8 18 8 23 12 23 17 13 17 13 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`, IconComponent: Truck },
  { id: "gift", name: "Gift", category: "Business", tags: ["gift", "present", "reward"], svgContent: `<rect width="18" height="14" x="3" y="8" rx="2"/><path d="M12 5a3 3 0 1 0-3 3h6a3 3 0 1 0-3-3Z"/><path d="M12 8v14"/><path d="M3 12h18"/>`, IconComponent: Gift },
  { id: "briefcase", name: "Briefcase", category: "Business", tags: ["work", "job", "office"], svgContent: `<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`, IconComponent: Briefcase },
  { id: "building", name: "Building", category: "Business", tags: ["office", "company", "city"], svgContent: `<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>`, IconComponent: Building },
  { id: "store", name: "Store", category: "Business", tags: ["shop", "market", "store"], svgContent: `<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M18 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M10 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/>`, IconComponent: Store },
  { id: "bar-chart-3", name: "BarChart3", category: "Business", tags: ["chart", "analytics", "bar"], svgContent: `<path d="M3 3v18h18"/><rect width="4" height="7" x="7" y="10" rx="1"/><rect width="4" height="12" x="15" y="5" rx="1"/>`, IconComponent: BarChart3 },
  { id: "pie-chart", name: "PieChart", category: "Business", tags: ["chart", "pie", "stats"], svgContent: `<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>`, IconComponent: PieChart },

  // --- WEATHER ---
  { id: "cloud-rain", name: "CloudRain", category: "Weather", tags: ["rain", "cloud", "weather"], svgContent: `<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>`, IconComponent: CloudRain },
  { id: "cloud-snow", name: "CloudSnow", category: "Weather", tags: ["snow", "cloud", "winter"], svgContent: `<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/>`, IconComponent: CloudSnow },
  { id: "cloud-lightning", name: "CloudLightning", category: "Weather", tags: ["storm", "thunder", "lightning"], svgContent: `<path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/>`, IconComponent: CloudLightning },
  { id: "wind", name: "Wind", category: "Weather", tags: ["wind", "breeze", "air"], svgContent: `<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>`, IconComponent: Wind },
  { id: "umbrella", name: "Umbrella", category: "Weather", tags: ["rain", "umbrella", "protect"], svgContent: `<path d="M22 12a10.06 10.06 0 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v10"/>`, IconComponent: Umbrella },
  { id: "thermometer", name: "Thermometer", category: "Weather", tags: ["temp", "temperature", "heat"], svgContent: `<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>`, IconComponent: Thermometer },
  { id: "snowflake", name: "Snowflake", category: "Weather", tags: ["snow", "ice", "cold"], svgContent: `<line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>`, IconComponent: Snowflake },
  { id: "droplets", name: "Droplets", category: "Weather", tags: ["water", "rain", "liquid"], svgContent: `<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.09 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M17 21c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S17.29 11.75 17 10.3c-.29 1.45-1.14 2.84-2.29 3.76S13 15.79 13 16.95c0 2.22 1.8 4.05 4 4.05z"/>`, IconComponent: Droplets },
  { id: "sunrise", name: "Sunrise", category: "Weather", tags: ["sun", "morning", "sunrise"], svgContent: `<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>`, IconComponent: Sunrise },
  { id: "sunset", name: "Sunset", category: "Weather", tags: ["sun", "evening", "sunset"], svgContent: `<path d="M12 10v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 14-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/>`, IconComponent: Sunset },

  // --- BRANDS ---
  { id: "github", name: "Github", category: "Brands", tags: ["github", "git", "code", "repo"], svgContent: `<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>`, IconComponent: GithubIcon },
  { id: "twitter", name: "Twitter", category: "Brands", tags: ["twitter", "x", "social", "tweet"], svgContent: `<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>`, IconComponent: TwitterIcon },
  { id: "facebook", name: "Facebook", category: "Brands", tags: ["facebook", "fb", "social"], svgContent: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`, IconComponent: FacebookIcon },
  { id: "instagram", name: "Instagram", category: "Brands", tags: ["instagram", "insta", "photo"], svgContent: `<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>`, IconComponent: InstagramIcon },
  { id: "linkedin", name: "Linkedin", category: "Brands", tags: ["linkedin", "job", "career", "network"], svgContent: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>`, IconComponent: LinkedinIcon },
  { id: "youtube", name: "Youtube", category: "Brands", tags: ["youtube", "video", "stream"], svgContent: `<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/>`, IconComponent: YoutubeIcon },
  { id: "chrome", name: "Chrome", category: "Brands", tags: ["chrome", "google", "browser"], svgContent: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/>`, IconComponent: ChromeIcon },
  { id: "figma", name: "Figma", category: "Brands", tags: ["figma", "design", "ui", "ux"], svgContent: `<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/>`, IconComponent: FigmaIcon },
  { id: "slack", name: "Slack", category: "Brands", tags: ["slack", "chat", "work"], svgContent: `<rect width="3" height="8" x="13" y="2" rx="1.5"/><path d="M19 8.5V10h1.5a1.5 1.5 0 1 0 0-3H19v1.5z"/><rect width="3" height="8" x="8" y="14" rx="1.5"/><path d="M5 15.5V14H3.5a1.5 1.5 0 1 0 0 3H5v-1.5z"/><rect width="8" height="3" x="14" y="13" rx="1.5"/><path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 3 0V19h-1.5z"/><rect width="8" height="3" x="2" y="8" rx="1.5"/><path d="M8.5 5H10V3.5a1.5 1.5 0 1 0-3 0V5h1.5z"/>`, IconComponent: SlackIcon },
  { id: "dribbble", name: "Dribbble", category: "Brands", tags: ["dribbble", "design", "portfolio"], svgContent: `<circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/>`, IconComponent: DribbbleIcon },
  { id: "gitlab", name: "Gitlab", category: "Brands", tags: ["gitlab", "git", "devops"], svgContent: `<path d="m22 13.29-1.42-4.37a.8.8 0 0 0-.25-.38.8.8 0 0 0-.44-.13.8.8 0 0 0-.43.12.8.8 0 0 0-.27.37l-2.06 6.35H8.88L6.82 8.9a.8.8 0 0 0-.27-.37.8.8 0 0 0-.43-.12.8.8 0 0 0-.44.13.8.8 0 0 0-.25.38L4 13.29a1 1 0 0 0 .36 1.13l7.19 5.37a1 1 0 0 0 1.1 0l7.19-5.37a1 1 0 0 0 .36-1.13Z"/>`, IconComponent: GitlabIcon },

  // --- SHAPES ---
  { id: "circle", name: "Circle", category: "Shapes", tags: ["circle", "shape", "round"], svgContent: `<circle cx="12" cy="12" r="10"/>`, IconComponent: Circle },
  { id: "square", name: "Square", category: "Shapes", tags: ["square", "shape", "box"], svgContent: `<rect width="18" height="18" x="3" y="3" rx="2"/>`, IconComponent: Square },
  { id: "triangle", name: "Triangle", category: "Shapes", tags: ["triangle", "shape", "pyramid"], svgContent: `<path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>`, IconComponent: Triangle },
  { id: "hexagon", name: "Hexagon", category: "Shapes", tags: ["hexagon", "polygon", "geometry"], svgContent: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>`, IconComponent: Hexagon },
  { id: "octagon", name: "Octagon", category: "Shapes", tags: ["octagon", "stop", "shape"], svgContent: `<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>`, IconComponent: Octagon },
  { id: "pentagon", name: "Pentagon", category: "Shapes", tags: ["pentagon", "polygon"], svgContent: `<path d="M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3 9.4a2 2 0 0 1-1.9 1.39H7a2 2 0 0 1-1.9-1.39l-3-9.4a2 2 0 0 1 .73-2.25z"/>`, IconComponent: Pentagon },
  { id: "box", name: "Box", category: "Shapes", tags: ["box", "cube", "3d"], svgContent: `<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>`, IconComponent: Box },

  // --- MISCELLANEOUS ---
  { id: "help-circle", name: "HelpCircle", category: "Miscellaneous", tags: ["help", "question", "faq"], svgContent: `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>`, IconComponent: HelpCircle },
  { id: "info", name: "Info", category: "Miscellaneous", tags: ["info", "about", "details"], svgContent: `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`, IconComponent: Info },
  { id: "alert-triangle", name: "AlertTriangle", category: "Miscellaneous", tags: ["warning", "caution", "danger"], svgContent: `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`, IconComponent: AlertTriangle },
  { id: "alert-circle", name: "AlertCircle", category: "Miscellaneous", tags: ["alert", "error", "warning"], svgContent: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`, IconComponent: AlertCircle },
  { id: "check-circle", name: "CheckCircle2", category: "Miscellaneous", tags: ["check", "success", "done"], svgContent: `<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>`, IconComponent: CheckCircle2 },
  { id: "x-circle", name: "XCircle", category: "Miscellaneous", tags: ["cancel", "close", "error"], svgContent: `<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>`, IconComponent: XCircle },
  { id: "trash-2", name: "Trash2", category: "Miscellaneous", tags: ["delete", "trash", "bin"], svgContent: `<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>`, IconComponent: Trash2 },
  { id: "clock", name: "Clock", category: "Miscellaneous", tags: ["clock", "time", "recent"], svgContent: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`, IconComponent: Clock },
  { id: "calendar", name: "Calendar", category: "Miscellaneous", tags: ["calendar", "date", "schedule"], svgContent: `<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`, IconComponent: Calendar },
  { id: "download", name: "Download", category: "Miscellaneous", tags: ["download", "save", "export"], svgContent: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`, IconComponent: Download },
  { id: "upload", name: "Upload", category: "Miscellaneous", tags: ["upload", "import", "file"], svgContent: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>`, IconComponent: Upload },
  { id: "wand2", name: "Wand2", category: "Miscellaneous", tags: ["wand", "magic", "effect"], svgContent: `<path d="m15 4 2 2"/><path d="m17 2 2 2"/><path d="m21 6-2 2"/><path d="m13 2 1 1"/><path d="M3 21l9-9"/><path d="M12.2 6.2 2 16.4l3.6 3.6L15.8 9.8z"/>`, IconComponent: Wand2 },
  { id: "flame", name: "Flame", category: "Miscellaneous", tags: ["fire", "flame", "hot", "trending"], svgContent: `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`, IconComponent: Flame },
  { id: "target", name: "Target", category: "Miscellaneous", tags: ["target", "goal", "aim"], svgContent: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`, IconComponent: Target },
  { id: "lightbulb", name: "Lightbulb", category: "Miscellaneous", tags: ["idea", "lightbulb", "tip"], svgContent: `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>`, IconComponent: Lightbulb },
  { id: "puzzle", name: "Puzzle", category: "Miscellaneous", tags: ["puzzle", "piece", "game"], svgContent: `<path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.234-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.951.107-1.276.433l-1.568 1.568c-.47.47-1.087.706-1.704.706s-1.234-.235-1.704-.706l-1.568-1.568a.98.98 0 0 1-.276-.837c.07-.47-.107-.951-.433-1.276l-1.611-1.611A2.41 2.41 0 0 1 6 12c0-.617.235-1.234.706-1.704l1.568-1.568c.326-.325.503-.806.433-1.276a.98.98 0 0 1 .276-.837l1.568-1.568c.47-.47 1.087-.706 1.704-.706s1.234.235 1.704.706l1.611 1.611c.23.23.556.338.878.289A2.41 2.41 0 0 1 19.439 7.85Z"/>`, IconComponent: Puzzle },
];

export const SvgIconsLibraryTool: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [size, setSize] = useState(24);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [color, setColor] = useState("#F97316");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<IconDef>(ICONS_COLLECTION[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(60);

  const categories: { key: string; label: string }[] = [
    { key: "All", label: "All Icons" },
    { key: "Arrows", label: "Arrows" },
    { key: "Navigation", label: "Navigation" },
    { key: "UI", label: "UI Controls" },
    { key: "Development", label: "Development" },
    { key: "Technology", label: "Technology" },
    { key: "Files", label: "Files & Folders" },
    { key: "Media", label: "Media & Audio" },
    { key: "Communication", label: "Communication" },
    { key: "Social", label: "Social & People" },
    { key: "Security", label: "Security & Auth" },
    { key: "Business", label: "Business & Store" },
    { key: "Weather", label: "Weather" },
    { key: "Brands", label: "Brands" },
    { key: "Shapes", label: "Shapes" },
    { key: "Miscellaneous", label: "Misc" },
    { key: "Favorites", label: "Starred" },
  ];

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ICONS_COLLECTION.length, Favorites: favorites.length };
    for (const icon of ICONS_COLLECTION) {
      counts[icon.category] = (counts[icon.category] || 0) + 1;
    }
    return counts;
  }, [favorites]);

  const filteredIcons = useMemo(() => {
    return ICONS_COLLECTION.filter((icon) => {
      const matchesCategory =
        selectedCategory === "All"
          ? true
          : selectedCategory === "Favorites"
          ? favorites.includes(icon.id)
          : icon.category === selectedCategory;

      const matchesSearch =
        search.trim() === "" ||
        icon.name.toLowerCase().includes(search.toLowerCase()) ||
        icon.category.toLowerCase().includes(search.toLowerCase()) ||
        icon.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory, favorites]);

  const visibleIcons = useMemo(() => {
    return filteredIcons.slice(0, visibleCount);
  }, [filteredIcons, visibleCount]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const getCustomizedSvg = useCallback(
    (icon: IconDef) => {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">\n  ${icon.svgContent}\n</svg>`;
    },
    [size, color, strokeWidth]
  );

  const copySvg = (icon: IconDef = selectedIcon, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const customizedSvg = getCustomizedSvg(icon);
    navigator.clipboard.writeText(customizedSvg);
    setCopiedType(`svg-${icon.id}`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const copyJsx = (icon: IconDef = selectedIcon, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const jsx = `<${icon.name} size={${size}} color="${color}" strokeWidth={${strokeWidth}} />`;
    navigator.clipboard.writeText(jsx);
    setCopiedType(`jsx-${icon.id}`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadSvg = () => {
    const customizedSvg = getCustomizedSvg(selectedIcon);
    const blob = new Blob([customizedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedIcon.name.toLowerCase()}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadPng = () => {
    const svgStr = getCustomizedSvg(selectedIcon);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const blobURL = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleFactor = 4; // High DPI scale factor
      canvas.width = size * scaleFactor;
      canvas.height = size * scaleFactor;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const png = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = png;
        a.download = `${selectedIcon.name.toLowerCase()}.png`;
        a.click();
      }
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  const SelectedIconComp = selectedIcon.IconComponent;

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-1 sm:px-0">
      {/* Search & Customization Toolbar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${ICONS_COLLECTION.length}+ vector SVG icons by name, category, or tag...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(60);
              }}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              aria-label="Search SVG icons"
            />
          </div>

          {/* Controls: Size, Stroke, Color */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-between sm:justify-start">
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-zinc-500 font-semibold">Size:</span>
              <input
                type="range"
                min="16"
                max="64"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-16 sm:w-20 accent-orange-500"
                aria-label="Icon size"
              />
              <span className="font-mono text-zinc-700 font-bold w-8 text-right">{size}px</span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-zinc-500 font-semibold">Stroke:</span>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-14 sm:w-16 accent-orange-500"
                aria-label="Icon stroke width"
              />
              <span className="font-mono text-zinc-700 font-bold w-7 text-right">{strokeWidth}px</span>
            </div>

            {/* Color Swatches & Picker */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-xl text-xs">
              <span className="text-zinc-500 font-semibold mr-1">Color:</span>
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setColor(preset.value)}
                  style={{ backgroundColor: preset.value }}
                  className={`w-4 h-4 rounded-full transition-all border border-black/10 ${
                    color === preset.value ? "ring-2 ring-orange-500 scale-110" : "hover:scale-105"
                  }`}
                  title={preset.label}
                  aria-label={`Color preset ${preset.label}`}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent ml-1"
                aria-label="Custom color picker"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1.5 max-w-full">
            {categories.map((cat) => {
              const count = categoryCounts[cat.key] || 0;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    setVisibleCount(60);
                  }}
                  aria-pressed={selectedCategory === cat.key}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    selectedCategory === cat.key
                      ? "bg-orange-500 text-white shadow-2xs font-bold"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      selectedCategory === cat.key ? "bg-white/20 text-white" : "bg-zinc-200/80 text-zinc-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
              aria-pressed={viewMode === "grid"}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid" ? "bg-white shadow-2xs text-orange-600" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List View"
              aria-pressed={viewMode === "list"}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list" ? "bg-white shadow-2xs text-orange-600" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Icons Grid / List Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>
              Showing <strong>{visibleIcons.length}</strong> of <strong>{filteredIcons.length}</strong> vector icons
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </span>
            {favorites.length > 0 && (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{favorites.length} Starred</span>
              </span>
            )}
          </div>

          {filteredIcons.length === 0 ? (
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-12 text-center space-y-3">
              <Search className="w-8 h-8 text-zinc-300 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-800">No icons found</h4>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                No icons matched your query &quot;{search}&quot;. Try searching for another term.
              </p>
              <Button size="sm" variant="outline" onClick={() => { setSearch(""); setSelectedCategory("All"); }}>
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {visibleIcons.map((icon) => {
                const IconC = icon.IconComponent;
                const isSelected = selectedIcon.id === icon.id;
                const isFav = favorites.includes(icon.id);

                return (
                  <button
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all relative group cursor-pointer ${
                      isSelected
                        ? "bg-orange-50/80 border-orange-400 shadow-xs ring-2 ring-orange-500/20"
                        : "bg-white border-zinc-200/90 hover:border-orange-300 hover:shadow-xs"
                    }`}
                  >
                    <button
                      onClick={(e) => toggleFavorite(icon.id, e)}
                      aria-label={`Favorite ${icon.name}`}
                      className="absolute top-2 right-2 text-zinc-300 hover:text-amber-400 transition-colors p-1"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                    </button>

                    <div style={{ color }} className="p-2 flex items-center justify-center">
                      <IconC size={Math.min(size, 36)} strokeWidth={strokeWidth} />
                    </div>

                    <span className="text-[11px] font-bold text-zinc-800 truncate w-full text-center">
                      {icon.name}
                    </span>

                    {/* Hover Toolbar */}
                    <div className="absolute inset-x-1 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-xs rounded-lg p-1 flex items-center justify-center gap-1 border border-zinc-200 shadow-xs">
                      <button
                        onClick={(e) => copySvg(icon, e)}
                        className="p-1 rounded text-[10px] font-bold text-zinc-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-1"
                        title="Copy SVG"
                      >
                        {copiedType === `svg-${icon.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>SVG</span>
                      </button>
                      <button
                        onClick={(e) => copyJsx(icon, e)}
                        className="p-1 rounded text-[10px] font-bold text-zinc-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-1"
                        title="Copy JSX"
                      >
                        {copiedType === `jsx-${icon.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Code className="w-3 h-3" />
                        )}
                        <span>JSX</span>
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {visibleIcons.map((icon) => {
                const IconC = icon.IconComponent;
                const isSelected = selectedIcon.id === icon.id;
                const isFav = favorites.includes(icon.id);

                return (
                  <div
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-orange-50 border-orange-400 shadow-2xs"
                        : "bg-white border-zinc-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ color }} className="p-1.5 bg-zinc-50 rounded-lg border border-zinc-200">
                        <IconC size={24} strokeWidth={strokeWidth} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900">{icon.name}</h4>
                        <span className="text-[10px] text-zinc-400">
                          {icon.category} • {icon.tags.slice(0, 3).join(", ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleFavorite(icon.id, e)}
                        className="p-1.5 rounded-lg border border-zinc-200 text-zinc-400 hover:text-amber-400"
                        aria-label={`Favorite ${icon.name}`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedIcon(icon)} className="text-xs">
                        Select
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Pagination Button */}
          {visibleCount < filteredIcons.length && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 60)}
                className="text-xs font-bold gap-2 shadow-xs border-zinc-300"
              >
                <span>Load More Icons ({filteredIcons.length - visibleCount} remaining)</span>
              </Button>
            </div>
          )}
        </div>

        {/* Selected Icon Inspector Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5 h-fit lg:sticky lg:top-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <div style={{ color }}>
                <SelectedIconComp size={20} strokeWidth={strokeWidth} />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">{selectedIcon.name}</h3>
            </div>
            <span className="text-[10px] font-mono bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-md font-bold">
              {selectedIcon.category}
            </span>
          </div>

          {/* Large SVG Preview Container */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex items-center justify-center shadow-inner relative group min-h-44">
            <div style={{ color }} className="transition-all transform group-hover:scale-110">
              <SelectedIconComp size={Math.max(size * 2, 56)} strokeWidth={strokeWidth} />
            </div>
            <span className="absolute bottom-2 right-3 text-[10px] font-mono text-zinc-400">
              {size}×{size}px • {strokeWidth}px stroke
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => copySvg(selectedIcon)}
                variant="default"
                className="text-xs font-bold gap-1.5 w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                {copiedType === `svg-${selectedIcon.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === `svg-${selectedIcon.id}` ? "Copied!" : "Copy SVG"}</span>
              </Button>
              <Button
                onClick={() => copyJsx(selectedIcon)}
                variant="outline"
                className="text-xs font-bold gap-1.5 w-full border-zinc-300 hover:bg-zinc-50"
              >
                {copiedType === `jsx-${selectedIcon.id}` ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedType === `jsx-${selectedIcon.id}` ? "Copied!" : "Copy JSX"}</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={downloadSvg}
                variant="secondary"
                className="text-xs font-semibold gap-1.5 w-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG File</span>
              </Button>
              <Button
                onClick={downloadPng}
                variant="secondary"
                className="text-xs font-semibold gap-1.5 w-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PNG Image</span>
              </Button>
            </div>
          </div>

          {/* SVG Source Code Block */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-700 flex items-center justify-between">
              <span>Customized SVG Code:</span>
              <button
                onClick={() => copySvg(selectedIcon)}
                className="text-orange-600 hover:underline font-semibold text-[10px]"
              >
                Copy Code
              </button>
            </label>
            <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36 shadow-inner">
              <pre>{getCustomizedSvg(selectedIcon)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
