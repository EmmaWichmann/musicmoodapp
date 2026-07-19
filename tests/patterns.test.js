import { describe, it, expect } from "vitest";
import {
  moodFrequency,
  timeOfDayDistribution,
  contextUsage,
  journeyCompletionStats,
  reflectionEffectiveness,
  buildInsights,
} from "../src/lib/patterns.js";

describe("moodFrequency", () => {
  it("counts and sorts moods descending", () => {
    const entries = [{ mood: "Calm" }, { mood: "Calm" }, { mood: "Focused" }];
    expect(moodFrequency(entries)).toEqual([
      { mood: "Calm", count: 2 },
      { mood: "Focused", count: 1 },
    ]);
  });

  it("returns an empty array for no entries", () => {
    expect(moodFrequency([])).toEqual([]);
  });
});

describe("timeOfDayDistribution", () => {
  it("buckets entries by hour of createdAt", () => {
    const morning = new Date();
    morning.setHours(8, 0, 0, 0);
    const night = new Date();
    night.setHours(23, 0, 0, 0);

    const entries = [{ createdAt: morning.getTime() }, { createdAt: night.getTime() }];
    const dist = timeOfDayDistribution(entries);

    expect(dist.find((d) => d.id === "morning").count).toBe(1);
    expect(dist.find((d) => d.id === "late-night").count).toBe(1);
    expect(dist.find((d) => d.id === "afternoon").count).toBe(0);
  });

  it("ignores entries with no createdAt instead of throwing", () => {
    expect(() => timeOfDayDistribution([{ mood: "Calm" }])).not.toThrow();
  });
});

describe("journeyCompletionStats", () => {
  it("computes a completion rate", () => {
    const journeys = [{ completedAt: 1 }, { completedAt: null }, { completedAt: 2 }];
    expect(journeyCompletionStats(journeys)).toEqual({ started: 3, completed: 2, completionRate: 67 });
  });

  it("returns 0% for no journeys instead of dividing by zero", () => {
    expect(journeyCompletionStats([])).toEqual({ started: 0, completed: 0, completionRate: 0 });
  });
});

describe("reflectionEffectiveness", () => {
  it("averages effectiveness and helped-rate per mood", () => {
    const reflections = [
      { targetMood: "Calm", effectiveness: 4, helped: "yes" },
      { targetMood: "Calm", effectiveness: 2, helped: "no" },
      { targetMood: "Focused", effectiveness: 5, helped: "yes" },
    ];
    const result = reflectionEffectiveness(reflections);
    expect(result.overallAverage).toBeCloseTo(3.7, 1);

    const calm = result.byMood.find((m) => m.mood === "Calm");
    expect(calm.averageEffectiveness).toBe(3);
    expect(calm.helpedRate).toBe(50);
    expect(calm.sampleSize).toBe(2);
  });

  it("handles zero reflections without dividing by zero", () => {
    expect(reflectionEffectiveness([])).toEqual({ overallAverage: 0, byMood: [] });
  });
});

describe("contextUsage", () => {
  it("counts sessions per context label", () => {
    const sessions = [{ label: "Studying" }, { label: "Studying" }, { label: "Commuting" }];
    expect(contextUsage(sessions)).toEqual([
      { label: "Studying", count: 2 },
      { label: "Commuting", count: 1 },
    ]);
  });
});

describe("buildInsights", () => {
  it("assembles all sub-reports without throwing on empty data", () => {
    const insights = buildInsights({ entries: [], reflections: [], journeys: [], contextSessions: [] });
    expect(insights.totalEntries).toBe(0);
    expect(insights.moodFrequency).toEqual([]);
    expect(insights.journeyStats.completionRate).toBe(0);
  });
});
