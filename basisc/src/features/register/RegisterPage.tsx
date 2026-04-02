import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RegisterForm } from "./RegisterForm";

export function RegisterPage() {
  const { isAuthenticated, user, register } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[var(--color-page)] px-[var(--space-4)] py-[var(--space-8)] md:grid-cols-2 md:items-center md:gap-[var(--space-8)] md:px-[var(--space-10)]">
      <section className="mx-auto hidden w-full max-w-[28rem] md:block">
        <h1 className="text-[var(--font-size-xl)] font-extrabold leading-[var(--line-tight)] text-[var(--color-text)]">
          Join us
        </h1>
        <p className="mt-[var(--space-4)] text-[var(--font-size-md)] text-[var(--color-muted)]">
          Create an account with your username, email, and password. Every field is required to keep your profile
          complete and your workspace secure.
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
        <RegisterForm
          onSubmit={async (values) => {
            await register(values.username, values.email);
          }}
        />
        <p className="mt-[var(--space-5)] text-center text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
