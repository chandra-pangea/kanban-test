import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_PRODUCTS } from "../data/products";
import { getProductById } from "../lib/getProductById";
import type { Product } from "../types/product";

const STORAGE_KEY = "ecommerce-demo-wishlist-v1";

type WishlistContextValue = {
  ids: readonly string[];
  items: Product[];
  count: number;
  isInWishlist: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function loadIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { ids?: unknown };
    if (!parsed?.ids || !Array.isArray(parsed.ids)) return [];
    return parsed.ids.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : loadIds(),
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ids }));
    } catch {
      /* ignore quota */
    }
  }, [ids]);

  const toggle = useCallback((productId: string) => {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => ids.includes(productId),
    [ids],
  );

  const items = useMemo(
    () =>
      ids
        .map((id) => getProductById(MOCK_PRODUCTS, id))
        .filter((p): p is Product => p != null),
    [ids],
  );

  const count = items.length;

  const value = useMemo(
    () => ({
      ids,
      items,
      count,
      isInWishlist,
      toggle,
      remove,
    }),
    [ids, items, count, isInWishlist, toggle, remove],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
