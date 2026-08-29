import type { DailyGrowthPoint } from '../api/types';

const WIDTH = 320;
const HEIGHT = 100;
const PADDING = 10;

function buildPoints(values: number[]): string {
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? (WIDTH - PADDING * 2) / (values.length - 1) : 0;
  return values
    .map((v, i) => {
      const x = PADDING + i * step;
      const y = HEIGHT - PADDING - (v / max) * (HEIGHT - PADDING * 2);
      return `${x},${y}`;
    })
    .join(' ');
}

export function GrowthSparkline({ points }: { points: DailyGrowthPoint[] }) {
  if (points.length === 0) {
    return <p className="text-sm text-text3">Aún no hay datos de crecimiento.</p>;
  }

  const signupsLine = buildPoints(points.map((p) => p.signups));
  const revenueLine = buildPoints(points.map((p) => p.revenue));

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full">
        <polyline points={signupsLine} fill="none" stroke="#7b6fdb" strokeWidth={2} />
        <polyline points={revenueLine} fill="none" stroke="#c4bcff" strokeWidth={2} strokeDasharray="4 3" />
        {points.map((p, i) => {
          const step = points.length > 1 ? (WIDTH - PADDING * 2) / (points.length - 1) : 0;
          const x = PADDING + i * step;
          const maxSignups = Math.max(1, ...points.map((pt) => pt.signups));
          const y = HEIGHT - PADDING - (p.signups / maxSignups) * (HEIGHT - PADDING * 2);
          return (
            <circle key={p.date} cx={x} cy={y} r={2.5} fill="#7b6fdb">
              <title>
                {p.date}: {p.signups} signups, ${p.revenue}
              </title>
            </circle>
          );
        })}
      </svg>
      <div className="mt-2 flex gap-4 text-[11px] text-text3">
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-accent" /> Signups
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-accent3" /> Revenue
        </span>
      </div>
    </div>
  );
}
