export function CenterNode({ label }: { label: string }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 flex h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full p-3 text-center shadow-lg"
      style={{
        background: 'radial-gradient(circle at 35% 30%, #c4bcff, #a78bfa 55%, #7b6fdb)',
      }}
    >
      {/* border-radius doesn't clip content on its own — overflow-hidden above
          does the clipping; line-clamp is the second layer of defense so long
          product summaries never spill outside the circle. */}
      <span className="line-clamp-4 font-display text-[11px] font-bold leading-tight text-text">
        {label}
      </span>
    </div>
  );
}
