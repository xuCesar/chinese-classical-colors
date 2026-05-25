import { readFile, writeFile } from "node:fs/promises";

const rawPath = new URL("../data/raw/zerosoul-chinese-colors.json", import.meta.url);
const curatedPath = new URL("../data/curated-color-seeds.ts", import.meta.url);
const outputPath = new URL("../data/color-seeds.ts", import.meta.url);
const checkMode = process.argv.includes("--check");

const validFamilies = new Set(["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink", "brown", "gray"]);
const validReliability = new Set(["open-source", "attributed", "curated"]);

const familyByGroup = {
  红: "red",
  黄: "yellow",
  绿: "green",
  蓝: "blue",
  紫: "purple",
  灰白: "gray",
  黑: "gray",
  金银: "yellow"
};

const sourceMeta = {
  sourceName: "zerosoul/chinese-colors",
  sourceUrl: "https://github.com/zerosoul/chinese-colors",
  license: "MIT",
  reliability: "open-source",
  sourceNote: ""
};

const pinyinByName = {
  粉红: "fen hong",
  妃色: "fei se",
  品红: "pin hong",
  桃红: "tao hong",
  海棠红: "hai tang hong",
  石榴红: "shi liu hong",
  樱桃色: "ying tao se",
  银红: "yin hong",
  大红: "da hong",
  绛紫: "jiang zi",
  绯红: "fei hong",
  胭脂: "yan zhi",
  朱红: "zhu hong",
  丹: "dan",
  彤: "tong",
  茜色: "qian se",
  火红: "huo hong",
  赫赤: "he chi",
  嫣红: "yan hong",
  洋红: "yang hong",
  炎: "yan",
  赤: "chi",
  绾: "wan",
  枣红: "zao hong",
  檀: "tan",
  殷红: "yan hong",
  酡红: "tuo hong",
  酡颜: "tuo yan",
  鹅黄: "e huang",
  鸭黄: "ya huang",
  樱草色: "ying cao se",
  杏黄: "xing huang",
  杏红: "xing hong",
  橘黄: "ju huang",
  橙黄: "cheng huang",
  橘红: "ju hong",
  姜黄: "jiang huang",
  缃色: "xiang se",
  橙色: "cheng se",
  茶色: "cha se",
  驼色: "tuo se",
  昏黄: "hun huang",
  栗色: "li se",
  棕色: "zong se",
  棕绿: "zong lv",
  棕黑: "zong hei",
  棕红: "zong hong",
  棕黄: "zong huang",
  赭: "zhe",
  琥珀: "hu po",
  褐色: "he se",
  枯黄: "ku huang",
  黄栌: "huang lu",
  秋色: "qiu se",
  秋香色: "qiu xiang se",
  嫩绿: "nen lv",
  柳黄: "liu huang",
  柳绿: "liu lv",
  竹青: "zhu qing",
  葱黄: "cong huang",
  葱绿: "cong lv",
  葱青: "cong qing",
  青葱: "qing cong",
  油绿: "you lv",
  绿沈: "lv shen",
  碧色: "bi se",
  碧绿: "bi lv",
  青碧: "qing bi",
  翡翠色: "fei cui se",
  草绿: "cao lv",
  青色: "qing se",
  青翠: "qing cui",
  青白: "qing bai",
  鸭卵青: "ya luan qing",
  蟹壳青: "xie ke qing",
  鸦青: "ya qing",
  绿色: "lv se",
  豆绿: "dou lv",
  豆青: "dou qing",
  石青: "shi qing",
  玉色: "yu se",
  缥: "piao",
  艾绿: "ai lv",
  松柏绿: "song bai lv",
  松花绿: "song hua lv",
  松花色: "song hua se",
  蓝: "lan",
  靛青: "dian qing",
  靛蓝: "dian lan",
  碧蓝: "bi lan",
  蔚蓝: "wei lan",
  宝蓝: "bao lan",
  蓝灰色: "lan hui se",
  藏青: "zang qing",
  藏蓝: "zang lan",
  黛: "dai",
  黛绿: "dai lv",
  黛蓝: "dai lan",
  黛紫: "dai zi",
  紫色: "zi se",
  紫酱: "zi jiang",
  酱紫: "jiang zi",
  紫檀: "zi tan",
  绀青: "gan qing",
  紫棠: "zi tang",
  青莲: "qing lian",
  群青: "qun qing",
  雪青: "xue qing",
  丁香色: "ding xiang se",
  藕色: "ou se",
  藕荷色: "ou he se",
  苍色: "cang se",
  苍黄: "cang huang",
  苍青: "cang qing",
  苍黑: "cang hei",
  苍白: "cang bai",
  水色: "shui se",
  水红: "shui hong",
  水绿: "shui lv",
  水蓝: "shui lan",
  淡青: "dan qing",
  湖蓝: "hu lan",
  湖绿: "hu lv",
  精白: "jing bai",
  象牙白: "xiang ya bai",
  雪白: "xue bai",
  月白: "yue bai",
  缟: "gao",
  素: "su",
  荼白: "tu bai",
  霜色: "shuang se",
  花白: "hua bai",
  鱼肚白: "yu du bai",
  莹白: "ying bai",
  灰色: "hui se",
  牙色: "ya se",
  铅白: "qian bai",
  玄色: "xuan se",
  玄青: "xuan qing",
  乌色: "wu se",
  乌黑: "wu hei",
  漆黑: "qi hei",
  墨色: "mo se",
  墨灰: "mo hui",
  黑色: "hei se",
  缁色: "zi se",
  煤黑: "mei hei",
  黧: "li",
  黎: "li",
  黝: "you",
  黝黑: "you hei",
  黯: "an",
  赤金: "chi jin",
  金色: "jin se",
  银白: "yin bai",
  老银: "lao yin",
  乌金: "wu jin",
  铜绿: "tong lv",
  落霞红: "luo xia hong",
  朱砂: "zhu sha",
  密陀僧: "mi tuo seng",
  雄黄: "xiong huang",
  姚黄: "yao huang",
  松花: "song hua",
  鸭蛋青: "ya dan qing",
  天青: "tian qing",
  藕荷: "ou he"
};

