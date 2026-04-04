import type { CartItem, Product } from "../types/product";

export type CartState = { items: CartItem[] };

export type CartAction =
  | { type: "ADD"; product: Product; qty?: number }
  | { type: "REMOVE"; id: string }
  | { type: "DECREMENT"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "REPLACE"; items: CartItem[] };

export const initialCartState: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const addQty = Math.max(1, Math.floor(action.qty ?? 1));
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id
              ? { ...i, qty: i.qty + addQty }
              : i,
          ),
        };
      }
      return {
        items: [...state.items, { ...action.product, qty: addQty }],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "DECREMENT": {
      const item = state.items.find((i) => i.id === action.id);
      if (!item) return state;
      if (item.qty <= 1) {
        return { items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty - 1 } : i,
        ),
      };
    }
    case "SET_QTY": {
      const q = Math.floor(action.qty);
      if (q <= 0) {
        return { items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: q } : i,
        ),
      };
    }
    case "CLEAR":
      return { items: [] };
    case "REPLACE":
      return { items: action.items };
    default:
      return state;
  }
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.price * i.qty, 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.qty, 0);
}
