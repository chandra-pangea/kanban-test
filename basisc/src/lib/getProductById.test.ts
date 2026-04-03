import { describe, expect, it } from "vitest";
import { getProductById } from "./getProductById";
import type { Product } from "../types/product";

const sample: Product[] = [
  {
    id: "1",
    name: "A",
    price: 10,
    category: "Cat",
    image: "",
    description: "Desc A",
  },
  {
    id: "2",
    name: "B",
    price: 20,
    category: "Cat",
    image: "",
    description: "Desc B",
  },
];

describe("getProductById", () => {
  it("returns the product when id matches", () => {
    expect(getProductById(sample, "2")).toEqual(sample[1]);
  });

  it("returns undefined for unknown id", () => {
    expect(getProductById(sample, "999")).toBeUndefined();
  });

  it("returns undefined for empty id mismatch", () => {
    expect(getProductById(sample, "not-a-real-id")).toBeUndefined();
  });
});
