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
        className={`h-[2.875rem] rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-[var(--space-3)] text-[var(--font-size-sm)] text-[var(--color-text)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] disabled:cursor-not-allowed disabled:bg-[color-mix(in_srgb,var(--color-surface)_84%,var(--color-muted)_16%)] ${
          error ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
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
