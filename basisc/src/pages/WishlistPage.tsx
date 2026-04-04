import { Link } from "react-router-dom";
import { WishlistHeartButton } from "../components/shop/WishlistHeartButton";
import { useWishlist } from "../context/WishlistContext";

export function WishlistPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div
        className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-8)] py-[var(--space-16)] text-center shadow-sm"
        data-testid="wishlist-empty"
      >
        <h1 className="text-[var(--font-size-xl)] font-bold text-[var(--color-text)]">
          Your wishlist is empty
        </h1>
        <p className="mt-[var(--space-3)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Save products you love with the heart icon — they will stay on this
          device.
        </p>
        <Link
          to="/"
          className="mt-[var(--space-6)] inline-block rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-6)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="wishlist-page">
      <h1 className="text-[var(--font-size-xl)] font-extrabold text-[var(--color-text)]">
        Wishlist
      </h1>
      <p className="mt-[var(--space-2)] max-w-2xl text-[var(--font-size-sm)] text-[var(--color-muted)]">
        Saved on this device only.
      </p>
      <ul className="mt-[var(--space-8)] divide-y divide-[var(--color-border)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        {items.map((p) => (
          <li
            key={p.id}
            className="flex flex-col gap-[var(--space-4)] p-[var(--space-4)] sm:flex-row sm:items-center"
            data-testid={`wishlist-item-${p.id}`}
          >
            <Link
              to={`/product/${p.id}`}
              className="flex shrink-0 gap-[var(--space-4)] sm:items-center"
            >
              <img
                src={p.image}
                alt=""
                className="h-20 w-20 rounded-[var(--radius-md)] object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <p className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)]">
                  {p.name}
                </p>
                <p className="mt-[var(--space-1)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
                  {p.category}
                </p>
                <p className="mt-[var(--space-1)] text-[var(--font-size-sm)] font-bold tabular-nums text-[var(--color-text)]">
                  ${p.price.toFixed(2)}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-[var(--space-3)] sm:ml-auto">
              <WishlistHeartButton productId={p.id} size="sm" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
