// Pattern ported from prototype/chick-ux-journey.html's inverted "Refinement
// Loop" card — the one deliberately dark moment in an otherwise light/lilac UI.
export function DarkInsightCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[#120d1e] p-6 text-[#c4bcff]">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#9b91e8]">
        Refinement insight
      </div>
      <div className="text-sm leading-relaxed text-[#fbf8ff]">{children}</div>
    </div>
  );
}