const moodTagRules = [
  ["红", ["红系", "明艳"]],
  ["粉", ["柔和", "妆色"]],
  ["妃", ["妆色", "典雅"]],
  ["桃", ["花色", "春日"]],
  ["海棠", ["花色", "柔婉"]],
  ["石榴", ["花色", "节庆"]],
  ["樱", ["果实", "鲜活"]],
  ["朱", ["矿物", "仪式"]],
  ["丹", ["矿物", "古典"]],
  ["茜", ["植物", "染色"]],
  ["黄", ["黄系", "温暖"]],
  ["鹅", ["春日", "轻盈"]],
  ["杏", ["果实", "温润"]],
  ["橘", ["果实", "明快"]],
  ["姜", ["草木", "暖意"]],
  ["茶", ["器物", "沉静"]],
  ["栗", ["果实", "厚重"]],
  ["棕", ["土色", "沉着"]],
  ["绿", ["绿系", "植物"]],
  ["柳", ["植物", "春日"]],
  ["竹", ["植物", "文雅"]],
  ["葱", ["植物", "鲜活"]],
  ["碧", ["玉石", "清透"]],
  ["翡翠", ["玉石", "贵重"]],
  ["草", ["植物", "清新"]],
  ["青", ["青系", "清朗"]],
  ["鸭", ["浅淡", "洁净"]],
  ["蟹", ["器物", "灰调"]],
  ["豆", ["植物", "柔和"]],
  ["石", ["矿物", "稳定"]],
  ["玉", ["玉石", "温润"]],
  ["松", ["植物", "沉静"]],
  ["蓝", ["蓝系", "深远"]],
  ["靛", ["染色", "沉静"]],
  ["蔚", ["天空", "清朗"]],
  ["宝", ["器物", "贵重"]],
  ["藏", ["深色", "庄重"]],
  ["黛", ["远山", "含蓄"]],
  ["紫", ["紫系", "典雅"]],
  ["檀", ["木器", "厚重"]],
  ["莲", ["花色", "清雅"]],
  ["丁香", ["花色", "柔婉"]],
  ["藕", ["荷花", "浅淡"]],
  ["苍", ["自然", "古朴"]],
  ["水", ["水色", "清透"]],
  ["湖", ["水色", "清朗"]],
  ["白", ["白系", "留白"]],
  ["雪", ["清冷", "洁净"]],
  ["月", ["月色", "清冷"]],
  ["霜", ["清冷", "浅淡"]],
  ["灰", ["灰系", "克制"]],
  ["黑", ["黑系", "庄重"]],
  ["玄", ["夜色", "庄重"]],
  ["乌", ["深色", "沉稳"]],
  ["墨", ["书写", "沉静"]],
  ["金", ["金属", "贵重"]],
  ["银", ["金属", "冷光"]],
  ["铜", ["金属", "器物"]]
];

