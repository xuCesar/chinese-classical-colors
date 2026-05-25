import { Bookmark, ChevronRight, Dice5, Library, RotateCcw, Search } from "lucide-react";

import type { ColorSeed, ColorSeedDynasty, GeneratedScale, PaletteBagItem, ScaleGenerationOptions } from "@/lib/types";

import {
  depthOptions,
  dynastyOptions,
  type DepthFilter,
  type PreviewTab
} from "@/components/color-workbench/constants";
import { PreviewPanel, RangeControl } from "@/components/color-workbench/shared";

export function ExplorerView({
  error,
  familyOptions,
  filteredCount,
  hexInput,
  onBagToggle,
  onCopy,
  onDepthChange,
  onDynastyChange,
  onFamilyChange,
  onGenerate,
  onHexInputChange,
  onPreviewChange,
  onQueryChange,
  onRandom,
  onScaleOptionChange,
  onSeedInspect,
  onSeedSelect,
  onViewChange,
  paletteBag,
  previewTab,
  query,
  scale,
  scaleOptions,
  selectedDepth,
  selectedDynasty,
  selectedFamily,
  seeds,
  totalCount
}: {
  error: string;
  familyOptions: { family: ColorSeed["family"]; label: string; count: number }[];
  filteredCount: number;
  hexInput: string;
  onBagToggle: (seed: ColorSeed) => void;
  onCopy: (text: string, message: string) => void;
  onDepthChange: (value: DepthFilter) => void;
  onDynastyChange: (value: ColorSeedDynasty | "all") => void;
  onFamilyChange: (value: ColorSeed["family"] | "all") => void;
  onGenerate: () => void;
  onHexInputChange: (value: string) => void;
  onPreviewChange: (tab: PreviewTab) => void;
  onQueryChange: (value: string) => void;
  onRandom: () => void;
  onScaleOptionChange: (options: Required<ScaleGenerationOptions>) => void;
  onSeedInspect: (seed: ColorSeed | null) => void;
  onSeedSelect: (seed: ColorSeed) => void;
  onViewChange: (view: "landing" | "explorer" | "exporter" | "guide") => void;
  paletteBag: PaletteBagItem[];
  previewTab: PreviewTab;
  query: string;
  scale: GeneratedScale;
  scaleOptions: Required<ScaleGenerationOptions>;
  selectedDepth: DepthFilter;
  selectedDynasty: ColorSeedDynasty | "all";
  selectedFamily: ColorSeed["family"] | "all";
  seeds: ColorSeed[];
  totalCount: number;
}) {
  return (
    <section className="view-panel active space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-black/5 pb-4 md:flex-row md:items-center">
        <div>
          <h3 className="font-serif text-2xl tracking-[0.24em] text-[var(--fg-ink)]">天工开物</h3>
          <p className="mt-1 font-mono text-xs text-black/45">Classic Chromatic Catalog / 传统色彩探索器</p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索雅色汉字 / 拼音 / HEX..."
            className="w-full rounded-full border border-black/10 bg-white py-2 pl-10 pr-4 text-xs text-[var(--fg-ink)] outline-none transition-all focus:border-[var(--accent-cinnabar)]"
          />
          <Search className="absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-black/35" aria-hidden="true" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-3 lg:sticky lg:top-24 lg:h-fit">
          <ExplorerFilters
            error={error}
            familyOptions={familyOptions}
            hexInput={hexInput}
            onDepthChange={onDepthChange}
            onDynastyChange={onDynastyChange}
            onFamilyChange={onFamilyChange}
            onGenerate={onGenerate}
            onHexInputChange={onHexInputChange}
            onRandom={onRandom}
            selectedDepth={selectedDepth}
            selectedDynasty={selectedDynasty}
            selectedFamily={selectedFamily}
            totalCount={totalCount}
          />
          <div className="hidden rounded-xl border border-black/5 bg-[rgba(250,248,245,0.82)] p-4 text-[11px] leading-relaxed text-[var(--fg-muted)] lg:block">
            <p className="font-serif font-bold text-[var(--fg-ink)]">五正色记</p>
            <p className="mt-1">东方谓之青，南方谓之赤，西方谓之白，北方谓之黑，天谓之玄，地谓之黄。</p>
          </div>
        </aside>

        <div className="space-y-6 lg:col-span-9">
          <div className="flex items-center justify-between text-xs font-mono text-black/45">
            <span>VISIBLE COLORS</span>
            <span>{filteredCount} 项</span>
          </div>
          <ColorRodGrid
            activeSeedId={scale.baseSeed.id}
            bagIds={new Set(paletteBag.map((item) => item.seedId))}
            onBagToggle={onBagToggle}
            onSeedInspect={onSeedInspect}
            onSeedSelect={onSeedSelect}
            seeds={seeds}
          />
          <ExplorerDetail
            onCopy={onCopy}
            onPreviewChange={onPreviewChange}
            onScaleOptionChange={onScaleOptionChange}
            onViewChange={onViewChange}
            previewTab={previewTab}
            scale={scale}
            scaleOptions={scaleOptions}
          />
        </div>
      </div>
    </section>
  );
}

