export type OrderLineItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  items: OrderLineItem[];
  total: number;
  /** ISO 8601 timestamp */
  date: string;
  status: "Completed";
};
