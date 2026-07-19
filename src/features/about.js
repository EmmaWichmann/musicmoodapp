import { el } from "../lib/dom.js";

export function initAbout() {
  const root = document.getElementById("about-root");

  root.append(
    el("div", { class: "about-layout" }, [
      el("div", { class: "panel-inset about-lead" }, [
        el("p", { class: "section-label", text: "About this project" }),
        el("h2", {
          text: "Most music apps begin by asking what you want to hear. I wanted to begin with a different question.",
        }),
        el("p", { class: "about-pullquote", text: "How do you feel now, and how would you like to feel when the music ends?" }),
      ]),

      el("div", { class: "panel-inset" }, [
        el("h3", { text: "Why this exists" }),
        el("p", {
          text:
            "I'm Emma Wichmann. My background is in psychology, physiology, and clinical research — fields built around a simple habit: pay close attention to what someone is actually experiencing before deciding what to do about it. Music has been an important emotional outlet in my own life, and I kept noticing that most music tools treat mood as a genre filter instead of the point of the interaction.",
        }),
        el("p", {
          text:
            "I built this app to explore how technology can respond to a human need that's difficult to express — not to prove I can write code. It combines that research background with the technical skills I'm building now: product thinking, interface design, data organization, accessibility, and testing.",
        }),
      ]),

      el("div", { class: "panel-inset business-case" }, [
        el("h3", { text: "The business case, not just the personal one" }),
        el("p", {
          text:
            "Streaming platforms have effectively unlimited catalogs, but deciding what to play remains a real source of friction — the industry's own term for it is choice paralysis. Existing mood and activity playlists narrow the catalog by label, but they're one-way: nothing confirms whether what a listener picked actually met their need, and nothing adapts as the session goes on. That gap has a business cost, not just a UX cost — time spent browsing instead of listening lowers session engagement, mismatched recommendations raise skip rates, and platforms are left inferring 'this worked' from skip/completion behavior alone, a noisy proxy with no direct signal underneath it.",
        }),
        el("h4", { text: "Where this fits as a product" }),
        el("ul", { class: "plain-list" }, [
          el("li", {}, [
            el("strong", { text: "As a feature inside an existing platform. " }),
            "Context Mode and the Journey Builder are a faster, more structured way to decide what to play — the kind of session-mode feature a Spotify or Apple Music could ship to cut time-to-first-play. Reflection Cards give the product team something they don't currently have: a direct, opted-in signal for whether a recommendation actually worked, instead of inferring it from skips.",
          ]),
          el("li", {}, [
            el("strong", { text: "As a licensable layer for other products. " }),
            "Workplace wellness and EAP benefit providers, and meditation apps, already sell attention and emotional-state features (breathing exercises, sound baths) but generally don't build music-specific tooling. The mood taxonomy, journey logic, and feedback loop here are exactly the pieces a smaller product would otherwise have to build from scratch.",
          ]),
        ]),
        el("h4", { text: "How a business would know it's working" }),
        el("p", {
          text:
            "Time-to-first-play, session completion rate, Reflection Card completion rate, and 7/30-day retention for users who engage with Journeys or Context Mode versus those who don't. The Patterns dashboard in this app (src/lib/patterns.js) is already the same kind of aggregation layer a product team would build internally to track exactly these numbers — it just reports them back to the user instead of to a dashboard.",
        }),
        el("h4", { text: "How it could make money" }),
        el("p", {
          text:
            "Freemium is the most direct model and mirrors how streaming platforms already segment free versus paid: mood tagging and the library stay free, Journey Builder, Patterns, and unlimited Reflections sit behind a subscription tier. The more ambitious version is a usage-priced API for the B2B case above.",
        }),
      ]),

      el("div", { class: "panel-inset" }, [
        el("h3", { text: "How I used AI" }),
        el("p", {
          text:
            "I used AI as a development partner throughout — for brainstorming feature directions, debugging, writing tests, and speeding up implementation. I stayed responsible for the decisions: what the app should and shouldn't claim, how a heartbroken user should be spoken to, which data was worth collecting, and whether a feature was actually useful or just impressive-looking. The Journey Builder's recommendation logic (in Journey Builder → 'How this was generated') is deliberately transparent and rule-based rather than a hidden model, on purpose — I didn't want to ship an 'AI feature' I couldn't fully explain.",
        }),
      ]),

      el("div", { class: "panel-inset" }, [
        el("h3", { text: "What I am — and am not — claiming" }),
        el("p", {
          text:
            "I'm not presenting myself as an expert engineer, and this app doesn't make medical or therapeutic claims about music. It's a self-reflection tool: it organizes what you already know about your own listening habits and gives you a more deliberate way to act on it. I'm a cross-functional builder who can take an unclear, human problem and carry it into a structured, tested digital product using modern tools.",
        }),
      ]),
    ])
  );
}
