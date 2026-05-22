import { describe, expect, it } from "vitest";

import { colorSeeds } from "@/data/color-seeds";
import {
  findNearbySeeds,
  generateScale,
  getForegroundColor,
  normalizeHex
} from "@/lib/color-utils";

describe("color-utils", () => {
  it("normalizes 3-digit and 6-digit hex values", () => {
    expect(normalizeHex("cf4813")).toBe("#cf4813");
    expect(normalizeHex("#ABC")).toBe("#aabbcc");
    expect(normalizeHex("not-a-color")).toBeNull();
  });

  it("generates a complete 50-950 scale", () => {
    const scale = generateScale("#cf4813", colorSeeds[0]);

    expect(scale.colors).toHaveLength(11);
    expect(scale.colors.map((color) => color.step)).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]);
    expect(scale.colors.every((color) => /^#[0-9a-f]{6}$/.test(color.hex))).toBe(true);
  });

  it("selects readable foreground color", () => {
    expect(getForegroundColor("#ffffff")).toBe("#0f172a");
    expect(getForegroundColor("#111827")).toBe("#f8fafc");
  });

  it("returns nearby seeds without the excluded seed", () => {
    const nearby = findNearbySeeds(colorSeeds[0].hex, colorSeeds[0].id, 3);

    expect(nearby).toHaveLength(3);
    expect(nearby.some((seed) => seed.id === colorSeeds[0].id)).toBe(false);
  });
});
