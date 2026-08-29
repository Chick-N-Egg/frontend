import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  full?: boolean;
}

export function Card({ full = false, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-5 ${full ? 'col-span-2' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
