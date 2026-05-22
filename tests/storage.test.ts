import { describe, expect, it } from "vitest";

import { colorSeeds } from "@/data/color-seeds";
import { generateScale } from "@/lib/color-utils";
import { createSavedPalette, readSavedPalettes, saveSavedPalettes } from "@/lib/storage";

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
});
