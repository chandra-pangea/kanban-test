import type { Order } from "../types/order";

export const ORDERS_STORAGE_KEY = "ecommerce-demo-orders-v1";

function isLineItem(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.id === "string" &&
    typeof line.name === "string" &&
    typeof line.price === "number" &&
    typeof line.qty === "number"
  );
}

function isOrderRecord(value: unknown): value is Order {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.total !== "number" || typeof o.date !== "string")
    return false;
  if (o.status !== "Completed") return false;
  if (!Array.isArray(o.items)) return false;
  return o.items.every(isLineItem);
}

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isOrderRecord);
  } catch {
    return [];
  }
}

export function appendOrder(order: Order): void {
  try {
    const next = [order, ...loadOrders()];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function getOrderById(id: string): Order | undefined {
  return loadOrders().find((o) => o.id === id);
}
