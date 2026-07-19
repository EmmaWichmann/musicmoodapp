import { el, clear } from "../lib/dom.js";
import { getMood, planePosition } from "../lib/moods.js";
import { renderPlane } from "../lib/planeChart.js";
import { moodFrequency } from "../lib/patterns.js";

// A live view of the same energy/valence plane the Journey Builder reasons
// over — but plotted from the user's actual saved library instead of a
// generated path. The SVG is decorative; the legend list underneath carries
// the same information as visible text, so nothing here depends on being
// able to see a dot's position precisely.

export function initMoodMap() {
  const root = document.getElementById("mood-map-root");

  function render(entries) {
    clear(root);

    if (entries.length === 0) {
      root.append(
        el("p", {
          class: "empty-state",
          text: "Save songs across a few different moods and this map fills in on its own.",
        })
      );
      return;
    }

    const counts = moodFrequency(entries);
    const maxCount = Math.max(...counts.map((c) => c.count));

    const points = counts
      .map(({ mood, count }) => {
        const moodData = getMood(mood);
        if (!moodData) return null;
        const { xPct, yPct } = planePosition(moodData.energy, moodData.valence);
        return { xPct, yPct, count, mood, r: 2.2 + (count / maxCount) * 3.4 };
      })
      .filter(Boolean);

    root.append(
      el("div", { class: "plane-wrap" }, [
        el("span", { class: "plane-label energy-top", text: "High energy" }),
        el("span", { class: "plane-label energy-bottom", text: "Low energy" }),
        el("span", { class: "plane-label valence-left", text: "Unpleasant" }),
        el("span", { class: "plane-label valence-right", text: "Pleasant" }),
        renderPlane({ points }),
      ]),
      el(
        "ul",
        { class: "plane-legend" },
        counts.map(({ mood, count }) =>
          el("li", {}, [
            el("span", { class: "plane-legend-dot" }),
            el("span", { class: "plane-legend-mood", text: mood }),
            el("span", { class: "plane-legend-count", text: `${count} song${count === 1 ? "" : "s"}` }),
          ])
        )
      )
    );
  }

  return { render };
}
