import { create } from 'zustand';
import { CartItem } from '../types';

interface StoreState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      // Check if item already exists with same product, size, and color
      const existingItemIndex = state.cart.findIndex(
        cartItem => 
          cartItem.product.id === item.product.id && 
          cartItem.size === item.size && 
          cartItem.color === item.color
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newCart = [...state.cart];
        newCart[existingItemIndex].quantity += item.quantity;
        return { cart: newCart };
      }

      // Add new item with unique ID
      const newItem = {
        ...item,
        id: `${item.product.id}-${item.size}-${item.color}-${Date.now()}`
      };
      return { cart: [...state.cart, newItem] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ cart: [] }),
}));