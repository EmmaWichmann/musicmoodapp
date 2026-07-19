import { el, clear } from "../lib/dom.js";
import { getEntries, getReflections, getJourneys, getContextSessions } from "../lib/storage.js";
import { buildInsights } from "../lib/patterns.js";

// Each chart below is a single measure across categories (a count, an average),
// so it uses one consistent brand hue rather than a categorical palette — a
// different color per bar would imply the bars are unrelated series, which
// they aren't. Every bar also carries a visible text label and number, so
// meaning never depends on color alone.

function barList(items, { valueKey, labelKey, maxHint, suffix = "" }) {
  const max = maxHint ?? Math.max(1, ...items.map((i) => i[valueKey]));
  return el(
    "ul",
    { class: "bar-list" },
    items.map((item) => {
      const pct = Math.round((item[valueKey] / max) * 100);
      return el("li", { class: "bar-row" }, [
        el("span", { class: "bar-label", text: item[labelKey] }),
        el("span", { class: "bar-track", role: "img", "aria-label": `${item[labelKey]}: ${item[valueKey]}${suffix}` }, [
          el("span", { class: "bar-fill", style: `width: ${pct}%` }),
        ]),
        el("span", { class: "bar-value", text: `${item[valueKey]}${suffix}` }),
      ]);
    })
  );
}

function statTile(label, value, sublabel) {
  return el("div", { class: "stat-tile" }, [
    el("p", { class: "stat-value", text: value }),
    el("p", { class: "stat-label", text: label }),
    sublabel ? el("p", { class: "stat-sublabel", text: sublabel }) : null,
  ]);
}

export function initPatternsDashboard() {
  const root = document.getElementById("patterns-root");
  render();

  function render() {
    clear(root);

    const insights = buildInsights({
      entries: getEntries(),
      reflections: getReflections(),
      journeys: getJourneys(),
      contextSessions: getContextSessions(),
    });

    if (insights.totalEntries === 0) {
      root.append(
        el("p", {
          class: "empty-state",
          text: "Save a few songs across different moods and this dashboard fills in on its own.",
        })
      );
      return;
    }

    root.append(
      el("div", { class: "stat-row" }, [
        statTile("Songs saved", String(insights.totalEntries)),
        statTile("Journeys completed", `${insights.journeyStats.completed}/${insights.journeyStats.started}`, `${insights.journeyStats.completionRate}% completion`),
        statTile(
          "Average effectiveness",
          insights.reflectionStats.overallAverage ? `${insights.reflectionStats.overallAverage}/5` : "—",
          `${getReflections().length} reflection${getReflections().length === 1 ? "" : "s"}`
        ),
      ])
    );

    root.append(
      el("div", { class: "insight-panel panel-inset" }, [
        el("h3", { text: "Most-saved moods" }),
        insights.moodFrequency.length
          ? barList(insights.moodFrequency, { valueKey: "count", labelKey: "mood" })
          : el("p", { class: "empty-state", text: "No entries yet." }),
      ])
    );

    root.append(
      el("div", { class: "insight-panel panel-inset" }, [
        el("h3", { text: "When you save music" }),
        barList(insights.timeOfDay, { valueKey: "count", labelKey: "label" }),
      ])
    );

    if (insights.contextUsage.length) {
      root.append(
        el("div", { class: "insight-panel panel-inset" }, [
          el("h3", { text: "Most-used Context Mode sessions" }),
          barList(insights.contextUsage, { valueKey: "count", labelKey: "label" }),
        ])
      );
    }

    if (insights.reflectionStats.byMood.length) {
      root.append(
        el("div", { class: "insight-panel panel-inset" }, [
          el("h3", { text: "What tends to actually help (from your reflections)" }),
          barList(insights.reflectionStats.byMood, { valueKey: "averageEffectiveness", labelKey: "mood", maxHint: 5, suffix: "/5" }),
        ])
      );
    }
  }

  return { refresh: render };
}
