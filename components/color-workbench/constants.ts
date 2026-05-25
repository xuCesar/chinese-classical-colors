import { Palette, ScrollText, Shapes, Sparkles } from "lucide-react";

import { catalogColorSeeds } from "@/data/catalog-color-seeds";
import type { AppView, ColorSeed, ColorSeedDynasty, ExportFormat, WuxingHue } from "@/lib/types";

export const defaultSeed = catalogColorSeeds.find((seed) => seed.nameZh === "落霞红") ?? catalogColorSeeds[0];

export const previewTabs = ["产品 UI", "东方视觉"] as const;

export const exportFormats: { label: string; value: ExportFormat }[] = [
  { label: "CSS", value: "css" },
  { label: "Tailwind", value: "tailwind" },
  { label: "JSON", value: "json" }
];

export const depthOptions = [
  { label: "全部", value: "all" },
  { label: "浅色", value: "light" },
  { label: "中色", value: "medium" },
  { label: "深色", value: "dark" }
] as const;

export const viewItems: { view: AppView; label: string; mobileLabel: string; icon: typeof Palette }[] = [
  { view: "landing", label: "主页大观", mobileLabel: "主页", icon: Sparkles },
  { view: "explorer", label: "天工开物", mobileLabel: "色谱", icon: Palette },
  { view: "exporter", label: "画轴印制", mobileLabel: "印制", icon: ScrollText },
  { view: "guide", label: "设计指南", mobileLabel: "指南", icon: Shapes }
];

export const familyLabels: Record<ColorSeed["family"], string> = {
  red: "红",
  orange: "橙",
  yellow: "黄",
  green: "绿",
  cyan: "青",
  blue: "蓝",
  purple: "紫",
  pink: "粉",
  brown: "棕",
  gray: "灰"
};

export const dynastyOptions: { label: string; value: ColorSeedDynasty | "all" }[] = [
  { label: "全部朝代", value: "all" },
  { label: "周朝", value: "周朝" },
  { label: "秦汉", value: "秦汉" },
  { label: "唐朝", value: "唐朝" },
  { label: "宋朝", value: "宋朝" },
  { label: "明清", value: "明清" }
];

export const wuxingDescriptions: { hue: WuxingHue; title: string; description: string; swatch: string }[] = [
  { hue: "青", title: "青", description: "东方之色，主生机与修竹。", swatch: "#1661ab" },
  { hue: "赤", title: "赤", description: "南方之色，主礼制与繁盛。", swatch: "#c12c1f" },
  { hue: "黄", title: "黄", description: "中央之色，主器物与厚德。", swatch: "#d4af37" },
  { hue: "白", title: "白", description: "西方之色，主清寒与素净。", swatch: "#f3f0ea" },
  { hue: "黑", title: "黑", description: "北方之色，主深邃与玄远。", swatch: "#2b2b2b" }
];

export type PreviewTab = (typeof previewTabs)[number];
export type DepthFilter = (typeof depthOptions)[number]["value"];
