import { describe, expect, it } from "vitest";
import { validateRegisterForm } from "./registerValidation";

describe("validateRegisterForm", () => {
  const validBase = {
    username: "jane",
    email: "jane@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("returns required errors for empty fields", () => {
    const result = validateRegisterForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    expect(result.username).toBe("Username is required");
    expect(result.email).toBe("Email is required");
    expect(result.password).toBe("Password is required");
    expect(result.confirmPassword).toBe("Please confirm your password");
  });

  it("returns invalid email error", () => {
    const result = validateRegisterForm({ ...validBase, email: "not-an-email" });
    expect(result.email).toBe("Enter a valid email address");
  });

  it("returns username length error for short values", () => {
    const result = validateRegisterForm({ ...validBase, username: "ab" });
    expect(result.username).toBe("Username must be at least 3 characters");
  });

  it("returns password length error", () => {
    const result = validateRegisterForm({ ...validBase, password: "short", confirmPassword: "short" });
    expect(result.password).toBe("Password must be at least 8 characters");
  });

  it("returns mismatch when passwords differ", () => {
    const result = validateRegisterForm({
      ...validBase,
      password: "password123",
      confirmPassword: "password124",
    });
    expect(result.confirmPassword).toBe("Passwords do not match");
  });

  it("returns no errors for valid values", () => {
    const result = validateRegisterForm(validBase);
    expect(result.username).toBeUndefined();
    expect(result.email).toBeUndefined();
    expect(result.password).toBeUndefined();
    expect(result.confirmPassword).toBeUndefined();
  });

  it("treats whitespace-only username as missing", () => {
    const result = validateRegisterForm({ ...validBase, username: "   " });
    expect(result.username).toBe("Username is required");
  });

  it("accepts username with surrounding whitespace via trim", () => {
    const result = validateRegisterForm({ ...validBase, username: "  janedoe  " });
    expect(result.username).toBeUndefined();
  });

  it("reports mismatch when confirm is filled but password is empty", () => {
    const result = validateRegisterForm({
      ...validBase,
      password: "",
      confirmPassword: "anything",
    });
    expect(result.password).toBe("Password is required");
    expect(result.confirmPassword).toBe("Passwords do not match");
  });
});
