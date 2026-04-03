import { useMemo, useState } from "react";
import { MOCK_PRODUCTS } from "../data/products";
import { ProductCard } from "../components/shop/ProductCard";
import { ProductFilters } from "../components/shop/ProductFilters";
import {
  filterProducts,
  uniqueCategories,
  type ProductFilters as FiltersState,
} from "../lib/filterProducts";

const defaultFilters = (): FiltersState => ({
  category: "",
  search: "",
  priceMin: null,
  priceMax: null,
});

export function ProductsPage() {
  const priceBounds = useMemo(() => {
    const prices = MOCK_PRODUCTS.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, []);

  const categories = useMemo(
    () => uniqueCategories(MOCK_PRODUCTS),
    [],
  );

  const [filters, setFilters] = useState<FiltersState>(defaultFilters);

  const visible = useMemo(
    () => filterProducts(MOCK_PRODUCTS, filters),
    [filters],
  );

  return (
    <div>
      <div className="mb-[var(--space-8)]">
        <h1 className="text-[var(--font-size-xl)] font-extrabold tracking-tight text-[var(--color-text)]">
          Products
        </h1>
        <p className="mt-[var(--space-2)] max-w-2xl text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Browse our demo catalog. Filters and search run instantly in the
          browser.
        </p>
      </div>

      <ProductFilters
        categories={categories}
        value={filters}
        onChange={setFilters}
        priceBounds={priceBounds}
      />

      {visible.length === 0 ? (
        <div
          className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-8)] py-[var(--space-16)] text-center"
          data-testid="no-products"
        >
          <p className="text-[var(--font-size-lg)] font-semibold text-[var(--color-text)]">
            No products found
          </p>
          <p className="mt-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <ul className="grid gap-[var(--space-6)] sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
