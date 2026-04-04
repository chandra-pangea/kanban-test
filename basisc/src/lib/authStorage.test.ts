import { beforeEach, describe, expect, it } from "vitest";
import {
  SESSION_KEY,
  USERS_KEY,
  loadUsers,
  removeSessionRecord,
  saveSession,
  seedDemoAccounts,
  tryLogin,
  tryRegisterUser,
} from "./authStorage";

describe("authStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("tryRegisterUser", () => {
    it("stores a new user", () => {
      const result = tryRegisterUser({
        name: "Jane",
        email: "jane@example.com",
        password: "secret1",
      });
      expect(result).toEqual({ ok: true });
      expect(loadUsers()).toEqual([
        { name: "Jane", email: "jane@example.com", password: "secret1", role: "user" },
      ]);
    });

    it("normalizes email to lowercase", () => {
      tryRegisterUser({ name: "A", email: "User@EXAMPLE.COM", password: "p" });
      expect(loadUsers()[0].email).toBe("user@example.com");
    });

    it("rejects duplicate email", () => {
      tryRegisterUser({ name: "A", email: "a@b.com", password: "x" });
      const dup = tryRegisterUser({ name: "B", email: "A@B.COM", password: "y" });
      expect(dup).toEqual({ ok: false, reason: "duplicate_email" });
      expect(loadUsers()).toHaveLength(1);
    });
  });

  describe("tryLogin", () => {
    it("returns user on correct credentials", () => {
      tryRegisterUser({ name: "Neo", email: "neo@example.com", password: "matrix6" });
      const result = tryLogin("neo@example.com", "matrix6");
      expect(result).toEqual({
        ok: true,
        user: { name: "Neo", email: "neo@example.com", role: "user" },
      });
    });

    it("returns admin role when stored", () => {
      tryRegisterUser({ name: "Boss", email: "boss@example.com", password: "x" });
      const users = loadUsers();
      users[0].role = "admin";
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const result = tryLogin("boss@example.com", "x");
      expect(result).toEqual({
        ok: true,
        user: { name: "Boss", email: "boss@example.com", role: "admin" },
      });
    });

    it("fails on wrong password", () => {
      tryRegisterUser({ name: "Neo", email: "neo@example.com", password: "matrix6" });
      expect(tryLogin("neo@example.com", "wrong")).toEqual({
        ok: false,
        reason: "invalid_credentials",
      });
    });

    it("fails when user missing", () => {
      expect(tryLogin("ghost@example.com", "x")).toEqual({
        ok: false,
        reason: "invalid_credentials",
      });
    });
  });

  describe("session helpers", () => {
    it("saveSession persists JSON under session key", () => {
      saveSession({ name: "T", email: "t@t.com", role: "user" });
      expect(JSON.parse(localStorage.getItem(SESSION_KEY)!)).toEqual({
        name: "T",
        email: "t@t.com",
        role: "user",
      });
    });

    it("removeSessionRecord clears session key only", () => {
      localStorage.setItem(USERS_KEY, "[]");
      saveSession({ name: "T", email: "t@t.com", role: "user" });
      removeSessionRecord();
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
      expect(localStorage.getItem(USERS_KEY)).toBe("[]");
    });
  });

  describe("seedDemoAccounts", () => {
    it("adds demo admin once", () => {
      seedDemoAccounts();
      seedDemoAccounts();
      const emails = loadUsers().map((u) => u.email);
      expect(emails.filter((e) => e === "admin@demo.shop")).toHaveLength(1);
    });
  });
});
