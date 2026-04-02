import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren, ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({ children, isLoading = false, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 w-full items-center justify-center rounded-xl border border-transparent bg-[#5562ff] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3947f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] disabled:cursor-not-allowed disabled:bg-[#b8bff8] ${className}`}
      disabled={props.disabled ?? isLoading}
      {...props}
    >
      {isLoading ? "Signing in..." : children}
    </button>
  );
}
