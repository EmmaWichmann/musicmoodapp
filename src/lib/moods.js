// Shared mood taxonomy. Every mood is placed on two axes so the app can reason
// about moods instead of just labeling them: energy (how much activation/arousal,
// 1 low - 5 high) and valence (how pleasant it feels, -2 unpleasant - 2 pleasant).
// This is the backbone the Journey Builder and Context Mode use to move a listener
// from one emotional point to another in a deliberate way.

export const MOODS = [
  { name: "Euphoric", energy: 5, valence: 2 },
  { name: "Vacation", energy: 4, valence: 2 },
  { name: "Motivated", energy: 4, valence: 1 },
  { name: "Hopeful", energy: 3, valence: 1 },
  { name: "Focused", energy: 3, valence: 0 },
  { name: "Grounded", energy: 2, valence: 1 },
  { name: "Calm", energy: 1, valence: 1 },
  { name: "Soft", energy: 2, valence: 1 },
  { name: "Nostalgic", energy: 2, valence: 0 },
  { name: "Anxious", energy: 4, valence: -1 },
  { name: "Overwhelmed", energy: 4, valence: -2 },
  { name: "Heartbroken", energy: 1, valence: -2 },
];

const MOOD_NAMES = new Set(MOODS.map((m) => m.name));

export function getMood(name) {
  return MOODS.find((m) => m.name === name) ?? null;
}

export function isKnownMood(name) {
  return MOOD_NAMES.has(name);
}

// Converts a mood's energy/valence coordinates into percentage position on a
// 2D plane (0-100 for both axes), for rendering the mood map. Valence maps to
// x (unpleasant -> pleasant, left to right); energy maps to y, inverted
// because SVG y grows downward and "high energy" should render near the top.
export function planePosition(energy, valence) {
  const xPct = ((valence + 2) / 4) * 100;
  const yPct = 100 - ((energy - 1) / 4) * 100;
  return { xPct, yPct };
}

// Nearest mood(s) to a point in energy/valence space, by Euclidean distance.
// Used to translate an interpolated "target feeling" back into a real, pickable
// mood tag. Returns the closest match; ties are broken by list order so the
// result is deterministic (important for both UI stability and unit tests).
export function nearestMood(energy, valence, exclude = []) {
  const excluded = new Set(exclude);
  let best = null;
  let bestDistance = Infinity;

  for (const mood of MOODS) {
    if (excluded.has(mood.name)) continue;
    const distance = Math.hypot(mood.energy - energy, mood.valence - valence);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = mood;
    }
  }

  return best;
}
