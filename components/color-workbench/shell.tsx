import { ChevronRight, Library, Menu, Trash2, X } from "lucide-react";

import { catalogColorSeeds } from "@/data/catalog-color-seeds";
import type { AppView, ColorSeed, PaletteBagItem } from "@/lib/types";

import { viewItems } from "@/components/color-workbench/constants";

export function AppHeader({
  activeView,
  bagCount,
  mobileMenuOpen,
  onMenuToggle,
  onOpenBag,
  onViewChange
}: {
  activeView: AppView;
  bagCount: number;
  mobileMenuOpen: boolean;
  onMenuToggle: () => void;
  onOpenBag: () => void;
  onViewChange: (view: AppView) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[rgba(250,248,245,0.9)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <button type="button" onClick={() => onViewChange("landing")} className="flex items-center gap-3 text-left">
          <span className="cinnabar-seal flex h-9 w-9 items-center justify-center rounded-sm text-sm font-bold">国色</span>
          <span className="leading-none">
            <span className="block font-serif text-lg font-bold tracking-[0.22em] text-[var(--fg-ink)]">中国传统色</span>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.24em] text-black/40">
              Zen Color Spec & App
            </span>
          </span>
        </button>

        <nav className="relative hidden items-center gap-8 md:flex">
          {viewItems.map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => onViewChange(item.view)}
              className={`nav-btn-tab relative py-1 font-serif text-sm tracking-[0.18em] transition-all duration-300 ${
                activeView === item.view ? "nav-btn-active" : "text-[var(--fg-ink)]/60 hover:text-[var(--accent-cinnabar)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenBag}
            className="relative hidden items-center gap-2 rounded-full border border-black/10 bg-white/55 px-4 py-1.5 text-xs font-serif text-[var(--fg-ink)] transition-all duration-300 hover:border-[var(--accent-cinnabar)] hover:text-[var(--accent-cinnabar)] md:inline-flex"
          >
            <Library className="size-3.5" aria-hidden="true" />
            <span>采色袋</span>
            <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--accent-cinnabar)] px-1 text-[9px] font-sans text-white">
              {bagCount}
            </span>
          </button>
          <button
            type="button"
            onClick={mobileMenuOpen ? onMenuToggle : onMenuToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[var(--fg-ink)] md:hidden"
            aria-label="打开导航"
          >
            <Menu className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function ColorDetailSheet({
  bagged,
  onAddToBag,
  onClose,
  onCopy,
  open,
  seed
}: {
  bagged: boolean;
  onAddToBag: () => void;
  onClose: () => void;
  onCopy: (text: string, message: string) => void;
  open: boolean;
  seed: ColorSeed;
}) {
  return (
    <section className={`bottom-sheet p-5 md:hidden ${open ? "open" : ""}`}>
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/10" />
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 shrink-0 rounded-2xl border border-black/10" style={{ backgroundColor: seed.hex }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-serif text-xl">{seed.nameZh}</h4>
              <p className="mt-1 font-mono text-[11px] text-[var(--fg-muted)]">{seed.namePinyin}</p>
            </div>
            <button type="button" onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 font-serif text-xs leading-relaxed text-[var(--fg-muted)]">
            {seed.poemLine ?? seed.note ?? "这一色适合作为东方视觉中的留白主调，也适合作为现代产品中的主强调色。"}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <button type="button" onClick={() => onCopy(seed.hex, "已复制 HEX")} className="rounded-lg bg-[#f5f3ef] p-2 text-left">
              HEX
              <br />
              <span className="text-[var(--fg-ink)]">{seed.hex}</span>
            </button>
            <div className="rounded-lg bg-[#f5f3ef] p-2">
              朝代
              <br />
              <span className="text-[var(--fg-ink)]">{seed.dynasty ?? "未定"}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onAddToBag}
            className="mt-4 rounded-full border border-black/10 px-4 py-2 text-xs font-serif transition-all hover:border-[var(--accent-cinnabar)]"
          >
            {bagged ? "移出采色袋" : "加入采色袋"}
          </button>
        </div>
      </div>
    </section>
  );
}

export function PaletteBagDrawer({
  items,
  onClose,
  onLoadColor,
  onRemove,
  open
}: {
  items: PaletteBagItem[];
  onClose: () => void;
  onLoadColor: (seedId: string) => void;
  onRemove: (seedId: string) => void;
  open: boolean;
}) {
  return (
    <section className={`bottom-sheet p-5 ${open ? "open" : ""}`}>
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/10" />
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-serif text-lg">采色袋</h4>
          <p className="font-mono text-[10px] text-black/40">PALETTE BAG</p>
        </div>
        <button type="button" onClick={onClose} className="text-black/40 transition-all hover:text-[var(--accent-cinnabar)]">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="max-h-[55vh] space-y-3 overflow-auto">
        {items.length === 0 ? (
          <div className="py-6 text-center text-sm text-[var(--fg-muted)]">暂未采色。请先在探索器中挑选心仪之色。</div>
        ) : (
          items.map((item) => (
            <div key={item.seedId} className="flex items-center gap-3 rounded-xl border border-black/5 bg-[#faf8f5]/55 p-3">
              <div className="h-10 w-10 rounded-lg border border-black/10" style={{ backgroundColor: item.hex }} />
              <div className="min-w-0 flex-1">
                <div className="font-serif">{item.nameZh}</div>
                <div className="font-mono text-[10px] text-black/40">{item.hex}</div>
              </div>
              <button
                type="button"
                onClick={() => onLoadColor(item.seedId)}
                className="rounded-full border border-black/10 px-3 py-1 text-xs font-serif transition-all hover:border-[var(--accent-cinnabar)]"
              >
                装裱
              </button>
              <button
                type="button"
                onClick={() => onRemove(item.seedId)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/45"
                aria-label={`移出 ${item.nameZh}`}
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function MobileMenuSheet({
  activeView,
  onClose,
  onViewChange,
  open
}: {
  activeView: AppView;
  onClose: () => void;
  onViewChange: (view: AppView) => void;
  open: boolean;
}) {
  return (
    <section className={`bottom-sheet p-5 md:hidden ${open ? "open" : ""}`}>
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/10" />
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-serif text-lg">导航</h4>
        <button type="button" onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-2">
        {viewItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => {
                onViewChange(item.view);
                onClose();
              }}
              className={`flex min-h-12 w-full items-center justify-between rounded-xl border px-4 text-left font-serif ${
                activeView === item.view
                  ? "border-[var(--accent-cinnabar)] bg-[rgba(193,44,31,0.08)] text-[var(--accent-cinnabar)]"
                  : "border-black/5 bg-white text-[var(--fg-ink)]"
              }`}
            >
              <span className="inline-flex items-center gap-3">
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function MobileBottomNav({
  activeView,
  onViewChange
}: {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 z-40 flex w-[92%] max-w-sm -translate-x-1/2 justify-around rounded-full border border-black/10 bg-white/95 px-4 py-2.5 text-[var(--fg-muted)] shadow-xl backdrop-blur-lg md:hidden">
      {viewItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.view}
            type="button"
            onClick={() => onViewChange(item.view)}
            className={`flex flex-col items-center gap-1 font-serif text-[10px] ${activeView === item.view ? "text-[var(--accent-cinnabar)]" : ""}`}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span>{item.mobileLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SheetBackdrop({
  active,
  onClose
}: {
  active: boolean;
  onClose: () => void;
}) {
  return <div className={`sheet-backdrop ${active ? "show" : ""}`} onClick={onClose} aria-hidden="true" />;
}

export function resolveBagSeed(seedId: string): ColorSeed | undefined {
  return catalogColorSeeds.find((item) => item.id === seedId);
}
