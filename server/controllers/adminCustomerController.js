import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { recordAuditLog } from '../middleware/adminAuthMiddleware.js';

/**
 * @desc    Get aggregated admin customers list with order counts & total spent
 * @route   GET /api/admin/customers
 * @access  Private (Admin: SUPER_ADMIN, ORDER_MANAGER, SUPPORT)
 */
export const getAdminCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    // 1. Fetch registered users from User collection
    const userQuery = { role: 'CUSTOMER' };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    const registeredUsers = await User.find(userQuery).lean();

    // 2. Aggregate customer metrics from existing orders
    const pipeline = [
      {
        $group: {
          _id: '$customer.email',
          name: { $first: '$customer.name' },
          email: { $first: '$customer.email' },
          phone: { $first: '$customer.phone' },
          ordersCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastOrderDate: { $max: '$createdAt' },
          firstOrderDate: { $min: '$createdAt' },
        },
      },
      { $sort: { totalSpent: -1 } },
    ];

    if (search) {
      pipeline.unshift({
        $match: {
          $or: [
            { 'customer.name': { $regex: search, $options: 'i' } },
            { 'customer.email': { $regex: search, $options: 'i' } },
            { 'customer.phone': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    const orderCustomers = await Order.aggregate(pipeline);

    // 3. Merge registered users & order customers
    const customerMap = new Map();

    registeredUsers.forEach((u) => {
      customerMap.set(u.email.toLowerCase(), {
        _id: u.email.toLowerCase(),
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: u.createdAt,
        registeredUser: true,
      });
    });

    orderCustomers.forEach((oc) => {
      const emailKey = oc.email ? oc.email.toLowerCase() : '';
      if (emailKey) {
        const existing = customerMap.get(emailKey) || {};
        customerMap.set(emailKey, {
          ...existing,
          _id: emailKey,
          name: oc.name || existing.name || 'Guest Customer',
          email: oc.email || existing.email,
          phone: oc.phone || existing.phone || 'N/A',
          ordersCount: oc.ordersCount || 0,
          totalSpent: oc.totalSpent || 0,
          lastOrderDate: oc.lastOrderDate || existing.lastOrderDate,
        });
      }
    });

    const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

    res.json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin customers',
      error: error.message,
    });
  }
};

/**
 * @desc    Get customer profile & order history by email
 * @route   GET /api/admin/customers/:email
 * @access  Private (Admin)
 */
export const getAdminCustomerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ 'customer.email': email.toLowerCase() }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const customer = {
      name: orders[0].customer.name,
      email: orders[0].customer.email,
      phone: orders[0].customer.phone,
      ordersCount: orders.length,
      totalSpent: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      orders,
    };

    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer profile',
      error: error.message,
    });
  }
};
