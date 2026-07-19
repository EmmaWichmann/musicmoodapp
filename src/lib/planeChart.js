// Renders the energy/valence plane as an SVG — the same coordinate system
// `planePosition` computes. The SVG itself is decorative (aria-hidden): every
// chart that uses this renders a paired, visible text legend alongside it, so
// nothing here is the only carrier of information (mirrors the rule the bar
// charts in Patterns already follow).

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
    viewBox: "0 0 100 60",
    preserveAspectRatio: "none",
    class: "plane-svg",
    "aria-hidden": "true",
  });

  svg.append(
    svgEl("line", { x1: 50, y1: 2, x2: 50, y2: 58, class: "plane-axis" }),
    svgEl("line", { x1: 2, y1: 30, x2: 98, y2: 30, class: "plane-axis" })
  );

  if (path && path.length > 1) {
    const d = path
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.xPct} ${(p.yPct * 56) / 100 + 2}`)
      .join(" ");
    svg.append(svgEl("path", { d, class: "plane-path" }));
  }

  for (const point of points) {
    const cy = (point.yPct * 56) / 100 + 2;
    svg.append(
      svgEl("circle", {
        cx: point.xPct,
        cy,
        r: point.r ?? 2.6,
        class: `plane-dot${point.variant ? ` plane-dot-${point.variant}` : ""}`,
      })
    );
  }

  return svg;
}
