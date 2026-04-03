import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { SESSION_KEY, USERS_KEY } from "../lib/authStorage";
import { AuthProvider, useAuth } from "./AuthContext";

function LoginProbe() {
  const { login, signInWithGoogle, user } = useAuth();
  return (
    <div>
      <button type="button" onClick={() => void login("neo@example.com", "secret12")}>
        Login
      </button>
      <button type="button" onClick={() => signInWithGoogle("Google User", "google@example.com")}>
        Google
      </button>
      <span data-testid="name">{user?.name ?? ""}</span>
      <span data-testid="email">{user?.email ?? ""}</span>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists session to localStorage on login", async () => {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([{ name: "Neo", email: "neo@example.com", password: "secret12" }]),
    );
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <LoginProbe />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByTestId("name")).toHaveTextContent("Neo");
    expect(screen.getByTestId("email")).toHaveTextContent("neo@example.com");
    expect(JSON.parse(localStorage.getItem(SESSION_KEY)!)).toEqual({
      name: "Neo",
      email: "neo@example.com",
    });
  });

  it("persists session on signInWithGoogle", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <LoginProbe />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Google" }));

    expect(screen.getByTestId("name")).toHaveTextContent("Google User");
    expect(screen.getByTestId("email")).toHaveTextContent("google@example.com");
    expect(JSON.parse(localStorage.getItem(SESSION_KEY)!)).toEqual({
      name: "Google User",
      email: "google@example.com",
    });
  });
});
