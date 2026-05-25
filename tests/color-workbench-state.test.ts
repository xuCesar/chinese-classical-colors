import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";

import { catalogColorSeeds } from "@/data/catalog-color-seeds";
import { defaultSeed } from "@/components/color-workbench/constants";
import { useColorWorkbenchState } from "@/components/color-workbench/use-color-workbench-state";

describe("useColorWorkbenchState", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("randomizes a landing seed without leaving the landing view", () => {
    const { result } = renderHook(() => useColorWorkbenchState());
    const candidates = catalogColorSeeds.filter((seed) => seed.id !== defaultSeed.id);
    const expectedSeed = candidates[0];

    vi.spyOn(Math, "random").mockReturnValue(0);

    act(() => {
      result.current.actions.randomizeLandingSeed();
    });

    expect(result.current.state.activeView).toBe("landing");
    expect(result.current.state.scale.baseSeed.id).toBe(expectedSeed.id);
    expect(result.current.state.hexInput).toBe(expectedSeed.hex);
    expect(result.current.state.error).toBe("");
  });

  it("keeps explorer random navigation behavior", () => {
    const { result } = renderHook(() => useColorWorkbenchState());
    const candidates = catalogColorSeeds.filter((seed) => seed.id !== defaultSeed.id);
    const expectedSeed = candidates[0];

    vi.spyOn(Math, "random").mockReturnValue(0);

    act(() => {
      result.current.actions.randomSeed();
    });

    expect(result.current.state.activeView).toBe("explorer");
    expect(result.current.state.scale.baseSeed.id).toBe(expectedSeed.id);
    expect(result.current.state.hexInput).toBe(expectedSeed.hex);
  });
});
