import { memo } from "react";
import { useWishlist } from "../../context/WishlistContext";

type Props = {
  productId: string;
  className?: string;
  /** Card vs detail page */
  size?: "sm" | "md";
};

export const WishlistHeartButton = memo(function WishlistHeartButton({
  productId,
  className = "",
  size = "sm",
}: Props) {
  const { isInWishlist, toggle } = useWishlist();
  const active = isInWishlist(productId);
  const box = size === "md" ? "h-11 w-11" : "h-9 w-9";
  const icon = size === "md" ? "h-6 w-6" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/90 text-[var(--color-muted)] shadow-sm backdrop-blur transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${box} ${active ? "border-rose-500/60 text-rose-600 hover:border-rose-500 hover:text-rose-700" : ""} ${className}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      data-testid={`wishlist-toggle-${productId}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={icon}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? 0 : 2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
});
