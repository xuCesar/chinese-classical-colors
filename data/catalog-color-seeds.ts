import { colorSeeds } from "@/data/color-seeds";
import { featuredColorSemantics } from "@/data/featured-color-semantics";
import type { ColorSeed, WuxingHue } from "@/lib/types";

const semanticsByName = new Map(featuredColorSemantics.map((item) => [item.nameZh, item]));

const wuxingHueByFamily: Record<ColorSeed["family"], WuxingHue> = {
  red: "赤",
  orange: "黄",
  yellow: "黄",
  green: "青",
  cyan: "青",
  blue: "青",
  purple: "黑",
  pink: "赤",
  brown: "黄",
  gray: "白"
};

export const catalogColorSeeds: ColorSeed[] = colorSeeds.map((seed) => {
  const semantic = semanticsByName.get(seed.nameZh);

  return {
    ...seed,
    dynasty: semantic?.dynasty ?? seed.dynasty,
    poemLine: semantic?.poemLine ?? seed.poemLine,
    note: semantic?.note ?? seed.note,
    sealLabel: semantic?.sealLabel ?? seed.sealLabel,
    wuxingHue: semantic?.wuxingHue ?? seed.wuxingHue ?? wuxingHueByFamily[seed.family],
    isFeatured: semantic?.isFeatured ?? seed.isFeatured ?? false
  };
});

export const featuredColorSeeds = catalogColorSeeds.filter((seed) => seed.isFeatured);
