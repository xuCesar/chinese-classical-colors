import { describe, expect, it } from "vitest";

import { colorSeeds } from "@/data/color-seeds";
import { generateScale } from "@/lib/color-utils";
import {
  createPaletteBagItem,
  createSavedPalette,
  readPaletteBag,
  readSavedPalettes,
  savePaletteBag,
  saveSavedPalettes
} from "@/lib/storage";

class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
  private readonly data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

describe("storage", () => {
  it("saves and reads palettes", () => {
    const storage = new MemoryStorage();
    const palette = createSavedPalette(generateScale("#cf4813", colorSeeds[0]));

    saveSavedPalettes(storage, [palette]);

    expect(readSavedPalettes(storage)).toEqual([palette]);
  });

  it("falls back to empty list for invalid data", () => {
    const storage = new MemoryStorage();
    storage.setItem("ccc.saved-palettes.v1", "not-json");

    expect(readSavedPalettes(storage)).toEqual([]);
  });

  it("adds default scale options when reading old palettes", () => {
    const storage = new MemoryStorage();
    const palette = createSavedPalette(generateScale("#cf4813", colorSeeds[0]));
    const legacyPalette = {
      ...palette,
      scale: {
        ...palette.scale,
        options: undefined
      }
    };

    storage.setItem("ccc.saved-palettes.v1", JSON.stringify([legacyPalette]));

    expect(readSavedPalettes(storage)[0].scale.options).toEqual({ lightnessShift: 0, chromaScale: 1 });
  });

  it("saves and reads palette bag items", () => {
    const storage = new MemoryStorage();
    const item = createPaletteBagItem("seed-1", "天青", "#8ea9b5");

    savePaletteBag(storage, [item]);

    expect(readPaletteBag(storage)).toEqual([item]);
  });

  it("falls back to empty palette bag for invalid data", () => {
    const storage = new MemoryStorage();
    storage.setItem("ccc.palette-bag.v1", "{\"bad\":true}");

    expect(readPaletteBag(storage)).toEqual([]);
  });
});
