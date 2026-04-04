import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  loadSession,
  removeSessionRecord,
  saveSession,
  tryLogin,
  tryRegisterUser,
  type SessionUser,
} from "../lib/authStorage";

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: "invalid_credentials" }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: "duplicate_email" }>;
  /** Persists a session from Google Identity Services (JWT profile); no password stored in this demo. */
  signInWithGoogle: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readInitialUser(): AuthUser | null {
  const s = loadSession();
  if (!s?.email || !s?.name) return null;
  return { name: s.name, email: s.email };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(readInitialUser);

  const login = useCallback(async (email: string, password: string) => {
    const result = tryLogin(email, password);
    if (!result.ok) {
      return { ok: false as const, error: "invalid_credentials" as const };
    }
    const session: SessionUser = result.user;
    saveSession(session);
    setUser(session);
    return { ok: true as const };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = tryRegisterUser({ name, email, password });
    if (!result.ok) {
      return { ok: false as const, error: "duplicate_email" as const };
    }
    return { ok: true as const };
  }, []);

  const signInWithGoogle = useCallback((name: string, email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const session: SessionUser = {
      name: name.trim() || normalizedEmail.split("@")[0] || "User",
      email: normalizedEmail,
    };
    saveSession(session);
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    removeSessionRecord();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      currentUser: user,
      isAuthenticated: Boolean(user),
      login,
      register,
      signInWithGoogle,
      logout,
    }),
    [login, logout, register, signInWithGoogle, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
