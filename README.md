# MusicMoodApp

An emotional music companion. Most music apps start by asking what you want to
hear. This one starts with a different question: how do you feel now, and how
would you like to feel when the music ends?

Built by Emma Wichmann as a portfolio project. Full write-up in
[`CASE_STUDY.md`](./CASE_STUDY.md) — the product thinking, UX decisions,
testing approach, and tradeoffs behind it, not just the code.

## Why this exists

Spotify and Apple Music are excellent at "play me more of this." Neither asks
the more useful question: what do you actually need from music right now, and
where are you trying to go emotionally? This app is built entirely around
that gap — see `CASE_STUDY.md` for the full reasoning.

## What's in it

- **Compose & Library** — save songs tagged by mood, with notes.
- **Context Mode** — pick a situation (studying, commuting, recovering from a
  hard day, an interview, cleaning, exercise, falling asleep, starting a hard
  task) and get a fitting energy range and time budget instead of guessing.
- **Emotional Journey Builder** — pick a starting feeling and a destination
  feeling; the app builds a short, explainable sequence of stages between
  them. The recommendation logic is deliberately transparent, not a black box
  — see "How this journey was generated" inside the app.
- **Music Reflection Cards** — a short check-in after listening: did it help,
  what surfaced, how effective did it feel.
- **My Listening Patterns** — a dashboard built entirely from your own saved
  entries and reflections: most-saved moods, time-of-day patterns, and what
  tends to actually help, sourced from your own data.
- **Roadmap: Adaptive Soundtrack** (coming soon, not yet functional) — a
  concept preview for a future feature, with an explicit privacy/consent
  model.

## Running it locally

Module scripts (`type="module"`) need to be served over HTTP — opening
`index.html` directly (`file://`) won't work in most browsers. Use any static
file server, for example:

```bash
npm run dev
# serves the app at http://localhost:5500
```

## Running the tests

The core recommendation and insights logic (`src/lib/`) is pure and unit
tested with Vitest:

```bash
npm install
npm test
```

## Project structure

```
index.html             App shell + tab structure
style.css              All styling
src/lib/                Pure, unit-tested logic (no DOM)
  moods.js               Mood taxonomy (energy/valence per mood)
  journey.js              Emotional Journey Builder's recommendation logic
  context.js              Context Mode presets
  reflections.js          Reflection Card data shaping
  patterns.js              Listening Patterns aggregation
  storage.js               Versioned localStorage access
src/features/            DOM wiring per feature, one file per tab
tests/                   Vitest unit tests for src/lib
```

## What I practiced

- Structuring a real product decision (not just a feature list) around a
  distinct user need.
- Modular vanilla JavaScript with a clean split between pure logic and DOM
  rendering.
- Writing a small, explainable recommendation engine instead of reaching for
  an opaque "AI" label.
- Accessible UI patterns: a real ARIA tablist, native `<dialog>` for modals,
  visible text alongside every data visualization, keyboard navigation,
  reduced-motion support.
- Unit testing business logic in isolation with Vitest.
- Writing a privacy-and-consent model for a feature before building it.

## Status

Actively developed. Data is stored in the browser's `localStorage` — nothing
leaves your device.
