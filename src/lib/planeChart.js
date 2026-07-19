// Renders the energy/valence plane as an SVG — the same coordinate system
// `planePosition` computes. The SVG itself is decorative (aria-hidden): every
// chart that uses this renders a paired, visible text legend alongside it, so
// nothing here is the only carrier of information (mirrors the rule the bar
// charts in Patterns already follow).
//
// The viewBox is a plain 0-100 square matching planePosition's own xPct/yPct
// range exactly. Any CSS overlay (e.g. the journey start/end tags) that also
// positions itself with `left/top: <xPct/yPct>%` over this element's rendered
// box will land on the exact same point as the SVG content — no separate
// inset or aspect-correction math to keep in sync between the two.

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

export function renderPlane({ points = [], path = null } = {}) {
  const svg = svgEl("svg", {
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    class: "plane-svg",
    "aria-hidden": "true",
  });

  svg.append(
    svgEl("line", { x1: 50, y1: 4, x2: 50, y2: 96, class: "plane-axis" }),
    svgEl("line", { x1: 4, y1: 50, x2: 96, y2: 50, class: "plane-axis" })
  );

  if (path && path.length > 1) {
    const d = path.map((p, i) => `${i === 0 ? "M" : "L"} ${p.xPct} ${p.yPct}`).join(" ");
    svg.append(svgEl("path", { d, class: "plane-path", "vector-effect": "non-scaling-stroke" }));
  }

  for (const point of points) {
    svg.append(
      svgEl("circle", {
        cx: point.xPct,
        cy: point.yPct,
        r: point.r ?? 2.6,
        class: `plane-dot${point.variant ? ` plane-dot-${point.variant}` : ""}`,
        "vector-effect": "non-scaling-stroke",
      })
    );
  }

  return svg;
}
