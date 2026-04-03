import { Link, Outlet } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export function ShopLayout() {
  const { itemCount } = useCart();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-4)]">
          <Link
            to="/"
            className="text-[var(--font-size-lg)] font-semibold tracking-tight text-[var(--color-text)]"
          >
            Demo Shop
          </Link>
          <nav className="flex items-center gap-[var(--space-6)] text-[var(--font-size-sm)] font-medium">
            <Link
              to="/"
              className="text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="relative text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
              data-testid="nav-cart"
            >
              Cart
              {itemCount > 0 ? (
                <span
                  className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white"
                  data-testid="cart-badge-count"
                  aria-label={`${itemCount} items in cart`}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-[var(--space-4)] py-[var(--space-8)]">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--color-border)] py-[var(--space-6)] text-center text-[var(--font-size-xs)] text-[var(--color-muted)]">
        Frontend demo — mock data only, no backend.
      </footer>
    </div>
  );
}
