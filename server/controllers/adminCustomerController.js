import { Order } from '../models/Order.js';
import { recordAuditLog } from '../middleware/adminAuthMiddleware.js';

/**
 * @desc    Get aggregated admin customers list with order counts & total spent
 * @route   GET /api/admin/customers
 * @access  Private (Admin: SUPER_ADMIN, ORDER_MANAGER, SUPPORT)
 */
export const getAdminCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    // Aggregate customers from existing orders
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

    const customers = await Order.aggregate(pipeline);

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
