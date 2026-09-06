/**
 * Service to manage customer orders isolated per account email.
 */

const getStorageKey = (email) => {
  if (!email) return 'aham_user_orders_guest';
  return `aham_user_orders_${email.toLowerCase().trim()}`;
};

export const orderService = {
  /**
   * Get all orders belonging to a specific customer email
   */
  getUserOrders(email) {
    if (!email) return [];
    try {
      const key = getStorageKey(email);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to retrieve user orders from localStorage:', e);
      return [];
    }
  },

  /**
   * Save a newly placed order under the customer's email
   */
  saveOrder(email, orderData) {
    if (!email) return;
    try {
      const key = getStorageKey(email);
      const existingOrders = this.getUserOrders(email);
      const updatedOrders = [orderData, ...existingOrders];
      localStorage.setItem(key, JSON.stringify(updatedOrders));
      return updatedOrders;
    } catch (e) {
      console.error('Failed to save order to localStorage:', e);
    }
  },

  /**
   * Find a specific order by ID for a user
   */
  getOrderById(email, orderId) {
    const orders = this.getUserOrders(email);
    return orders.find((o) => o.id === orderId || o.orderId === orderId) || null;
  },
};
