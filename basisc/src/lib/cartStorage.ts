import type { CartItem } from "../types/product";

/** Legacy single cart bucket (pre user-specific carts). */
export const LEGACY_CART_KEY = "ecommerce-demo-cart-v1";

/** Anonymous / logged-out cart — keeps add-to-cart + refresh working without an account. */
export const GUEST_CART_KEY = "ecommerce-demo-cart-guest-v1";

/**
 * Per logged-in user: `cart_<normalized email>` (example: cart_user1@example.com).
 * Email is lowercased and trimmed to match auth storage.
 */
export function cartLocalStorageKeyForUser(email: string | null | undefined): string {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return GUEST_CART_KEY;
  return `cart_${normalized}`;
}

function parseCartItems(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as { items?: CartItem[] };
    if (!parsed?.items || !Array.isArray(parsed.items)) return [];
    return parsed.items;
  } catch {
    return [];
  }
}

/**
 * Reads cart lines for the given account. Migrates legacy global cart into the guest bucket once.
 */
export function loadCartItemsForUser(email: string | null | undefined): CartItem[] {
  if (typeof window === "undefined") return [];
  const key = cartLocalStorageKeyForUser(email);
  let raw = localStorage.getItem(key);

  if (key === GUEST_CART_KEY && !raw) {
    raw = localStorage.getItem(LEGACY_CART_KEY);
    if (raw) {
      const items = parseCartItems(raw);
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify({ items }));
        localStorage.removeItem(LEGACY_CART_KEY);
      } catch {
        /* ignore quota */
      }
      return items;
    }
  }

  return parseCartItems(raw);
}

export function saveCartItemsForUser(
  email: string | null | undefined,
  items: CartItem[],
): void {
  if (typeof window === "undefined") return;
  const key = cartLocalStorageKeyForUser(email);
  try {
    localStorage.setItem(key, JSON.stringify({ items }));
  } catch {
    /* ignore quota */
  }
}