function normalizeHex(value) {
  const hex = String(value ?? "").trim().replace(/^#/, "").toLowerCase();
  if (!/^[0-9a-f]{6}$/.test(hex)) {
    throw new Error(`Invalid hex: ${value}`);
  }
  return `#${hex}`;
}

function slugifyName(name) {
  return (pinyinByName[name] ?? name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getPinyin(name) {
  return pinyinByName[name] ?? name;
}

function getMoodTags(name, groupName, intro) {
  const tags = new Set([`${groupName}系`]);
  const haystack = `${name}${intro ?? ""}`;

  for (const [keyword, keywordTags] of moodTagRules) {
    if (haystack.includes(keyword)) {
      keywordTags.forEach((tag) => tags.add(tag));
    }
  }

  return [...tags].slice(0, 3);
}

function readCuratedSeeds(source) {
  const literalMatch = source.match(/export const curatedColorSeeds: ColorSeed\[] = (\[[\s\S]*\]);/);
  if (!literalMatch) {
    throw new Error("Unable to parse curatedColorSeeds literal.");
  }

  const jsLiteral = literalMatch[1];
  return Function(`"use strict"; return (${jsLiteral});`)();
}

function buildOpenSourceSeeds(groups) {
  return groups.flatMap((group) => {
    const family = familyByGroup[group.name] ?? "gray";
    if (!Array.isArray(group.colors)) {
      throw new Error(`Missing colors array for group ${group.name}`);
    }

    return group.colors.map((color) => {
      const nameZh = String(color.name ?? "").trim();
      const hex = normalizeHex(color.hex);

      if (!nameZh) {
        throw new Error(`Missing color name for ${color.id}`);
      }

      return {
        id: slugifyName(nameZh),
        sourceId: `zerosoul-${color.id}`,
        sourceName: sourceMeta.sourceName,
        sourceUrl: sourceMeta.sourceUrl,
        license: sourceMeta.license,
        reliability: sourceMeta.reliability,
        nameZh,
        namePinyin: getPinyin(nameZh),
        hex,
        family,
        moodTags: getMoodTags(nameZh, group.name, color.intro),
        sourceNote: sourceMeta.sourceNote
      };
    });
  });
}

function mergeSeeds(openSourceSeeds, curatedSeeds) {
  const byId = new Map();
  const byHex = new Map();

  for (const seed of openSourceSeeds) {
    byId.set(seed.id, seed);
    byHex.set(seed.hex, seed.id);
  }

  for (const seed of curatedSeeds) {
    const normalized = { ...seed, hex: normalizeHex(seed.hex) };
    const sameHexId = byHex.get(normalized.hex);

    if (sameHexId) {
      const previous = byId.get(sameHexId);
      byId.delete(sameHexId);
      byId.set(normalized.id, {
        ...previous,
        ...normalized,
        sourceNote: normalized.sourceNote
      });
      byHex.set(normalized.hex, normalized.id);
      continue;
    }

    byId.set(normalized.id, normalized);
    byHex.set(normalized.hex, normalized.id);
  }

  return [...byId.values()].sort((first, second) => first.family.localeCompare(second.family) || first.id.localeCompare(second.id));
}

function assertValidSeeds(seeds) {
  const ids = new Set();
  const hexes = new Set();

  for (const seed of seeds) {
    const requiredStringFields = [
      "id",
      "sourceId",
      "sourceName",
      "sourceUrl",
      "license",
      "reliability",
      "nameZh",
      "namePinyin",
      "hex",
      "family",
      "sourceNote"
    ];

    for (const field of requiredStringFields) {
      if (typeof seed[field] !== "string") {
        throw new Error(`Missing field ${field} for ${seed.nameZh ?? seed.id}`);
      }
    }

    if (!validReliability.has(seed.reliability)) {
      throw new Error(`Invalid reliability ${seed.reliability} for ${seed.nameZh}`);
    }

    if (!validFamilies.has(seed.family)) {
      throw new Error(`Invalid family ${seed.family} for ${seed.nameZh}`);
    }

    if (!Array.isArray(seed.moodTags) || seed.moodTags.length === 0) {
      throw new Error(`Missing moodTags for ${seed.nameZh}`);
    }

    if (ids.has(seed.id)) {
      throw new Error(`Duplicate id: ${seed.id}`);
    }

    if (hexes.has(seed.hex)) {
      throw new Error(`Duplicate hex: ${seed.hex}`);
    }

    ids.add(seed.id);
    hexes.add(seed.hex);
  }
}

function buildOutput(seeds) {
  return `import type { ColorSeed } from "@/lib/types";

// Generated by scripts/generate-color-seeds.mjs. Do not edit this file by hand.
export const colorSeeds: ColorSeed[] = ${JSON.stringify(seeds, null, 2)};
`;
}

const rawGroups = JSON.parse(await readFile(rawPath, "utf8"));
const curatedSource = await readFile(curatedPath, "utf8");
const curatedSeeds = readCuratedSeeds(curatedSource);
const openSourceSeeds = buildOpenSourceSeeds(rawGroups);
const seeds = mergeSeeds(openSourceSeeds, curatedSeeds);

assertValidSeeds(seeds);

const output = buildOutput(seeds);

if (checkMode) {
  const currentOutput = await readFile(outputPath, "utf8");

  if (currentOutput !== output) {
    throw new Error("Generated color seeds are out of date. Run `pnpm data:generate` and commit data/color-seeds.ts.");
  }

  console.log(`Color seeds are up to date (${seeds.length} seeds).`);
  process.exit(0);
}

await writeFile(outputPath, output);

console.log(`Generated ${seeds.length} color seeds.`);
