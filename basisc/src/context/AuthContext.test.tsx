import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

const STORAGE_KEY = "nexus-user";

function RegisterProbe() {
  const { register, user } = useAuth();
  return (
    <div>
      <button type="button" onClick={() => void register("neo", "neo@example.com")}>
        Register
      </button>
      <span data-testid="name">{user?.name ?? ""}</span>
      <span data-testid="email">{user?.email ?? ""}</span>
    </div>
  );
}

describe("AuthContext register", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("persists username as display name and email to session storage", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <RegisterProbe />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(screen.getByTestId("name")).toHaveTextContent("neo");
    expect(screen.getByTestId("email")).toHaveTextContent("neo@example.com");
    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY)!)).toEqual({
      name: "neo",
      email: "neo@example.com",
    });
  });
});
