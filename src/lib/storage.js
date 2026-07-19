// Thin, versioned localStorage access. Every collection lives under its own key
// so features can evolve independently, and every read is guarded against
// missing/corrupt data (a user's first visit, a cleared cache, or a manually
// edited localStorage value should never throw).

const KEYS = {
  entries: "mmapp.entries.v2",
  reflections: "mmapp.reflections.v1",
  journeys: "mmapp.journeys.v1",
  contextSessions: "mmapp.contextSessions.v1",
};

const LEGACY_ENTRIES_KEY = "mood-mix-entries";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getEntries() {
  const current = read(KEYS.entries, null);
  if (current) return current;

  // One-time migration from the original v1 schema (no timestamps, no ids
  // beyond a uuid). Keeps existing users' saved songs instead of wiping them.
  const legacy = read(LEGACY_ENTRIES_KEY, []);
  const migrated = legacy.map((entry) => ({ ...entry, createdAt: entry.createdAt ?? Date.now() }));
  write(KEYS.entries, migrated);
  return migrated;
}

export function saveEntries(entries) {
  write(KEYS.entries, entries);
}

export function getReflections() {
  return read(KEYS.reflections, []);
}

export function saveReflections(reflections) {
  write(KEYS.reflections, reflections);
}

export function getJourneys() {
  return read(KEYS.journeys, []);
}

export function saveJourneys(journeys) {
  write(KEYS.journeys, journeys);
}

export function getContextSessions() {
  return read(KEYS.contextSessions, []);
}

export function saveContextSessions(sessions) {
  write(KEYS.contextSessions, sessions);
}

export function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
