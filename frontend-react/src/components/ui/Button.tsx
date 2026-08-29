import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition-opacity disabled:cursor-not-allowed disabled:opacity-50';
  const variantClass =
    variant === 'primary'
      ? 'bg-gradient-to-br from-accent to-[#5b4fb8] text-[#fff8ee] hover:opacity-90'
      : 'rounded-full border border-border bg-transparent text-text2 hover:border-accent hover:text-accent';

  return (
    <button
      className={`${base} ${variantClass} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <Spinner className="h-4 w-4 border-2" />}
      {children}
    </button>
  );
}
