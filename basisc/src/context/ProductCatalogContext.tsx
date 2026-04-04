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
import type { Product } from "../types/product";

const CATALOG_KEY = "basisc-product-catalog";

function loadStoredCatalog(): Product[] | null {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as Product[];
  } catch {
    return null;
  }
}

function saveStoredCatalog(products: Product[]) {
  try {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
  } catch {
    /* ignore quota */
  }
}

export type ProductCatalogContextValue = {
  products: Product[];
  addProduct: (input: Omit<Product, "id"> & { id?: string }) => void;
  updateProduct: (id: string, patch: Partial<Omit<Product, "id">>) => void;
  removeProduct: (id: string) => void;
};

const ProductCatalogContext = createContext<ProductCatalogContextValue | null>(null);

export function ProductCatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [...MOCK_PRODUCTS];
    return loadStoredCatalog() ?? [...MOCK_PRODUCTS];
  });

  useEffect(() => {
    saveStoredCatalog(products);
  }, [products]);

  const addProduct = useCallback((input: Omit<Product, "id"> & { id?: string }) => {
    const id = input.id ?? `p-${Date.now()}`;
    const product: Product = {
      id,
      name: input.name,
      price: input.price,
      category: input.category,
      image: input.image,
      description: input.description,
      ...(input.rating != null ? { rating: input.rating } : {}),
    };
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Omit<Product, "id">>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({ products, addProduct, updateProduct, removeProduct }),
    [products, addProduct, updateProduct, removeProduct],
  );

  return (
    <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>
  );
}

export function useProductCatalog(): ProductCatalogContextValue {
  const ctx = useContext(ProductCatalogContext);
  if (!ctx) throw new Error("useProductCatalog must be used within ProductCatalogProvider");
  return ctx;
}
