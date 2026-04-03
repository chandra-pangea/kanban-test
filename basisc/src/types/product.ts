export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  /** Average rating out of 5 (optional in data, omitted when unknown) */
  rating?: number;
};

export type CartItem = Product & { qty: number };
