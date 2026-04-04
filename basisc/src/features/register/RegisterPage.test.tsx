import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { SESSION_KEY } from "../../lib/authStorage";
import { AuthProvider } from "../../context/AuthContext";
import { ThemeProvider } from "../../context/ThemeContext";
import { ToastProvider } from "../../context/ToastContext";
import { RegisterPage } from "./RegisterPage";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<main>Products destination</main>} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("RegisterPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows heading, required notice, and sign-in navigation when logged out", () => {
    renderAt("/register");

    expect(screen.getByRole("heading", { name: "Create account" })).toBeInTheDocument();
    expect(screen.getByText("All fields are required.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  });

  it("redirects to products when session already exists", () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: "x@y.com", name: "x" }));
    renderAt("/register");

    expect(screen.getByText("Products destination")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Create account" })).not.toBeInTheDocument();
  });
});
