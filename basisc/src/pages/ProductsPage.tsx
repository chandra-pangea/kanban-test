import { useMemo, useState } from "react";
import { useProductCatalog } from "../context/ProductCatalogContext";
import { ProductCard } from "../components/shop/ProductCard";
import { ProductFilters } from "../components/shop/ProductFilters";
import {
  filterProducts,
  uniqueCategories,
  type ProductFilterFields,
  type ProductFilters as FiltersState,
} from "../lib/filterProducts";
import { useDebouncedValue } from "../lib/useDebouncedValue";

const SEARCH_DEBOUNCE_MS = 300;

const defaultFilters = (): FiltersState => ({
  category: "",
  search: "",
  priceMin: null,
  priceMax: null,
});

const defaultFilterFields = (): ProductFilterFields => {
  const d = defaultFilters();
  return { category: d.category, priceMin: d.priceMin, priceMax: d.priceMax };
};

export function ProductsPage() {
  const { products: catalog } = useProductCatalog();

  const priceBounds = useMemo(() => {
    const prices = catalog.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [catalog]);

  const categories = useMemo(
    () => uniqueCategories(catalog),
    [catalog],
  );

  const [filterFields, setFilterFields] =
    useState<ProductFilterFields>(defaultFilterFields);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  const filters = useMemo(
    (): FiltersState => ({ ...filterFields, search: debouncedSearch }),
    [filterFields, debouncedSearch],
  );

  const visible = useMemo(
    () => filterProducts(catalog, filters),
    [catalog, filters],
  );

  return (
    <div>
      <div className="mb-[var(--space-8)]">
        <h1 className="text-[var(--font-size-xl)] font-extrabold tracking-tight text-[var(--color-text)]">
          Products
        </h1>
        <p className="mt-[var(--space-2)] max-w-2xl text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Browse our demo catalog. Search is debounced so typing stays smooth;
          category and price filters apply immediately.
        </p>
      </div>

      <ProductFilters
        categories={categories}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        value={filterFields}
        onChange={setFilterFields}
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
