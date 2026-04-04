import { memo } from "react";
import type { ProductFilterFields } from "../../lib/filterProducts";

type Props = {
  categories: string[];
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  value: ProductFilterFields;
  onChange: (next: ProductFilterFields) => void;
  priceBounds: { min: number; max: number };
};

export const ProductFilters = memo(function ProductFilters({
  categories,
  searchInput,
  onSearchInputChange,
  value,
  onChange,
  priceBounds,
}: Props) {
  return (
    <div
      className="mb-[var(--space-8)] grid gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      data-testid="product-filters"
    >
      <label className="flex flex-col gap-[var(--space-2)] text-[var(--font-size-sm)]">
        <span className="font-medium text-[var(--color-text)]">Search</span>
        <input
          type="search"
          placeholder="Search by name…"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] outline-none ring-[var(--color-ring)] focus:ring-2"
          data-testid="filter-search"
        />
      </label>
      <label className="flex flex-col gap-[var(--space-2)] text-[var(--font-size-sm)]">
        <span className="font-medium text-[var(--color-text)]">Category</span>
        <select
          value={value.category}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] outline-none ring-[var(--color-ring)] focus:ring-2"
          data-testid="filter-category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-[var(--space-2)] text-[var(--font-size-sm)]">
        <span className="font-medium text-[var(--color-text)]">Min price</span>
        <input
          type="number"
          min={priceBounds.min}
          max={priceBounds.max}
          step={1}
          placeholder={`${priceBounds.min}`}
          value={value.priceMin ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange({
              ...value,
              priceMin: v === "" ? null : Number(v),
            });
          }}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] outline-none ring-[var(--color-ring)] focus:ring-2"
          data-testid="filter-price-min"
        />
      </label>
      <label className="flex flex-col gap-[var(--space-2)] text-[var(--font-size-sm)]">
        <span className="font-medium text-[var(--color-text)]">Max price</span>
        <input
          type="number"
          min={priceBounds.min}
          max={priceBounds.max}
          step={1}
          placeholder={`${priceBounds.max}`}
          value={value.priceMax ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange({
              ...value,
              priceMax: v === "" ? null : Number(v),
            });
          }}
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] outline-none ring-[var(--color-ring)] focus:ring-2"
          data-testid="filter-price-max"
        />
      </label>
    </div>
  );
});
