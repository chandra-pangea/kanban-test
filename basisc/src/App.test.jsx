import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "./App";
import { CartProvider } from "./context/CartContext";

describe("App shop", () => {
  it("renders product catalog heading", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
    expect(screen.getAllByTestId("product-card").length).toBeGreaterThan(0);
  });
});
