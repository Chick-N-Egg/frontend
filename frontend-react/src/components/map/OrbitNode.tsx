import type { NodeLayout } from './orbitalLayout';
import { CHANNEL_COLORS } from './channelColors';

interface OrbitNodeProps {
  layout: NodeLayout;
  index: number;
  onClick: () => void;
  isPending: boolean;
}

export function OrbitNode({ layout, index, onClick, isPending }: OrbitNodeProps) {
  const { result, x, y, size, angleDeg, dist, showName, nameFontSize, scoreFontSize } = layout;
  const color = CHANNEL_COLORS[result.channelType];

  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 h-px origin-left"
        style={{
          width: dist,
          transform: `rotate(${angleDeg}deg)`,
          background: 'linear-gradient(90deg, rgba(123,111,219,0.35), transparent)',
        }}
      />
      {/*
        This wrapper carries the x/y position and stays un-clipped so the
        "Best shot" label (positioned above the circle via negative top) is
        never cut off. The button inside clips only its own text content —
        border-radius alone doesn't clip overflowing content, so without this
        the button's overflow-hidden would also hide the label sitting above it.
      */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: size,
          height: size,
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        }}
      >
        {result.isBestShot && (
          <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-wide text-accent [animation:pulse-best-shot_1.8s_ease-in-out_infinite]">
            ★ Best shot
          </span>
        )}
        <button
          type="button"
          onClick={onClick}
          disabled={isPending}
          className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full p-1 text-center text-white shadow-md transition-transform hover:z-10 hover:scale-105 disabled:cursor-wait"
          style={{
            backgroundColor: color,
            animation: `node-in 0.4s ease ${index * 0.06}s both`,
            boxShadow: result.isBestShot
              ? '0 0 0 3px #a78bfa, 0 0 24px 4px rgba(167,139,250,0.55)'
              : undefined,
          }}
        >
          {/* line-clamp-2 is the second layer of defense (after this button's
              overflow-hidden) so long channel names — much longer than the
              original demo's "NoteAI"-style short labels — never spill past
              the circle the way border-radius alone would allow. */}
          {showName ? (
            <>
              <span className="line-clamp-2 px-0.5 leading-tight" style={{ fontSize: nameFontSize }}>
                {result.name}
              </span>
              <span className="font-bold" style={{ fontSize: scoreFontSize }}>
                {result.confidenceTotal.toFixed(1)}
              </span>
            </>
          ) : (
            <span className="font-bold" style={{ fontSize: scoreFontSize }}>
              {result.confidenceTotal.toFixed(1)}
            </span>
          )}
          {isPending && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white [animation:spin_0.7s_linear_infinite]" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}
