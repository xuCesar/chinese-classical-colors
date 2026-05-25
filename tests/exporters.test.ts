import { describe, expect, it } from "vitest";

import { colorSeeds } from "@/data/color-seeds";
import { generateScale } from "@/lib/color-utils";
import { exportPalette } from "@/lib/exporters";

describe("exportPalette", () => {
  const seed = colorSeeds.find((item) => item.nameZh === "落霞红") ?? colorSeeds[0];
  const scale = generateScale(seed.hex, seed);

  it("exports JSON", () => {
    const output = exportPalette(scale, "json");
    const parsed = JSON.parse(output) as { name: string; colors: Record<string, string> };

    expect(parsed.name).toBe(seed.nameZh);
    expect(parsed.colors["500"]).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("exports Tailwind config snippet", () => {
    const output = exportPalette(scale, "tailwind");

    expect(output).toContain("colors");
    expect(output).toContain("ccc");
    expect(output).toContain("500:");
  });

  it("exports CSS variables", () => {
    const output = exportPalette(scale, "css");

    expect(output).toContain("--ccc-name");
    expect(output).toContain("--ccc-950");
  });
});
