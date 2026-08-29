export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-9 w-9 rounded-full border-[3px] border-border border-t-accent [animation:spin_0.8s_linear_infinite] ${className}`}
    />
  );
}
