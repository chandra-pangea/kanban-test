import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function CartPage() {
  const { items, subtotal, decrement, setQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div
        className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-8)] py-[var(--space-16)] text-center shadow-sm"
        data-testid="cart-empty"
      >
        <h1 className="text-[var(--font-size-xl)] font-bold text-[var(--color-text)]">
          Your cart is empty
        </h1>
        <p className="mt-[var(--space-3)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Add something from the catalog to get started.
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
    <div>
      <h1 className="text-[var(--font-size-xl)] font-extrabold text-[var(--color-text)]">
        Cart
      </h1>
      <ul className="mt-[var(--space-8)] divide-y divide-[var(--color-border)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        {items.map((line) => (
          <li
            key={line.id}
            className="flex flex-col gap-[var(--space-4)] p-[var(--space-4)] sm:flex-row sm:items-center"
            data-testid="cart-line"
          >
            <img
              src={line.image}
              alt=""
              className="h-20 w-20 shrink-0 rounded-[var(--radius-md)] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--color-text)]">
                {line.name}
              </p>
              <p className="text-[var(--font-size-sm)] text-[var(--color-muted)]">
                ${line.price.toFixed(2)} each
              </p>
            </div>
            <div className="flex items-center gap-[var(--space-3)]">
              <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)]">
                <button
                  type="button"
                  className="px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-lg)] leading-none text-[var(--color-text)] hover:bg-[var(--color-page)]"
                  aria-label="Decrease quantity"
                  onClick={() => decrement(line.id)}
                  data-testid={`qty-dec-${line.id}`}
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  className="w-14 border-x border-[var(--color-border)] bg-transparent py-[var(--space-2)] text-center text-[var(--font-size-sm)] outline-none"
                  value={line.qty}
                  onChange={(e) =>
                    setQuantity(line.id, Number(e.target.value) || 0)
                  }
                  data-testid={`qty-input-${line.id}`}
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  className="px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-lg)] leading-none text-[var(--color-text)] hover:bg-[var(--color-page)]"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(line.id, line.qty + 1)}
                  data-testid={`qty-inc-${line.id}`}
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-semibold tabular-nums">
                ${(line.price * line.qty).toFixed(2)}
              </p>
              <button
                type="button"
                className="text-[var(--font-size-sm)] font-medium text-[var(--color-error)] hover:underline"
                onClick={() => removeFromCart(line.id)}
                data-testid={`remove-${line.id}`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-[var(--space-8)] flex flex-col items-end gap-[var(--space-4)] border-t border-[var(--color-border)] pt-[var(--space-6)]">
        <p className="text-[var(--font-size-lg)] font-bold tabular-nums">
          Total:{" "}
          <span data-testid="cart-total">${subtotal.toFixed(2)}</span>
        </p>
        <Link
          to="/checkout"
          className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-8)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          data-testid="checkout-link"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
