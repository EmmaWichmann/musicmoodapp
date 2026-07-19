// Context Mode presets. Each situation carries a default time budget and a
// short list of moods that tend to fit it — used to pre-filter the library and
// pre-fill the Journey Builder, not to make a clinical claim about what someone
// "should" feel while studying, commuting, etc.

export const CONTEXTS = [
  {
    id: "studying",
    label: "Studying",
    description: "Steady focus without pulling your attention away from the page.",
    defaultMinutes: 45,
    suggestedMoods: ["Focused", "Grounded", "Calm"],
    tip: "Lyrics-light and mid-energy tends to hold attention longest.",
  },
  {
    id: "commuting",
    label: "Commuting",
    description: "Something to carry you through the in-between time.",
    defaultMinutes: 25,
    suggestedMoods: ["Hopeful", "Motivated", "Nostalgic"],
    tip: "A short energy lift near the end can make the last leg easier.",
  },
  {
    id: "hard-day",
    label: "Recovering from a hard day",
    description: "Room to feel it first, then gradually come down from it.",
    defaultMinutes: 20,
    suggestedMoods: ["Heartbroken", "Soft", "Grounded"],
    tip: "Rushing straight to upbeat can feel dismissive — start where you are.",
  },
  {
    id: "interview-prep",
    label: "Preparing for an interview",
    description: "Steadying nerves into something closer to confidence.",
    defaultMinutes: 15,
    suggestedMoods: ["Anxious", "Motivated", "Hopeful"],
    tip: "Familiar songs lower cognitive load right before you need to perform.",
  },
  {
    id: "cleaning",
    label: "Cleaning or tidying",
    description: "Momentum for a task that's more physical than mental.",
    defaultMinutes: 30,
    suggestedMoods: ["Euphoric", "Vacation", "Motivated"],
    tip: "Higher energy is usually welcome here — it's not a focus task.",
  },
  {
    id: "exercising",
    label: "Exercising",
    description: "Energy that matches or slightly leads your effort.",
    defaultMinutes: 30,
    suggestedMoods: ["Euphoric", "Motivated", "Vacation"],
    tip: "Consistent tempo across the set can help pacing more than peak energy.",
  },
  {
    id: "hard-task",
    label: "Starting a difficult task",
    description: "Moving from overwhelmed to just... starting.",
    defaultMinutes: 10,
    suggestedMoods: ["Overwhelmed", "Grounded", "Focused"],
    tip: "The goal is the first five minutes, not motivation for the whole task.",
  },
  {
    id: "falling-asleep",
    label: "Falling asleep",
    description: "A slow descent in energy, not an abrupt stop.",
    defaultMinutes: 20,
    suggestedMoods: ["Soft", "Calm", "Nostalgic"],
    tip: "Consider fading volume or song count rather than stopping abruptly.",
  },
];

export function getContext(id) {
  return CONTEXTS.find((c) => c.id === id) ?? null;
}

// Builds a lightweight session plan for a context: which saved moods are
// relevant, and a starting point for the Journey Builder if the user wants a
// structured path rather than a flat filtered list.
export function buildContextPlan(contextId, minutesOverride) {
  const context = getContext(contextId);
  if (!context) throw new Error("buildContextPlan requires a known context id");

  return {
    contextId,
    label: context.label,
    minutes: minutesOverride ?? context.defaultMinutes,
    suggestedMoods: context.suggestedMoods,
    tip: context.tip,
  };
}
