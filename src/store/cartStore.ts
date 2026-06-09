import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine, Product } from '../types';

type CartState = {
  lines: CartLine[];
  isCartOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isCartOpen: false,
      addItem: (product) =>
        set((state) => {
          const existing = state.lines.find((line) => line.product.id === product.id);
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
              ),
            };
          }
          return { lines: [...state.lines, { product, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({ lines: state.lines.filter((line) => line.product.id !== productId) })),
      increaseQuantity: (productId) =>
        set((state) => ({
          lines: state.lines.map((line) =>
            line.product.id === productId ? { ...line, quantity: line.quantity + 1 } : line,
          ),
        })),
      decreaseQuantity: (productId) =>
        set((state) => ({
          lines: state.lines
            .map((line) => (line.product.id === productId ? { ...line, quantity: line.quantity - 1 } : line))
            .filter((line) => line.quantity > 0),
        })),
      clearCart: () => set({ lines: [], isCartOpen: false }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      subtotal: () => get().lines.reduce((total, line) => total + line.product.price * line.quantity, 0),
      totalItems: () => get().lines.reduce((total, line) => total + line.quantity, 0),
    }),
    {
      name: 'rikki-tikki-cart',
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
