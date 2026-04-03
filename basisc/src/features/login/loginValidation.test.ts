import { describe, expect, it } from "vitest";
import { validateLoginForm } from "./loginValidation";

describe("validateLoginForm", () => {
  it("returns required errors for empty fields", () => {
    const result = validateLoginForm({ email: "", password: "" });
    expect(result.email).toBe("Email is required");
    expect(result.password).toBe("Password is required");
  });

  it("returns invalid email error", () => {
    const result = validateLoginForm({ email: "bad-email", password: "x" });
    expect(result.email).toBe("Enter a valid email address");
    expect(result.password).toBeUndefined();
  });

  it("allows short password for client validation (server decides match)", () => {
    const result = validateLoginForm({ email: "dev@example.com", password: "x" });
    expect(result.email).toBeUndefined();
    expect(result.password).toBeUndefined();
  });

  it("returns no errors for typical values", () => {
    const result = validateLoginForm({ email: "dev@example.com", password: "anything" });
    expect(result.email).toBeUndefined();
    expect(result.password).toBeUndefined();
  });
});
