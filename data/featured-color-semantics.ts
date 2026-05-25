import type { ColorSeedDynasty, WuxingHue } from "@/lib/types";

export type FeaturedColorSemantic = {
  nameZh: string;
  dynasty: ColorSeedDynasty;
  poemLine: string;
  note: string;
  sealLabel: string;
  wuxingHue: WuxingHue;
  isFeatured: true;
};

export const featuredColorSemantics: FeaturedColorSemantic[] = [
  {
    nameZh: "天青",
    dynasty: "宋朝",
    poemLine: "雨过天青云破处，这般颜色做将来。",
    note: "汝窑天青，温润静穆，适合作为东方留白中的主色锚点。",
    sealLabel: "汝窑",
    wuxingHue: "青",
    isFeatured: true
  },
  {
    nameZh: "朱砂",
    dynasty: "秦汉",
    poemLine: "丹砂点染，千载不黯。",
    note: "矿物红最适合做朱砂落印，只在关键处出现才有分量。",
    sealLabel: "正色",
    wuxingHue: "赤",
    isFeatured: true
  },
  {
    nameZh: "竹青",
    dynasty: "周朝",
    poemLine: "修竹新梢雨初后，青阴满地入书窗。",
    note: "植物青里带静气，适合作为辅助主调和背景过渡。",
    sealLabel: "君子",
    wuxingHue: "青",
    isFeatured: true
  },
  {
    nameZh: "月白",
    dynasty: "宋朝",
    poemLine: "月色入瓷，清寒如洗。",
    note: "带冷意的青白，适合作为宣纸底上的浅层面板与高光。",
    sealLabel: "清玩",
    wuxingHue: "白",
    isFeatured: true
  },
  {
    nameZh: "黛蓝",
    dynasty: "明清",
    poemLine: "黛色横山远，暮云收尽时。",
    note: "近墨的深蓝适合标题、深背景与强对比段落。",
    sealLabel: "远山",
    wuxingHue: "黑",
    isFeatured: true
  },
  {
    nameZh: "秋香色",
    dynasty: "明清",
    poemLine: "金风一动，香染庭阶。",
    note: "带器物感的古金黄，适合点亮次级强调与标签。",
    sealLabel: "宫苑",
    wuxingHue: "黄",
    isFeatured: true
  },
  {
    nameZh: "藕荷",
    dynasty: "宋朝",
    poemLine: "荷气将歇，余霞成绡。",
    note: "轻柔的粉紫过渡适合东方视觉页里的辅助色与诗意层。",
    sealLabel: "绡影",
    wuxingHue: "赤",
    isFeatured: true
  },
  {
    nameZh: "胭脂",
    dynasty: "唐朝",
    poemLine: "云鬓花颜金步摇，芙蓉帐暖度春宵。",
    note: "更深更熟的红，适合礼制感与成熟场景中的重心色。",
    sealLabel: "宫妆",
    wuxingHue: "赤",
    isFeatured: true
  },
  {
    nameZh: "石榴红",
    dynasty: "明清",
    poemLine: "榴花照眼明，暑气入庭深。",
    note: "比朱砂更鲜明热烈，适合节庆感与强动作按钮。",
    sealLabel: "华采",
    wuxingHue: "赤",
    isFeatured: true
  },
  {
    nameZh: "雄黄",
    dynasty: "秦汉",
    poemLine: "午日微醺，金砂照席。",
    note: "矿物橙黄可用于强调提醒，但面积需要克制。",
    sealLabel: "端阳",
    wuxingHue: "黄",
    isFeatured: true
  },
  {
    nameZh: "落霞红",
    dynasty: "唐朝",
    poemLine: "落霞与孤鹜齐飞，秋水共长天一色。",
    note: "偏暮色的暖红适合首页主叙事与品牌级吸睛点。",
    sealLabel: "霞染",
    wuxingHue: "赤",
    isFeatured: true
  }
];
