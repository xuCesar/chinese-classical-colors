import { execFileSync } from "node:child_process";

import { describe, expect, it } from "vitest";

import { featuredColorSeeds } from "@/data/catalog-color-seeds";
import { colorSeeds } from "@/data/color-seeds";
import { generateScale } from "@/lib/color-utils";
import type { ColorSeed } from "@/lib/types";

const validFamilies = new Set<ColorSeed["family"]>([
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
  "brown",
  "gray"
]);

describe("colorSeeds", () => {
  it("keeps generated color seeds in sync with raw and curated sources", () => {
    expect(() => {
      execFileSync("node", ["scripts/generate-color-seeds.mjs", "--check"], {
        cwd: process.cwd(),
        stdio: "pipe"
      });
    }).not.toThrow();
  });

  it("contains a production-sized seed collection", () => {
    expect(colorSeeds.length).toBeGreaterThanOrEqual(150);
  });

  it("has complete and normalized fields", () => {
    for (const seed of colorSeeds) {
      expect(seed.id).toMatch(/^[a-z0-9\u4e00-\u9fa5-]+$/);
      expect(seed.sourceId).not.toHaveLength(0);
      expect(seed.sourceName).not.toHaveLength(0);
      expect(seed.sourceUrl).toMatch(/^https?:\/\//);
      expect(seed.license).not.toHaveLength(0);
      expect(["open-source", "attributed", "curated"]).toContain(seed.reliability);
      expect(seed.nameZh).not.toHaveLength(0);
      expect(seed.namePinyin).not.toHaveLength(0);
      expect(seed.hex).toMatch(/^#[0-9a-f]{6}$/);
      expect(validFamilies.has(seed.family)).toBe(true);
      expect(seed.moodTags.length).toBeGreaterThan(0);
      expect(typeof seed.sourceNote).toBe("string");
    }
  });

  it("does not contain duplicate ids or hex values", () => {
    const ids = new Set(colorSeeds.map((seed) => seed.id));
    const hexes = new Set(colorSeeds.map((seed) => seed.hex));

    expect(ids.size).toBe(colorSeeds.length);
    expect(hexes.size).toBe(colorSeeds.length);
  });

  it("generates a scale for every seed", () => {
    for (const seed of colorSeeds) {
      expect(generateScale(seed.hex, seed).colors).toHaveLength(11);
    }
  });

  it("contains complete semantics for featured colors", () => {
    expect(featuredColorSeeds.length).toBeGreaterThanOrEqual(8);

    for (const seed of featuredColorSeeds) {
      expect(seed.dynasty).toBeDefined();
      expect(seed.poemLine).toBeTruthy();
      expect(seed.note).toBeTruthy();
      expect(seed.sealLabel).toBeTruthy();
      expect(seed.wuxingHue).toBeDefined();
    }
  });
});
