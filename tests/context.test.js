import { describe, it, expect } from "vitest";
import { CONTEXTS, getContext, buildContextPlan } from "../src/lib/context.js";
import { isKnownMood } from "../src/lib/moods.js";

describe("CONTEXTS data integrity", () => {
  it("every context has at least one suggested mood that exists in the mood taxonomy", () => {
    for (const context of CONTEXTS) {
      expect(context.suggestedMoods.length).toBeGreaterThan(0);
      for (const mood of context.suggestedMoods) {
        expect(isKnownMood(mood)).toBe(true);
      }
    }
  });

  it("has no duplicate context ids", () => {
    const ids = CONTEXTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("buildContextPlan", () => {
  it("falls back to the context's default minutes when none is given", () => {
    const plan = buildContextPlan("studying");
    expect(plan.minutes).toBe(getContext("studying").defaultMinutes);
  });

  it("honors an explicit minutes override", () => {
    const plan = buildContextPlan("studying", 90);
    expect(plan.minutes).toBe(90);
  });

  it("throws on an unknown context id", () => {
    expect(() => buildContextPlan("not-a-real-context")).toThrow();
  });
});
