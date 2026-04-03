export const USERS_KEY = "basisc-users";
export const SESSION_KEY = "basisc-auth-session";

export interface StoredUserRecord {
  name: string;
  email: string;
  password: string;
}

export interface SessionUser {
  name: string;
  email: string;
}

function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadUsers(): StoredUserRecord[] {
  const data = parseJson<StoredUserRecord[]>(localStorage.getItem(USERS_KEY));
  return Array.isArray(data) ? data : [];
}

export function saveUsers(users: StoredUserRecord[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadSession(): SessionUser | null {
  return parseJson<SessionUser>(localStorage.getItem(SESSION_KEY));
}

export function saveSession(user: SessionUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function removeSessionRecord(): void {
  localStorage.removeItem(SESSION_KEY);
}

export type RegisterOutcome =
  | { ok: true }
  | { ok: false; reason: "duplicate_email" };

export function tryRegisterUser(input: StoredUserRecord): RegisterOutcome {
  const users = loadUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, reason: "duplicate_email" };
  }
  users.push({
    name: input.name.trim(),
    email,
    password: input.password,
  });
  saveUsers(users);
  return { ok: true };
}

export type LoginOutcome =
  | { ok: true; user: SessionUser }
  | { ok: false; reason: "invalid_credentials" };

export function tryLogin(email: string, password: string): LoginOutcome {
  const users = loadUsers();
  const normalized = email.trim().toLowerCase();
  const found = users.find((u) => u.email === normalized);
  if (!found || found.password !== password) {
    return { ok: false, reason: "invalid_credentials" };
  }
  return { ok: true, user: { name: found.name, email: found.email } };
}
