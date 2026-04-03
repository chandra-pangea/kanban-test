import type { Product } from "../types/product";

/**
 * Returns the product with the given id, or `undefined` if none exists.
 */
export function getProductById(
  products: readonly Product[],
  id: string,
): Product | undefined {
  return products.find((p) => p.id === id);
}
