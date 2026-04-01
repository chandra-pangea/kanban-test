import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
  const { isAuthenticated, user, login } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[var(--color-page)] px-[var(--space-4)] py-[var(--space-8)] md:grid-cols-2 md:items-center md:gap-[var(--space-8)] md:px-[var(--space-10)]">
      <section className="mx-auto hidden w-full max-w-[28rem] md:block">
        <h1 className="text-[var(--font-size-xl)] font-extrabold leading-[var(--line-tight)] text-[var(--color-text)]">
          Welcome back
        </h1>
        <p className="mt-[var(--space-4)] text-[var(--font-size-md)] text-[var(--color-muted)]">
          Sign in to continue managing your projects, tasks, and progress across your workspace.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[28rem] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-card)] md:p-[var(--space-8)]">
        <header className="mb-[var(--space-6)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold leading-[var(--line-tight)] text-[var(--color-text)]">
            Sign in
          </h2>
          <p className="mt-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
            Enter your details below to access your account.
          </p>
        </header>
        <LoginForm
          onSubmit={async (values) => {
            await login(values.email);
          }}
        />
      </section>
    </main>
  );
}
