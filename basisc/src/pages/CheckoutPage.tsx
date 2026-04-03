import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("card");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-8)] py-[var(--space-12)] text-center shadow-[var(--shadow-card)]"
        data-testid="checkout-success"
      >
        <div className="mx-auto mb-[var(--space-4)] flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          ✓
        </div>
        <h1 className="text-[var(--font-size-xl)] font-bold text-[var(--color-text)]">
          Order placed
        </h1>
        <p className="mt-[var(--space-3)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Thanks, {name}. This is a demo — no payment was processed.
        </p>
        <Link
          to="/"
          className="mt-[var(--space-8)] inline-block rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-6)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-[var(--color-text)]"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-[var(--font-size-xl)] font-bold text-[var(--color-text)]">
          Nothing to checkout
        </h1>
        <p className="mt-[var(--space-3)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Your cart is empty. Add items before checking out.
        </p>
        <Link
          to="/"
          className="mt-[var(--space-6)] inline-block rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-6)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-white"
        >
          Back to products
        </Link>
      </div>
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    clearCart();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-[var(--font-size-xl)] font-extrabold text-[var(--color-text)]">
        Checkout
      </h1>
      <p className="mt-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
        Mock checkout — data is not sent anywhere.
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-[var(--space-8)] space-y-[var(--space-6)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)]"
        data-testid="checkout-form"
      >
        <label className="block text-[var(--font-size-sm)]">
          <span className="mb-[var(--space-2)] block font-medium text-[var(--color-text)]">
            Full name
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-2)] outline-none ring-[var(--color-ring)] focus:ring-2"
            autoComplete="name"
            data-testid="checkout-name"
          />
        </label>
        <label className="block text-[var(--font-size-sm)]">
          <span className="mb-[var(--space-2)] block font-medium text-[var(--color-text)]">
            Shipping address
          </span>
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-2)] outline-none ring-[var(--color-ring)] focus:ring-2"
            data-testid="checkout-address"
          />
        </label>
        <label className="block text-[var(--font-size-sm)]">
          <span className="mb-[var(--space-2)] block font-medium text-[var(--color-text)]">
            Payment method
          </span>
          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-2)] outline-none ring-[var(--color-ring)] focus:ring-2"
            data-testid="checkout-payment"
          >
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on delivery</option>
          </select>
        </label>
        <button
          type="submit"
          className="w-full rounded-[var(--radius-md)] bg-[var(--color-primary)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          data-testid="checkout-submit"
        >
          Place order
        </button>
      </form>
    </div>
  );
}
