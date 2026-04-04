import { describe, expect, it } from "vitest";
import {
  cartItemCount,
  cartReducer,
  cartSubtotal,
  initialCartState,
} from "./cartReducer";
import type { Product } from "../types/product";

const p1: Product = {
  id: "a",
  name: "Item A",
  price: 10,
  category: "X",
  image: "",
  description: "",
};

const p2: Product = {
  id: "b",
  name: "Item B",
  price: 5,
  category: "Y",
  image: "",
  description: "",
};

describe("cartReducer", () => {
  it("adds a new line", () => {
    const s = cartReducer(initialCartState, { type: "ADD", product: p1 });
    expect(s.items).toEqual([{ ...p1, qty: 1 }]);
  });

  it("merges duplicate add by increasing quantity", () => {
    let s = cartReducer(initialCartState, { type: "ADD", product: p1 });
    s = cartReducer(s, { type: "ADD", product: p1 });
    expect(s.items).toEqual([{ ...p1, qty: 2 }]);
  });

  it("adds with explicit quantity on new line", () => {
    const s = cartReducer(initialCartState, {
      type: "ADD",
      product: p1,
      qty: 3,
    });
    expect(s.items).toEqual([{ ...p1, qty: 3 }]);
  });

  it("merges duplicate add with explicit quantity", () => {
    let s = cartReducer(initialCartState, {
      type: "ADD",
      product: p1,
      qty: 2,
    });
    s = cartReducer(s, { type: "ADD", product: p1, qty: 4 });
    expect(s.items).toEqual([{ ...p1, qty: 6 }]);
  });

  it("treats invalid qty as at least 1", () => {
    const s = cartReducer(initialCartState, {
      type: "ADD",
      product: p1,
      qty: 0,
    });
    expect(s.items).toEqual([{ ...p1, qty: 1 }]);
  });

  it("removes a line", () => {
    let s = cartReducer(initialCartState, { type: "ADD", product: p1 });
    s = cartReducer(s, { type: "ADD", product: p2 });
    s = cartReducer(s, { type: "REMOVE", id: "a" });
    expect(s.items).toEqual([{ ...p2, qty: 1 }]);
  });

  it("decrements quantity and removes at 1", () => {
    let s = cartReducer(initialCartState, { type: "ADD", product: p1 });
    s = cartReducer(s, { type: "ADD", product: p1 });
    s = cartReducer(s, { type: "DECREMENT", id: "a" });
    expect(s.items[0].qty).toBe(1);
    s = cartReducer(s, { type: "DECREMENT", id: "a" });
    expect(s.items).toEqual([]);
  });

  it("sets quantity and removes when zero or negative", () => {
    let s = cartReducer(initialCartState, { type: "ADD", product: p1 });
    s = cartReducer(s, { type: "SET_QTY", id: "a", qty: 3 });
    expect(s.items[0].qty).toBe(3);
    s = cartReducer(s, { type: "SET_QTY", id: "a", qty: 0 });
    expect(s.items).toEqual([]);
  });

  it("clears cart", () => {
    let s = cartReducer(initialCartState, { type: "ADD", product: p1 });
    s = cartReducer(s, { type: "CLEAR" });
    expect(s.items).toEqual([]);
  });

  it("replaces entire cart", () => {
    let s = cartReducer(initialCartState, { type: "ADD", product: p1 });
    s = cartReducer(s, {
      type: "REPLACE",
      items: [{ ...p2, qty: 2 }],
    });
    expect(s.items).toEqual([{ ...p2, qty: 2 }]);
  });
});

describe("cartSubtotal", () => {
  it("sums line totals", () => {
    expect(
      cartSubtotal([
        { ...p1, qty: 2 },
        { ...p2, qty: 3 },
      ]),
    ).toBe(10 * 2 + 5 * 3);
  });
});

describe("cartItemCount", () => {
  it("sums quantities", () => {
    expect(
      cartItemCount([
        { ...p1, qty: 2 },
        { ...p2, qty: 1 },
      ]),
    ).toBe(3);
  });
});
