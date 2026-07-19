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
