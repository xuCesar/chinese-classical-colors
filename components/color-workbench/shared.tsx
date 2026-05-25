import { Copy } from "lucide-react";

import { getScaleColor } from "@/lib/color-utils";
import type { GeneratedScale, ScaleStep } from "@/lib/types";

import { previewTabs, type PreviewTab } from "@/components/color-workbench/constants";

export function GuideSection({
  children,
  id,
  index,
  title
}: {
  children: React.ReactNode;
  id: string;
  index: string;
  title: string;
}) {
  return (
    <section id={id} className="spec-card space-y-5 p-6 md:p-8">
      <div className="flex items-center gap-3 border-b border-black/5 pb-4">
        <span className="font-mono text-2xl text-[var(--accent-cinnabar)]/30">{index}/</span>
        <h2 className="font-serif text-2xl tracking-[0.18em]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function SwatchSpec({
  swatch,
  title,
  token,
  value
}: {
  swatch: string;
  title: string;
  token: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-black/5 p-4">
      <div className="h-12 w-12 rounded-full border border-black/10" style={{ backgroundColor: swatch }} />
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-serif font-bold">{title}</span>
          <span className="font-mono text-xs text-[var(--accent-cinnabar)]">{token}</span>
        </div>
        <div className="mt-1 font-mono text-[11px] text-black/45">{value}</div>
      </div>
    </div>
  );
}

export function CodeCard({
  code,
  onCopy
}: {
  code: string;
  onCopy: () => void;
}) {
  return (
    <div className="relative rounded-xl border border-black/5 bg-[#f5f3ef] p-4">
      <button type="button" onClick={onCopy} className="absolute right-3 top-3 text-black/35 transition-all hover:text-[var(--accent-cinnabar)]">
        <Copy className="size-4" aria-hidden="true" />
      </button>
      <pre className="code-pre font-mono text-[11px] text-[var(--fg-ink)]/80">{code}</pre>
    </div>
  );
}

export function RangeControl({
  label,
  max,
  min,
  onChange,
  value,
  valueLabel
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
  valueLabel: string;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-bold text-[var(--fg-muted)]">
        {label}
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/45">{valueLabel}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-[var(--accent-cinnabar)]"
      />
    </label>
  );
}

export function PreviewPanel({
  active,
  onChange,
  scale
}: {
  active: PreviewTab;
  onChange: (tab: PreviewTab) => void;
  scale: GeneratedScale;
}) {
  return (
    <section className="rounded-xl border border-black/5 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Preview</p>
          <h2 className="mt-1 text-lg font-black text-[var(--fg-ink)]">场景预览</h2>
        </div>
        <div className="grid grid-cols-2 rounded-full border border-black/10 bg-[#f7f3ed] p-1">
          {previewTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`min-h-9 rounded-full px-3 text-sm font-bold transition ${
                active === tab ? "bg-white text-[var(--fg-ink)] shadow-sm" : "text-[var(--fg-muted)]"
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
            <p className="text-sm font-bold" style={{ color: primary }}>
              设计系统
            </p>
            <h3 className="mt-1 text-2xl font-black text-[var(--fg-ink)]">产品色彩映射</h3>
          </div>
          <button type="button" className="rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm" style={{ backgroundColor: primary }}>
            应用主色
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {["组件", "对比", "导出"].map((label, index) => (
            <div key={label} className="rounded-lg border bg-white p-3" style={{ borderColor: border }}>
              <p className="text-sm text-[var(--fg-muted)]">{label}</p>
              <p className="mt-2 text-2xl font-black text-[var(--fg-ink)]">{[12, "AA", 3][index]}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border bg-white p-4" style={{ borderColor: border }}>
          <div className="flex h-36 items-end gap-2">
            {[35, 72, 48, 92, 64, 78, 55].map((height, index) => (
              <span
                key={height + index}
                className="flex-1 rounded-t-md"
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
        <h3 className="text-lg font-black text-[var(--fg-ink)]">组件状态</h3>
        <div className="mt-4 space-y-3">
          <input readOnly value={`${scale.baseSeed.nameZh} / ${scale.baseHex}`} className="min-h-11 w-full rounded-md border px-3 text-sm" style={{ borderColor: border }} />
          <div className="grid grid-cols-2 gap-2">
            <button className="min-h-11 rounded-md text-sm font-bold text-white" style={{ backgroundColor: primary }}>
              主按钮
            </button>
            <button className="min-h-11 rounded-md border text-sm font-bold" style={{ borderColor: primary, color: primary }}>
              次按钮
            </button>
          </div>
          <div className="rounded-lg p-3" style={{ backgroundColor: getScaleColor(scale, 100).hex }}>
            <p className="text-sm font-bold" style={{ color: dark }}>
              状态提示
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">这组色阶已映射到背景、边框、强调与标题角色。</p>
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
        className="relative min-h-[340px] overflow-hidden rounded-lg p-6"
        style={{ backgroundColor: getScaleColor(scale, 900).hex, color: getScaleColor(scale, 900).foreground }}
      >
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(90deg,currentColor_1px,transparent_1px),linear-gradient(currentColor_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.24em] opacity-80">chinese classical colors</p>
          <h3 className="mt-16 font-serif text-6xl font-bold">{scale.baseSeed.nameZh}</h3>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] opacity-80">{scale.baseSeed.namePinyin}</p>
          <div className="mt-12 h-1 w-24 rounded-full" style={{ backgroundColor: getScaleColor(scale, 300).hex }} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-white/82 p-5" style={{ borderColor: getScaleColor(scale, 200).hex }}>
          <p className="font-serif text-2xl font-semibold text-[var(--fg-ink)]">色笺</p>
          <p className="mt-4 font-serif text-lg leading-9 text-[var(--fg-muted)]">
            一色入纸，半是风物，半是器用。{scale.baseSeed.nameZh} 宜作主调，也宜藏在边框与阴影之间。
          </p>
        </div>
        <div className="rounded-lg border bg-white/82 p-5" style={{ borderColor: getScaleColor(scale, 200).hex }}>
          <p className="font-serif text-2xl font-semibold text-[var(--fg-ink)]">色卡</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {[100, 300, 500, 700, 900, 950].map((step) => {
              const color = getScaleColor(scale, step as ScaleStep);
              return (
                <div
                  key={step}
                  className="flex min-h-16 items-end rounded-md p-2 text-xs font-bold"
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
