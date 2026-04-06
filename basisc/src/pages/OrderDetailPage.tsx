import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrderById } from "../lib/ordersStorage";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function OrderDetailPage() {
  const { user } = useAuth();
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(user?.email, orderId) : undefined;

  if (!order) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-[var(--font-size-xl)] font-bold text-[var(--color-text)]">
          Order not found
        </h1>
        <p className="mt-[var(--space-3)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
          This order may have been removed or the link is invalid.
        </p>
        <Link
          to="/orders"
          className="mt-[var(--space-6)] inline-block rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-6)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          Back to order history
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-[var(--space-2)] sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-[var(--font-size-xl)] font-extrabold text-[var(--color-text)]">
          Order details
        </h1>
        <Link
          to="/orders"
          className="text-[var(--font-size-sm)] font-medium text-[var(--color-primary)] hover:underline"
        >
          ← All orders
        </Link>
      </div>
      <div
        className="mt-[var(--space-6)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)]"
        data-testid="order-detail"
      >
        <dl className="grid gap-[var(--space-4)] sm:grid-cols-2">
          <div>
            <dt className="text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Order ID
            </dt>
            <dd className="mt-[var(--space-1)] font-mono text-[var(--font-size-sm)] text-[var(--color-text)]">
              {order.id}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Date
            </dt>
            <dd
              className="mt-[var(--space-1)] text-[var(--font-size-sm)] text-[var(--color-text)]"
              data-testid="order-detail-date"
            >
              {formatDate(order.date)}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Status
            </dt>
            <dd className="mt-[var(--space-1)]">
              <span
                className="inline-block rounded-full bg-emerald-100 px-[var(--space-3)] py-[var(--space-1)] text-[var(--font-size-xs)] font-semibold text-emerald-800"
                data-testid="order-detail-status"
              >
                {order.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Total
            </dt>
            <dd
              className="mt-[var(--space-1)] text-[var(--font-size-lg)] font-bold tabular-nums text-[var(--color-text)]"
              data-testid="order-detail-total"
            >
              ${order.total.toFixed(2)}
            </dd>
          </div>
        </dl>
      </div>
      <h2 className="mt-[var(--space-10)] text-[var(--font-size-lg)] font-bold text-[var(--color-text)]">
        Items
      </h2>
      <ul className="mt-[var(--space-4)] divide-y divide-[var(--color-border)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        {order.items.map((line) => (
          <li
            key={`${order.id}-${line.id}`}
            className="flex flex-col gap-[var(--space-2)] p-[var(--space-4)] sm:flex-row sm:items-center sm:justify-between"
            data-testid="order-line-item"
          >
            <div>
              <p className="font-semibold text-[var(--color-text)]">{line.name}</p>
              <p className="text-[var(--font-size-sm)] text-[var(--color-muted)]">
                ${line.price.toFixed(2)} × {line.qty}
              </p>
            </div>
            <p
              className="font-semibold tabular-nums text-[var(--color-text)]"
              data-testid={`order-line-subtotal-${line.id}`}
            >
              ${(line.price * line.qty).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
