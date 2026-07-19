import { el } from "../lib/dom.js";

const SIGNALS = [
  { label: "In-app feedback", detail: "Reflection cards you've already submitted — the strongest signal, because you gave it on purpose." },
  { label: "Time of day", detail: "Your device clock only. Used to bias energy, not to track anything." },
  { label: "Calendar context (opt-in)", detail: "Free/busy status only, never event titles or attendees, to sense high-stress stretches of a day." },
  { label: "Wearable data (opt-in)", detail: "Resting heart rate / movement trend from a connected wearable, as a rough stress or energy signal." },
  { label: "Manual mood check-in", detail: "You can always override any inferred state with one tap — inference never outranks what you say." },
];

const CONSENT_TOGGLES = [
  { label: "Use calendar free/busy status", enabled: false },
  { label: "Use connected wearable data", enabled: false },
  { label: "Let the app adjust energy automatically through the day", enabled: false },
  { label: "Use in-app reflections to personalize suggestions", enabled: true },
];

export function initRoadmap() {
  const root = document.getElementById("roadmap-root");

  root.append(
    el("div", { class: "roadmap-layout" }, [
      el("div", { class: "panel-inset" }, [
        el("h3", { text: "The concept" }),
        el("p", {
          text:
            "Adaptive Soundtrack would let a listening session gently adjust — not autoplay something unrelated, but nudge tempo, energy, or the next Journey stage — in response to how your day is actually going, not just the mood you picked when you opened the app.",
        }),
        el("p", {
          text:
            "Example: you set a 45-minute 'Focused' Journey for work. Your calendar shows back-to-back meetings ending late, and your last two reflections after long work sessions rated low effectiveness. The app would suggest shortening the Journey and adding a 'Grounded' stage before you start, instead of assuming the original plan still fits.",
        }),
      ]),

      el("div", { class: "panel-inset" }, [
        el("h3", { text: "How the recommendation logic would work, at a high level" }),
        el("ol", { class: "roadmap-steps" }, [
          el("li", { text: "Every enabled signal is converted into the same energy/valence scale the Journey Builder already uses — nothing new to learn, no separate 'AI model' vocabulary." }),
          el("li", { text: "Signals are weighted by how directly you gave them: your own reflections outweigh inferred signals like time of day, which outweigh optional external signals like wearable data." }),
          el("li", { text: "The system proposes a change; it never silently applies one. You see the suggestion and the reason before anything changes." }),
          el("li", { text: "Every suggestion ships with a one-line reason, the same way the Journey Builder's 'How this was generated' panel works today." }),
        ]),
      ]),

      el("div", { class: "panel-inset" }, [
        el("h3", { text: "Signals it could use" }),
        el(
          "ul",
          { class: "signal-list" },
          SIGNALS.map((s) => el("li", {}, [el("strong", { text: s.label }), ": " + s.detail]))
        ),
      ]),

      el("div", { class: "panel-inset" }, [
        el("h3", { text: "Privacy and consent controls (preview — not yet functional)" }),
        el("p", { class: "panel-intro", text: "Every external signal is opt-in and off by default. This is a design preview of those controls, disabled because the feature doesn't exist yet." }),
        el(
          "div",
          { class: "toggle-list" },
          CONSENT_TOGGLES.map((t) =>
            el("label", { class: "toggle-row" }, [
              el("span", { text: t.label }),
              el("input", { type: "checkbox", disabled: "true", checked: t.enabled }),
            ])
          )
        ),
        el("p", { class: "roadmap-note" }, [
          "Planned commitments: raw calendar/wearable data would never leave your device unprocessed, only the derived energy signal would sync; any toggle above is reversible instantly; and turning everything off returns the app to exactly today's behavior.",
        ]),
      ]),
    ])
  );
}
