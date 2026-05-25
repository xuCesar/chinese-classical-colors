export type ScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type ColorFamily =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "pink"
  | "brown"
  | "gray";

export type ColorSeedReliability = "open-source" | "attributed" | "curated";
export type ColorSeedDynasty = "周朝" | "秦汉" | "唐朝" | "宋朝" | "明清";
export type WuxingHue = "青" | "赤" | "黄" | "白" | "黑";

export type ColorSeed = {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  license: string;
  reliability: ColorSeedReliability;
  nameZh: string;
  namePinyin: string;
  hex: string;
  family: ColorFamily;
  moodTags: string[];
  sourceNote: string;
  dynasty?: ColorSeedDynasty;
  poemLine?: string;
  note?: string;
  sealLabel?: string;
  wuxingHue?: WuxingHue;
  isFeatured?: boolean;
};

export type ScaleGenerationOptions = {
  lightnessShift?: number;
  chromaScale?: number;
};

export type GeneratedColor = {
  step: ScaleStep;
  hex: string;
  foreground: "#0f172a" | "#f8fafc";
  role: string;
};

export type GeneratedScale = {
  id: string;
  baseHex: string;
  baseSeed: ColorSeed;
  options: Required<ScaleGenerationOptions>;
  colors: GeneratedColor[];
  nearbySeeds: ColorSeed[];
  createdAt: string;
};

export type SavedPalette = {
  id: string;
  name: string;
  scale: GeneratedScale;
  createdAt: string;
  updatedAt: string;
};

export type PaletteBagItem = {
  seedId: string;
  nameZh: string;
  hex: string;
  savedAt: string;
};

export type ExportFormat = "json" | "tailwind" | "css";
export type AppView = "landing" | "explorer" | "exporter" | "guide";
