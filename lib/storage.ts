import type { GeneratedScale, SavedPalette } from "@/lib/types";

export const savedPaletteStorageKey = "ccc.saved-palettes.v1";

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

    return parsed.filter(isSavedPalette);
  } catch {
    return [];
  }
}

export function saveSavedPalettes(storage: Pick<Storage, "setItem">, palettes: SavedPalette[]): void {
  storage.setItem(savedPaletteStorageKey, JSON.stringify(palettes));
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
