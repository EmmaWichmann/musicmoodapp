// Music Reflection Cards: a short, structured check-in after listening. The
// options are deliberately observational ("felt calmer," "still sad, but okay")
// rather than diagnostic — this app tracks self-reported patterns, not medical
// or therapeutic outcomes.

export const EMOTION_OPTIONS = [
  "Calmer",
  "Lighter",
  "Energized",
  "Still sad, but okay",
  "Understood",
  "Nostalgic",
  "Motivated",
  "Overwhelm eased",
  "Focused",
  "Nothing changed",
];

export const HELPED_OPTIONS = ["yes", "somewhat", "no"];

export function buildReflection({ targetType, targetId, targetMood, helped, emotions, effectiveness, note }) {
  if (targetType !== "entry" && targetType !== "journey") {
    throw new Error("targetType must be 'entry' or 'journey'");
  }
  if (!HELPED_OPTIONS.includes(helped)) {
    throw new Error("helped must be one of: " + HELPED_OPTIONS.join(", "));
  }
  const clampedEffectiveness = Math.min(5, Math.max(1, Math.round(effectiveness ?? 3)));

  return {
    targetType,
    targetId,
    targetMood: targetMood ?? null,
    helped,
    emotions: Array.isArray(emotions) ? emotions.filter((e) => EMOTION_OPTIONS.includes(e)) : [],
    effectiveness: clampedEffectiveness,
    note: (note ?? "").trim(),
    createdAt: Date.now(),
  };
}
