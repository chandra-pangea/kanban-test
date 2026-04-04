import { afterEach, describe, expect, it } from "vitest";
import {
  GUEST_CART_KEY,
  LEGACY_CART_KEY,
  cartLocalStorageKeyForUser,
  loadCartItemsForUser,
  saveCartItemsForUser,
} from "./cartStorage";
import type { CartItem } from "../types/product";

const sampleItems: CartItem[] = [
  {
    id: "p1",
    name: "Widget",
    price: 9.99,
    category: "X",
    image: "",
    description: "",
    qty: 2,
  },
];

describe("cartStorage", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("uses guest key when email is missing", () => {
    expect(cartLocalStorageKeyForUser(null)).toBe(GUEST_CART_KEY);
    expect(cartLocalStorageKeyForUser(undefined)).toBe(GUEST_CART_KEY);
    expect(cartLocalStorageKeyForUser("   ")).toBe(GUEST_CART_KEY);
  });

  it("uses cart_<email> for logged-in users", () => {
    expect(cartLocalStorageKeyForUser("UserA@Example.com")).toBe("cart_usera@example.com");
  });

  it("saves and loads per-user without cross-user leakage", () => {
    saveCartItemsForUser("a@test.com", sampleItems);
    saveCartItemsForUser("b@test.com", []);

    expect(loadCartItemsForUser("a@test.com")).toEqual(sampleItems);
    expect(loadCartItemsForUser("b@test.com")).toEqual([]);
  });

  it("migrates legacy global cart into guest bucket once", () => {
    localStorage.setItem(LEGACY_CART_KEY, JSON.stringify({ items: sampleItems }));
    expect(localStorage.getItem(GUEST_CART_KEY)).toBeNull();

    const loaded = loadCartItemsForUser(null);
    expect(loaded).toEqual(sampleItems);
    expect(localStorage.getItem(GUEST_CART_KEY)).toContain("Widget");
    expect(localStorage.getItem(LEGACY_CART_KEY)).toBeNull();
  });
});
