import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren, ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({ children, isLoading = false, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-[2.875rem] w-full items-center justify-center rounded-[var(--radius-md)] border border-transparent bg-[var(--color-primary)] px-[var(--space-4)] text-[var(--font-size-sm)] font-semibold text-[var(--color-surface)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={props.disabled ?? isLoading}
      {...props}
    >
      {isLoading ? "Signing in..." : children}
    </button>
  );
}