function ExplorerFilters({
  error,
  familyOptions,
  hexInput,
  onDepthChange,
  onDynastyChange,
  onFamilyChange,
  onGenerate,
  onHexInputChange,
  onRandom,
  selectedDepth,
  selectedDynasty,
  selectedFamily,
  totalCount
}: {
  error: string;
  familyOptions: { family: ColorSeed["family"]; label: string; count: number }[];
  hexInput: string;
  onDepthChange: (value: DepthFilter) => void;
  onDynastyChange: (value: ColorSeedDynasty | "all") => void;
  onFamilyChange: (value: ColorSeed["family"] | "all") => void;
  onGenerate: () => void;
  onHexInputChange: (value: string) => void;
  onRandom: () => void;
  selectedDepth: DepthFilter;
  selectedDynasty: ColorSeedDynasty | "all";
  selectedFamily: ColorSeed["family"] | "all";
  totalCount: number;
}) {
  return (
    <>
      <div className="spec-card space-y-3 p-5">
        <h4 className="flex items-center justify-between border-b border-black/5 pb-2 font-serif text-xs font-bold text-[var(--fg-ink)]">
          <span>按朝代风雅</span>
          <Library className="size-3.5 text-black/30" aria-hidden="true" />
        </h4>
        <div className="flex flex-wrap gap-2">
          {dynastyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onDynastyChange(option.value)}
              className={`rounded-full border px-3 py-1 text-[11px] transition-all ${
                selectedDynasty === option.value
                  ? "border-[var(--accent-cinnabar)] bg-[var(--accent-cinnabar)] text-white"
                  : "border-black/10 bg-white hover:border-[var(--accent-cinnabar)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="spec-card space-y-4 p-5">
        <h4 className="font-serif text-xs font-bold text-[var(--fg-ink)]">选色与生成</h4>
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-black/45" htmlFor="hex-input">
            HEX 输入
          </label>
          <div className="flex gap-2">
            <input
              id="hex-input"
              value={hexInput}
              onChange={(event) => onHexInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onGenerate();
                }
              }}
              className="min-h-11 min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 text-sm"
              placeholder="#cf4813"
            />
            <button
              type="button"
              onClick={onGenerate}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--fg-ink)] px-4 text-sm font-bold text-white"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              生成
            </button>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
        <div className="grid gap-3">
          <label className="block">
            <span className="text-[11px] font-bold text-black/45">按色系筛选</span>
            <select
              value={selectedFamily}
              onChange={(event) => onFamilyChange(event.target.value as ColorSeed["family"] | "all")}
              className="mt-1 min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm"
            >
              <option value="all">全部色系 ({totalCount})</option>
              {familyOptions.map((option) => (
                <option key={option.family} value={option.family}>
                  {option.label}系 ({option.count})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[11px] font-bold text-black/45">按明暗筛选</span>
            <select
              value={selectedDepth}
              onChange={(event) => onDepthChange(event.target.value as DepthFilter)}
              className="mt-1 min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm"
            >
              {depthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={onRandom}
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white font-serif text-sm text-[var(--fg-ink)] transition-all hover:border-[var(--accent-cinnabar)] hover:text-[var(--accent-cinnabar)]"
        >
          <Dice5 className="size-4" aria-hidden="true" />
          随机一枚传统色
        </button>
      </div>
    </>
  );
}

function ColorRodGrid({
  activeSeedId,
  bagIds,
  onBagToggle,
  onSeedInspect,
  onSeedSelect,
  seeds
}: {
  activeSeedId: string;
  bagIds: Set<string>;
  onBagToggle: (seed: ColorSeed) => void;
  onSeedInspect: (seed: ColorSeed) => void;
  onSeedSelect: (seed: ColorSeed) => void;
  seeds: ColorSeed[];
}) {
  return (
    <div className="color-rod-grid">
      {seeds.map((seed) => {
        const bagged = bagIds.has(seed.id);
        return (
          <article
            key={seed.id}
            className={`color-rod ${activeSeedId === seed.id ? "border-[rgba(43,43,43,0.18)] shadow-[0_16px_28px_rgba(43,43,43,0.06)]" : ""}`}
          >
            <div className="flex h-full flex-col text-left">
              <div className="relative h-28" style={{ backgroundColor: seed.hex }}>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onBagToggle(seed);
                  }}
                  className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[10px] transition-all hover:border-[var(--accent-cinnabar)]"
                  aria-label={bagged ? `移出 ${seed.nameZh}` : `加入 ${seed.nameZh}`}
                >
                  <Bookmark
                    className={`size-3.5 ${
                      bagged ? "fill-[var(--accent-cinnabar)] text-[var(--accent-cinnabar)]" : "text-[var(--fg-ink)]/60"
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {seed.sealLabel ? (
                  <span className="absolute right-11 top-2 rounded-sm bg-white/85 px-1 py-0.5 font-serif text-[8px] text-[var(--accent-cinnabar)]">
                    {seed.sealLabel}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onSeedSelect(seed)}
                className="flex flex-1 flex-col text-left"
              >
                <div className="flex flex-1 items-center justify-center px-2 py-4">
                  <div className="vertical-text text-2xl tracking-[0.18em] text-[var(--fg-ink)]">{seed.nameZh}</div>
                </div>
                <div className="space-y-1 border-t border-black/5 px-3 py-3">
                  <div className="font-mono text-[10px] text-black/40">{seed.hex}</div>
                  <div className="line-clamp-2 font-serif text-[10px] leading-relaxed text-[var(--fg-muted)]">
                    {seed.poemLine ?? seed.note ?? seed.moodTags.join(" / ")}
                  </div>
                </div>
              </button>
            </div>
            <button
              type="button"
              onClick={() => onSeedInspect(seed)}
              className="flex min-h-10 items-center justify-between border-t border-black/5 px-3 text-[11px] font-serif text-[var(--fg-muted)] md:hidden"
            >
              查看详情
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </button>
          </article>
        );
      })}
    </div>
  );
}

