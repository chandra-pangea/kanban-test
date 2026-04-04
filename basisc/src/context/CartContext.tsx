import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { loadSession } from "../lib/authStorage";
import {
  loadCartItemsForUser,
  saveCartItemsForUser,
} from "../lib/cartStorage";
import {
  cartItemCount,
  cartReducer,
  cartSubtotal,
  initialCartState,
  type CartState,
} from "../lib/cartReducer";
import type { CartItem, Product } from "../types/product";
import { useAuth } from "./AuthContext";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  decrement: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readInitialCartState(): CartState {
  if (typeof window === "undefined") return initialCartState;
  const session = loadSession();
  return { items: loadCartItemsForUser(session?.email ?? null) };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    readInitialCartState,
  );

  useLayoutEffect(() => {
    const items = loadCartItemsForUser(user?.email ?? null);
    dispatch({ type: "REPLACE", items });
  }, [user?.email]);

  useEffect(() => {
    saveCartItemsForUser(user?.email ?? null, state.items);
  }, [state.items, user?.email]);

  const addToCart = useCallback((product: Product, qty?: number) => {
    dispatch({ type: "ADD", product, qty });
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
