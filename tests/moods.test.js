import { describe, it, expect } from "vitest";
import { planePosition, nearestMood, getMood, isKnownMood, MOODS } from "../src/lib/moods.js";

describe("planePosition", () => {
  it("maps the most unpleasant, lowest-energy corner near (0, 100)", () => {
    const pos = planePosition(1, -2);
    expect(pos.xPct).toBeCloseTo(0, 5);
    expect(pos.yPct).toBeCloseTo(100, 5);
  });

  it("maps the most pleasant, highest-energy corner near (100, 0)", () => {
    const pos = planePosition(5, 2);
    expect(pos.xPct).toBeCloseTo(100, 5);
    expect(pos.yPct).toBeCloseTo(0, 5);
  });

  it("maps a neutral midpoint to the center", () => {
    const pos = planePosition(3, 0);
    expect(pos.xPct).toBeCloseTo(50, 5);
    expect(pos.yPct).toBeCloseTo(50, 5);
  });

  it("produces a valid position for every mood in the taxonomy", () => {
    for (const mood of MOODS) {
      const pos = planePosition(mood.energy, mood.valence);
      expect(pos.xPct).toBeGreaterThanOrEqual(0);
      expect(pos.xPct).toBeLessThanOrEqual(100);
      expect(pos.yPct).toBeGreaterThanOrEqual(0);
      expect(pos.yPct).toBeLessThanOrEqual(100);
    }
  });
});

describe("getMood / isKnownMood", () => {
  it("finds a known mood by name", () => {
    expect(getMood("Calm")?.name).toBe("Calm");
  });

  it("returns null for an unknown mood", () => {
    expect(getMood("Not A Mood")).toBeNull();
  });

  it("agrees with isKnownMood", () => {
    expect(isKnownMood("Focused")).toBe(true);
    expect(isKnownMood("Not A Mood")).toBe(false);
  });
});

describe("nearestMood", () => {
  it("excludes moods already used", () => {
    const nearest = nearestMood(1, 1, ["Calm", "Soft"]);
    expect(["Calm", "Soft"]).not.toContain(nearest.name);
  });

  it("returns null if every mood is excluded", () => {
    const allNames = MOODS.map((m) => m.name);
    expect(nearestMood(1, 1, allNames)).toBeNull();
  });
});
