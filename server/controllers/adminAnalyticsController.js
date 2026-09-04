import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { AuditLog } from '../models/AuditLog.js';

/**
 * @desc    Get executive dashboard metrics & revenue analytics
 * @route   GET /api/admin/analytics/dashboard
 * @access  Private (Admin)
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const [totalOrders, revenueData, lowStockCount, recentOrders, recentAudits] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Product.countDocuments({ stock_quantity: { $lte: 15 } }),
      Order.find().sort({ createdAt: -1 }).limit(5),
      AuditLog.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      success: true,
      metrics: {
        totalOrders,
        totalRevenue,
        lowStockCount,
      },
      recentOrders,
      recentAudits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: error.message,
    });
  }
};
