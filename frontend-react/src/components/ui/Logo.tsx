// Ported from prototype/chick-brief.html's nav-logo SVG mark.
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="26" rx="13" ry="9" fill="#F2EFFF" stroke="#7B6FDB" strokeWidth="1.2" />
      <path
        d="M7 24 Q12 20 15 23 Q18 26 20 22 Q22 18 25 21 Q28 24 33 22"
        stroke="#7B6FDB"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="20" cy="18" r="7" fill="#A78BFA" />
      <circle cx="17.5" cy="17" r="1.2" fill="#120D1E" />
      <circle cx="22.5" cy="17" r="1.2" fill="#120D1E" />
      <path d="M19 19.5 L21 19.5 L20 21 Z" fill="#C4401A" />
    </svg>
  );
}

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2 font-display text-xl text-text">
      <LogoMark size={size} />
      Chick<span className="text-accent">.</span>
    </div>
  );
}
