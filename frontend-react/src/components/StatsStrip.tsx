interface Stat {
  label: string;
  value: string;
}

export function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface px-5 py-4">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-text3">
            {stat.label}
          </div>
          <div className="font-display text-2xl text-accent">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
