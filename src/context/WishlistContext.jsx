import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

const WISHLIST_STORAGE_KEY = 'aham_wishlist_items';

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { addToCart } = useCart();
  const toast = useToast();

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistItems]);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some((item) => (item.id || item.productId) === productId);
    },
    [wishlistItems]
  );

  const addToWishlist = useCallback(
    (product) => {
      const id = product.id || product.productId;
      if (!isInWishlist(id)) {
        setWishlistItems((prev) => [product, ...prev]);
        toast.wishlist(`Added "${product.name}" to your Wishlist ❤️`, 'Saved to Wishlist');
      }
    },
    [isInWishlist, toast]
  );

  const removeFromWishlist = useCallback(
    (productId) => {
      setWishlistItems((prev) => {
        const itemToRemove = prev.find((item) => (item.id || item.productId) === productId);
        const filtered = prev.filter((item) => (item.id || item.productId) !== productId);
        if (itemToRemove) {
          toast.info(`Removed "${itemToRemove.name}" from your Wishlist.`, 'Wishlist Updated');
        }
        return filtered;
      });
    },
    [toast]
  );

  const toggleWishlist = useCallback(
    (product) => {
      const id = product.id || product.productId;
      if (isInWishlist(id)) {
        removeFromWishlist(id);
      } else {
        addToWishlist(product);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    toast.info('Your wishlist has been cleared.', 'Wishlist Cleared');
  }, [toast]);

  /**
   * Move item directly from Wishlist to Cart
   */
  const moveToCart = useCallback(
    async (product) => {
      const id = product.id || product.productId;
      await addToCart(product, 1);
      setWishlistItems((prev) => prev.filter((item) => (item.id || item.productId) !== id));
      toast.cart(`Moved "${product.name}" from Wishlist to Cart! 🛒`, 'Moved to Cart');
    },
    [addToCart, toast]
  );

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    moveToCart,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
