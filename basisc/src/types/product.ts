export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
};

export type CartItem = Product & { qty: number };
