import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { recordAuditLog } from '../middleware/adminAuthMiddleware.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback orders store
let inMemoryOrders = [
  {
    _id: "ord-101",
    id: "ord-101",
    orderNumber: "AHM-10021",
    customer: { name: "Ananya Ramesh", email: "ananya@example.com", phone: "+91 9840123456" },
    shippingAddress: { street: "45 Green Park", city: "Chennai", state: "Tamil Nadu", pincode: "600028", country: "India" },
    items: [{ name: "Aham Natural Turmeric Powder", sku: "AHM-TUR-250", price: 399, quantity: 2, image: "https://images.unsplash.com/photo-1615486171448-4fd325a8ee58?auto=format&fit=crop&q=80&w=800" }],
    subtotal: 798,
    totalAmount: 798,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    statusHistory: [{ status: "PENDING", updatedBy: "System", note: "Order placed via Cash on Delivery", updatedAt: new Date(Date.now() - 86400000).toISOString() }],
    fulfillment: { carrier: "", trackingNumber: "", trackingUrl: "" },
    adminNotes: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "ord-102",
    id: "ord-102",
    orderNumber: "AHM-10022",
    customer: { name: "Karthik Subramanian", email: "karthik@example.com", phone: "+91 9444112233" },
    shippingAddress: { street: "12 Anna Salai", city: "Coimbatore", state: "Tamil Nadu", pincode: "641001", country: "India" },
    items: [{ name: "Cold-Pressed Sesame Oil (Mara Chekku)", sku: "AHM-OIL-SES-500", price: 450, quantity: 1, image: "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?auto=format&fit=crop&q=80&w=800" }],
    subtotal: 450,
    totalAmount: 450,
    paymentMethod: "ONLINE",
    paymentStatus: "PAID",
    orderStatus: "PROCESSING",
    statusHistory: [
      { status: "PENDING", updatedBy: "System", note: "Payment verified online", updatedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      { status: "PROCESSING", updatedBy: "Master Admin", note: "Sent to warehouse packing", updatedAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    fulfillment: { carrier: "Delhivery", trackingNumber: "AHM-DEL-8921", trackingUrl: "https://track.delhivery.com" },
    adminNotes: [{ note: "Customer requested morning delivery", adminName: "Master Admin", createdAt: new Date(Date.now() - 86400000).toISOString() }],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: "ord-103",
    id: "ord-103",
    orderNumber: "AHM-10023",
    customer: { name: "Priya Lakshmi", email: "priya@example.com", phone: "+91 9789012345" },
    shippingAddress: { street: "78 Heritage Enclave", city: "Madurai", state: "Tamil Nadu", pincode: "625001", country: "India" },
    items: [{ name: "Raw Wild Forest Honey", sku: "AHM-HON-500", price: 650, quantity: 1, image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=800" }],
    subtotal: 650,
    totalAmount: 650,
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    orderStatus: "SHIPPED",
    statusHistory: [
      { status: "SHIPPED", updatedBy: "Master Admin", note: "Handed over to BlueDart courier", updatedAt: new Date(Date.now() - 86400000 * 3).toISOString() }
    ],
    fulfillment: { carrier: "BlueDart", trackingNumber: "BD-99881122", trackingUrl: "https://bluedart.com" },
    adminNotes: [],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

/**
 * @desc    Get paginated admin orders with status tabs and search
 * @route   GET /api/admin/orders
 */
export const getAdminOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const { search, status, paymentStatus, paymentMethod, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    if (isMongoConnected()) {
      try {
        const query = {};
        if (search) {
          query.$or = [
            { orderNumber: { $regex: search, $options: 'i' } },
            { 'customer.name': { $regex: search, $options: 'i' } },
            { 'customer.email': { $regex: search, $options: 'i' } },
          ];
        }
        if (status && status !== 'ALL') query.orderStatus = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;
        if (paymentMethod) query.paymentMethod = paymentMethod;

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const count = await Order.countDocuments(query);
        if (count > 0) {
          const orders = await Order.find(query).sort(sortOptions).skip((page - 1) * limit).limit(limit);
          return res.json({
            success: true,
            total: count,
            page,
            pages: Math.ceil(count / limit),
            limit,
            orders,
          });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Order DB Warning]: Falling back to in-memory orders store:', dbErr.message);
      }
    }

    // In-memory filter logic
    let filtered = [...inMemoryOrders];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      );
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter(o => o.orderStatus === status);
    }
    if (paymentStatus) {
      filtered = filtered.filter(o => o.paymentStatus === paymentStatus);
    }
    if (paymentMethod) {
      filtered = filtered.filter(o => o.paymentMethod === paymentMethod);
    }

    return res.json({
      success: true,
      total: filtered.length,
      page: 1,
      pages: 1,
      limit,
      orders: filtered,
    });
  } catch (error) {
    console.error('getAdminOrders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin orders',
      error: error.message,
    });
  }
};

/**
 * @desc    Get order details by ID
 * @route   GET /api/admin/orders/:id
 */
export const getAdminOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      const order = await Order.findById(id);
      if (order) return res.json({ success: true, order });
    }

    const order = inMemoryOrders.find(o => o._id === id || o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/admin/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, paymentStatus } = req.body;

    const allowedStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status '${status}'. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        const order = await Order.findById(id);
        if (order) {
          const previousStatus = order.orderStatus;
          order.orderStatus = status;
          if (paymentStatus) order.paymentStatus = paymentStatus;
          else if (status === 'DELIVERED' && order.paymentMethod === 'COD') order.paymentStatus = 'PAID';

          order.statusHistory.push({
            status,
            updatedBy: req.admin?.name || 'Master Admin',
            note: note || `Status transitioned to ${status}`,
            updatedAt: new Date(),
          });
          await order.save();
          return res.json({ success: true, message: `Order status updated to ${status}`, order });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Order DB Warning]: Status update fallback to in-memory:', dbErr.message);
      }
    }

    // In-memory update
    const index = inMemoryOrders.findIndex(o => o._id === id || o.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    inMemoryOrders[index].orderStatus = status;
    if (paymentStatus) {
      inMemoryOrders[index].paymentStatus = paymentStatus;
    } else if (status === 'DELIVERED' && inMemoryOrders[index].paymentMethod === 'COD') {
      inMemoryOrders[index].paymentStatus = 'PAID';
    }

    inMemoryOrders[index].statusHistory.push({
      status,
      updatedBy: req.admin?.name || 'Master Admin',
      note: note || `Status transitioned to ${status}`,
      updatedAt: new Date().toISOString(),
    });

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: inMemoryOrders[index],
    });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

