// Pattern ported from prototype/chick-ux-journey.html's score-grid/score-cell
// (3-cell Reach/Receptiveness/Warmth breakdown), emoji labels kept consistent
// with the live frontend/frontend/map.html side-panel (🎯/🤝/🔥).
interface ScoreGridProps {
  reachScore: number;
  receptivenessScore: number;
  warmthScore: number;
}

const CELLS = [
  { key: 'reachScore' as const, emoji: '🎯', label: 'Reach' },
  { key: 'receptivenessScore' as const, emoji: '🤝', label: 'Receptiveness' },
  { key: 'warmthScore' as const, emoji: '🔥', label: 'Warmth' },
];

export function ScoreGrid(props: ScoreGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {CELLS.map((cell) => (
        <div
          key={cell.key}
          className="rounded-lg border border-borderTint bg-surface2 px-3 py-3 text-center"
        >
          <div className="text-lg">{cell.emoji}</div>
          <div className="mt-1 font-display text-2xl text-text">{props[cell.key]}</div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-text3">{cell.label}</div>
        </div>
      ))}
    </div>
  );
}
