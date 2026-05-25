import { fireEvent, render, screen, within } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { generateScale } from "@/lib/color-utils";
import { catalogColorSeeds } from "@/data/catalog-color-seeds";
import { defaultSeed } from "@/components/color-workbench/constants";
import { LandingView } from "@/components/color-workbench/landing-view";

describe("LandingView", () => {
  it("renders the default landing scale module", () => {
    const scale = generateScale(defaultSeed.hex, defaultSeed);

    render(
      createElement(LandingView, {
        onRandomGenerate: () => undefined,
        onViewChange: () => undefined,
        scale
      })
    );

    expect(screen.getByRole("button", { name: "随机色笺" })).toBeTruthy();
    const landingModule = screen.getByLabelText("首页随机色阶模块");

    expect(within(landingModule).getByRole("heading", { name: defaultSeed.nameZh })).toBeTruthy();
    expect(within(landingModule).getByText(new RegExp(defaultSeed.namePinyin))).toBeTruthy();
    expect(landingModule.textContent).toContain(defaultSeed.hex);

    const scaleGrid = screen.getByLabelText(`${defaultSeed.nameZh}色阶`);
    expect(within(scaleGrid).getAllByText(/^(50|100|200|300|400|500|600|700|800|900|950)$/)).toHaveLength(11);
  });

  it("renders exactly three marquee cards and highlights the center card", () => {
    const scale = generateScale(defaultSeed.hex, defaultSeed);

    render(
      createElement(LandingView, {
        onRandomGenerate: () => undefined,
        onViewChange: () => undefined,
        scale
      })
    );

    const marqueeStage = screen.getByLabelText("首屏流动笺");
    const marqueeCards = within(marqueeStage).getAllByRole("article");

    expect(marqueeCards).toHaveLength(3);
    expect(
      screen.getByLabelText(`${catalogColorSeeds[0]?.nameZh}色笺`).getAttribute("data-slot"),
    ).toBe("center");
  });

  it("renders the landing color note by default and randomizes on click", () => {
    const scale = generateScale(defaultSeed.hex, defaultSeed);
    const onRandomGenerate = vi.fn();

    render(
      createElement(LandingView, {
        onRandomGenerate,
        onViewChange: () => undefined,
        scale
      })
    );

    expect(screen.getByLabelText(`首页随机${defaultSeed.nameZh}色笺`)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "随机色笺" }));

    expect(onRandomGenerate).toHaveBeenCalledTimes(1);
  });
});
