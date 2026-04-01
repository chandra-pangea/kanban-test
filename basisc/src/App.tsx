import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./features/login/LoginPage";

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-page)] p-[var(--space-4)]">
      <section className="w-full max-w-[28rem] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] text-center shadow-[var(--shadow-card)]">
        <h1 className="text-[var(--font-size-lg)] font-semibold text-[var(--color-text)]">You are logged in</h1>
        <p className="mt-[var(--space-3)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Signed in as {user?.email}
        </p>
        <button
          type="button"
          className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-4)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-text)]"
          onClick={logout}
        >
          Sign out
        </button>
      </section>
    </main>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />} />
    </Routes>
  );
}
