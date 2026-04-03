import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  cartItemCount,
  cartReducer,
  cartSubtotal,
  initialCartState,
  type CartState,
} from "../lib/cartReducer";
import type { CartItem, Product } from "../types/product";

const STORAGE_KEY = "ecommerce-demo-cart-v1";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  decrement: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialCartState;
    const parsed = JSON.parse(raw) as { items?: CartItem[] };
    if (!parsed?.items || !Array.isArray(parsed.items)) return initialCartState;
    return { items: parsed.items };
  } catch {
    return initialCartState;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, () =>
    typeof window === "undefined" ? initialCartState : loadState(),
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
      /* ignore quota */
    }
  }, [state.items]);

  const addToCart = useCallback((product: Product) => {
    dispatch({ type: "ADD", product });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const decrement = useCallback((id: string) => {
    dispatch({ type: "DECREMENT", id });
  }, []);

  const setQuantity = useCallback((id: string, qty: number) => {
    dispatch({ type: "SET_QTY", id, qty });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const itemCount = useMemo(
    () => cartItemCount(state.items),
    [state.items],
  );

  const subtotal = useMemo(
    () => cartSubtotal(state.items),
    [state.items],
  );

  const value = useMemo(
    () => ({
      items: state.items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      decrement,
      setQuantity,
      clearCart,
    }),
    [
      state.items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      decrement,
      setQuantity,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
