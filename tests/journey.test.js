import { describe, it, expect } from "vitest";
import { buildJourney, stageCountForMinutes, explainJourney } from "../src/lib/journey.js";

describe("stageCountForMinutes", () => {
  it("maps short windows to 2 stages", () => {
    expect(stageCountForMinutes(5)).toBe(2);
    expect(stageCountForMinutes(10)).toBe(2);
  });

  it("maps longer windows to more stages", () => {
    expect(stageCountForMinutes(20)).toBe(3);
    expect(stageCountForMinutes(40)).toBe(4);
    expect(stageCountForMinutes(60)).toBe(5);
  });
});

describe("buildJourney", () => {
  it("starts at the from-mood and ends at the to-mood", () => {
    const journey = buildJourney({ fromMood: "Heartbroken", toMood: "Grounded", minutes: 20 });
    expect(journey.stages[0].targetMood).toBe("Heartbroken");
    expect(journey.stages.at(-1).targetMood).toBe("Grounded");
  });

  it("produces a stage count consistent with the time budget", () => {
    const journey = buildJourney({ fromMood: "Anxious", toMood: "Calm", minutes: 45 });
    expect(journey.stages).toHaveLength(4);
    expect(journey.stageCount).toBe(4);
  });

  it("allocates minutes across all stages without exceeding the budget by more than rounding error", () => {
    const journey = buildJourney({ fromMood: "Overwhelmed", toMood: "Focused", minutes: 10 });
    const totalAllocated = journey.stages.reduce((sum, s) => sum + s.minutes, 0);
    expect(totalAllocated).toBeGreaterThanOrEqual(8);
    expect(totalAllocated).toBeLessThanOrEqual(12);
  });

  it("moves energy monotonically toward the destination when destination has lower energy", () => {
    const journey = buildJourney({ fromMood: "Euphoric", toMood: "Heartbroken", minutes: 60 });
    const energies = journey.stages.map((s) => s.energyTarget);
    for (let i = 1; i < energies.length; i += 1) {
      expect(energies[i]).toBeLessThanOrEqual(energies[i - 1]);
    }
  });

  it("is deterministic for identical inputs", () => {
    const a = buildJourney({ fromMood: "Nostalgic", toMood: "Hopeful", minutes: 25 });
    const b = buildJourney({ fromMood: "Nostalgic", toMood: "Hopeful", minutes: 25 });
    expect(a).toEqual(b);
  });

  it("throws on an unknown mood instead of silently failing", () => {
    expect(() => buildJourney({ fromMood: "Nope", toMood: "Calm", minutes: 20 })).toThrow();
  });

  it("handles a same-mood journey without throwing, anchoring the first and last stage", () => {
    const journey = buildJourney({ fromMood: "Calm", toMood: "Calm", minutes: 15 });
    expect(journey.stages[0].targetMood).toBe("Calm");
    expect(journey.stages.at(-1).targetMood).toBe("Calm");
  });
});

describe("explainJourney", () => {
  it("mentions the actual from/to moods and stage count so the explanation is never generic", () => {
    const journey = buildJourney({ fromMood: "Anxious", toMood: "Hopeful", minutes: 20 });
    const explanation = explainJourney(journey);
    expect(explanation).toContain("Anxious");
    expect(explanation).toContain("Hopeful");
    expect(explanation).toContain(String(journey.stageCount));
  });
});
