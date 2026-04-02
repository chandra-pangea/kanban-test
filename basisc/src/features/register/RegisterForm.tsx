import { useState, type FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { validateRegisterForm, type RegisterFormErrors, type RegisterFormValues } from "./registerValidation";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void> | void;
}

const DEFAULT_VALUES: RegisterFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
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
        username: values.username.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-[var(--space-4)]" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Username"
        type="text"
        autoComplete="username"
        value={values.username}
        onChange={(event) => setValues((prev) => ({ ...prev, username: event.target.value }))}
        disabled={isSubmitting}
        error={errors.username}
      />
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
        autoComplete="new-password"
        value={values.password}
        onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
        disabled={isSubmitting}
        error={errors.password}
      />
      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={(event) => setValues((prev) => ({ ...prev, confirmPassword: event.target.value }))}
        disabled={isSubmitting}
        error={errors.confirmPassword}
      />
      <Button type="submit" isLoading={isSubmitting} loadingLabel="Creating account...">
        Create account
      </Button>
    </form>
  );
}
