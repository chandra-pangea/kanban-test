import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, id, error, className = "", ...props }: TextFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label htmlFor={inputId} className="text-[var(--font-size-sm)] font-semibold text-[var(--color-text)]">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-required={props.required === true ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-11 w-full rounded-xl border bg-[var(--color-surface)] px-4 text-sm text-[#0f172a] transition-colors placeholder:text-[var(--color-muted)] focus:border-[#5562ff] focus:ring-2 focus:ring-[#5562ff]/20 disabled:cursor-not-allowed disabled:bg-[color-mix(in_srgb,var(--color-surface)_84%,var(--color-muted)_16%)] ${
          error ? "border-[var(--color-error)]" : "border-[#d6dbe8]"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="rounded-[var(--radius-sm)] bg-[var(--color-error-soft)] px-[var(--space-2)] py-[var(--space-1)] text-[var(--font-size-xs)] text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
