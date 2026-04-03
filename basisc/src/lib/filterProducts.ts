import type { Product } from "../types/product";

export type ProductFilters = {
  category: string;
  search: string;
  priceMin: number | null;
  priceMax: number | null;
};

export function filterProducts(
  products: Product[],
  f: ProductFilters,
): Product[] {
  const q = f.search.trim().toLowerCase();
  return products.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (q && !p.name.toLowerCase().includes(q)) return false;
    if (f.priceMin != null && p.price < f.priceMin) return false;
    if (f.priceMax != null && p.price > f.priceMax) return false;
    return true;
  });
}

export function uniqueCategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.category))].sort((a, b) =>
    a.localeCompare(b),
  );
}
