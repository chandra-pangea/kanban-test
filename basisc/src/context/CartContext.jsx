import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.product, qty: 1 }] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }
    case 'DECREMENT': {
      const item = state.items.find((i) => i.id === action.id)
      if (!item) return state
      if (item.qty <= 1) {
        return { items: state.items.filter((i) => i.id !== action.id) }
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty - 1 } : i,
        ),
      }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addToCart = useCallback((product) => {
    dispatch({ type: 'ADD', product })
  }, [])

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const decrement = useCallback((id) => {
    dispatch({ type: 'DECREMENT', id })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const itemCount = useMemo(
    () => state.items.reduce((n, i) => n + i.qty, 0),
    [state.items],
  )

  const subtotal = useMemo(
    () => state.items.reduce((n, i) => n + i.price * i.qty, 0),
    [state.items],
  )

  const value = useMemo(
    () => ({
      items: state.items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      decrement,
      clearCart,
    }),
    [
      state.items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      decrement,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
