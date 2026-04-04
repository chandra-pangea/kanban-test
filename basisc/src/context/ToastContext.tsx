import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const DEFAULT_TOAST_DURATION_MS = 4000;

export type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (
    message: string,
    options?: { variant?: ToastVariant; durationMs?: number },
  ) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-[var(--space-6)] left-1/2 z-[100] flex max-w-md -translate-x-1/2 flex-col gap-[var(--space-2)] px-[var(--space-4)]"
      data-testid="toast-region"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.variant === "error" ? "alert" : "status"}
          data-testid="app-toast"
          data-variant={t.variant}
          className={[
            "rounded-[var(--radius-md)] border px-[var(--space-5)] py-[var(--space-3)] text-[var(--font-size-sm)] font-medium shadow-lg",
            t.variant === "success"
              ? "border-[color-mix(in_srgb,var(--color-primary)_35%,var(--color-border))] bg-[var(--color-surface)] text-[var(--color-text)]"
              : t.variant === "error"
                ? "border-[var(--color-error)]/30 bg-[var(--color-error-soft)] text-[var(--color-error)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]",
          ].join(" ")}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  /** Browser timer ids (`window.setTimeout`); stored as `number` for DOM typings. */
  const timeoutsRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const t = timeoutsRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, options?: { variant?: ToastVariant; durationMs?: number }) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const variant = options?.variant ?? "info";
      const durationMs = options?.durationMs ?? DEFAULT_TOAST_DURATION_MS;

      setToasts((prev) => [...prev, { id, message, variant }]);

      if (durationMs > 0) {
        const tid = window.setTimeout(() => dismissToast(id), durationMs) as unknown as number;
        timeoutsRef.current.set(id, tid);
      }
    },
    [dismissToast],
  );

  useEffect(
    () => () => {
      timeoutsRef.current.forEach((tid) => clearTimeout(tid));
      timeoutsRef.current.clear();
    },
    [],
  );

  const value: ToastContextValue = { showToast, dismissToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
