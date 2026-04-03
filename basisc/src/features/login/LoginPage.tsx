import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { GoogleSignInButton } from "../../components/GoogleSignInButton";
import { useAuth } from "../../context/AuthContext";
import { isGoogleAuthConfigured } from "../../lib/googleAuth";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
  const { isAuthenticated, login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string; registered?: boolean } | undefined;
  const [serverError, setServerError] = useState<string | undefined>();
  const [oauthError, setOauthError] = useState<string | undefined>();

  const redirectTo =
    state?.from && state.from !== "/login" && state.from !== "/register" ? state.from : "/";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[var(--color-page)] px-[var(--space-4)] py-[var(--space-8)] md:grid-cols-2 md:items-center md:gap-[var(--space-8)] md:px-[var(--space-10)]">
      <section className="mx-auto hidden w-full max-w-[28rem] md:block">
        <h1 className="text-[var(--font-size-xl)] font-extrabold leading-[var(--line-tight)] text-[var(--color-text)]">
          Welcome back
        </h1>
        <p className="mt-[var(--space-4)] text-[var(--font-size-md)] text-[var(--color-muted)]">
          Sign in to access your cart and checkout. Sessions persist in local storage for this frontend-only demo.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[28rem] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-card)] md:p-[var(--space-8)]">
        <header className="mb-[var(--space-6)]">
          <h2 className="text-[var(--font-size-lg)] font-semibold leading-[var(--line-tight)] text-[var(--color-text)]">
            Sign in
          </h2>
          <p className="mt-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
            Enter the email and password you used at registration.
          </p>
        </header>
        {state?.registered ? (
          <p
            role="status"
            data-testid="login-registered-notice"
            className="mb-[var(--space-4)] rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] px-[var(--space-3)] py-[var(--space-3)] text-[var(--font-size-sm)] font-medium text-[var(--color-primary)]"
          >
            Registration successful. Please sign in.
          </p>
        ) : null}
        <LoginForm
          serverError={serverError}
          onSubmit={async (values) => {
            setServerError(undefined);
            setOauthError(undefined);
            const result = await login(values.email, values.password);
            if (result.ok) {
              navigate(redirectTo, { replace: true });
            } else {
              setServerError("Invalid email or password.");
            }
          }}
        />
        {isGoogleAuthConfigured() ? (
          <div className="mt-[var(--space-5)]">
            <div className="relative mb-[var(--space-4)]">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <span className="w-full border-t border-[var(--color-border)]" />
              </div>
              <div className="relative flex justify-center text-[var(--font-size-xs)] uppercase tracking-wide">
                <span className="bg-[var(--color-surface)] px-[var(--space-2)] text-[var(--color-muted)]">Or</span>
              </div>
            </div>
            {oauthError ? (
              <p
                role="alert"
                data-testid="login-oauth-error"
                className="mb-[var(--space-4)] rounded-[var(--radius-sm)] bg-[var(--color-error-soft)] px-[var(--space-2)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-error)]"
              >
                {oauthError}
              </p>
            ) : null}
            <GoogleSignInButton
              onSuccess={(profile) => {
                setOauthError(undefined);
                signInWithGoogle(profile.name, profile.email);
                navigate(redirectTo, { replace: true });
              }}
              onError={(message) => setOauthError(message)}
            />
          </div>
        ) : null}
        <p className="mt-[var(--space-5)] text-center text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Need an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
