# MusicMoodApp — Case Study

**Emma Wichmann** · Product / UX / AI-assisted development portfolio project

> Most music apps begin by asking what you want to hear. I wanted to begin
> with a different question: how do you feel now, and how would you like to
> feel when the music ends?

---

## 1. The Problem

People don't always know what they want to listen to — but they often know,
if asked the right way, what they *need*. Someone who just left a hard
conversation doesn't want "sad songs." They want ten minutes to feel it, and
then something that helps them come down from it without pretending it
didn't happen. Someone with a job interview in fifteen minutes doesn't want
"upbeat music." They want their nervous system talked down a notch before
they have to perform.

Music genre and artist are surface-level filters. Mood, energy, desired
outcome, available time, and context are the actual inputs to the decision
"what should I put on right now" — and almost no music product asks for them
directly.

## 2. Why Existing Music Apps Do Not Fully Solve It

Spotify and Apple Music are catalog-and-discovery products. They are
extremely good at "more of what you already like," built from listening
history, collaborative filtering, and engagement optimization. That is a
different job than the one this app is built around:

- They assume you already know what you want to hear; their mood/genre tags
  are a search filter on a catalog, not a starting question about your
  emotional state.
- They optimize for time-on-platform, not for whether the listening session
  actually got you somewhere you wanted to be, emotionally.
- A "chill" or "sad" playlist is static. It doesn't move you anywhere — it
  just holds you at one point.
- Their personalization is opaque. You get a recommendation; you don't get a
  reason.
- Neither asks you afterward whether it worked, and neither turns your own
  reported experience into something you can see patterns in.

MusicMoodApp doesn't compete on catalog size — it has none, deliberately (see
§12). It's a decision layer that sits on top of *your own* listening choices:
it asks better questions before you pick something, gives you a structured
way to move between emotional states, checks whether it worked, and shows you
the pattern over time.

## 3. The Product Idea

An emotional music companion, not a streaming client. Instead of "genre,
artist, mood tag," the app asks: How do you feel right now? What's the
situation? How much time do you have? Where would you like to end up? It then
gives you a structured way to act on the answer — a Journey, a Context
session, or just a well-tagged library — checks in afterward, and reflects
your own patterns back to you.

## 4. Who It Is For

- Someone who wants to process a specific feeling in a bounded way (ten
  minutes, not indefinitely).
- Someone transitioning between emotional states around a task — overwhelmed
  into starting, anxious into steady before an interview, wound-up into
  asleep.
- Someone curious about their own emotional/listening patterns who doesn't
  want a clinical mood tracker — the tone is closer to a journal than a
  medical app.
- Employers and reviewers assessing whether I can take an ambiguous, human
  problem and carry it into a structured, tested, accessible product.

## 5. My Role

I'm not presenting myself as an expert engineer. I did product definition
(deciding what the app is *for*, and as importantly what it refuses to
claim), interaction and visual design, the full front-end implementation,
data modeling, accessibility decisions, and the test suite. I used AI as a
development partner throughout (§8) and stayed responsible for every product,
UX, and validity decision myself.

## 6. Research and Psychology Perspective

My background is psychology, physiology, and clinical research. The habit
that background gives you is: describe the actual phenomenon before you
design an intervention for it. Two things from that background shaped this
app directly:

- **Dimensional emotion models over categorical labels.** Rather than a flat
  list of mood names, every mood in the app is placed on two axes — energy
  (activation) and valence (pleasantness), in [`src/lib/moods.js`](./src/lib/moods.js).
  That's a simplified circumplex-style model, and it's what makes the Journey
  Builder possible: you can't gradually move someone from "Anxious" to
  "Grounded" if moods are just an unordered list of strings.
- **Deliberate avoidance of clinical framing.** Reflection Cards ask "did
  this help?" and "what surfaced?" in plain, observational language —
  "calmer," "still sad, but okay" — not diagnostic categories. The app never
  claims a therapeutic or medical effect. It reports back what a user told it
  about their own experience; it doesn't interpret that as treatment.

