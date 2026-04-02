import { useState, type FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { validateLoginForm, type LoginFormErrors, type LoginFormValues } from "./loginValidation";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
}

const DEFAULT_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-[var(--space-4)]" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
        disabled={isSubmitting}
        error={errors.email}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
        disabled={isSubmitting}
        error={errors.password}
      />
      <div className="flex items-center justify-between gap-[var(--space-4)]">
        <label className="inline-flex items-center gap-[0.5rem] text-[var(--font-size-sm)] font-semibold text-[var(--color-text)]">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-60"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isSubmitting}
          />
          Remember me
        </label>
        <button
          type="button"
          className="text-[var(--font-size-sm)] font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          Forgot password?
        </button>
      </div>
      <Button type="submit" isLoading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
