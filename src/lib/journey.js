// The Emotional Journey Builder's recommendation logic.
//
// This is the app's "AI-assisted" feature, and it is intentionally NOT a black
// box: there is no hosted model and no hidden prompt. It is a small, deterministic
// heuristic — the same kind of logic a human counselor-thinking designer would use
// on paper — and every journey it produces comes with a plain-language explanation
// of exactly how it was built (see explainJourney). That transparency is the point:
// a listener should never have to wonder why the app suggested what it suggested.

import { getMood, nearestMood } from "./moods.js";

const STAGE_NAMES = {
  2: ["Meet the feeling", "Arrive somewhere new"],
  3: ["Meet the feeling", "Shift", "Arrive"],
  4: ["Meet the feeling", "Loosen", "Shift", "Arrive"],
  5: ["Meet the feeling", "Loosen", "Turn", "Shift", "Arrive"],
};

// Available minutes -> number of stages. More time means room for a gentler,
// more gradual emotional path instead of a single jump.
export function stageCountForMinutes(minutes) {
  if (minutes <= 10) return 2;
  if (minutes <= 25) return 3;
  if (minutes <= 45) return 4;
  return 5;
}

export function buildJourney({ fromMood, toMood, minutes }) {
  const start = getMood(fromMood);
  const end = getMood(toMood);

  if (!start || !end) {
    throw new Error("buildJourney requires two known moods");
  }

  const stageCount = stageCountForMinutes(minutes);
  const names = STAGE_NAMES[stageCount];
  const perStageMinutes = Math.max(1, Math.round(minutes / stageCount));
  const usedMoodNames = [];

  const stages = names.map((label, index) => {
    // t = 0 at the starting feeling, 1 at the destination feeling. Interior
    // stages interpolate linearly between the two so energy and valence move
    // in one steady direction rather than bouncing around.
    const t = stageCount === 1 ? 1 : index / (stageCount - 1);
    const targetEnergy = start.energy + (end.energy - start.energy) * t;
    const targetValence = start.valence + (end.valence - start.valence) * t;

    let targetMood;
    if (index === 0) {
      targetMood = start;
    } else if (index === stageCount - 1) {
      targetMood = end;
    } else {
      targetMood = nearestMood(targetEnergy, targetValence, usedMoodNames) ?? end;
    }

    usedMoodNames.push(targetMood.name);

    return {
      stage: index + 1,
      label,
      targetMood: targetMood.name,
      energyTarget: Math.round(targetEnergy * 10) / 10,
      valenceTarget: Math.round(targetValence * 10) / 10,
      minutes: perStageMinutes,
      songIds: [],
    };
  });

  return {
    fromMood: start.name,
    toMood: end.name,
    minutes,
    stageCount,
    stages,
  };
}

export function explainJourney(journey) {
  const lines = [
    `You started at ${journey.fromMood} and want to end at ${journey.toMood}, with about ${journey.minutes} minutes.`,
    `That time budget maps to ${journey.stageCount} stage${journey.stageCount === 1 ? "" : "s"} — more time means smaller, gentler steps between how you feel now and how you want to feel.`,
    `Each stage's target energy and mood is a straight-line interpolation between your start and end feelings, then matched to the closest mood in your library's mood set.`,
    `Nothing here is inferred from listening history or predicted by a model — it's the same math every time for the same inputs, so you can always see exactly why a stage was suggested.`,
  ];
  return lines.join(" ");
}
