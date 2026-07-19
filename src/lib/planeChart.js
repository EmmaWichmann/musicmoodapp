// Renders the energy/valence plane as an SVG — the same coordinate system
// `planePosition` computes.
//
// The viewBox (100 x 60) is deliberately the same aspect ratio as the
// element's rendered box (`aspect-ratio: 5/3` in CSS, see .plane-svg), so the
// browser scales x and y uniformly — a circle stays a circle instead of
// squashing into an ellipse. Because the scale is uniform, a point's percent
// position along the viewBox's y-axis (0-60) still equals its percent
// position on-screen, which is what lets a plain CSS overlay (the journey
// start/end tags) use `top: <yPct>%` and land exactly on the matching SVG
// point with no separate conversion.
//
// The SVG itself is decorative (aria-hidden): every chart using this pairs
// it with a visible text legend, so nothing here is the only carrier of
// information (mirrors the rule the bar charts in Patterns already follow).

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEW_H = 60;

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, value);
  }
  return node;
}

function toViewY(yPct) {
  return (yPct / 100) * VIEW_H;
}

export function renderPlane({ points = [], path = null } = {}) {
  const svg = svgEl("svg", {
    viewBox: `0 0 100 ${VIEW_H}`,
    class: "plane-svg",
    "aria-hidden": "true",
  });

  svg.append(
    svgEl("line", { x1: 50, y1: 2, x2: 50, y2: VIEW_H - 2, class: "plane-axis" }),
    svgEl("line", { x1: 2, y1: VIEW_H / 2, x2: 98, y2: VIEW_H / 2, class: "plane-axis" })
  );

  if (path && path.length > 1) {
    const d = path.map((p, i) => `${i === 0 ? "M" : "L"} ${p.xPct} ${toViewY(p.yPct)}`).join(" ");
    svg.append(svgEl("path", { d, class: "plane-path", "vector-effect": "non-scaling-stroke" }));
  }

  for (const point of points) {
    svg.append(
      svgEl("circle", {
        cx: point.xPct,
        cy: toViewY(point.yPct),
        r: point.r ?? 2.6,
        class: `plane-dot${point.variant ? ` plane-dot-${point.variant}` : ""}`,
        "vector-effect": "non-scaling-stroke",
      })
    );
  }

  return svg;
}
