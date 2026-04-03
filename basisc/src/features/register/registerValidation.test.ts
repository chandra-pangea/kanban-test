import { describe, expect, it } from "vitest";
import { validateRegisterForm } from "./registerValidation";

describe("validateRegisterForm", () => {
  const validBase = {
    name: "Jane",
    email: "jane@example.com",
    password: "secret",
  };

  it("returns required errors for empty fields", () => {
    const result = validateRegisterForm({
      name: "",
      email: "",
      password: "",
    });
    expect(result.name).toBe("Name is required");
    expect(result.email).toBe("Email is required");
    expect(result.password).toBe("Password is required");
  });

  it("returns invalid email error", () => {
    const result = validateRegisterForm({ ...validBase, email: "not-an-email" });
    expect(result.email).toBe("Enter a valid email address");
  });

  it("returns name length error for short values", () => {
    const result = validateRegisterForm({ ...validBase, name: "a" });
    expect(result.name).toBe("Name must be at least 2 characters");
  });

  it("returns password length error", () => {
    const result = validateRegisterForm({ ...validBase, password: "12345" });
    expect(result.password).toBe("Password must be at least 6 characters");
  });

  it("returns no errors for valid values", () => {
    const result = validateRegisterForm(validBase);
    expect(result.name).toBeUndefined();
    expect(result.email).toBeUndefined();
    expect(result.password).toBeUndefined();
  });

  it("treats whitespace-only name as missing", () => {
    const result = validateRegisterForm({ ...validBase, name: "   " });
    expect(result.name).toBe("Name is required");
  });

  it("accepts name with surrounding whitespace via trim", () => {
    const result = validateRegisterForm({ ...validBase, name: "  janedoe  " });
    expect(result.name).toBeUndefined();
  });
});
