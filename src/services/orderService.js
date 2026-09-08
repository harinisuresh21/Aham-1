/**
 * Service to manage customer orders isolated per account email.
 */

const getStorageKey = (email) => {
  if (!email) return 'aham_user_orders_guest';
  return `aham_user_orders_${email.toLowerCase().trim()}`;
};

export const orderService = {
  /**
   * Fetch live user orders from backend API
   */
  async fetchUserOrders(email) {
    if (!email) return [];
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/orders/user?email=${encodeURIComponent(email.toLowerCase())}`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.orders)) {
        return data.orders.map((o) => ({
          id: o.orderNumber,
          orderId: o.orderNumber,
          date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: o.orderStatus,
          statusLabel: `Order ${o.orderStatus}`,
          recipientName: o.customer.name,
          recipientPhone: o.customer.phone,
          recipientEmail: o.customer.email,
          deliveryAddress: `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.state} - ${o.shippingAddress.pincode}`,
          paymentMethod: o.paymentMethod,
          total: o.totalAmount,
          subtotal: o.subtotal,
          shipping: o.shippingFee,
          itemCount: o.items.reduce((acc, item) => acc + item.quantity, 0),
          items: o.items,
        }));
      }
      return this.getUserOrders(email);
    } catch (err) {
      console.warn('API user orders fetch failed, using local storage:', err.message);
      return this.getUserOrders(email);
    }
  },

  /**
   * Get all orders belonging to a specific customer email from localStorage
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
