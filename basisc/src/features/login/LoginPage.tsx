import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
  const { isAuthenticated, user, login } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-[var(--color-page)] px-4 py-10 md:py-16">
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] md:grid-cols-2">
        <div className="hidden bg-gradient-to-b from-[#5562ff] to-[#3947f4] p-10 text-white md:block">
          <p className="text-sm/6 tracking-[0.14em] text-white/70">NEXUS</p>
          <h2 className="mt-6 text-3xl font-semibold leading-tight">Manage your projects with clarity.</h2>
          <p className="mt-4 max-w-sm text-sm/6 text-white/85">
            Plan work, track progress, and collaborate with your team in one clean workspace.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827]">Welcome back</h1>
          <p className="mt-2 text-sm text-[#64748b]">Please enter your details to log in.</p>

          <div className="mt-8">
            <LoginForm
              onSubmit={async (values) => {
                await login(values.email);
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
