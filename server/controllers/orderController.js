import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

/**
 * @desc    Create new customer order
 * @route   POST /api/orders
 * @access  Public / Authenticated Customer
 */
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      shippingAddress,
      items,
      subtotal,
      tax = 0,
      shippingFee = 0,
      discount = 0,
      totalAmount,
      paymentMethod = 'COD',
    } = req.body;

    if (!customer || !customer.email || !customer.name || !customer.phone) {
      return res.status(400).json({ success: false, message: 'Customer details (name, email, phone) are required.' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Shipping address details are required.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    const orderNumber = `AHM-${Math.floor(100000 + Math.random() * 900000)}`;

    const normalizedPaymentMethod = paymentMethod.toUpperCase().includes('UPI')
      ? 'UPI'
      : paymentMethod.toUpperCase().includes('CARD')
      ? 'CREDIT_CARD'
      : paymentMethod.toUpperCase().includes('ONLINE')
      ? 'ONLINE'
      : 'COD';

    const newOrder = await Order.create({
      orderNumber,
      customer: {
        name: customer.name,
        email: customer.email.toLowerCase(),
        phone: customer.phone,
      },
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || 'Tamil Nadu',
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || 'India',
      },
      items: items.map((item) => ({
        product: item._id || item.id || null,
        name: item.name,
        sku: item.sku || '',
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
        image: item.image || item.imageUrl || (Array.isArray(item.images) ? item.images[0]?.url : '') || '',
      })),
      subtotal: Number(subtotal),
      tax: Number(tax),
      shippingFee: Number(shippingFee),
      discount: Number(discount),
      totalAmount: Number(totalAmount),
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: normalizedPaymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'PENDING',
      statusHistory: [
        {
          status: 'PENDING',
          updatedBy: 'System',
          note: 'Order placed by customer',
          updatedAt: new Date(),
        },
      ],
    });

    // Reduce stock quantities in Mongoose Products
    for (const item of items) {
      if (item._id || item.id) {
        await Product.findByIdAndUpdate(item._id || item.id, {
          $inc: { stock_quantity: -Math.abs(Number(item.quantity || 1)) },
        }).catch((err) => console.warn('Stock update warning:', err.message));
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

/**
 * @desc    Get customer orders by email
 * @route   GET /api/orders/user?email=...
 * @access  Public / Customer
 */
export const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email parameter is required' });
    }

    const orders = await Order.find({ 'customer.email': email.toLowerCase() }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single order details by orderNumber or ID
 * @route   GET /api/orders/:orderNumber
 * @access  Public / Customer
 */
export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({
      $or: [
        { orderNumber: orderNumber.toUpperCase() },
        { _id: orderNumber.match(/^[0-9a-fA-F]{24}$/) ? orderNumber : null },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};
