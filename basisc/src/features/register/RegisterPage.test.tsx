import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import { RegisterPage } from "./RegisterPage";

const STORAGE_KEY = "nexus-user";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<main>Dashboard destination</main>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("RegisterPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("shows heading, required notice, and sign-in navigation when logged out", () => {
    renderAt("/register");

    expect(screen.getByRole("heading", { name: "Create account" })).toBeInTheDocument();
    expect(screen.getByText("All fields are required.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  });

  it("redirects to dashboard when session already has a user", () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ email: "x@y.com", name: "x" }));
    renderAt("/register");

    expect(screen.getByText("Dashboard destination")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Create account" })).not.toBeInTheDocument();
  });
});
