import { el, clear } from "../lib/dom.js";
import { MOODS, planePosition } from "../lib/moods.js";
import { buildJourney, explainJourney } from "../lib/journey.js";
import { getEntries, getJourneys, saveJourneys, newId } from "../lib/storage.js";
import { openReflectionModal } from "./reflectionModal.js";
import { renderPlane } from "../lib/planeChart.js";

export function initJourneyBuilder() {
  const root = document.getElementById("journey-root");
  let fromMood = MOODS.find((m) => m.name === "Anxious")?.name ?? MOODS[0].name;
  let toMood = MOODS.find((m) => m.name === "Grounded")?.name ?? MOODS[1].name;
  let minutes = 20;
  let journey = null;
  let journeyId = null;
  let journeyCompleted = false;

  render();

  function render() {
    clear(root);

    root.append(
      el("div", { class: "panel-inset journey-form" }, [
        el("div", { class: "field-grid three" }, [
          el("label", {}, [
            "Starting feeling",
            el(
              "select",
              { onChange: (e) => (fromMood = e.target.value) },
              MOODS.map((m) => el("option", { value: m.name, selected: m.name === fromMood, text: m.name }))
            ),
          ]),
          el("label", {}, [
            "Where you want to end up",
            el(
              "select",
              { onChange: (e) => (toMood = e.target.value) },
              MOODS.map((m) => el("option", { value: m.name, selected: m.name === toMood, text: m.name }))
            ),
          ]),
          el("label", {}, [
            "Minutes you have",
            el("input", {
              type: "number",
              min: "5",
              max: "120",
              step: "5",
              value: String(minutes),
              onChange: (e) => (minutes = Number(e.target.value) || minutes),
            }),
          ]),
        ]),
        el("button", {
          type: "button",
          class: "save-button",
          text: journey ? "Rebuild journey" : "Build my journey",
          onClick: () => {
            journey = buildJourney({ fromMood, toMood, minutes });
            journeyId = newId();
            journeyCompleted = false;
            renderJourney();
          },
        }),
      ])
    );

    if (journey) renderJourney();
  }

  function renderJourney() {
    let journeyOutput = root.querySelector(".journey-output");
    if (journeyOutput) journeyOutput.remove();

    const entries = getEntries();

    const pathPoints = journey.stages.map((stage) => ({
      ...planePosition(stage.energyTarget, stage.valenceTarget),
      variant: "path",
    }));

    journeyOutput = el("div", { class: "journey-output" }, [
      el("div", { class: "plane-wrap journey-plane" }, [
        el("span", { class: "plane-label energy-top", text: "High energy" }),
        el("span", { class: "plane-label energy-bottom", text: "Low energy" }),
        el("span", { class: "plane-label valence-left", text: "Unpleasant" }),
        el("span", { class: "plane-label valence-right", text: "Pleasant" }),
        renderPlane({ points: pathPoints, path: pathPoints }),
        el("span", {
          class: "plane-tag plane-tag-start",
          style: `left:${pathPoints[0].xPct}%; top:${pathPoints[0].yPct}%`,
          text: journey.fromMood,
        }),
        el("span", {
          class: "plane-tag plane-tag-end",
          style: `left:${pathPoints.at(-1).xPct}%; top:${pathPoints.at(-1).yPct}%`,
          text: journey.toMood,
        }),
      ]),
      el("details", { class: "explain-panel" }, [
        el("summary", { text: "How this journey was generated" }),
        el("p", { text: explainJourney(journey) }),
      ]),
      el(
        "ol",
        { class: "journey-stages" },
        journey.stages.map((stage, index) => {
          const matchingEntries = entries.filter((e) => e.mood === stage.targetMood);
          return el("li", { class: "journey-stage" }, [
            el("div", { class: "stage-heading" }, [
              el("span", { class: "stage-number", text: `Stage ${stage.stage}` }),
              el("h3", { text: stage.label }),
            ]),
            el("p", { class: "stage-meta" }, [
              `Target: `,
              el("strong", { text: stage.targetMood }),
              ` · ~${stage.minutes} min · energy ${stage.energyTarget}/5`,
            ]),
            matchingEntries.length > 0
              ? el(
                  "select",
                  { "aria-label": `Pick a song for stage ${stage.stage}`, onChange: (e) => (stage.songIds = e.target.value ? [e.target.value] : []) },
                  [
                    el("option", { value: "", text: "Choose a saved song…" }),
                    ...matchingEntries.map((e) =>
                      el("option", { value: e.id, text: `${e.songTitle} — ${e.artistName}` })
                    ),
                  ]
                )
              : el("p", { class: "stage-empty", text: `No ${stage.targetMood} songs saved yet — add one from Compose & Library.` }),
          ]);
        })
      ),
      journeyCompleted
        ? el("p", { class: "context-tip", text: "Journey saved. You can reflect on it any time from the Reflections tab." })
        : el("div", { class: "dialog-actions" }, [
            el("button", {
              type: "button",
              class: "save-button",
              text: "Mark journey complete",
              onClick: () => {
                const journeys = getJourneys();
                journeys.unshift({ id: journeyId, ...journey, createdAt: Date.now(), completedAt: Date.now() });
                saveJourneys(journeys);
                journeyCompleted = true;
                renderJourney();
                openReflectionModal({
                  targetType: "journey",
                  targetId: journeyId,
                  targetMood: journey.toMood,
                  label: `${journey.fromMood} → ${journey.toMood} journey`,
                });
              },
            }),
          ]),
    ]);

    root.append(journeyOutput);
  }

  return {
    prefill: ({ fromMood: nextFrom, minutes: nextMinutes }) => {
      if (nextFrom) fromMood = nextFrom;
      if (nextMinutes) minutes = nextMinutes;
      render();
    },
  };
}
