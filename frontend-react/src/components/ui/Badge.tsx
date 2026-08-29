interface BadgeProps {
  children: React.ReactNode;
  tone?: 'accent' | 'muted' | 'warning';
}

const toneClass: Record<NonNullable<BadgeProps['tone']>, string> = {
  accent: 'bg-accent/15 text-accent',
  muted: 'bg-surface2 text-text3',
  warning: 'bg-warning/10 text-warning',
};

export function Badge({ children, tone = 'muted' }: BadgeProps) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${toneClass[tone]}`}>
      {children}
    </span>
  );
}