/**
 * @desc    Update order fulfillment carrier and tracking details
 * @route   PATCH /api/admin/orders/:id/fulfillment
 */
export const updateFulfillmentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { carrier, trackingNumber, trackingUrl } = req.body;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        const order = await Order.findById(id);
        if (order) {
          order.fulfillment = {
            carrier: carrier || order.fulfillment.carrier,
            trackingNumber: trackingNumber || order.fulfillment.trackingNumber,
            trackingUrl: trackingUrl || order.fulfillment.trackingUrl,
            shippedAt: new Date(),
          };
          if (order.orderStatus === 'PROCESSING') order.orderStatus = 'SHIPPED';
          await order.save();
          return res.json({ success: true, message: 'Fulfillment tracking details saved', order });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Order DB Warning]: Fulfillment update fallback to in-memory:', dbErr.message);
      }
    }

    // In-memory fulfillment update
    const index = inMemoryOrders.findIndex(o => o._id === id || o.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    inMemoryOrders[index].fulfillment = {
      carrier: carrier || inMemoryOrders[index].fulfillment.carrier,
      trackingNumber: trackingNumber || inMemoryOrders[index].fulfillment.trackingNumber,
      trackingUrl: trackingUrl || inMemoryOrders[index].fulfillment.trackingUrl,
    };
    if (inMemoryOrders[index].orderStatus === 'PROCESSING') {
      inMemoryOrders[index].orderStatus = 'SHIPPED';
    }

    return res.json({
      success: true,
      message: 'Fulfillment tracking details saved',
      order: inMemoryOrders[index],
    });
  } catch (error) {
    console.error('updateFulfillmentInfo error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update fulfillment details',
      error: error.message,
    });
  }
};

/**
 * @desc    Add internal admin note to order
 * @route   POST /api/admin/orders/:id/notes
 */
export const addAdminNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty' });
    }

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        const order = await Order.findById(id);
        if (order) {
          order.adminNotes.push({
            note: note.trim(),
            adminName: req.admin?.name || 'Master Admin',
            createdAt: new Date(),
          });
          await order.save();
          return res.json({ success: true, message: 'Note added successfully', order });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Order DB Warning]: Note add fallback to in-memory:', dbErr.message);
      }
    }

    // In-memory note addition
    const index = inMemoryOrders.findIndex(o => o._id === id || o.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const noteObj = {
      note: note.trim(),
      adminName: req.admin?.name || 'Master Admin',
      createdAt: new Date().toISOString(),
    };
    inMemoryOrders[index].adminNotes.push(noteObj);

    return res.json({
      success: true,
      message: 'Note added successfully',
      order: inMemoryOrders[index],
    });
  } catch (error) {
    console.error('addAdminNote error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add admin note',
      error: error.message,
    });
  }
};
