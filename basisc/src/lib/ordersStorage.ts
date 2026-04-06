import type { Order } from "../types/order";

export function ordersLocalStorageKeyForUser(email: string | null | undefined): string {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return "ecommerce-demo-orders-guest-v1";
  return `orders_${normalized}`;
}

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

export function loadOrders(email: string | null | undefined): Order[] {
  try {
    const raw = localStorage.getItem(ordersLocalStorageKeyForUser(email));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isOrderRecord);
  } catch {
    return [];
  }
}

export function appendOrder(email: string | null | undefined, order: Order): void {
  try {
    const next = [order, ...loadOrders(email)];
    localStorage.setItem(ordersLocalStorageKeyForUser(email), JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function getOrderById(email: string | null | undefined, id: string): Order | undefined {
  return loadOrders(email).find((o) => o.id === id);
}
