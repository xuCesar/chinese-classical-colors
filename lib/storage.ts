import type { GeneratedScale, PaletteBagItem, SavedPalette } from "@/lib/types";

export const savedPaletteStorageKey = "ccc.saved-palettes.v1";
export const paletteBagStorageKey = "ccc.palette-bag.v1";
const defaultScaleOptions = {
  lightnessShift: 0,
  chromaScale: 1
};

export function readSavedPalettes(storage: Pick<Storage, "getItem">): SavedPalette[] {
  const raw = storage.getItem(savedPaletteStorageKey);

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isSavedPalette).map((palette) => ({
      ...palette,
      scale: {
        ...palette.scale,
        options: palette.scale.options ?? defaultScaleOptions
      }
    }));
  } catch {
    return [];
  }
}

export function saveSavedPalettes(storage: Pick<Storage, "setItem">, palettes: SavedPalette[]): void {
  storage.setItem(savedPaletteStorageKey, JSON.stringify(palettes));
}

export function readPaletteBag(storage: Pick<Storage, "getItem">): PaletteBagItem[] {
  const raw = storage.getItem(paletteBagStorageKey);

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isPaletteBagItem);
  } catch {
    return [];
  }
}

export function savePaletteBag(storage: Pick<Storage, "setItem">, items: PaletteBagItem[]): void {
  storage.setItem(paletteBagStorageKey, JSON.stringify(items));
}

export function createSavedPalette(scale: GeneratedScale, name = scale.baseSeed.nameZh): SavedPalette {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,
    scale,
    createdAt: now,
    updatedAt: now
  };
}

export function createPaletteBagItem(seedId: string, nameZh: string, hex: string): PaletteBagItem {
  return {
    seedId,
    nameZh,
    hex,
    savedAt: new Date().toISOString()
  };
}

function isSavedPalette(value: unknown): value is SavedPalette {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.name === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.updatedAt === "string" &&
    typeof record.scale === "object" &&
    record.scale !== null
  );
}

function isPaletteBagItem(value: unknown): value is PaletteBagItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.seedId === "string" &&
    typeof record.nameZh === "string" &&
    typeof record.hex === "string" &&
    typeof record.savedAt === "string"
  );
}