function ExplorerDetail({
  onCopy,
  onPreviewChange,
  onScaleOptionChange,
  onViewChange,
  previewTab,
  scale,
  scaleOptions
}: {
  onCopy: (text: string, message: string) => void;
  onPreviewChange: (tab: PreviewTab) => void;
  onScaleOptionChange: (options: Required<ScaleGenerationOptions>) => void;
  onViewChange: (view: "landing" | "explorer" | "exporter" | "guide") => void;
  previewTab: PreviewTab;
  scale: GeneratedScale;
  scaleOptions: Required<ScaleGenerationOptions>;
}) {
  return (
    <div className="space-y-4">
      <section className="spec-card p-5">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[rgba(193,44,31,0.08)] px-3 py-1 text-xs font-bold text-[var(--accent-cinnabar)]">
                {scale.baseSeed.wuxingHue ?? "青"}
              </span>
              {scale.baseSeed.dynasty ? (
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-[var(--fg-muted)]">{scale.baseSeed.dynasty}</span>
              ) : null}
              {scale.baseSeed.moodTags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-[var(--fg-muted)]">
                  {tag}
                </span>
              ))}
            </div>
            <h4 className="mt-4 font-serif text-4xl tracking-[0.16em] text-[var(--fg-ink)]">{scale.baseSeed.nameZh}</h4>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-black/45">{scale.baseSeed.namePinyin}</p>
            <p className="mt-4 font-serif text-sm leading-8 text-[var(--fg-muted)]">
              {scale.baseSeed.poemLine ?? scale.baseSeed.note ?? "这一色适合作为东方视觉中的留白主调，也适合作为现代产品中的主强调色。"}
            </p>
            {scale.baseSeed.note ? <p className="mt-3 text-xs leading-6 text-black/45">{scale.baseSeed.note}</p> : null}
          </div>
          <div className="rounded-2xl border border-black/5 bg-[#faf8f5] p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40">Current scale</span>
              <button
                type="button"
                onClick={() => onViewChange("exporter")}
                className="inline-flex items-center gap-1 text-xs font-serif text-[var(--accent-cinnabar)]"
              >
                画轴装裱
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {scale.colors.map((color) => (
                <button
                  key={color.step}
                  type="button"
                  onClick={() => onCopy(color.hex, `已复制 ${color.step} 色阶`)}
                  className="grid min-h-11 grid-cols-[44px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-black/5 bg-white p-2 text-left transition-all hover:-translate-y-0.5"
                >
                  <span className="h-full rounded-md border border-black/10" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-[var(--fg-ink)]">{color.step}</span>
                      <span className="font-mono text-[10px] uppercase text-black/40">{color.hex}</span>
                    </span>
                    <span className="text-[11px] text-[var(--fg-muted)]">{color.role}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <details className="spec-card group overflow-hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 font-serif text-sm text-[var(--fg-ink)]">
          色阶参数与场景预览
          <span className="text-xs text-black/35 group-open:hidden">展开</span>
          <span className="hidden text-xs text-black/35 group-open:inline">收起</span>
        </summary>
        <div className="border-t border-black/5 p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_1.2fr]">
            <div className="space-y-4">
              <RangeControl
                label="明度"
                max={8}
                min={-8}
                value={Math.round(scaleOptions.lightnessShift * 100)}
                valueLabel={`${Math.round(scaleOptions.lightnessShift * 100)}`}
                onChange={(value) => onScaleOptionChange({ ...scaleOptions, lightnessShift: value / 100 })}
              />
              <RangeControl
                label="饱和"
                max={135}
                min={65}
                value={Math.round(scaleOptions.chromaScale * 100)}
                valueLabel={`${Math.round(scaleOptions.chromaScale * 100)}%`}
                onChange={(value) => onScaleOptionChange({ ...scaleOptions, chromaScale: value / 100 })}
              />
              <button
                type="button"
                onClick={() => onScaleOptionChange({ lightnessShift: 0, chromaScale: 1 })}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-black/10 px-4 text-sm font-serif text-[var(--fg-muted)]"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                重置色阶参数
              </button>
            </div>
            <PreviewPanel active={previewTab} onChange={onPreviewChange} scale={scale} />
          </div>
        </div>
      </details>
    </div>
  );
}
