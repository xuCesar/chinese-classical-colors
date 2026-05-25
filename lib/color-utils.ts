import {
  clampRgb,
  converter,
  differenceEuclidean,
  formatHex,
  parse,
  wcagContrast
} from "culori";

import { colorSeeds } from "@/data/color-seeds";
import type { ColorSeed, GeneratedColor, GeneratedScale, ScaleGenerationOptions, ScaleStep } from "@/lib/types";

const toOklch = converter("oklch");
const difference = differenceEuclidean("oklch");

const scaleSteps: ScaleStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const lightnessByStep: Record<ScaleStep, number> = {
  50: 0.985,
  100: 0.955,
  200: 0.9,
  300: 0.815,
  400: 0.705,
  500: 0.61,
  600: 0.515,
  700: 0.43,
  800: 0.34,
  900: 0.255,
  950: 0.18
};

const chromaFactorByStep: Record<ScaleStep, number> = {
  50: 0.2,
  100: 0.35,
  200: 0.55,
  300: 0.78,
  400: 0.95,
  500: 1,
  600: 0.92,
  700: 0.78,
  800: 0.62,
  900: 0.45,
  950: 0.32
};

const roleByStep: Record<ScaleStep, string> = {
  50: "背景",
  100: "浅底",
  200: "边框",
  300: "悬停",
  400: "辅助",
  500: "主色",
  600: "强调",
  700: "按钮",
  800: "深色面",
  900: "标题",
  950: "墨色"
};

const defaultScaleOptions: Required<ScaleGenerationOptions> = {
  lightnessShift: 0,
  chromaScale: 1
};

export function normalizeHex(input: string): string | null {
  const trimmed = input.trim().replace(/^#/, "");

  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    const expanded = trimmed
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
    return `#${expanded.toLowerCase()}`;
  }

  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return `#${trimmed.toLowerCase()}`;
  }

  return null;
}

export function getForegroundColor(hex: string): "#0f172a" | "#f8fafc" {
  const whiteContrast = wcagContrast(hex, "#f8fafc");
  const darkContrast = wcagContrast(hex, "#0f172a");
  return whiteContrast >= darkContrast ? "#f8fafc" : "#0f172a";
}

export function findNearestSeed(hex: string): ColorSeed {
  return [...colorSeeds].sort((first, second) => difference(first.hex, hex) - difference(second.hex, hex))[0];
}

export function findNearbySeeds(hex: string, excludeId?: string, limit = 5): ColorSeed[] {
  return colorSeeds
    .filter((seed) => seed.id !== excludeId)
    .sort((first, second) => difference(first.hex, hex) - difference(second.hex, hex))
    .slice(0, limit);
}

export function generateScale(
  inputHex: string,
  seedOverride?: ColorSeed,
  options: ScaleGenerationOptions = {}
): GeneratedScale {
  const normalizedHex = normalizeHex(inputHex);

  if (!normalizedHex) {
    throw new Error("请输入有效的 HEX 色值。");
  }

  const parsedBase = parse(normalizedHex);
  const baseOklch = toOklch(parsedBase);

  if (!baseOklch) {
    throw new Error("无法解析当前颜色。");
  }

  const baseSeed = seedOverride ?? findNearestSeed(normalizedHex);
  const resolvedOptions = {
    lightnessShift: clampNumber(options.lightnessShift ?? defaultScaleOptions.lightnessShift, -0.08, 0.08),
    chromaScale: clampNumber(options.chromaScale ?? defaultScaleOptions.chromaScale, 0.65, 1.35)
  };
  const baseChroma = Math.max(baseOklch.c ?? 0.02, 0.02);
  const hue = baseOklch.h ?? toOklch(baseSeed.hex)?.h ?? 0;

  const colors: GeneratedColor[] = scaleSteps.map((step) => {
    const color = clampRgb({
      mode: "oklch",
      l: clampNumber(lightnessByStep[step] + resolvedOptions.lightnessShift, 0.08, 0.995),
      c: baseChroma * chromaFactorByStep[step] * resolvedOptions.chromaScale,
      h: hue
    });
    const hex = formatHex(color);

    return {
      step,
      hex,
      foreground: getForegroundColor(hex),
      role: roleByStep[step]
    };
  });

  return {
    id: crypto.randomUUID(),
    baseHex: normalizedHex,
    baseSeed,
    options: resolvedOptions,
    colors,
    nearbySeeds: findNearbySeeds(normalizedHex, baseSeed.id),
    createdAt: new Date().toISOString()
  };
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getScaleColor(scale: GeneratedScale, step: ScaleStep): GeneratedColor {
  const color = scale.colors.find((item) => item.step === step);

  if (!color) {
    throw new Error(`缺少 ${step} 色阶。`);
  }

  return color;
}
