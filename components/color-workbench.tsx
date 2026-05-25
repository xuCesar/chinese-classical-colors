"use client";

import { Check } from "lucide-react";

import { catalogColorSeeds } from "@/data/catalog-color-seeds";

import { ExplorerView } from "@/components/color-workbench/explorer-view";
import { ExporterView } from "@/components/color-workbench/exporter-view";
import { GuideView } from "@/components/color-workbench/guide-view";
import { LandingView } from "@/components/color-workbench/landing-view";
import {
  AppHeader,
  ColorDetailSheet,
  MobileBottomNav,
  MobileMenuSheet,
  PaletteBagDrawer,
  resolveBagSeed,
  SheetBackdrop
} from "@/components/color-workbench/shell";
import { useColorWorkbenchState } from "@/components/color-workbench/use-color-workbench-state";

export function ColorWorkbench() {
  const { actions, derived, state } = useColorWorkbenchState();

  return (
    <main className="rice-paper min-h-dvh overflow-x-hidden text-[var(--fg-ink)]">
      <AppHeader
        activeView={state.activeView}
        bagCount={state.paletteBag.length}
        mobileMenuOpen={state.mobileMenuOpen}
        onMenuToggle={() => actions.setMobileMenuOpen((value) => !value)}
        onOpenBag={() => actions.setPaletteDrawerOpen(true)}
        onViewChange={(view) => {
          actions.setActiveView(view);
          actions.setMobileMenuOpen(false);
        }}
      />

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:px-8 md:pb-12">
        {state.activeView === "landing" ? (
          <LandingView
            onRandomGenerate={actions.randomizeLandingSeed}
            onViewChange={actions.setActiveView}
            scale={state.scale}
          />
        ) : null}

        {state.activeView === "explorer" ? (
          <ExplorerView
            error={state.error}
            familyOptions={derived.familyOptions}
            filteredCount={derived.filteredSeeds.length}
            hexInput={state.hexInput}
            onBagToggle={actions.toggleBag}
            onCopy={(text, message) => actions.copyText(text, message)}
            onDepthChange={actions.setSelectedDepth}
            onDynastyChange={actions.setSelectedDynasty}
            onFamilyChange={actions.setSelectedFamily}
            onGenerate={() => actions.regenerateByHex()}
            onHexInputChange={actions.setHexInput}
            onPreviewChange={actions.setActivePreview}
            onQueryChange={actions.setQuery}
            onRandom={actions.randomSeed}
            onScaleOptionChange={actions.updateScaleOptions}
            onSeedInspect={actions.setMobileSheetSeed}
            onSeedSelect={actions.selectSeed}
            onViewChange={actions.setActiveView}
            paletteBag={state.paletteBag}
            previewTab={state.activePreview}
            query={state.query}
            scale={state.scale}
            scaleOptions={state.scaleOptions}
            selectedDepth={state.selectedDepth}
            selectedDynasty={state.selectedDynasty}
            selectedFamily={state.selectedFamily}
            seeds={derived.visibleSeeds}
            totalCount={catalogColorSeeds.length}
          />
        ) : null}

        {state.activeView === "exporter" ? (
          <ExporterView
            exportFormat={state.exportFormat}
            exportText={derived.exportText}
            onBagColorLoad={actions.loadBagColor}
            onCopy={(text, message) => actions.copyText(text, message)}
            onFormatChange={actions.setExportFormat}
            onPaletteRemove={actions.removePalette}
            onPaletteRename={actions.renamePalette}
            onPaletteRestore={actions.restorePalette}
            onSave={actions.saveCurrentPalette}
            paletteBag={state.paletteBag}
            savedPalettes={state.savedPalettes}
            scale={state.scale}
            sealText={state.sealText}
            setSealText={actions.setSealText}
          />
        ) : null}

        {state.activeView === "guide" ? <GuideView onCopy={(text, message) => actions.copyText(text, message)} /> : null}
      </main>

      <MobileBottomNav activeView={state.activeView} onViewChange={actions.setActiveView} />

      <SheetBackdrop
        active={Boolean(state.mobileSheetSeed) || state.paletteDrawerOpen || state.mobileMenuOpen}
        onClose={() => {
          actions.setMobileSheetSeed(null);
          actions.setPaletteDrawerOpen(false);
          actions.setMobileMenuOpen(false);
        }}
      />

      <ColorDetailSheet
        bagged={state.paletteBag.some((item) => item.seedId === state.activeSheetSeed.id)}
        onAddToBag={() => actions.toggleBag(state.activeSheetSeed)}
        onClose={() => actions.setMobileSheetSeed(null)}
        onCopy={(text, message) => actions.copyText(text, message)}
        open={Boolean(state.mobileSheetSeed)}
        seed={state.activeSheetSeed}
      />

      <PaletteBagDrawer
        items={state.paletteBag}
        onClose={() => actions.setPaletteDrawerOpen(false)}
        onLoadColor={actions.loadBagColor}
        onRemove={(seedId) => {
          const seed = resolveBagSeed(seedId);
          if (!seed) {
            return;
          }
          actions.toggleBag(seed);
        }}
        open={state.paletteDrawerOpen}
      />

      <MobileMenuSheet
        activeView={state.activeView}
        onClose={() => actions.setMobileMenuOpen(false)}
        onViewChange={actions.setActiveView}
        open={state.mobileMenuOpen}
      />

      {state.toast ? (
        <div aria-live="polite" className="toast-msg show">
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" aria-hidden="true" />
            {state.toast}
          </span>
        </div>
      ) : null}
    </main>
  );
}
