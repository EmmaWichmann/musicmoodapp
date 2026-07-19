import { el, clear, formatDate } from "../lib/dom.js";
import { getReflections, getEntries } from "../lib/storage.js";
import { openReflectionModal } from "./reflectionModal.js";

const HELPED_LABEL = { yes: "Helped", somewhat: "Helped somewhat", no: "Didn't help" };

export function initReflectionsFeed() {
  const root = document.getElementById("reflections-root");
  render();

  function render() {
    clear(root);
    const entries = getEntries();
    const reflections = getReflections();

    root.append(
      el("div", { class: "panel-inset" }, [
        el("label", {}, [
          "Reflect on a saved song",
          el(
            "select",
            {
              id: "reflect-entry-picker",
              onChange: (e) => {
                if (!e.target.value) return;
                const entry = entries.find((en) => en.id === e.target.value);
                if (!entry) return;
                openReflectionModal({
                  targetType: "entry",
                  targetId: entry.id,
                  targetMood: entry.mood,
                  label: entry.songTitle,
                  onSaved: render,
                });
                e.target.value = "";
              },
            },
            [
              el("option", { value: "", text: entries.length ? "Choose a saved song…" : "Save a song first" }),
              ...entries.map((entry) => el("option", { value: entry.id, text: `${entry.songTitle} — ${entry.artistName}` })),
            ]
          ),
        ]),
      ])
    );

    if (reflections.length === 0) {
      root.append(el("p", { class: "empty-state", text: "No reflections yet. Save a song, then reflect on how it went." }));
      return;
    }

    root.append(
      el(
        "ul",
        { class: "reflection-feed" },
        reflections.map((r) =>
          el("li", { class: "reflection-card" }, [
            el("div", { class: "entry-topline" }, [
              el("span", { class: `helped-badge helped-${r.helped}`, text: HELPED_LABEL[r.helped] }),
              el("span", { class: "reflection-date", text: formatDate(r.createdAt) }),
            ]),
            r.targetMood ? el("p", { class: "stage-meta" }, ["Mood: ", el("strong", { text: r.targetMood })]) : null,
            r.emotions.length
              ? el("p", { class: "reflection-emotions", text: r.emotions.join(" · ") })
              : null,
            el("p", { class: "reflection-effectiveness", text: `Effectiveness: ${r.effectiveness}/5` }),
            r.note ? el("p", { class: "entry-note", text: r.note }) : null,
          ])
        )
      )
    );
  }

  return { refresh: render };
}
