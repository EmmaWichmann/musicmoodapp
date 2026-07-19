// A reusable reflection dialog, opened from either a saved entry or a
// completed journey. Uses the native <dialog> element so focus trapping,
// Escape-to-close, and the backdrop come from the browser instead of a
// hand-rolled (and easy to get wrong) implementation.

import { el } from "../lib/dom.js";
import { EMOTION_OPTIONS, buildReflection } from "../lib/reflections.js";
import { getReflections, saveReflections, newId } from "../lib/storage.js";

let dialog = null;

function ensureDialog() {
  if (dialog) return dialog;

  dialog = el("dialog", { class: "reflection-dialog", "aria-labelledby": "reflection-dialog-title" });
  document.body.append(dialog);
  return dialog;
}

export function openReflectionModal({ targetType, targetId, targetMood, label, onSaved }) {
  const node = ensureDialog();
  let selectedHelped = "somewhat";
  let selectedEmotions = new Set();
  let effectiveness = 3;
  let noteValue = "";

  function render() {
    node.replaceChildren(
      el("form", { method: "dialog", class: "reflection-form" }, [
        el("h2", { id: "reflection-dialog-title", text: `How did "${label}" go?` }),
        el("p", { class: "panel-intro", text: "This is a personal check-in, not a diagnosis — answer however feels true." }),

        el("fieldset", {}, [
          el("legend", { text: "Did it help?" }),
          el(
            "div",
            { class: "chip-row", role: "radiogroup", "aria-label": "Did it help?" },
            ["yes", "somewhat", "no"].map((value) =>
              el("button", {
                type: "button",
                class: `mood-chip helped-chip${selectedHelped === value ? " selected" : ""}`,
                "aria-pressed": String(selectedHelped === value),
                text: value === "yes" ? "Yes" : value === "somewhat" ? "Somewhat" : "No",
                onClick: () => {
                  selectedHelped = value;
                  render();
                },
              })
            )
          ),
        ]),

        el("fieldset", {}, [
          el("legend", { text: "What surfaced? (optional, pick any)" }),
          el(
            "div",
            { class: "chip-row" },
            EMOTION_OPTIONS.map((emotion) =>
              el("button", {
                type: "button",
                class: `mood-chip small${selectedEmotions.has(emotion) ? " selected" : ""}`,
                "aria-pressed": String(selectedEmotions.has(emotion)),
                text: emotion,
                onClick: () => {
                  if (selectedEmotions.has(emotion)) selectedEmotions.delete(emotion);
                  else selectedEmotions.add(emotion);
                  render();
                },
              })
            )
          ),
        ]),

        el("label", { class: "effectiveness-label" }, [
          "How effective did this feel? ",
          el("span", { id: "effectiveness-value", text: `${effectiveness} / 5` }),
          el("input", {
            type: "range",
            min: "1",
            max: "5",
            value: String(effectiveness),
            "aria-valuemin": "1",
            "aria-valuemax": "5",
            "aria-valuenow": String(effectiveness),
            onInput: (e) => {
              effectiveness = Number(e.target.value);
              node.querySelector("#effectiveness-value").textContent = `${effectiveness} / 5`;
              e.target.setAttribute("aria-valuenow", String(effectiveness));
            },
          }),
        ]),

        el("label", {}, [
          "Anything else?",
          el("textarea", {
            id: "reflection-note",
            rows: "3",
            placeholder: "Optional",
            text: noteValue,
            onInput: (e) => {
              noteValue = e.target.value;
            },
          }),
        ]),

        el("div", { class: "dialog-actions" }, [
          el("button", { type: "button", class: "ghost-button", text: "Cancel", onClick: () => node.close() }),
          el("button", { type: "submit", class: "save-button", text: "Save reflection" }),
        ]),
      ])
    );

    node.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      const reflection = {
        id: newId(),
        ...buildReflection({
          targetType,
          targetId,
          targetMood,
          helped: selectedHelped,
          emotions: [...selectedEmotions],
          effectiveness,
          note: noteValue,
        }),
      };
      const reflections = getReflections();
      reflections.unshift(reflection);
      saveReflections(reflections);
      node.close();
      onSaved?.(reflection);
    });
  }

  render();
  node.showModal();
}
