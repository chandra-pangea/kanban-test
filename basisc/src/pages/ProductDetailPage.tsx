import { memo, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { WishlistHeartButton } from "../components/shop/WishlistHeartButton";
import { useCart } from "../context/CartContext";
import { MOCK_PRODUCTS } from "../data/products";
import { getProductById } from "../lib/getProductById";
import type { Product } from "../types/product";

function relatedProducts(current: Product, catalog: readonly Product[]): Product[] {
  return catalog
    .filter((p) => p.id !== current.id && p.category === current.category)
    .slice(0, 4);
}

type ContentProps = { product: Product };

const ProductDetailContent = memo(function ProductDetailContent({
  product,
}: ContentProps) {
  const { addToCart } = useCart();
  const [qtyInput, setQtyInput] = useState<number | "">(1);
  const [toast, setToast] = useState<string | null>(null);

  const related = useMemo(
    () => relatedProducts(product, MOCK_PRODUCTS),
    [product],
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  function handleAddToCart() {
    const q = Math.max(1, Math.floor(Number(qtyInput === "" ? 1 : qtyInput)) || 1);
    addToCart(product, q);
    setToast(`Added ${q} × ${product.name} to cart`);
  }

  return (
    <div data-testid="product-detail">
      {toast ? (
        <div
          role="status"
          className="fixed bottom-[var(--space-6)] left-1/2 z-20 max-w-md -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-5)] py-[var(--space-3)] text-[var(--font-size-sm)] font-medium text-[var(--color-text)] shadow-lg"
          data-testid="cart-toast"
        >
          {toast}
        </div>
      ) : null}

      <nav className="mb-[var(--space-6)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
        <Link to="/" className="hover:text-[var(--color-primary)]">
          Products
        </Link>
        <span className="mx-[var(--space-2)]">/</span>
        <span className="text-[var(--color-text)]">{product.name}</span>
      </nav>

      <div className="grid gap-[var(--space-8)] lg:grid-cols-2 lg:gap-[var(--space-10)] lg:items-start">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-border)]/30 shadow-[var(--shadow-card)]">
          <img
            src={product.image}
            alt=""
            className="aspect-square w-full object-cover"
            data-testid="pdp-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-[var(--space-4)]">
          <p
            className="text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-primary)]"
            data-testid="pdp-category"
          >
            {product.category}
          </p>
          <div className="flex flex-wrap items-start gap-[var(--space-3)]">
            <h1
              className="min-w-0 flex-1 text-[var(--font-size-xl)] font-extrabold tracking-tight text-[var(--color-text)]"
              data-testid="pdp-name"
            >
              {product.name}
            </h1>
            <WishlistHeartButton productId={product.id} size="md" />
          </div>
          {product.rating != null ? (
            <p
              className="text-[var(--font-size-sm)] text-[var(--color-muted)]"
              data-testid="pdp-rating"
            >
              Rating:{" "}
              <span className="font-semibold text-[var(--color-text)]">
                {product.rating.toFixed(1)}
              </span>{" "}
              / 5
            </p>
          ) : null}
          <p
            className="text-[var(--font-size-xl)] font-bold tabular-nums text-[var(--color-text)]"
            data-testid="pdp-price"
          >
            ${product.price.toFixed(2)}
          </p>
          <p
            className="text-[var(--font-size-sm)] leading-relaxed text-[var(--color-muted)]"
            data-testid="pdp-description"
          >
            {product.description}
          </p>

          <div className="mt-[var(--space-2)] flex flex-col gap-[var(--space-4)] sm:flex-row sm:items-end">
            <label className="flex flex-col gap-[var(--space-2)] text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Quantity
              <input
                type="number"
                min={1}
                step={1}
                className="w-28 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-text)] outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                value={qtyInput === "" ? "" : qtyInput}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") {
                    setQtyInput("");
                    return;
                  }
                  const n = Number(v);
                  if (!Number.isFinite(n)) return;
                  setQtyInput(Math.max(1, Math.floor(n)));
                }}
                onBlur={() => {
                  if (qtyInput === "" || Number(qtyInput) < 1) {
                    setQtyInput(1);
                  }
                }}
                data-testid="pdp-quantity"
                aria-label="Quantity to add"
              />
            </label>
            <button
              type="button"
              className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-8)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
              onClick={handleAddToCart}
              data-testid="pdp-add-to-cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-[var(--space-16)] border-t border-[var(--color-border)] pt-[var(--space-10)]">
          <h2 className="text-[var(--font-size-lg)] font-bold text-[var(--color-text)]">
            Related products
          </h2>
          <ul
            className="mt-[var(--space-6)] grid gap-[var(--space-6)] sm:grid-cols-2 lg:grid-cols-4"
            data-testid="related-products"
          >
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/product/${p.id}`}
                  className="group block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-card)]"
                  data-testid={`related-link-${p.id}`}
                >
                  <div className="aspect-square overflow-hidden bg-[var(--color-border)]/40">
                    <img
                      src={p.image}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </div>
                  <div className="p-[var(--space-3)]">
                    <p className="text-[var(--font-size-sm)] font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                      {p.name}
                    </p>
                    <p className="mt-[var(--space-1)] text-[var(--font-size-sm)] font-bold tabular-nums">
                      ${p.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
});

export function ProductDetailPage() {
  const { id = "" } = useParams<{ id: string }>();

  const product = useMemo(
    () => (id ? getProductById(MOCK_PRODUCTS, id) : undefined),
    [id],
  );

  if (!product) {
    return (
      <div
        className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-8)] py-[var(--space-16)] text-center"
        data-testid="product-not-found"
      >
        <h1 className="text-[var(--font-size-xl)] font-bold text-[var(--color-text)]">
          Product not found
        </h1>
        <p className="mt-[var(--space-3)] text-[var(--font-size-sm)] text-[var(--color-muted)]">
          We couldn&apos;t find a product with this id. Try another item from the
          catalog.
        </p>
        <Link
          to="/"
          className="mt-[var(--space-6)] inline-block rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-6)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return <ProductDetailContent key={id} product={product} />;
}
