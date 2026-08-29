import type { ChannelPerformance } from '../api/types';
import { CHANNEL_COLORS, CHANNEL_LABELS } from './map/channelColors';
import { formatCurrency, formatPercent } from '../lib/format';

export function ChannelPerformanceTable({ rows }: { rows: ChannelPerformance[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-text3">Aún no hay intentos registrados por canal.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div
          key={row.channelType}
          className="flex items-center gap-3 rounded-lg bg-surface2 px-3 py-2.5 text-sm"
        >
          <span
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: CHANNEL_COLORS[row.channelType] }}
          />
          <span className="w-32 flex-shrink-0 font-semibold text-text">
            {CHANNEL_LABELS[row.channelType]}
          </span>
          <span className="text-text3">{row.attempts} attempts</span>
          <span className="text-text3">{formatPercent(row.responseRate)} response</span>
          <span className="text-text3">{row.signups} signups</span>
          <span className="ml-auto font-semibold text-accent">{formatCurrency(row.revenue)}</span>
        </div>
      ))}
    </div>
  );
}