## 7. Five Major Product Updates

Every feature below is implemented and working in the repository, not just
specified — see the linked source.

---

### 7.1 Emotional Journey Builder

**User problem.** A static "sad playlist" doesn't move you anywhere — it
holds you at one emotional point. Most people don't want to *stay* sad, or
*stay* anxious; they want a path, even a short one, toward somewhere else.

**How it works.** In [`src/lib/journey.js`](./src/lib/journey.js): the user
picks a starting mood, a destination mood, and available minutes. The time
budget maps to a stage count (2–5 stages — more time, gentler steps). Each
stage's target energy/valence is a straight-line interpolation between the
start and end mood's coordinates, then matched back to the nearest real mood
in the taxonomy. Every journey ships with a plain-language explanation
(`explainJourney`) of exactly how it was built, shown in an expandable "How
this journey was generated" panel in the UI — because a listener should never
have to wonder why a stage was suggested.

**Why it's different from Spotify/Apple Music.** Neither product has a
concept of "gradual emotional transition" at all. A mood playlist is one
static point; this is a deliberate path with a visible, inspectable reason
for every step.

**Technical skills demonstrated.** Deterministic algorithm design (linear
interpolation in a 2D feature space, nearest-neighbor matching), pure/testable
function architecture, explainable-by-construction system design.

**Product/UX skills demonstrated.** Translating a fuzzy human request ("help
me feel less anxious before this call") into a concrete, structured
interaction; designing for trust through transparency rather than a
"magic AI" veneer.

**How I'd explain it in an interview.** "I designed a small, honest
recommendation engine instead of reaching for a black-box AI feature. Every
suggestion is explainable because the logic is linear interpolation over a
mood's energy and valence, not a hidden model — and I built the 'why' panel
because I think a personalization feature that can't explain itself is a
trust problem, not just a UX nicety."

**On screen.** Three inputs (starting feeling, destination feeling, minutes),
a "Build my journey" action, then a numbered stage list — each stage shows
its name (e.g. "Loosen," "Shift"), target mood, target energy, minutes, and a
picker to attach one of the user's saved songs matching that mood. A "Mark
journey complete" action logs it and opens a Reflection Card.

**Edge cases.** Same start/end mood (still produces a valid path — covered by
a unit test); an unknown mood name (throws instead of silently producing a
wrong journey); a stage whose target mood has no saved songs yet (shows a
prompt to add one instead of a broken picker); very short (5 min) or long
(90+ min) time budgets (stage count is clamped by the same function that's
unit tested for both extremes).

**Accessibility.** Native `<select>` elements (full keyboard and
screen-reader support) instead of custom dropdowns; the explanation panel is
a native `<details>/<summary>` so it's keyboard-operable and announced
correctly by default; every stage's information is in visible text, not
conveyed by color or icon alone.

**Privacy.** Journeys are stored only in the browser's `localStorage`; no
network request is made to build one — the entire recommendation runs
client-side.

**Testing plan.** Unit tests in [`tests/journey.test.js`](./tests/journey.test.js)
cover: stage count for short/medium/long time budgets, start/end mood
anchoring, monotonic energy movement toward the destination, minute
allocation staying within the time budget, determinism (same inputs →
identical output), and the explicit-throw behavior for unknown moods — 10
tests, all passing. Manual QA: build a journey with every mood pair at the
taxonomy's extremes (Euphoric→Heartbroken) and confirm the stage sequence
reads as a plausible gradual path, not a jump.

---

### 7.2 Context Mode

**User problem.** "I need music for studying" and "I need music for falling
asleep" are different problems with different constraints (energy, time,
tolerance for lyrics) — but most apps make you translate that yourself into a
genre or mood search.

