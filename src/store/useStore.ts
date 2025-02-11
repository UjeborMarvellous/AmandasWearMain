import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CartItem } from '../types';

interface StoreState {
  cart: CartItem[];
  loadCart: () => Promise<void>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  cart: [],

  // Load cart from Supabase or localStorage
  loadCart: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('carts')
        .select('cart_data')
        .eq('user_id', user.id)
        .single();

      if (data) {
        set({ cart: data.cart_data });
      }
    } else {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      set({ cart: savedCart });
    }
  },

  // Add to cart
  addToCart: (item) => 
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        cartItem =>
          cartItem.product.id === item.product.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += item.quantity;
      } else {
        const newItem = {
          ...item,
          id: `${item.product.id}-${item.size}-${item.color}-${Date.now()}`
        };
        updatedCart = [...state.cart, newItem];
      }

      saveCart(updatedCart);
      return { cart: updatedCart };
    }),

  // Remove from cart
  removeFromCart: (productId) =>
    set((state) => {
      const updatedCart = state.cart.filter(item => item.product.id !== productId);
      saveCart(updatedCart);
      return { cart: updatedCart };
    }),

  // Update item quantity
  updateQuantity: (productId, quantity) =>
    set((state) => {
      const updatedCart = state.cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCart(updatedCart);
      return { cart: updatedCart };
    }),

  // Clear the cart
  clearCart: () => set(() => {
    saveCart([]);
    return { cart: [] };
  }),
}));

// Helper function to save cart to Supabase or localStorage
const saveCart = async (cart: CartItem[]) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from('carts')
      .upsert([{ user_id: user.id, cart_data: cart }], { onConflict: 'user_id' });
  } else {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};
