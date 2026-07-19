const STORAGE_KEY = "mmapp.theme";

function systemPrefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const label = document.getElementById("theme-toggle-label");
  const root = document.documentElement;
  const stored = localStorage.getItem(STORAGE_KEY);

  function isEffectivelyDark() {
    const explicit = root.getAttribute("data-theme");
    if (explicit === "dark") return true;
    if (explicit === "light") return false;
    return systemPrefersDark();
  }

  function reflectState() {
    const dark = isEffectivelyDark();
    toggle.setAttribute("aria-pressed", String(dark));
    label.textContent = dark ? "Light mode" : "Dark mode";
  }

  if (stored === "dark" || stored === "light") {
    root.setAttribute("data-theme", stored);
  }
  reflectState();

  toggle.addEventListener("click", () => {
    const next = isEffectivelyDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
    reflectState();
  });
}
