import { Sparkles } from "lucide-react";
import { useState } from "react";

import {
  designSpecColorTokens,
  designSpecComponentNarratives,
  designSpecComponentSnippets,
  designSpecIndex,
  designSpecInteraction,
  designSpecMobile,
  designSpecPhilosophyCards,
  designSpecPosture,
  designSpecRootCssCode,
  designSpecSpacing,
  designSpecToneLabels,
  designSpecTypography,
  projectDesignRules
} from "@/lib/design-spec";

import { GuideSection, SwatchSpec, CodeCard } from "@/components/color-workbench/shared";

export function GuideView({
  onCopy
}: {
  onCopy: (text: string, message: string) => void;
}) {
  const [sealDemoText, setSealDemoText] = useState("雅赏");

  return (
    <section className="view-panel active space-y-8">
      <div className="grid gap-8 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-3 lg:sticky lg:top-24 lg:h-fit">
          <div className="spec-card space-y-3 p-5">
            <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-[var(--accent-cinnabar)]">SPECIFICATION INDEX</p>
            <nav className="flex flex-col gap-1 font-serif text-sm text-[var(--fg-muted)]">
              {designSpecIndex.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="border-b border-black/5 py-1.5 transition-all hover:text-[var(--accent-cinnabar)]">
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="spec-card space-y-2 p-5">
            <h4 className="flex items-center gap-2 font-serif text-xs font-bold text-[var(--fg-ink)]">
              <Sparkles className="size-3.5 text-[var(--accent-cinnabar)]" aria-hidden="true" />
              核心姿态
            </h4>
            <p className="font-serif text-[11px] leading-relaxed text-[var(--fg-muted)]">
              {designSpecPosture}
            </p>
          </div>
        </aside>

        <div className="space-y-8 lg:col-span-9">
          <GuideSection id="spec-overview" index="00" title="项目级设计约束">
            <p className="font-serif text-sm leading-relaxed text-[var(--fg-muted)]">
              这一页不只是视觉展示，而是当前项目的 UI 设计规范基线。后续对首页、色谱浏览、导出与移动端交互的修改，都应优先复用这里定义的色彩 token、组件语义、间距和动效节奏。
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {projectDesignRules.map((rule) => (
                <div key={rule} className="rounded-xl border border-black/5 p-4 text-xs leading-relaxed text-[var(--fg-muted)]">
                  {rule}
                </div>
              ))}
            </div>
          </GuideSection>

          <GuideSection id="spec-philosophy" index="01" title="东方禅意之美学心法">
            <p className="font-serif text-sm leading-relaxed text-[var(--fg-muted)]">
              这一风格的关键不在古风元素堆砌，而在于以现代界面的秩序感、信息密度与可操作性，承载东方留白、器物感与章法感。
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {designSpecPhilosophyCards.map(({ short, title, desc }) => (
                <div key={title} className="rounded-xl border border-black/5 p-4">
                  <h4 className="flex items-center gap-2 font-serif font-bold">
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent-cinnabar)]/10 text-[10px] text-[var(--accent-cinnabar)]">
                      {short}
                    </span>
                    {title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--fg-muted)]">{desc}</p>
                </div>
              ))}
            </div>
          </GuideSection>

          <GuideSection id="spec-colors" index="02" title="色彩系统">
            <div className="grid gap-4 md:grid-cols-2">
              {designSpecColorTokens.map((item) => (
                <SwatchSpec key={item.token} title={item.title} token={item.token} value={item.value} swatch={item.swatch} />
              ))}
            </div>
            <CodeCard code={designSpecRootCssCode} onCopy={() => onCopy(designSpecRootCssCode, "CSS变量已复制")} />
          </GuideSection>

          <GuideSection id="spec-type" index="03" title="字体与章法">
            <div className="specimen-grid rounded-xl border border-black/5 p-6">
              <div className="grid gap-8 md:grid-cols-12">
                <div className="rounded-lg border border-black/5 bg-[#faf8f5]/60 py-4 md:col-span-5">
                  <div className="flex justify-center gap-4">
                    <div className="vertical-text font-serif text-3xl leading-loose tracking-[0.22em] text-[var(--fg-ink)]">
                      {designSpecTypography.sampleTitle}
                      <br />
                      <span className="text-[var(--accent-cinnabar)]">{designSpecTypography.sampleAccent}</span>
                    </div>
                    <div className="vertical-text mt-6 text-xs tracking-[0.24em] text-black/45">{designSpecTypography.sampleCaption}</div>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-4 md:col-span-7">
                  <div className="border-l-2 border-[var(--accent-cinnabar)] pl-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40">{designSpecTypography.displayLabel}</div>
                    <div className="mt-1 font-serif text-base">{designSpecTypography.displayStack}</div>
                  </div>
                  <div className="border-l-2 border-black/15 pl-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40">{designSpecTypography.monoLabel}</div>
                    <div className="mt-1 font-mono text-xs">{designSpecTypography.monoStack}</div>
                  </div>
                </div>
              </div>
            </div>
          </GuideSection>

          <GuideSection id="spec-components" index="04" title="核心美学组件 Spec 及在线生成">
            <div className="space-y-5">
              <div className="rounded-xl border border-black/5 p-5">
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <h4 className="font-serif text-sm font-bold">1. 朱砂古法印章生成器</h4>
                  <span className="font-mono text-[10px] text-black/30">SEAL STAMP COMPONENT</span>
                </div>
                <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-center">
                  <div className="space-y-3">
                    <p className="text-xs leading-relaxed text-[var(--fg-muted)]">
                      {designSpecComponentNarratives.seal}
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={sealDemoText}
                        onChange={(event) => setSealDemoText(event.target.value.slice(0, 4))}
                        className="min-h-11 flex-1 rounded-xl border border-black/10 bg-white px-3 text-xs"
                      />
                      <button type="button" className="rounded-full bg-[var(--accent-cinnabar)] px-4 py-2 text-xs font-serif text-white">
                        刻印
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onCopy(designSpecComponentSnippets.sealHtml(sealDemoText), "印章 HTML 已复制")}
                        className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-serif"
                      >
                        复制 HTML
                      </button>
                      <button
                        type="button"
                        onClick={() => onCopy(designSpecComponentSnippets.sealCss, "印章 CSS 已复制")}
                        className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-serif"
                      >
                        复制 CSS
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center rounded-lg border border-black/5 bg-[#faf8f5]/60 py-6">
                    <div className="cinnabar-seal flex h-16 w-16 items-center justify-center rounded-sm text-base font-bold">{sealDemoText}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-black/5 p-5">
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <h4 className="font-serif text-sm font-bold">2. 纵向色柱卡片规范</h4>
                  <span className="font-mono text-[10px] text-black/30">VERTICAL COLOR ROD</span>
                </div>
                <div className="mt-4 grid gap-6 lg:grid-cols-12">
                  <div className="flex items-center justify-center rounded-lg border border-black/5 bg-[#faf8f5]/60 p-5 lg:col-span-4">
                    <article className="color-rod !h-[350px] w-[108px]">
                      <div className="relative h-28" style={{ background: "#8ea9b5" }}>
                        <div className="absolute right-2 top-2 rounded-sm bg-white/85 px-1 py-0.5 font-serif text-[8px] text-[var(--accent-cinnabar)]">汝窑</div>
                      </div>
                      <div className="flex flex-1 items-center justify-center py-4">
                        <div className="vertical-text text-2xl tracking-[0.18em] text-[var(--fg-ink)]">天青</div>
                      </div>
                      <div className="border-t border-black/5 px-3 py-3">
                        <div className="font-mono text-[10px] text-black/40">#8EA9B5</div>
                      </div>
                    </article>
                  </div>
                  <div className="flex flex-col justify-between lg:col-span-8">
                    <p className="mb-4 text-xs leading-relaxed text-[var(--fg-muted)]">
                      {designSpecComponentNarratives.colorRod}
                    </p>
                    <CodeCard
                      code={designSpecComponentSnippets.colorRodHtml}
                      onCopy={() => onCopy(designSpecComponentSnippets.colorRodHtml, "色柱结构已复制")}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-black/5 p-5">
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <h4 className="font-serif text-sm font-bold">3. 五声音律反馈组件</h4>
                  <span className="font-mono text-[10px] text-black/30">PENTATONIC FEEDBACK</span>
                </div>
                <div className="mt-4 grid gap-6 md:grid-cols-2 md:items-center">
                  <div className="space-y-3">
                    <p className="font-serif text-xs leading-relaxed text-[var(--fg-muted)]">
                      {designSpecComponentNarratives.pentatonic}
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {designSpecToneLabels.map((label) => (
                        <button key={label} type="button" className="rounded-lg border border-black/10 py-2 text-xs font-serif">
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-black/5 bg-[#faf8f5]/60 p-6">
                    <div className="flex h-8 items-end justify-center gap-1.5">
                      {designSpecToneLabels.map((label, index) => (
                        <span
                          key={label}
                          className="wave-bar playing"
                          style={{ animationDelay: `${index * 0.08}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GuideSection>

          <GuideSection id="spec-spacing" index="05" title="间距、边框与状态">
            <p className="font-serif text-xs leading-relaxed text-[var(--fg-muted)]">
              {designSpecSpacing}
            </p>
          </GuideSection>

          <GuideSection id="spec-mobile" index="06" title="移动端扩展规则">
            <p className="font-serif text-xs leading-relaxed text-[var(--fg-muted)]">
              {designSpecMobile}
            </p>
          </GuideSection>

          <GuideSection id="section-interaction" index="07" title="触觉交互动效周期">
            <p className="font-serif text-xs leading-relaxed text-[var(--fg-muted)]">
              {designSpecInteraction}
            </p>
          </GuideSection>
        </div>
      </div>
    </section>
  );
}
