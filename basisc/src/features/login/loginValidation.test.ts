import { describe, expect, it } from "vitest";
import { validateLoginForm } from "./loginValidation";

describe("validateLoginForm", () => {
  it("returns required errors for empty fields", () => {
    const result = validateLoginForm({ email: "", password: "" });
    expect(result.email).toBe("Email is required");
    expect(result.password).toBe("Password is required");
  });

  it("returns invalid email error", () => {
    const result = validateLoginForm({ email: "bad-email", password: "12345678" });
    expect(result.email).toBe("Enter a valid email address");
    expect(result.password).toBeUndefined();
  });

  it("returns password length error", () => {
    const result = validateLoginForm({ email: "dev@example.com", password: "123" });
    expect(result.password).toBe("Password must be at least 8 characters");
  });

  it("returns no errors for valid values", () => {
    const result = validateLoginForm({ email: "dev@example.com", password: "strongpass123" });
    expect(result.email).toBeUndefined();
    expect(result.password).toBeUndefined();
  });
});
