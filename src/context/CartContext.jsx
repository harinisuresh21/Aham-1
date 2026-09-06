import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  // Sync state with API data
  const updateStateFromResponse = useCallback((data) => {
    if (!data) return;
    const items = data.items || [];
    setCartItems(items);
    setCartCount(data.totalCount ?? items.reduce((sum, item) => sum + item.quantity, 0));
    setSubtotal(data.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }, []);

  // Fetch initial cart on mount
  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      updateStateFromResponse(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [updateStateFromResponse]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  /**
   * Add to Cart action
   */
  const addToCart = async (product, quantity = 1) => {
    try {
      const data = await cartService.addToCart(product, quantity);
      updateStateFromResponse(data);
      toast.cart(
        `Added ${quantity}x "${product.name}" to your cart!`,
        'Added to Cart'
      );
      return { success: true };
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error(err.message || 'Could not add item to cart', 'Error');
      return { success: false, error: err.message };
    }
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = async (productId) => {
    try {
      const itemToRemove = cartItems.find((i) => (i.productId || i.id) === productId);
      const data = await cartService.removeFromCart(productId);
      updateStateFromResponse(data);
      toast.error(
        `Removed "${itemToRemove?.name || 'Item'}" from your cart.`,
        'Item Removed'
      );
      return { success: true };
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      toast.error(err.message || 'Could not remove item', 'Error');
      return { success: false, error: err.message };
    }
  };

  /**
   * Update quantity
   */
  const updateQuantity = async (productId, quantity) => {
    try {
      const targetItem = cartItems.find((i) => (i.productId || i.id) === productId);

      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      const data = await cartService.updateQuantity(productId, quantity);
      updateStateFromResponse(data);
      toast.info(
        `Updated "${targetItem?.name || 'Item'}" quantity to ${quantity}.`,
        'Quantity Updated'
      );
      return { success: true };
    } catch (err) {
      console.error('Failed to update quantity:', err);
      toast.error(err.message || 'Could not update quantity', 'Error');
      return { success: false, error: err.message };
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    try {
      const data = await cartService.clearCart();
      updateStateFromResponse(data);
      toast.info('Your shopping cart has been cleared.', 'Cart Cleared');
      return { success: true };
    } catch (err) {
      console.error('Failed to clear cart:', err);
      toast.error('Could not clear cart', 'Error');
      return { success: false, error: err.message };
    }
  };

  const value = {
    cartItems,
    cartCount,
    subtotal,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
