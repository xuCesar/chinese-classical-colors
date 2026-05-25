import { Bookmark, Copy, ScrollText, Trash2 } from "lucide-react";

import { getScaleColor } from "@/lib/color-utils";
import type { ExportFormat, GeneratedScale, PaletteBagItem, SavedPalette } from "@/lib/types";

import { exportFormats } from "@/components/color-workbench/constants";

export function ExporterView({
  exportFormat,
  exportText,
  onBagColorLoad,
  onCopy,
  onFormatChange,
  onPaletteRemove,
  onPaletteRename,
  onPaletteRestore,
  onSave,
  paletteBag,
  savedPalettes,
  scale,
  sealText,
  setSealText
}: {
  exportFormat: ExportFormat;
  exportText: string;
  onBagColorLoad: (seedId: string) => void;
  onCopy: (text: string, message: string) => void;
  onFormatChange: (format: ExportFormat) => void;
  onPaletteRemove: (id: string) => void;
  onPaletteRename: (id: string, name: string) => void;
  onPaletteRestore: (palette: SavedPalette) => void;
  onSave: () => void;
  paletteBag: PaletteBagItem[];
  savedPalettes: SavedPalette[];
  scale: GeneratedScale;
  sealText: string;
  setSealText: (value: string) => void;
}) {
  return (
    <section className="view-panel active space-y-8">
      <div className="border-b border-black/5 pb-4">
        <h3 className="font-serif text-2xl tracking-[0.24em] text-[var(--fg-ink)]">画轴印制</h3>
        <p className="mt-1 font-mono text-xs text-black/45">Interactive Hanging Poster Scroll & Developer Exporter</p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <PosterPreview scale={scale} sealText={sealText} />
        </div>

        <div className="space-y-6 lg:col-span-7">
          <section className="spec-card space-y-4 p-6">
            <h4 className="flex items-center justify-between font-serif text-lg font-bold text-[var(--fg-ink)]">
              <span>海报装裱参数</span>
              <ScrollText className="size-4 text-black/30" aria-hidden="true" />
            </h4>
            <div className="grid gap-4 text-xs md:grid-cols-2">
              <div className="space-y-2">
                <label className="font-serif text-[var(--fg-muted)]">刻写朱砂印章</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={sealText}
                    onChange={(event) => setSealText(event.target.value.slice(0, 4))}
                    className="min-h-11 flex-1 rounded-xl border border-black/10 bg-white px-3"
                  />
                  <button
                    type="button"
                    onClick={() => setSealText((sealText.trim() || "雅赏").slice(0, 4))}
                    className="rounded-full bg-[var(--accent-cinnabar)] px-4 py-2 text-xs font-serif text-white"
                  >
                    重刻
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-serif text-[var(--fg-muted)]">从采色袋选择主色</label>
                <select
                  value=""
                  onChange={(event) => {
                    if (event.target.value) {
                      onBagColorLoad(event.target.value);
                    }
                  }}
                  className="min-h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-xs"
                >
                  <option value="">-- 选择采色袋中的主色 --</option>
                  {paletteBag.map((item) => (
                    <option key={item.seedId} value={item.seedId}>
                      {item.nameZh} · {item.hex}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="spec-card space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <h4 className="font-serif text-base font-bold text-[var(--fg-ink)]">开发者代码输出</h4>
              <div className="flex gap-2 font-mono text-[10px]">
                {exportFormats.map((format) => (
                  <button
                    key={format.value}
                    type="button"
                    onClick={() => onFormatChange(format.value)}
                    className={`rounded px-2 py-1 ${
                      exportFormat === format.value ? "bg-[var(--accent-cinnabar)] text-white" : "bg-black/5 text-[var(--fg-ink)]"
                    }`}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative rounded-xl border border-black/5 bg-[#f5f3ef] p-4">
              <button
                type="button"
                onClick={() => onCopy(exportText, "代码已复制")}
                className="absolute right-3 top-3 text-black/35 transition-all hover:text-[var(--accent-cinnabar)]"
              >
                <Copy className="size-4" aria-hidden="true" />
              </button>
              <pre className="code-pre font-mono text-[11px] leading-relaxed text-[var(--fg-ink)]/80">{exportText}</pre>
            </div>
            <button
              type="button"
              onClick={onSave}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--fg-ink)] px-4 font-serif text-sm text-white"
            >
              <Bookmark className="size-4" aria-hidden="true" />
              保存当前色板
            </button>
          </section>

          <section className="spec-card space-y-4 p-6">
            <h4 className="font-serif text-base font-bold text-[var(--fg-ink)]">我的色板</h4>
            {savedPalettes.length === 0 ? (
              <p className="text-sm text-[var(--fg-muted)]">当前浏览器还没有保存的色板。</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {savedPalettes.map((palette) => (
                  <div key={palette.id} className="rounded-xl border border-black/5 bg-white p-3">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 rounded-lg border border-black/10" style={{ backgroundColor: palette.scale.baseHex }} aria-hidden="true" />
                      <input
                        value={palette.name}
                        onChange={(event) => onPaletteRename(palette.id, event.target.value)}
                        className="min-h-10 min-w-0 flex-1 rounded-lg border border-black/10 px-3 text-sm font-bold"
                        aria-label="色板名称"
                      />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onPaletteRestore(palette)}
                        className="min-h-10 rounded-full bg-[var(--fg-ink)] text-sm font-bold text-white"
                      >
                        恢复
                      </button>
                      <button
                        type="button"
                        onClick={() => onPaletteRemove(palette.id)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-black/10 text-sm font-bold text-[var(--fg-muted)]"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

function PosterPreview({
  scale,
  sealText
}: {
  scale: GeneratedScale;
  sealText: string;
}) {
  const posterColor = getScaleColor(scale, 300).hex;

  return (
    <div className="flex h-[460px] items-center justify-center rounded-2xl border border-black/5 bg-white/40 p-5 md:p-8">
      <div className="relative flex h-[380px] w-full max-w-[253px] flex-col overflow-hidden border border-black/10 bg-[#faf8f5] p-4 shadow-2xl md:h-[400px] md:max-w-[267px]">
        <div className="absolute -top-2.5 left-1/2 h-2 w-[104%] -translate-x-1/2 rounded-sm bg-yellow-950 shadow-md" />
        <div className="absolute -bottom-2.5 left-1/2 h-3 w-[104%] -translate-x-1/2 rounded bg-yellow-950 shadow-md" />

        <div className="flex items-start justify-between border-b border-black/5 pb-3">
          <div className="leading-none">
            <span className="block font-mono text-[8px] uppercase text-black/30">CHINESE AESTHETIC</span>
            <span className="mt-1 block font-serif text-[11px] text-black/50">{scale.baseSeed.dynasty ?? "宋朝"}风雅</span>
          </div>
          <div className="cinnabar-seal flex h-7 w-7 items-center justify-center rounded-sm text-[11px] font-bold">
            {(sealText.trim() || "雅赏").slice(0, 4)}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-around gap-4 overflow-hidden py-4">
          <div className="vertical-text flex max-h-full items-center justify-center overflow-hidden font-serif text-4xl leading-none tracking-[0.12em] text-[var(--fg-ink)]">
            {scale.baseSeed.nameZh}
          </div>
          <div className="flex min-h-0 flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-full border-[3px] border-white shadow-xl" style={{ backgroundColor: posterColor }} />
            <div className="vertical-text h-28 overflow-hidden text-center font-serif text-[11px] leading-relaxed text-[var(--fg-muted)]">
              {scale.baseSeed.poemLine ?? scale.baseSeed.note ?? "一色入纸，半是风物，半是器用。"}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-black/5 pt-3 font-mono text-[9px] text-black/45">
          <div className="space-y-0.5">
            <div>
              HEX: <span className="text-[var(--fg-ink)]">{scale.baseHex}</span>
            </div>
            <div>
              PINYIN: <span className="text-[var(--fg-ink)]">{scale.baseSeed.namePinyin}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="rounded bg-black/5 px-1.5 py-0.5 text-[7px] text-black/50">中华传统色</span>
          </div>
        </div>
      </div>
    </div>
  );
}
