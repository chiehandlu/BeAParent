import type { ScoreResult } from "@/game/scoring";

/** 純 SVG 雷達圖，避免為單一圖表引入圖表套件。 */
export function ResultRadar({ dimensions }: Pick<ScoreResult, "dimensions">) {
  const n = dimensions.length;
  const point = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [50 + Math.cos(angle) * r, 50 + Math.sin(angle) * r] as const;
  };
  const polygon = (r: (i: number) => number) =>
    dimensions.map((_, i) => point(i, r(i)).join(",")).join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      className="mx-auto w-full max-w-sm"
      role="img"
      aria-label="五維度評分雷達圖"
    >
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={polygon(() => 38 * f)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={0.4}
        />
      ))}
      <polygon
        points={polygon((i) => (dimensions[i].value / 100) * 38)}
        fill="var(--color-island)"
        fillOpacity={0.5}
        stroke="var(--color-island)"
        strokeWidth={0.6}
      />
      {dimensions.map((d, i) => {
        const [x, y] = point(i, 46);
        return (
          <text
            key={d.key}
            x={x}
            y={y}
            fontSize={4}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
          >
            {d.label} {d.value}
          </text>
        );
      })}
    </svg>
  );
}
