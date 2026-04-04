import { useState, type FormEvent } from "react";
import { useProductCatalog } from "../context/ProductCatalogContext";
import type { Product } from "../types/product";

const emptyDraft = (): Omit<Product, "id"> => ({
  name: "",
  price: 0,
  category: "General",
  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
  description: "",
});

export function AdminProductsPage() {
  const { products, addProduct, updateProduct, removeProduct } = useProductCatalog();
  const [draft, setDraft] = useState<Omit<Product, "id">>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Omit<Product, "id">>(emptyDraft());

  function startEdit(p: Product) {
    setEditingId(p.id);
    setEditDraft({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      description: p.description,
      ...(p.rating != null ? { rating: p.rating } : {}),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(emptyDraft());
  }

  function saveEdit() {
    if (!editingId) return;
    updateProduct(editingId, editDraft);
    cancelEdit();
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    addProduct(draft);
    setDraft(emptyDraft());
  }

  return (
    <div data-testid="admin-products-page">
      <div className="mb-[var(--space-8)]">
        <h1 className="text-[var(--font-size-xl)] font-extrabold tracking-tight text-[var(--color-text)]">
          Manage products
        </h1>
        <p className="mt-[var(--space-2)] max-w-2xl text-[var(--font-size-sm)] text-[var(--color-muted)]">
          Mock catalog editor — changes persist in this browser only.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="mb-[var(--space-10)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)]"
        data-testid="admin-add-form"
      >
        <h2 className="text-[var(--font-size-md)] font-bold text-[var(--color-text)]">Add product</h2>
        <div className="mt-[var(--space-4)] grid gap-[var(--space-4)] sm:grid-cols-2">
          <label className="flex flex-col gap-[var(--space-2)] text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Name
            <input
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-page)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-text)]"
              data-testid="admin-add-name"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              required
            />
          </label>
          <label className="flex flex-col gap-[var(--space-2)] text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Price
            <input
              type="number"
              min={0}
              step={0.01}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-page)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-text)]"
              data-testid="admin-add-price"
              value={draft.price}
              onChange={(e) =>
                setDraft((d) => ({ ...d, price: Number.parseFloat(e.target.value) || 0 }))
              }
              required
            />
          </label>
          <label className="flex flex-col gap-[var(--space-2)] text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Category
            <input
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-page)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-text)]"
              data-testid="admin-add-category"
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              required
            />
          </label>
          <label className="flex flex-col gap-[var(--space-2)] text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Image URL
            <input
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-page)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-text)]"
              data-testid="admin-add-image"
              value={draft.image}
              onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
              required
            />
          </label>
        </div>
        <label className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] text-[var(--font-size-xs)] font-medium uppercase tracking-wide text-[var(--color-muted)]">
          Description
          <textarea
            className="min-h-[88px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-page)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--font-size-sm)] text-[var(--color-text)]"
            data-testid="admin-add-description"
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            required
          />
        </label>
        <button
          type="submit"
          className="mt-[var(--space-6)] rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-6)] py-[var(--space-3)] text-[var(--font-size-sm)] font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          data-testid="admin-add-submit"
        >
          Add product
        </button>
      </form>

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <table className="w-full min-w-[640px] text-left text-[var(--font-size-sm)]" data-testid="admin-product-table">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--font-size-xs)] uppercase tracking-wide text-[var(--color-muted)]">
            <tr>
              <th className="px-[var(--space-4)] py-[var(--space-3)]">Name</th>
              <th className="px-[var(--space-4)] py-[var(--space-3)]">Category</th>
              <th className="px-[var(--space-4)] py-[var(--space-3)]">Price</th>
              <th className="px-[var(--space-4)] py-[var(--space-3)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-[var(--color-border)] last:border-0"
                data-testid={`admin-product-row-${p.id}`}
              >
                {editingId === p.id ? (
                  <>
                    <td className="px-[var(--space-4)] py-[var(--space-3)] align-top" colSpan={4}>
                      <div className="grid gap-[var(--space-3)] sm:grid-cols-2">
                        <input
                          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-2)] py-[var(--space-2)]"
                          data-testid={`admin-edit-name-${p.id}`}
                          value={editDraft.name}
                          onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                        />
                        <input
                          type="number"
                          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-2)] py-[var(--space-2)]"
                          data-testid={`admin-edit-price-${p.id}`}
                          value={editDraft.price}
                          onChange={(e) =>
                            setEditDraft((d) => ({
                              ...d,
                              price: Number.parseFloat(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                      <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-3)]">
                        <button
                          type="button"
                          className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] py-[var(--space-2)] text-white"
                          data-testid={`admin-save-${p.id}`}
                          onClick={saveEdit}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-4)] py-[var(--space-2)]"
                          data-testid={`admin-cancel-${p.id}`}
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-[var(--space-4)] py-[var(--space-3)] font-medium text-[var(--color-text)]">
                      {p.name}
                    </td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)] text-[var(--color-muted)]">
                      {p.category}
                    </td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)] tabular-nums">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-[var(--space-4)] py-[var(--space-3)]">
                      <div className="flex flex-wrap gap-[var(--space-2)]">
                        <button
                          type="button"
                          className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-[var(--space-3)] py-[var(--space-1)] text-[var(--font-size-xs)] font-medium"
                          data-testid={`admin-edit-${p.id}`}
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-[var(--radius-md)] border border-rose-600/50 px-[var(--space-3)] py-[var(--space-1)] text-[var(--font-size-xs)] font-medium text-rose-600"
                          data-testid={`admin-delete-${p.id}`}
                          onClick={() => removeProduct(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
