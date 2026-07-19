import { initCompose } from "./features/compose.js";
import { initContextMode } from "./features/contextMode.js";
import { initJourneyBuilder } from "./features/journeyBuilder.js";
import { initReflectionsFeed } from "./features/reflectionsFeed.js";
import { initPatternsDashboard } from "./features/patternsDashboard.js";
import { initRoadmap } from "./features/roadmap.js";
import { initAbout } from "./features/about.js";
import { initTheme } from "./features/theme.js";

function initTabs({ onActivate } = {}) {
  const tabButtons = [...document.querySelectorAll(".tab-button")];
  const panels = [...document.querySelectorAll(".tab-panel")];

  function activate(tabButton) {
    tabButtons.forEach((btn) => {
      const isActive = btn === tabButton;
      btn.setAttribute("aria-selected", String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });
    const panelId = tabButton.getAttribute("aria-controls");
    panels.forEach((panel) => {
      panel.classList.toggle("is-hidden", panel.id !== panelId);
    });
    onActivate?.(panelId);
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => activate(btn));
    btn.addEventListener("keydown", (event) => {
      let targetIndex = null;
      if (event.key === "ArrowRight") targetIndex = (index + 1) % tabButtons.length;
      if (event.key === "ArrowLeft") targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === "Home") targetIndex = 0;
      if (event.key === "End") targetIndex = tabButtons.length - 1;
      if (targetIndex === null) return;
      event.preventDefault();
      tabButtons[targetIndex].focus();
      activate(tabButtons[targetIndex]);
    });
  });

  return {
    goTo: (panelId) => {
      const btn = tabButtons.find((b) => b.getAttribute("aria-controls") === panelId);
      if (btn) activate(btn);
    },
  };
}

function main() {
  initTheme();
  const compose = initCompose();
  const journeyBuilder = initJourneyBuilder();
  const reflectionsFeed = initReflectionsFeed();
  const patternsDashboard = initPatternsDashboard();

  const tabs = initTabs({
    onActivate: (panelId) => {
      if (panelId === "tab-reflections") reflectionsFeed.refresh();
      if (panelId === "tab-patterns") patternsDashboard.refresh();
    },
  });

  initContextMode({
    onFilterLibrary: (moodName) => {
      tabs.goTo("tab-compose");
      compose.filterToMood(moodName);
    },
    onStartJourney: ({ fromMood, minutes }) => {
      tabs.goTo("tab-journey");
      journeyBuilder.prefill({ fromMood, minutes });
    },
  });

  initRoadmap();
  initAbout();

  document.getElementById("footer-about-link").addEventListener("click", () => {
    tabs.goTo("tab-about");
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("tab-about").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
}

main();
