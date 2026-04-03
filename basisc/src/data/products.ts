import type { Product } from "../types/product";
import catalog from "./products.json";

/** Mock catalog from `products.json` — replace with API when backend exists */
export const MOCK_PRODUCTS: Product[] = catalog as Product[];
