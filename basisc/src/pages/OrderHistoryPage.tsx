import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loadOrders } from "../lib/ordersStorage";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function OrderHistoryPage() {
  const { user } = useAuth();
  const orders = loadOrders(user!.email);

  if (orders.length === 0) {
    return (
      <div
        className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-8)] py-[var(--space-16)] text-center shadow-sm"
        data-testid="orders-empty"
      >
        <h1 className="text-[var(--font-size-xl)] font-bold text-[var(--color-text)]">
          No orders yet
        </h1>
        <p className="mt-[var(--space-3)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Place an order at checkout and it will show up here.
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
        Order history
      </h1>
      <p className="mt-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
        Orders are saved in this browser only.
      </p>
      <ul className="mt-[var(--space-8)] divide-y divide-[var(--color-border)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              to={`/orders/${order.id}`}
              className="flex flex-col gap-[var(--space-2)] p-[var(--space-4)] transition hover:bg-[var(--color-page)] sm:flex-row sm:items-center sm:justify-between"
              data-testid="order-history-row"
            >
              <div>
                <p className="font-semibold text-[var(--color-text)]">
                  Order{" "}
                  <span className="font-mono text-[var(--font-size-sm)]">{order.id}</span>
                </p>
                <p className="text-[var(--font-size-sm)] text-[var(--color-muted)]">
                  {formatDate(order.date)} · {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-[var(--space-4)]">
                <span
                  className="rounded-full bg-emerald-100 px-[var(--space-3)] py-[var(--space-1)] text-[var(--font-size-xs)] font-semibold text-emerald-800"
                  data-testid="order-history-status"
                >
                  {order.status}
                </span>
                <span className="font-semibold tabular-nums text-[var(--color-text)]">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
