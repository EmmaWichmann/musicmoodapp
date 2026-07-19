// Pure aggregation functions for the "My Listening Patterns" dashboard.
// Kept free of DOM/rendering so they're independently unit-testable and so the
// dashboard can never accidentally mutate the underlying collections.

const TIME_BUCKETS = [
  { id: "morning", label: "Morning", test: (h) => h >= 5 && h < 12 },
  { id: "afternoon", label: "Afternoon", test: (h) => h >= 12 && h < 17 },
  { id: "evening", label: "Evening", test: (h) => h >= 17 && h < 22 },
  { id: "late-night", label: "Late night", test: (h) => h >= 22 || h < 5 },
];

export function moodFrequency(entries) {
  const counts = new Map();
  for (const entry of entries) {
    counts.set(entry.mood, (counts.get(entry.mood) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([mood, count]) => ({ mood, count }))
    .sort((a, b) => b.count - a.count);
}

export function timeOfDayDistribution(entries) {
  const counts = Object.fromEntries(TIME_BUCKETS.map((b) => [b.id, 0]));
  for (const entry of entries) {
    if (!entry.createdAt) continue;
    const hour = new Date(entry.createdAt).getHours();
    const bucket = TIME_BUCKETS.find((b) => b.test(hour));
    if (bucket) counts[bucket.id] += 1;
  }
  return TIME_BUCKETS.map((b) => ({ id: b.id, label: b.label, count: counts[b.id] }));
}

export function contextUsage(contextSessions) {
  const counts = new Map();
  for (const session of contextSessions) {
    counts.set(session.label, (counts.get(session.label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function journeyCompletionStats(journeys) {
  const started = journeys.length;
  const completed = journeys.filter((j) => j.completedAt).length;
  const completionRate = started === 0 ? 0 : Math.round((completed / started) * 100);
  return { started, completed, completionRate };
}

// Correlates reflections with the mood/journey they followed, so the dashboard
// can surface "what tends to actually help" from the user's own reported data
// rather than an assumption about any given mood.
export function reflectionEffectiveness(reflections) {
  if (reflections.length === 0) {
    return { overallAverage: 0, byMood: [] };
  }

  const overallAverage =
    Math.round((reflections.reduce((sum, r) => sum + r.effectiveness, 0) / reflections.length) * 10) / 10;

  const byMoodMap = new Map();
  for (const r of reflections) {
    if (!r.targetMood) continue;
    const bucket = byMoodMap.get(r.targetMood) ?? { mood: r.targetMood, total: 0, count: 0, helpedYes: 0 };
    bucket.total += r.effectiveness;
    bucket.count += 1;
    if (r.helped === "yes") bucket.helpedYes += 1;
    byMoodMap.set(r.targetMood, bucket);
  }

  const byMood = [...byMoodMap.values()]
    .map((b) => ({
      mood: b.mood,
      averageEffectiveness: Math.round((b.total / b.count) * 10) / 10,
      helpedRate: Math.round((b.helpedYes / b.count) * 100),
      sampleSize: b.count,
    }))
    .sort((a, b) => b.averageEffectiveness - a.averageEffectiveness);

  return { overallAverage, byMood };
}

export function buildInsights({ entries, reflections, journeys, contextSessions }) {
  return {
    moodFrequency: moodFrequency(entries),
    timeOfDay: timeOfDayDistribution(entries),
    contextUsage: contextUsage(contextSessions),
    journeyStats: journeyCompletionStats(journeys),
    reflectionStats: reflectionEffectiveness(reflections),
    totalEntries: entries.length,
  };
}
