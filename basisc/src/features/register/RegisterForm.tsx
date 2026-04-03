import { useState, type FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { validateRegisterForm, type RegisterFormErrors, type RegisterFormValues } from "./registerValidation";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void> | void;
  serverError?: string;
}

const DEFAULT_VALUES: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
};

export function RegisterForm({ onSubmit, serverError }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterFormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegisterForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-[var(--space-4)]" onSubmit={handleSubmit} noValidate data-testid="register-form">
      {serverError ? (
        <p
          role="alert"
          data-testid="register-error"
          className="rounded-[var(--radius-sm)] bg-[var(--color-error-soft)] px-[var(--space-2)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-error)]"
        >
          {serverError}
        </p>
      ) : null}
      <TextField
        label="Name"
        name="name"
        type="text"
        required
        autoComplete="name"
        data-testid="register-name"
        value={values.name}
        onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
        disabled={isSubmitting}
        error={errors.name}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        data-testid="register-email"
        value={values.email}
        onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
        disabled={isSubmitting}
        error={errors.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        data-testid="register-password"
        value={values.password}
        onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
        disabled={isSubmitting}
        error={errors.password}
      />
      <Button type="submit" isLoading={isSubmitting} loadingLabel="Creating account..." data-testid="register-submit">
        Create account
      </Button>
    </form>
  );
}
