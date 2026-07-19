import { el, clear } from "../lib/dom.js";
import { CONTEXTS, buildContextPlan } from "../lib/context.js";
import { getContextSessions, saveContextSessions, newId } from "../lib/storage.js";

export function initContextMode({ onFilterLibrary, onStartJourney }) {
  const root = document.getElementById("context-root");
  let selectedContextId = null;
  let minutes = null;

  render();

  function render() {
    clear(root);

    root.append(
      el(
        "div",
        { class: "context-grid" },
        CONTEXTS.map((context) =>
          el(
            "button",
            {
              type: "button",
              class: `context-card${selectedContextId === context.id ? " selected" : ""}`,
              "aria-pressed": String(selectedContextId === context.id),
              onClick: () => {
                selectedContextId = context.id;
                minutes = context.defaultMinutes;
                render();
              },
            },
            [
              el("h3", { text: context.label }),
              el("p", { text: context.description }),
              el("p", { class: "context-minutes", text: `~${context.defaultMinutes} min` }),
            ]
          )
        )
      )
    );

    if (selectedContextId) {
      const plan = buildContextPlan(selectedContextId, minutes);
      root.append(
        el("div", { class: "context-plan panel-inset" }, [
          el("h3", { text: `Plan for: ${plan.label}` }),
          el("label", { class: "minutes-field" }, [
            "Minutes available",
            el("input", {
              type: "number",
              min: "5",
              max: "120",
              step: "5",
              value: String(plan.minutes),
              onChange: (e) => {
                minutes = Number(e.target.value) || plan.minutes;
                render();
              },
            }),
          ]),
          el("p", { class: "context-tip", text: plan.tip }),
          el("p", {}, [
            "Suggested moods: ",
            el("strong", { text: plan.suggestedMoods.join(", ") }),
          ]),
          el("div", { class: "dialog-actions" }, [
            el("button", {
              type: "button",
              class: "ghost-button",
              text: `Show ${plan.suggestedMoods[0]} songs in library`,
              onClick: () => onFilterLibrary?.(plan.suggestedMoods[0]),
            }),
            el("button", {
              type: "button",
              class: "save-button",
              text: "Build a journey for this",
              onClick: () => {
                logSession(plan);
                onStartJourney?.({ fromMood: plan.suggestedMoods[0], minutes: plan.minutes });
              },
            }),
          ]),
        ])
      );
    }
  }

  function logSession(plan) {
    const sessions = getContextSessions();
    sessions.unshift({ id: newId(), contextId: plan.contextId, label: plan.label, minutes: plan.minutes, createdAt: Date.now() });
    saveContextSessions(sessions);
  }
}
