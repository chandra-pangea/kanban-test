import { describe, expect, it } from "vitest";
import { filterProducts, uniqueCategories } from "./filterProducts";
import type { Product } from "../types/product";

const products: Product[] = [
  {
    id: "1",
    name: "Alpha Gadget",
    price: 100,
    category: "Tech",
    image: "",
  },
  {
    id: "2",
    name: "Beta Tool",
    price: 50,
    category: "Tech",
    image: "",
  },
  {
    id: "3",
    name: "Garden Hose",
    price: 25,
    category: "Home",
    image: "",
  },
];

describe("filterProducts", () => {
  it("filters by category", () => {
    const r = filterProducts(products, {
      category: "Home",
      search: "",
      priceMin: null,
      priceMax: null,
    });
    expect(r.map((p) => p.id)).toEqual(["3"]);
  });

  it("filters by name search (case-insensitive)", () => {
    const r = filterProducts(products, {
      category: "",
      search: "beta",
      priceMin: null,
      priceMax: null,
    });
    expect(r.map((p) => p.id)).toEqual(["2"]);
  });

  it("combines category, search, and price range", () => {
    const r = filterProducts(products, {
      category: "Tech",
      search: "a",
      priceMin: 40,
      priceMax: 120,
    });
    expect(r.map((p) => p.id).sort()).toEqual(["1", "2"]);
  });

  it("returns empty when nothing matches", () => {
    const r = filterProducts(products, {
      category: "",
      search: "zzzznonexistent",
      priceMin: null,
      priceMax: null,
    });
    expect(r).toEqual([]);
  });
});

describe("uniqueCategories", () => {
  it("returns sorted unique categories", () => {
    expect(uniqueCategories(products)).toEqual(["Home", "Tech"]);
  });
});