**How it works.** [`src/lib/context.js`](./src/lib/context.js) defines eight
situations (studying, commuting, recovering from a hard day, interview prep,
cleaning, exercising, starting a hard task, falling asleep), each with a
default time budget, a short list of fitting moods, and a one-line practical
tip. Picking one shows an editable time budget and a plan; from there the
user can jump straight into their library filtered to that context, or hand
the plan straight to the Journey Builder pre-filled.

**Why it's different from Spotify/Apple Music.** Their "activity" playlists
are static, editorially curated lists with no connection to how much time the
user actually has or where the session should end. Context Mode is a bridge
into a structured session, not a destination itself.

**Technical skills demonstrated.** Small, well-organized reference data
design; cross-feature composition (Context Mode hands off cleanly into both
the library filter and the Journey Builder without duplicating logic).

**Product/UX skills demonstrated.** Situation-based information architecture
— designing around what the user is *doing*, not just how they feel, and
giving each situation a genuinely different default (interview prep defaults
to 15 minutes; studying to 45) instead of one generic template.

**How I'd explain it in an interview.** "I noticed that 'mood' alone is an
incomplete input — the same anxious feeling needs different handling before
an interview than during a commute. Context Mode adds the situational
variable without turning it into an open-ended free-text field, which keeps
it fast to use."

**On screen.** A grid of situation cards (label, one-line description,
default minutes); selecting one reveals an editable minutes field, a short
practical tip, the suggested moods, and two actions — filter the library, or
build a journey.

