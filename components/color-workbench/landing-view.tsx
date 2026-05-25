import React from "react";
import { Palette, ScrollText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { catalogColorSeeds } from "@/data/catalog-color-seeds";
import type { AppView, ColorSeed, GeneratedScale } from "@/lib/types";

import { wuxingDescriptions } from "@/components/color-workbench/constants";

const landingMarqueeSeeds = catalogColorSeeds;

export function LandingView({
  onRandomGenerate,
  onViewChange,
  scale,
}: {
  onRandomGenerate: () => void;
  onViewChange: (view: AppView) => void;
  scale: GeneratedScale;
}) {
  const [activeMarqueeIndex, setActiveMarqueeIndex] = useState(0);

  useEffect(() => {
    if (landingMarqueeSeeds.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveMarqueeIndex((currentIndex) => {
        return (currentIndex + 1) % landingMarqueeSeeds.length;
      });
    }, 2600);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const getWrappedSeed = (offset: number) => {
    const index =
      (activeMarqueeIndex + offset + landingMarqueeSeeds.length) %
      landingMarqueeSeeds.length;

    return landingMarqueeSeeds[index];
  };

  const marqueeSeeds = [
    { slot: "far-left" as const, seed: getWrappedSeed(-2) },
    { slot: "left" as const, seed: getWrappedSeed(-1) },
    { slot: "center" as const, seed: getWrappedSeed(0) },
    { slot: "right" as const, seed: getWrappedSeed(1) },
    { slot: "far-right" as const, seed: getWrappedSeed(2) },
  ];

  return (
    <section className="view-panel active space-y-16">
      <div className="grid items-center gap-12 py-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.34em] text-[var(--accent-cinnabar)]">
            Chinese Classical Color Spectrum
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-[0.06em] text-[var(--fg-ink)] md:text-6xl">
            雨过天晴云破处
            <br />
            <span className="text-[var(--accent-cinnabar)]">这般颜色</span>
            做将来
          </h2>
          <p className="max-w-lg font-serif text-sm leading-8 text-[var(--fg-muted)] md:text-base">
            中华传统色彩美学，肇始于河图洛书，成系统于春秋诸子。青、赤、黄、白、黑为五正色。国色以现代交互承载东方色谱，让传统颜色重新进入今天的设计与开发。
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="button"
              onClick={() => onViewChange("explorer")}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--fg-ink)] px-6 py-2.5 font-serif text-sm text-white transition-all duration-300 hover:bg-black"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              步入色谱大观
            </button>
            <button
              type="button"
              onClick={() => onViewChange("exporter")}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-2.5 font-serif text-sm text-[var(--fg-ink)] transition-all duration-300 hover:border-[var(--accent-cinnabar)] hover:text-[var(--accent-cinnabar)]"
            >
              <ScrollText className="size-4" aria-hidden="true" />
              印制东方海报
            </button>
            <button
              type="button"
              onClick={onRandomGenerate}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f5f3ef] px-6 py-2.5 font-serif text-sm text-[var(--fg-ink)] transition-all duration-300 hover:border-[var(--fg-ink)] hover:bg-white"
            >
              <Palette className="size-4" aria-hidden="true" />
              随机色笺
            </button>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-[2rem] px-4 py-5 backdrop-blur-md md:px-5">
            <div
              className="hero-marquee-stage"
              aria-label="首屏流动笺"
            >
              {marqueeSeeds.map(({ slot, seed }) => (
                <LandingColorNote
                  key={seed.id}
                  seed={seed}
                  slot={slot}
                  aria-hidden={slot === "far-left" || slot === "far-right"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section
          className="py-2"
          aria-label="首页随机色阶模块"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(8.5rem,8.5rem)_1fr] lg:items-stretch xl:gap-14">
            <div className="flex justify-center lg:justify-start">
              <LandingColorNote
                seed={scale.baseSeed}
                aria-label={`首页随机${scale.baseSeed.nameZh}色笺`}
              />
            </div>

            <div className="flex min-h-[28rem] flex-col justify-around gap-8">
              <div className="flex flex-col gap-4 border-b border-black/5 pb-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40">
                    Landing Scale Generator
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className="h-10 w-10 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: scale.baseHex }}
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="font-serif text-2xl tracking-[0.14em] text-[var(--fg-ink)]">
                        {scale.baseSeed.nameZh}
                      </h4>
                      <p className="font-mono text-[11px] text-[var(--fg-muted)]">
                        {scale.baseSeed.namePinyin} · {scale.baseHex}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 md:max-w-sm md:text-right">
                  <p className="text-sm font-serif leading-7 text-[var(--fg-muted)]">
                    {scale.baseSeed.poemLine ??
                      scale.baseSeed.note ??
                      `${scale.baseSeed.nameZh}适合延展为一组完整的东方色阶。`}
                  </p>
                  <button
                    type="button"
                    onClick={() => onViewChange("explorer")}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--fg-ink)] px-4 py-2 font-serif text-sm text-white transition-all duration-300 hover:bg-black"
                  >
                    <Sparkles className="size-4" aria-hidden="true" />
                    用这枚笺步入色谱
                  </button>
                </div>
              </div>

              <div
                className="grid gap-3 md:grid-cols-11"
                aria-label={`${scale.baseSeed.nameZh}色阶`}
              >
                {scale.colors.map((color) => (
                  <article
                    key={color.step}
                    className="overflow-hidden rounded-xl border border-black/5 bg-white"
                  >
                    <div
                      className="landing-scale-swatch h-20 w-full"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <div className="space-y-1 px-3 py-3">
                      <p className="font-mono text-[10px] text-black/45">
                        {color.step}
                      </p>
                      <p className="font-mono text-[10px] text-[var(--fg-ink)]">
                        {color.hex}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-xl space-y-2 text-center">
        <h3 className="font-serif text-2xl tracking-[0.24em]">五正色美学观</h3>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
          The Philosophy of Five Primary Colors
        </p>
        <div className="mx-auto my-3 h-px w-12 bg-[var(--accent-cinnabar)]" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {wuxingDescriptions.map((item) => (
          <div
            key={item.hue}
            className="spec-card flex flex-col justify-between space-y-3 rounded-xl p-4"
          >
            <div
              className="h-8 w-full rounded"
              style={{
                backgroundColor: item.swatch,
                border: item.hue === "白" ? "1px solid #e8e3db" : undefined,
              }}
            />
            <div>
              <h4 className="font-serif text-sm font-bold text-[var(--fg-ink)]">
                {item.title} (
                {item.hue === "青"
                  ? "青碧"
                  : item.hue === "赤"
                    ? "赤红"
                    : item.hue === "黄"
                      ? "金黄"
                      : item.hue === "白"
                        ? "素白"
                        : "玄黑"}
                )
              </h4>
              <p className="mt-1 text-[11px] leading-relaxed text-[var(--fg-muted)]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LandingColorNote({
  seed,
  slot,
  "aria-label": ariaLabel,
  ...articleProps
}: {
  seed: ColorSeed;
  slot?: "far-left" | "left" | "center" | "right" | "far-right";
} & React.ComponentPropsWithoutRef<"article">) {
  return (
    <article
      {...articleProps}
      className="hero-marquee-card"
      data-slot={slot}
      aria-label={ariaLabel ?? `${seed.nameZh}色笺`}
    >
      <div
        className="hero-marquee-swatch"
        style={{ backgroundColor: seed.hex }}
      >
        <LandingColorNoteSwatchContent seed={seed} />
      </div>
      <div className="hero-marquee-meta">
        <p className="hero-marquee-hex">
          {seed.hex.toUpperCase()}
        </p>
        <p className="hero-marquee-note">
          {seed.poemLine ??
            seed.note ??
            `${seed.nameZh}适合落在东方视觉的留白之间。`}
        </p>
      </div>
    </article>
  );
}

function LandingColorNoteSwatchContent({ seed }: { seed: ColorSeed }) {
  return (
    <>
      {seed.sealLabel ? (
        <span className="hero-marquee-seal">
          {seed.sealLabel}
        </span>
      ) : null}
      <span className="hero-marquee-name">{seed.nameZh}</span>
    </>
  );
}
