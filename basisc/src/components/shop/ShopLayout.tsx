import { Link, Outlet, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export function ShopLayout() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-4)]">
          <Link
            to="/"
            className="text-[var(--font-size-lg)] font-semibold tracking-tight text-[var(--color-text)]"
          >
            Demo Shop
          </Link>
          <nav className="flex flex-wrap items-center gap-[var(--space-4)] text-[var(--font-size-sm)] font-medium sm:gap-[var(--space-6)]">
            <ThemeToggle />
            <Link
              to="/"
              className="text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
            >
              Products
            </Link>
            {isAuthenticated && isAdmin ? (
              <Link
                to="/admin/products"
                className="text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
                data-testid="nav-admin-products"
              >
                Admin
              </Link>
            ) : null}
            <Link
              to="/orders"
              className="text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
              data-testid="nav-orders"
            >
              Orders
            </Link>
            <Link
              to="/wishlist"
              className="relative text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
              data-testid="nav-wishlist"
            >
              Wishlist
              {wishlistCount > 0 ? (
                <span
                  className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white"
                  data-testid="wishlist-badge-count"
                  aria-label={`${wishlistCount} items in wishlist`}
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              ) : null}
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
            {isAuthenticated ? (
              <>
                <span
                  className="hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] px-[var(--space-2)] py-[var(--space-1)] text-[var(--font-size-xs)] font-semibold uppercase tracking-wide text-[var(--color-muted)] sm:inline"
                  data-testid="nav-user-role"
                >
                  {user?.role === "admin" ? "Admin" : "User"}
                </span>
                <span className="hidden text-[var(--color-muted)] sm:inline" data-testid="nav-user-email">
                  {user?.email}
                </span>
                <button
                  type="button"
                  data-testid="logout-button"
                  onClick={() => {
                    logout();
                    navigate("/login", { replace: true });
                  }}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-1)] text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
                  data-testid="nav-login"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-3)] py-[var(--space-1)] text-white transition hover:opacity-95"
                  data-testid="nav-register"
                >
                  Register
                </Link>
              </>
            )}
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
