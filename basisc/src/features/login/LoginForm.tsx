import { useState, type FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { validateLoginForm, type LoginFormErrors, type LoginFormValues } from "./loginValidation";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  serverError?: string;
}

const DEFAULT_VALUES: LoginFormValues = {
  email: "",
  password: "",
};

export function LoginForm({ onSubmit, serverError }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLoginForm({
      email: values.email.trim(),
      password: values.password,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        email: values.email.trim(),
        password: values.password,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-[var(--space-4)]" onSubmit={handleSubmit} noValidate data-testid="login-form">
      {serverError ? (
        <p
          role="alert"
          data-testid="login-error"
          className="rounded-[var(--radius-sm)] bg-[var(--color-error-soft)] px-[var(--space-2)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-error)]"
        >
          {serverError}
        </p>
      ) : null}
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        data-testid="login-email"
        value={values.email}
        onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
        disabled={isSubmitting}
        error={errors.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        data-testid="login-password"
        value={values.password}
        onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
        disabled={isSubmitting}
        error={errors.password}
      />
      <Button type="submit" isLoading={isSubmitting} data-testid="login-submit">
        Sign in
      </Button>
    </form>
  );
}
