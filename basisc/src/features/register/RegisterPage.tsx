import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RegisterForm } from "./RegisterForm";

export function RegisterPage() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => {
      navigate("/login", { replace: true, state: { registered: true } });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [success, navigate]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[var(--color-page)] px-[var(--space-4)] py-[var(--space-8)] md:grid-cols-2 md:items-center md:gap-[var(--space-8)] md:px-[var(--space-10)]">
      <section className="mx-auto hidden w-full max-w-[28rem] md:block">
        <h1 className="text-[var(--font-size-xl)] font-extrabold leading-[var(--line-tight)] text-[var(--color-text)]">
          Join us
        </h1>
        <p className="mt-[var(--space-4)] text-[var(--font-size-md)] text-[var(--color-muted)]">
          Create an account with your name, email, and password. Your profile is stored locally in this demo — no
          backend.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[28rem] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-card)] md:p-[var(--space-8)]">
        <header className="mb-[var(--space-6)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold leading-[var(--line-tight)] text-[var(--color-text)]">
            Create account
          </h2>
          <p className="mt-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
            All fields are required.
          </p>
        </header>
        {success ? (
          <p
            role="status"
            data-testid="register-success"
            className="mb-[var(--space-4)] rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] px-[var(--space-3)] py-[var(--space-3)] text-[var(--font-size-sm)] font-medium text-[var(--color-primary)]"
          >
            Registration successful. Redirecting to sign in…
          </p>
        ) : (
          <RegisterForm
            serverError={serverError}
            onSubmit={async (values) => {
              setServerError(undefined);
              const result = await register(values.name, values.email, values.password);
              if (result.ok) {
                setSuccess(true);
              } else {
                setServerError("An account with this email already exists.");
              }
            }}
          />
        )}
        <p className="mt-[var(--space-5)] text-center text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
