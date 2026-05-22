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

export type ColorSeed = {
  id: string;
  nameZh: string;
  namePinyin: string;
  hex: string;
  family: ColorFamily;
  moodTags: string[];
  sourceNote: string;
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

export type ExportFormat = "json" | "tailwind" | "css";
