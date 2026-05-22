"use client";

import {
  Bookmark,
  Check,
  Copy,
  Dice5,
  Download,
  Palette,
  RotateCcw,
  Search,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { colorSeeds } from "@/data/color-seeds";
import { writeClipboard } from "@/lib/clipboard";
import { generateScale, getScaleColor, normalizeHex } from "@/lib/color-utils";
import { exportPalette } from "@/lib/exporters";
import {
  createSavedPalette,
  readSavedPalettes,
  saveSavedPalettes
} from "@/lib/storage";
import type { ColorSeed, ExportFormat, GeneratedScale, SavedPalette, ScaleStep } from "@/lib/types";

const defaultSeed = colorSeeds[0];
const previewTabs = ["产品 UI", "东方视觉"] as const;
const exportFormats: { label: string; value: ExportFormat }[] = [
  { label: "JSON", value: "json" },
  { label: "Tailwind", value: "tailwind" },
  { label: "CSS Vars", value: "css" }
];

type PreviewTab = (typeof previewTabs)[number];

export function ColorWorkbench() {
  const [hexInput, setHexInput] = useState(defaultSeed.hex);
  const [query, setQuery] = useState("");
  const [scale, setScale] = useState<GeneratedScale>(() => generateScale(defaultSeed.hex, defaultSeed));
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [activePreview, setActivePreview] = useState<PreviewTab>("产品 UI");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("tailwind");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const filteredSeeds = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return colorSeeds;
    }

    return colorSeeds.filter((seed) => {
      return [seed.nameZh, seed.namePinyin, seed.hex, seed.family, ...seed.moodTags]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [query]);

  const exportText = useMemo(() => exportPalette(scale, exportFormat), [exportFormat, scale]);

  useEffect(() => {
    setSavedPalettes(readSavedPalettes(window.localStorage));
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function regenerateByHex() {
    const normalized = normalizeHex(hexInput);

    if (!normalized) {
      setError("请输入 3 位或 6 位 HEX，例如 #cf4813。");
      return;
    }

    setScale(generateScale(normalized));
    setHexInput(normalized);
    setError("");
  }

  function selectSeed(seed: ColorSeed) {
    setScale(generateScale(seed.hex, seed));
    setHexInput(seed.hex);
    setError("");
  }

  function randomSeed() {
    const seed = colorSeeds[Math.floor(Math.random() * colorSeeds.length)];
    selectSeed(seed);
  }

  async function copyText(text: string, message: string) {
    try {
      await writeClipboard(text);
      setToast(message);
    } catch (copyError) {
      setToast(copyError instanceof Error ? copyError.message : "复制失败，请手动选择内容。");
    }
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
    setToast(`已恢复 ${palette.name}`);
  }

  return (
    <main className="min-h-dvh px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1540px] gap-5 xl:grid-cols-[360px_minmax(0,1fr)_390px]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white/86 p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">ccc</p>
                <h1 className="font-serif text-5xl font-bold text-slate-950">国色</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">chinese classical colors</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                <Palette className="size-5" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              从传统色出发，生成适合 Tailwind 与产品界面的 50-950 色阶，并保留色名、意象与相近国色。
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white/88 p-4 shadow-soft">
            <label className="text-sm font-semibold text-slate-900" htmlFor="hex-input">
              HEX 输入
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="hex-input"
                value={hexInput}
                onChange={(event) => setHexInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    regenerateByHex();
                  }
                }}
                className="min-h-11 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
                placeholder="#cf4813"
              />
              <button
                type="button"
                onClick={regenerateByHex}
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                生成
              </button>
            </div>
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            <button
              type="button"
              onClick={randomSeed}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              <Dice5 className="size-4" aria-hidden="true" />
              随机一枚传统色
            </button>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white/88 p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-slate-500" aria-hidden="true" />
              <label className="text-sm font-semibold text-slate-900" htmlFor="seed-search">
                传统色种子
              </label>
            </div>
            <input
              id="seed-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-3 min-h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
              placeholder="搜索色名、拼音、意象"
            />
            <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {filteredSeeds.map((seed) => (
                <button
                  key={seed.id}
                  type="button"
                  onClick={() => selectSeed(seed)}
                  className="grid min-h-[64px] w-full grid-cols-[40px_minmax(0,1fr)] gap-3 rounded-md border border-slate-200 bg-white p-2 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span
                    className="block size-10 rounded-md border border-black/10"
                    style={{ backgroundColor: seed.hex }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-950">{seed.nameZh}</span>
                      <span className="text-xs font-medium uppercase text-slate-500">{seed.hex}</span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{seed.namePinyin}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-5">
          <ColorIdentity scale={scale} onCopy={(text) => copyText(text, "已复制基准色")} />
          <ScaleGrid scale={scale} onCopy={(text) => copyText(text, "已复制色值")} />
          <PreviewPanel active={activePreview} onChange={setActivePreview} scale={scale} />
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white/88 p-4 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-950">导出</h2>
              <button
                type="button"
                onClick={saveCurrentPalette}
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Bookmark className="size-4" aria-hidden="true" />
                保存
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {exportFormats.map((format) => (
                <button
                  key={format.value}
                  type="button"
                  onClick={() => setExportFormat(format.value)}
                  className={`min-h-10 rounded-md border px-2 text-sm font-semibold transition ${
                    exportFormat === format.value
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
            <pre className="mt-3 max-h-[280px] overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100">
              {exportText}
            </pre>
            <button
              type="button"
              onClick={() => copyText(exportText, "已复制导出内容")}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              <Download className="size-4" aria-hidden="true" />
              复制导出内容
            </button>
          </section>

          <SavedPalettes
            palettes={savedPalettes}
            onRestore={restorePalette}
            onRename={renamePalette}
            onRemove={removePalette}
          />
        </aside>
      </div>

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-50 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-soft">
          <Check className="size-4" aria-hidden="true" />
          {toast}
        </div>
      ) : null}
    </main>
  );
}

function ColorIdentity({
  scale,
  onCopy
}: {
  scale: GeneratedScale;
  onCopy: (text: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div
        className="grid gap-6 p-5 sm:grid-cols-[minmax(0,1fr)_220px]"
        style={{
          background: `linear-gradient(135deg, ${getScaleColor(scale, 50).hex}, #ffffff 62%, ${getScaleColor(scale, 100).hex})`
        }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-white/86 px-3 py-1 text-xs font-semibold text-slate-700">
              {scale.baseSeed.family}
            </span>
            {scale.baseSeed.moodTags.map((tag) => (
              <span key={tag} className="rounded-md bg-white/86 px-3 py-1 text-xs font-semibold text-slate-700">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="mt-5 font-serif text-5xl font-bold text-slate-950 sm:text-6xl">
            {scale.baseSeed.nameZh}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-600">{scale.baseSeed.namePinyin}</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">{scale.baseSeed.sourceNote}</p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(scale.baseHex)}
          className="flex min-h-[190px] flex-col justify-end rounded-lg border border-black/10 p-4 text-left shadow-soft transition hover:scale-[1.01]"
          style={{ backgroundColor: scale.baseHex, color: getScaleColor(scale, 500).foreground }}
          aria-label={`复制 ${scale.baseSeed.nameZh} ${scale.baseHex}`}
        >
          <Copy className="mb-auto size-5" aria-hidden="true" />
          <span className="text-2xl font-bold uppercase">{scale.baseHex}</span>
          <span className="mt-1 text-sm opacity-85">点击复制基准色</span>
        </button>
      </div>
      <div className="grid gap-3 border-t border-slate-200 bg-white p-4 sm:grid-cols-5">
        {scale.nearbySeeds.map((seed) => (
          <button
            key={seed.id}
            type="button"
            onClick={() => onCopy(seed.hex)}
            className="flex min-h-16 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-2 text-left transition hover:bg-white"
          >
            <span className="size-9 rounded-md border border-black/10" style={{ backgroundColor: seed.hex }} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-950">{seed.nameZh}</span>
              <span className="block text-xs uppercase text-slate-500">{seed.hex}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ScaleGrid({
  scale,
  onCopy
}: {
  scale: GeneratedScale;
  onCopy: (text: string) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Tailwind 色阶</h2>
          <p className="mt-1 text-sm text-slate-500">OKLCH 明度阶梯，适合产品 UI 角色映射。</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {scale.colors.map((color) => (
          <button
            key={color.step}
            type="button"
            onClick={() => onCopy(color.hex)}
            className="flex min-h-[118px] flex-col justify-between rounded-md border border-black/10 p-3 text-left transition hover:scale-[1.01]"
            style={{ backgroundColor: color.hex, color: color.foreground }}
            aria-label={`复制 ${color.step} 色阶 ${color.hex}`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="text-lg font-bold">{color.step}</span>
              <Copy className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm opacity-80">{color.role}</span>
              <span className="mt-1 block text-xl font-bold uppercase">{color.hex}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function PreviewPanel({
  active,
  onChange,
  scale
}: {
  active: PreviewTab;
  onChange: (tab: PreviewTab) => void;
  scale: GeneratedScale;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950">场景预览</h2>
          <p className="mt-1 text-sm text-slate-500">同一组国色，同时看产品落地与东方气质。</p>
        </div>
        <div className="grid grid-cols-2 rounded-md border border-slate-200 bg-slate-50 p-1">
          {previewTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`min-h-9 rounded px-3 text-sm font-semibold transition ${
                active === tab ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">{active === "产品 UI" ? <ProductPreview scale={scale} /> : <EasternPreview scale={scale} />}</div>
    </section>
  );
}

function ProductPreview({ scale }: { scale: GeneratedScale }) {
  const primary = getScaleColor(scale, 600).hex;
  const light = getScaleColor(scale, 50).hex;
  const border = getScaleColor(scale, 200).hex;
  const dark = getScaleColor(scale, 900).hex;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-lg border p-4" style={{ backgroundColor: light, borderColor: border }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: primary }}>
              订单概览
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-950">本周设计交付</h3>
          </div>
          <button
            type="button"
            className="min-h-10 rounded-md px-4 text-sm font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            新建色板
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {["色板", "复制", "导出"].map((label, index) => (
            <div key={label} className="rounded-md border bg-white p-3" style={{ borderColor: border }}>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{[24, 186, 12][index]}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-md border bg-white p-4" style={{ borderColor: border }}>
          <div className="flex h-36 items-end gap-2">
            {[35, 72, 48, 92, 64, 78, 55].map((height, index) => (
              <span
                key={height + index}
                className="flex-1 rounded-t"
                style={{
                  height: `${height}%`,
                  backgroundColor: getScaleColor(scale, ([200, 300, 400, 500, 600, 700, 800] as ScaleStep[])[index]).hex
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4" style={{ borderColor: border }}>
        <h3 className="text-lg font-bold text-slate-950">组件状态</h3>
        <div className="mt-4 space-y-3">
          <input
            readOnly
            value={`${scale.baseSeed.nameZh} / ${scale.baseHex}`}
            className="min-h-11 w-full rounded-md border px-3 text-sm text-slate-900"
            style={{ borderColor: border }}
          />
          <div className="grid grid-cols-2 gap-2">
            <button className="min-h-11 rounded-md text-sm font-semibold text-white" style={{ backgroundColor: primary }}>
              主按钮
            </button>
            <button
              className="min-h-11 rounded-md border text-sm font-semibold"
              style={{ borderColor: primary, color: primary }}
            >
              次按钮
            </button>
          </div>
          <div className="rounded-md p-3" style={{ backgroundColor: getScaleColor(scale, 100).hex }}>
            <p className="text-sm font-semibold" style={{ color: dark }}>
              状态提示
            </p>
            <p className="mt-1 text-sm text-slate-600">这组色阶已映射到背景、边框、强调与标题角色。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EasternPreview({ scale }: { scale: GeneratedScale }) {
  return (
    <div
      className="grid gap-4 overflow-hidden rounded-lg border p-4 lg:grid-cols-[0.95fr_1.05fr]"
      style={{
        borderColor: getScaleColor(scale, 200).hex,
        background: `linear-gradient(135deg, ${getScaleColor(scale, 50).hex}, #fff 48%, ${getScaleColor(scale, 100).hex})`
      }}
    >
      <div
        className="min-h-[340px] rounded-lg p-6"
        style={{ backgroundColor: getScaleColor(scale, 900).hex, color: getScaleColor(scale, 900).foreground }}
      >
        <p className="text-sm uppercase tracking-[0.24em] opacity-80">chinese classical colors</p>
        <h3 className="mt-16 font-serif text-6xl font-bold">{scale.baseSeed.nameZh}</h3>
        <p className="mt-3 text-sm uppercase tracking-[0.2em] opacity-80">{scale.baseSeed.namePinyin}</p>
        <div className="mt-12 h-1 w-24 rounded-full" style={{ backgroundColor: getScaleColor(scale, 300).hex }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-white/82 p-5" style={{ borderColor: getScaleColor(scale, 200).hex }}>
          <p className="font-serif text-2xl font-semibold text-slate-950">色笺</p>
          <p className="mt-4 font-serif text-lg leading-9 text-slate-700">
            一色入纸，半是风物，半是器用。{scale.baseSeed.nameZh} 宜作主调，也宜藏在边框与阴影之间。
          </p>
        </div>
        <div className="rounded-lg border bg-white/82 p-5" style={{ borderColor: getScaleColor(scale, 200).hex }}>
          <p className="font-serif text-2xl font-semibold text-slate-950">色卡</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {[100, 300, 500, 700, 900, 950].map((step) => {
              const color = getScaleColor(scale, step as ScaleStep);
              return (
                <div
                  key={step}
                  className="flex min-h-16 items-end rounded-md p-2 text-xs font-semibold"
                  style={{ backgroundColor: color.hex, color: color.foreground }}
                >
                  {step}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedPalettes({
  palettes,
  onRestore,
  onRename,
  onRemove
}: {
  palettes: SavedPalette[];
  onRestore: (palette: SavedPalette) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white/88 p-4 shadow-soft">
      <h2 className="text-base font-semibold text-slate-950">我的色板</h2>
      <p className="mt-1 text-sm text-slate-500">保存在当前浏览器，不需要账号。</p>
      <div className="mt-4 space-y-3">
        {palettes.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm leading-6 text-slate-500">
            还没有保存的色板。生成满意的国色后，点击“保存”即可在这里恢复。
          </div>
        ) : (
          palettes.map((palette) => (
            <div key={palette.id} className="rounded-md border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <span
                  className="size-9 rounded-md border border-black/10"
                  style={{ backgroundColor: palette.scale.baseHex }}
                  aria-hidden="true"
                />
                <input
                  value={palette.name}
                  onChange={(event) => onRename(palette.id, event.target.value)}
                  className="min-h-10 min-w-0 flex-1 rounded-md border border-slate-200 px-2 text-sm font-semibold text-slate-900"
                  aria-label="色板名称"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onRestore(palette)}
                  className="min-h-10 rounded-md bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  恢复
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(palette.id)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
