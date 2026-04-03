import { useCart } from "../../context/CartContext";
import type { Product } from "../../types/product";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <article
      className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]"
      data-testid="product-card"
    >
      <div className="aspect-square overflow-hidden bg-[var(--color-border)]/40">
        <img
          src={product.image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-[var(--space-2)] p-[var(--space-4)]">
        <p className="text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-primary)]">
          {product.category}
        </p>
        <h2
          className="text-[var(--font-size-md)] font-semibold leading-[var(--line-tight)] text-[var(--color-text)]"
          data-testid="product-name"
        >
          {product.name}
        </h2>
        <p className="mt-auto text-[var(--font-size-lg)] font-bold text-[var(--color-text)]">
          ${product.price.toFixed(2)}
        </p>
        <button
          type="button"
          className="mt-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
          onClick={() => addToCart(product)}
          data-testid={`add-to-cart-${product.id}`}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
