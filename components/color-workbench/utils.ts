import type { DepthFilter } from "@/components/color-workbench/constants";

export function getDepth(hex: string): DepthFilter {
  const value = Number.parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  if (luminance > 0.72) {
    return "light";
  }

  if (luminance < 0.38) {
    return "dark";
  }

  return "medium";
}