**Edge cases.** Minutes field cleared or set to 0 (falls back to the
context's default rather than producing a zero-length plan); a context whose
suggested moods have no saved songs yet (the library filter action still
works and correctly shows the "no songs saved yet" empty state).

**Accessibility.** Situation cards are real `<button>` elements with
`aria-pressed` state, not `<div>`s with click handlers, so they're reachable
and operable by keyboard and correctly announced as toggleable by screen
readers.

**Privacy.** No location, calendar, or device data is used — every signal
here is a manual choice the user makes on screen.

**Testing plan.** Unit tests in [`tests/context.test.js`](./tests/context.test.js)
verify every context's suggested moods exist in the shared mood taxonomy
(catches a typo'd mood name at test time instead of a silent broken filter in
production), that context IDs are unique, and that the minutes override and
default-fallback both behave correctly — 5 tests, all passing.

---

### 7.3 Music Reflection Cards

**User problem.** Without a check-in, "did that actually help" stays a vague
impression instead of something you can notice a pattern in over weeks.

**How it works.** [`src/lib/reflections.js`](./src/lib/reflections.js)
defines a short, structured reflection: did it help (yes/somewhat/no), which
observational emotions surfaced (multi-select — "calmer," "still sad, but
okay," "nothing changed," etc.), an effectiveness rating, and an optional
note. It's attachable to either a saved song or a completed Journey, opened
from a native `<dialog>` ([`src/features/reflectionModal.js`](./src/features/reflectionModal.js))
so focus-trapping and Escape-to-close come from the browser instead of a
hand-rolled modal.

**Why it's different from Spotify/Apple Music.** Streaming platforms measure
whether you kept listening — a proxy for engagement, not for whether the
music did what you needed. This is a direct, first-person signal the app
never has to infer.

**Technical skills demonstrated.** Native `<dialog>` for accessible modal UX;
careful state handling so re-rendering the form (e.g. after toggling an
emotion chip) never silently discards a note the user already typed — a bug I
caught and fixed during development, not a hypothetical.

**Product/UX skills demonstrated.** Designing a check-in that takes under 15
seconds to complete (chips and a slider, not a form), and choosing
non-judgmental language deliberately — "no" instead of a red/alarm-colored
"failed," because this is emotional self-data, not a pass/fail test.

**How I'd explain it in an interview.** "I wanted a feedback loop without
making it feel like homework. The whole card is tappable chips plus one
slider — no required free text — because a reflection habit only survives if
it's fast."

**On screen.** A dialog titled with the song or journey name; a three-option
"did it help" chip group; a multi-select emotion chip grid; a 1–5
effectiveness slider with a live numeric readout; an optional note; save/
cancel actions.

**Edge cases.** Closing the dialog without submitting (no partial reflection
is saved); re-toggling chips repeatedly before submitting (state is held in
memory, not reset by re-render — verified manually after finding and fixing
the note-loss bug mentioned above); a reflection with no emotions selected
(valid — `emotions: []` is allowed, since "nothing surfaced" is a real
answer).

**Accessibility.** Chip groups use `role="radiogroup"` / `aria-pressed`
correctly; the effectiveness slider is a native `<input type="range">` with
`aria-valuenow` kept in sync, fully operable by keyboard; the dialog restores
focus to the triggering element on close (native `<dialog>` behavior).

**Privacy.** Reflections are self-reported text and taps stored only in
`localStorage`. Nothing is inferred about the user beyond what they directly
entered.

**Testing plan.** `buildReflection()` is exercised indirectly through the
Patterns aggregation tests (below); manual QA: open a reflection from an
entry, type a note, toggle two emotion chips, drag the slider, confirm the
note is still present, then submit and confirm it appears in the Reflections
feed with the correct mood, date, and effectiveness value.

---

### 7.4 My Listening Patterns (data visualization / insights)

**User problem.** People's instincts about their own habits are often wrong
("I never listen to sad music") until they see the actual counts.

**How it works.** [`src/lib/patterns.js`](./src/lib/patterns.js) contains
pure aggregation functions — mood frequency, time-of-day distribution,
context-session usage, journey completion rate, and reflection effectiveness
per mood (which moods you rated as actually helping) — that the dashboard
[`src/features/patternsDashboard.js`](./src/features/patternsDashboard.js)
renders as accessible bar charts and stat tiles.

**Why it's different from Spotify/Apple Music.** "Spotify Wrapped" is an
annual, backward-looking, engagement-flavored summary built from passive
play-count data. This dashboard is built entirely from data the user
knowingly gave the app — what they saved, what they reflected on — and is
available continuously, not once a year.

**Technical skills demonstrated.** Pure, dependency-free aggregation
functions kept fully separate from rendering (so they're independently unit
tested); deliberate charting decisions: every chart here is a single measure
across categories, so it uses one consistent hue rather than a rainbow
per-bar, following the project's own data-visualization checklist rather than
defaulting to whatever a charting library ships.

**Product/UX skills demonstrated.** Choosing what *not* to visualize (no
comparison to other users, no leaderboard, no gamified streak) to keep the
tool reflective rather than performance-driven; every value is shown as
visible text next to its bar, so no insight depends on correctly reading a
color.

**How I'd explain it in an interview.** "I treated the dashboard's logic and
its rendering as two different problems on purpose. The aggregation
functions — mood frequency, time-of-day buckets, effectiveness-by-mood — take
plain arrays in and objects out, with zero DOM dependency, which is what let
me unit test them properly instead of only being able to eyeball the chart."

**On screen.** Three stat tiles (songs saved, journeys completed with
completion rate, average reflection effectiveness), then bar-chart panels:
most-saved moods, when you save music (by time-of-day bucket), most-used
Context Mode sessions, and what tends to actually help (average effectiveness
per mood, sourced from reflections).

**Edge cases.** Zero entries (shows an explicit "save a few songs and this
fills in on its own" state rather than an empty or broken chart — unit
tested); zero journeys (`journeyCompletionStats` returns a 0% rate instead of
dividing by zero — unit tested); zero reflections (`reflectionEffectiveness`
returns an explicit empty result instead of `NaN` — unit tested); an entry
saved before the `createdAt` field existed, from an earlier version of the
app (the storage migration in `src/lib/storage.js` backfills a timestamp so
old data doesn't crash the time-of-day chart).

**Accessibility.** Every bar has a real text label and a real visible number
— color is never the only carrier of meaning; bar tracks have
`role="img"` with a full text `aria-label` ("Focused: 4") so a screen reader
gets the same information a sighted user gets from the bar's length.

**Privacy.** 100% derived from the user's own local data; there is no
aggregate, cross-user, or server-side analytics collection anywhere in the
app.

**Testing plan.** `tests/patterns.test.js` — 10 tests covering mood-frequency
counting and sort order, time-of-day bucketing (including entries with a
missing timestamp), context usage counts, journey completion math including
the zero-journeys case, and reflection-effectiveness averaging including the
zero-reflections case. Manual QA: seed the library with entries across at
least four moods and two times of day, complete one journey, submit two
reflections, and confirm every number on the dashboard matches a hand count.

---

### 7.5 Coming Soon — Adaptive Soundtrack

**Status.** Concept and UI preview only — intentionally not implemented, and
labeled as such in the app's Roadmap tab
([`src/features/roadmap.js`](./src/features/roadmap.js)).

**The idea.** Today, a Journey or Context session is a snapshot: you tell the
app how you feel once, at the start. Adaptive Soundtrack would let a session
adjust — shorten a Journey, add a grounding stage, shift energy — in response
to signals through the day, instead of assuming the plan you set at 9am still
fits at 4pm.

**Signals it could use.** In-app reflections (weighted highest, because they're
explicit); time of day; calendar free/busy status only, opt-in, never event
titles or attendees; connected wearable data (resting heart rate / movement
trend), opt-in; and a manual override that always outranks every inferred
signal.

**How the recommendation logic would work, at a high level.** Every enabled
signal converts to the same energy/valence scale the Journey Builder already
uses — no new concept to introduce. Signals are weighted by directness (your
own reflections > inferred signals > optional external signals). The system
proposes a change and always shows its one-line reason before anything
changes — it never silently adjusts what's playing, matching the same
transparency standard as the Journey Builder's "how this was generated"
panel.

**Privacy controls, explained now, before the feature exists.** Every
external signal (calendar, wearable) is opt-in and off by default. The
Roadmap tab includes a disabled preview of these toggles specifically so the
consent model is designed and communicated *before* a single line of the
feature is built — raw calendar/wearable data would never leave the device
unprocessed, only a derived energy value would sync; every toggle is
instantly reversible; and turning everything off returns the app to exactly
today's (fully manual) behavior.

**Why this belongs on the roadmap and not in v1.** It requires real external
integrations (calendar OAuth, wearable APIs) that don't belong in a
client-only static app, and a feature that touches health-adjacent data
deserves its consent model designed in the open first — which is what the
Roadmap tab is for.

---

## 8. AI-Assisted Development Process

I used AI (Claude, via Claude Code) as a development partner across this
project: brainstorming which five features would be distinct rather than
cosmetic variations on "playlist," debugging, writing and reviewing the unit
test suite, and speeding up implementation of repetitive UI wiring. I made
the calls AI can't make for me: what the app should and shouldn't claim about
emotional or mental health, which data was worth collecting versus
unnecessary, what tone a "did this help?" prompt should take, and — directly
visible in the product — the decision to make the one AI-flavored feature in
the app (the Journey Builder's recommendation logic) fully rule-based and
explainable rather than an opaque model call, specifically so I wasn't
shipping an "AI feature" I couldn't stand behind or explain in an interview.

## 9. Accessibility and Privacy

**Accessibility**, applied throughout rather than bolted on at the end: a
real ARIA tablist with roving `tabindex` and arrow-key navigation for the
main nav; native `<dialog>` for the reflection modal (browser-native focus
trap and Escape handling); every data visualization pairs a bar with visible
text, never color alone; a skip-to-content link; visible `:focus-visible`
states; and a `prefers-reduced-motion` rule that disables transition/animation
duration app-wide for users who've asked for that at the OS level.

**Privacy**, by architecture rather than policy: the entire app is
client-only and stores data in `localStorage`. There is no backend, no
account, and no network call that sends user data anywhere. The one feature
that would eventually need external data (Adaptive Soundtrack) is unbuilt,
and its consent model — opt-in, reversible, minimally scoped — is designed
and shown to the user *before* the feature exists, not after.

## 10. Testing and Quality Assurance

All non-trivial business logic lives in framework-free, dependency-free
modules under `src/lib/`, specifically so it can be unit tested without a
browser. 25 Vitest tests cover the Journey Builder's recommendation engine,
Context Mode's data integrity, and the Patterns dashboard's aggregation math
— including the edge cases that are easy to get wrong and embarrassing to
ship broken: division by zero on empty data, entries missing a timestamp,
unknown mood names, and determinism of the "AI-flavored" recommendation
logic. Rendering code is verified manually against a checklist per feature
(see the "Testing plan" in each feature spec above) plus static verification
of every DOM element ID and CSS class referenced in the code against what
actually exists in the markup, and a full syntax check of every module.

## 11. Technical Skills Demonstrated

Modular vanilla JavaScript (ES modules) with a clean split between pure logic
and DOM rendering; a small, deterministic recommendation algorithm (linear
interpolation over a 2D emotional feature space, nearest-neighbor matching);
versioned `localStorage` persistence with a migration path for existing user
data; accessible-by-default component choices (native `<dialog>`, real ARIA
roles, keyboard navigation); unit testing with Vitest; data-visualization
decisions grounded in an accessibility-first checklist rather than
library defaults; and static/manual QA practices adapted to a genuine
environment constraint (see §13).

## 12. Product Decisions and Tradeoffs

- **No music catalog, on purpose.** This app doesn't stream or search actual
  songs — it organizes *your* choices and helps you make better ones. That
  keeps the product honest about what it is (a decision layer) instead of a
  weaker Spotify clone.
- **Rule-based over model-based for the one "AI" feature.** I could have
  wired the Journey Builder to a hosted LLM and called it an AI feature. I
  chose a transparent heuristic instead, because a static portfolio app has
  no safe way to hold an API key, and because I'd rather ship a feature I can
  fully explain than one that sounds more impressive and isn't.
  See §8.
- **No red/alarm color for "didn't help."** Reflection data is not a
  pass/fail test; the UI deliberately avoids framing a "no" as a failure
  state.
- **Client-only, no backend.** Chosen for the honest reason that this is a
  portfolio project with no real users yet, not just a technical constraint —
  it also forces the privacy story to be genuinely simple instead of merely
  described as simple.

## 13. What I Learned

Two things surfaced that weren't obvious going in. First, re-rendering a form
naively on every interaction is an easy way to silently drop user input — I
found and fixed exactly this in the Reflection Card (a chip toggle was
wiping out a typed note) during development, not after. Second, working
through this project happened on a machine that turned out to be almost out
of disk space (571MB free on a 228GB drive) partway through, which blocked
installing a browser for automated visual QA — I adapted by verifying through
static analysis, the full unit test suite, and manual code tracing instead of
skipping verification, and it's a reminder that "run the tests" and "the app
actually works" aren't always checkable the same way in every environment.

## 14. Future Roadmap

Beyond Adaptive Soundtrack (§7.5): shareable, anonymized Journey templates
("Overwhelmed → Starting a hard task, 10 min" as something a friend could
try); a lightweight export of a user's own data (their reflections and
entries, as JSON, since it's their data); and richer Context presets built
from what the Patterns dashboard actually shows are the most-used situations,
rather than my initial guesses.

## 15. What I Would Build With More Time

A real backend and account system so Patterns and Journeys persist across
devices, with the same privacy defaults preserved rather than loosened; a
proper end-to-end test suite (Playwright) once environment constraints allow
it, to complement the current unit-test coverage; and user testing with
people outside my own household to see whether the Journey stage names
("Loosen," "Shift") read the way I intend them to for people who don't already
know the reasoning behind them.
