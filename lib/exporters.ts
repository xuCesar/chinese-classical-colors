import type { ExportFormat, GeneratedScale } from "@/lib/types";

export function exportPalette(scale: GeneratedScale, format: ExportFormat): string {
  if (format === "json") {
    return JSON.stringify(
      {
        name: scale.baseSeed.nameZh,
        pinyin: scale.baseSeed.namePinyin,
        baseHex: scale.baseHex,
        colors: Object.fromEntries(scale.colors.map((color) => [color.step, color.hex]))
      },
      null,
      2
    );
  }

  if (format === "tailwind") {
    const rows = scale.colors.map((color) => `          ${color.step}: "${color.hex}"`).join(",\n");

    return `// tailwind.config.ts\nexport default {\n  theme: {\n    extend: {\n      colors: {\n        ccc: {\n${rows}\n        }\n      }\n    }\n  }\n};`;
  }

  const rows = scale.colors.map((color) => `  --ccc-${color.step}: ${color.hex};`).join("\n");

  return `:root {\n  --ccc-name: "${scale.baseSeed.nameZh}";\n${rows}\n}`;
}
