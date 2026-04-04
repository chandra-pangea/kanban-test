import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";

describe("App shop", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders product catalog heading", () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <App />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
    expect(screen.getAllByTestId("product-card").length).toBeGreaterThan(0);
  });
});
