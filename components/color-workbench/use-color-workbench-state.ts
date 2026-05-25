import { useEffect, useMemo, useState } from "react";

import { catalogColorSeeds } from "@/data/catalog-color-seeds";
import { writeClipboard } from "@/lib/clipboard";
import { generateScale, normalizeHex } from "@/lib/color-utils";
import { exportPalette } from "@/lib/exporters";
import {
  createPaletteBagItem,
  createSavedPalette,
  readPaletteBag,
  readSavedPalettes,
  savePaletteBag,
  saveSavedPalettes
} from "@/lib/storage";
import type {
  AppView,
  ColorSeed,
  ColorSeedDynasty,
  ExportFormat,
  GeneratedScale,
  PaletteBagItem,
  SavedPalette,
  ScaleGenerationOptions
} from "@/lib/types";

import {
  defaultSeed,
  familyLabels,
  type DepthFilter,
  type PreviewTab
} from "@/components/color-workbench/constants";
import { resolveBagSeed } from "@/components/color-workbench/shell";
import { getDepth } from "@/components/color-workbench/utils";

export function useColorWorkbenchState() {
  const [activeView, setActiveView] = useState<AppView>("landing");
  const [hexInput, setHexInput] = useState(defaultSeed.hex);
  const [query, setQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState<ColorSeed["family"] | "all">("all");
  const [selectedDepth, setSelectedDepth] = useState<DepthFilter>("all");
  const [selectedDynasty, setSelectedDynasty] = useState<ColorSeedDynasty | "all">("all");
  const [scaleOptions, setScaleOptions] = useState<Required<ScaleGenerationOptions>>({
    lightnessShift: 0,
    chromaScale: 1
  });
  const [scale, setScale] = useState<GeneratedScale>(() => generateScale(defaultSeed.hex, defaultSeed, scaleOptions));
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [paletteBag, setPaletteBag] = useState<PaletteBagItem[]>([]);
  const [activePreview, setActivePreview] = useState<PreviewTab>("产品 UI");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css");
  const [sealText, setSealText] = useState(defaultSeed.sealLabel ?? "雅赏");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [mobileSheetSeed, setMobileSheetSeed] = useState<ColorSeed | null>(null);
  const [paletteDrawerOpen, setPaletteDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const familyOptions = useMemo(() => {
    const counts = catalogColorSeeds.reduce(
      (accumulator, seed) => {
        accumulator[seed.family] = (accumulator[seed.family] ?? 0) + 1;
        return accumulator;
      },
      {} as Partial<Record<ColorSeed["family"], number>>
    );

    return Object.entries(familyLabels)
      .filter(([family]) => counts[family as ColorSeed["family"]])
      .map(([family, label]) => ({
        family: family as ColorSeed["family"],
        label,
        count: counts[family as ColorSeed["family"]] ?? 0
      }));
  }, []);

  const filteredSeeds = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return catalogColorSeeds.filter((seed) => {
      const matchesFamily = selectedFamily === "all" || seed.family === selectedFamily;
      const matchesDepth = selectedDepth === "all" || getDepth(seed.hex) === selectedDepth;
      const matchesDynasty = selectedDynasty === "all" || seed.dynasty === selectedDynasty;
      const matchesKeyword =
        !keyword ||
        [
          seed.nameZh,
          seed.namePinyin,
          seed.hex,
          seed.family,
          seed.dynasty,
          seed.poemLine,
          seed.note,
          seed.sealLabel,
          seed.sourceName,
          ...seed.moodTags
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return matchesFamily && matchesDepth && matchesDynasty && matchesKeyword;
    });
  }, [query, selectedDepth, selectedDynasty, selectedFamily]);

  const visibleSeeds = useMemo(() => filteredSeeds.slice(0, 48), [filteredSeeds]);
  const exportText = useMemo(() => exportPalette(scale, exportFormat), [exportFormat, scale]);
  const activeSheetSeed = mobileSheetSeed ?? scale.baseSeed;

  useEffect(() => {
    setSavedPalettes(readSavedPalettes(window.localStorage));
    setPaletteBag(readPaletteBag(window.localStorage));
  }, []);

  useEffect(() => {
    setSealText(scale.baseSeed.sealLabel ?? "雅赏");
  }, [scale.baseSeed.id, scale.baseSeed.sealLabel]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (activeView !== "explorer") {
      setMobileSheetSeed(null);
    }
  }, [activeView]);

  async function copyText(text: string, message: string) {
    try {
      await writeClipboard(text);
      setToast(message);
    } catch (copyError) {
      setToast(copyError instanceof Error ? copyError.message : "复制失败，请手动选择内容。");
    }
  }

  function regenerateByHex(nextOptions = scaleOptions) {
    const normalized = normalizeHex(hexInput);

    if (!normalized) {
      setError("请输入 3 位或 6 位 HEX，例如 #cf4813。");
      return;
    }

    const nextScale = generateScale(normalized, undefined, nextOptions);
    setScale(nextScale);
    setHexInput(normalized);
    setError("");
    setActiveView("explorer");
  }

  function selectSeed(seed: ColorSeed, nextOptions = scaleOptions) {
    setScale(generateScale(seed.hex, seed, nextOptions));
    setHexInput(seed.hex);
    setError("");
  }

  function pickRandomSeed(pool: ColorSeed[]) {
    if (pool.length === 0) {
      return null;
    }

    const candidates = pool.length > 1 ? pool.filter((seed) => seed.id !== scale.baseSeed.id) : pool;
    return candidates[Math.floor(Math.random() * candidates.length)] ?? candidates[0];
  }

  function randomizeLandingSeed() {
    const seed = pickRandomSeed(catalogColorSeeds);

    if (!seed) {
      return;
    }

    selectSeed(seed);
  }

  function randomSeed() {
    const pool = filteredSeeds.length > 0 ? filteredSeeds : catalogColorSeeds;
    const seed = pickRandomSeed(pool);

    if (!seed) {
      return;
    }

    selectSeed(seed);
    setActiveView("explorer");
  }

  function updateScaleOptions(next: Required<ScaleGenerationOptions>) {
    setScaleOptions(next);
    setScale(generateScale(scale.baseHex, scale.baseSeed, next));
  }

  function saveCurrentPalette() {
    const palette = createSavedPalette(scale);
    const next = [palette, ...savedPalettes.filter((item) => item.scale.baseHex !== scale.baseHex)].slice(0, 12);
    setSavedPalettes(next);
    saveSavedPalettes(window.localStorage, next);
    setToast("已保存到我的色板");
  }

  function renamePalette(id: string, name: string) {
    const next = savedPalettes.map((palette) =>
      palette.id === id ? { ...palette, name, updatedAt: new Date().toISOString() } : palette
    );
    setSavedPalettes(next);
    saveSavedPalettes(window.localStorage, next);
  }

  function removePalette(id: string) {
    const next = savedPalettes.filter((palette) => palette.id !== id);
    setSavedPalettes(next);
    saveSavedPalettes(window.localStorage, next);
    setToast("已删除色板");
  }

  function restorePalette(palette: SavedPalette) {
    setScale(palette.scale);
    setHexInput(palette.scale.baseHex);
    setScaleOptions(palette.scale.options ?? { lightnessShift: 0, chromaScale: 1 });
    setActiveView("exporter");
    setToast(`已恢复 ${palette.name}`);
  }

  function toggleBag(seed: ColorSeed) {
    const exists = paletteBag.some((item) => item.seedId === seed.id);
    const next = exists
      ? paletteBag.filter((item) => item.seedId !== seed.id)
      : [createPaletteBagItem(seed.id, seed.nameZh, seed.hex), ...paletteBag].slice(0, 16);

    setPaletteBag(next);
    savePaletteBag(window.localStorage, next);
    setToast(exists ? `已移出「${seed.nameZh}」` : `已收入「${seed.nameZh}」`);
  }

  function loadBagColor(seedId: string) {
    const seed = resolveBagSeed(seedId);

    if (!seed) {
      return;
    }

    selectSeed(seed);
    setActiveView("exporter");
    setPaletteDrawerOpen(false);
    setToast(`已将「${seed.nameZh}」装裱入画轴`);
  }

  return {
    state: {
      activePreview,
      activeSheetSeed,
      activeView,
      error,
      exportFormat,
      hexInput,
      mobileMenuOpen,
      mobileSheetSeed,
      paletteBag,
      paletteDrawerOpen,
      query,
      savedPalettes,
      scale,
      scaleOptions,
      sealText,
      selectedDepth,
      selectedDynasty,
      selectedFamily,
      toast
    },
    derived: {
      exportText,
      familyOptions,
      filteredSeeds,
      visibleSeeds
    },
    actions: {
      copyText,
      loadBagColor,
      randomSeed,
      randomizeLandingSeed,
      regenerateByHex,
      removePalette,
      renamePalette,
      restorePalette,
      saveCurrentPalette,
      selectSeed,
      setActivePreview,
      setActiveView,
      setExportFormat,
      setHexInput,
      setMobileMenuOpen,
      setMobileSheetSeed,
      setPaletteDrawerOpen,
      setQuery,
      setSealText,
      setSelectedDepth,
      setSelectedDynasty,
      setSelectedFamily,
      setToast,
      toggleBag,
      updateScaleOptions
    }
  };
}
