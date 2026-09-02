const API_BASE_URL = 'http://localhost:5000/api/cart';

// Generate or retrieve persistent guest session ID
export const getSessionId = () => {
  let sessionId = localStorage.getItem('aham_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem('aham_session_id', sessionId);
  }
  return sessionId;
};

// Common headers including session identification
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-session-id': getSessionId(),
});

// LocalStorage fallback helper
const getLocalCart = () => {
  try {
    const raw = localStorage.getItem('aham_cart_data');
    return raw ? JSON.parse(raw) : { items: [], totalCount: 0, subtotal: 0 };
  } catch {
    return { items: [], totalCount: 0, subtotal: 0 };
  }
};

const saveLocalCart = (cartData) => {
  try {
    localStorage.setItem('aham_cart_data', JSON.stringify(cartData));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
};

export const cartService = {
  /**
   * Fetch all cart items
   */
  async getCart() {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.data) {
        saveLocalCart(data.data);
        return data.data;
      }
      return getLocalCart();
    } catch (err) {
      console.warn('[CartService] Backend unreachable, using local fallback:', err.message);
      return getLocalCart();
    }
  },

  /**
   * Add item to cart or increment quantity
   */
  async addToCart(product, quantity = 1) {
    const payload = {
      productId: product.id || product.productId,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0]?.url || product.image || '',
      weight: product.weight || '',
      slug: product.slug || '',
      sessionId: getSessionId(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.data) {
        saveLocalCart(data.data);
        return data.data;
      }
      throw new Error(data.message || 'Failed to add item');
    } catch (err) {
      console.warn('[CartService] Backend unreachable, updating locally:', err.message);
      // Local fallback calculation
      const current = getLocalCart();
      const items = [...current.items];
      const existingIdx = items.findIndex((i) => (i.productId || i.id) === payload.productId);

      if (existingIdx > -1) {
        items[existingIdx].quantity += payload.quantity;
      } else {
        items.push({
          id: `item-${Date.now()}`,
          ...payload,
        });
      }

      const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
      const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
      const updated = { items, totalCount, subtotal };
      saveLocalCart(updated);
      return updated;
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/remove/${productId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.data) {
        saveLocalCart(data.data);
        return data.data;
      }
      throw new Error(data.message || 'Failed to remove item');
    } catch (err) {
      console.warn('[CartService] Backend unreachable, removing locally:', err.message);
      const current = getLocalCart();
      const items = current.items.filter((i) => (i.productId || i.id) !== productId);
      const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
      const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
      const updated = { items, totalCount, subtotal };
      saveLocalCart(updated);
      return updated;
    }
  },

  /**
   * Update quantity
   */
  async updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/update/${productId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ quantity, sessionId: getSessionId() }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.data) {
        saveLocalCart(data.data);
        return data.data;
      }
      throw new Error(data.message || 'Failed to update quantity');
    } catch (err) {
      console.warn('[CartService] Backend unreachable, updating locally:', err.message);
      const current = getLocalCart();
      const items = current.items.map((i) =>
        (i.productId || i.id) === productId ? { ...i, quantity } : i
      );
      const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
      const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
      const updated = { items, totalCount, subtotal };
      saveLocalCart(updated);
      return updated;
    }
  },

  /**
   * Clear entire cart
   */
  async clearCart() {
    try {
      await fetch(`${API_BASE_URL}/clear`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    } catch (err) {
      console.warn('[CartService] Error clearing backend cart:', err.message);
    }
    const empty = { items: [], totalCount: 0, subtotal: 0 };
    saveLocalCart(empty);
    return empty;
  },
};
