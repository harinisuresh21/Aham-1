import mongoose from 'mongoose';
import { CartItem } from '../models/Cart.js';

// In-memory fallback store in case MongoDB is disconnected during testing
const inMemoryCart = new Map(); // key: sessionId, value: array of items

const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Helper to compute cart totals
 */
const formatCartResponse = (items) => {
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return {
    items,
    totalCount,
    subtotal,
  };
};

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart or increment quantity if already present
 */
export const addToCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId || 'default-session';
    const { productId, name, price, quantity = 1, image = '', weight = '', slug = '', userId = null } = req.body;

    if (!productId || price === undefined || !name) {
      return res.status(400).json({
        success: false,
        message: 'productId, name, and price are required fields.',
      });
    }

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    if (isMongoConnected()) {
      // Find existing item in MongoDB
      let existingItem = await CartItem.findOne({ sessionId, productId });

      if (existingItem) {
        existingItem.quantity += qtyToAdd;
        await existingItem.save();
      } else {
        await CartItem.create({
          sessionId,
          userId,
          productId,
          name,
          price: Number(price),
          quantity: qtyToAdd,
          image,
          weight,
          slug,
        });
      }

      const allItems = await CartItem.find({ sessionId }).sort({ createdAt: -1 });
      const cartData = formatCartResponse(allItems);

      return res.status(200).json({
        success: true,
        message: 'Item added to cart successfully',
        data: cartData,
      });
    } else {
      // In-memory fallback
      const sessionItems = inMemoryCart.get(sessionId) || [];
      const existingIndex = sessionItems.findIndex((item) => item.productId === productId);

      if (existingIndex > -1) {
        sessionItems[existingIndex].quantity += qtyToAdd;
      } else {
        sessionItems.push({
          id: `cart-${Date.now()}`,
          sessionId,
          productId,
          name,
          price: Number(price),
          quantity: qtyToAdd,
          image,
          weight,
          slug,
          createdAt: new Date().toISOString(),
        });
      }

      inMemoryCart.set(sessionId, sessionItems);
      const cartData = formatCartResponse(sessionItems);

      return res.status(200).json({
        success: true,
        message: 'Item added to cart successfully (in-memory mode)',
        data: cartData,
      });
    }
  } catch (error) {
    console.error('Error in addToCart:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while adding item to cart',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/cart
 * @desc    Fetch all cart items for user / session
 */
export const getCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || 'default-session';

    if (isMongoConnected()) {
      const items = await CartItem.find({ sessionId }).sort({ createdAt: -1 });
      const cartData = formatCartResponse(items);
      return res.status(200).json({
        success: true,
        data: cartData,
      });
    } else {
      const items = inMemoryCart.get(sessionId) || [];
      const cartData = formatCartResponse(items);
      return res.status(200).json({
        success: true,
        data: cartData,
      });
    }
  } catch (error) {
    console.error('Error in getCart:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching cart',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/cart/remove/:id
 * @desc    Remove item from cart by productId or mongo _id
 */
export const removeFromCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || req.body?.sessionId || 'default-session';
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Item ID / Product ID is required',
      });
    }

    if (isMongoConnected()) {
      // Remove by either productId or Mongo _id
      await CartItem.deleteMany({
        sessionId,
        $or: [{ productId: id }, ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : [])],
      });

      const items = await CartItem.find({ sessionId }).sort({ createdAt: -1 });
      const cartData = formatCartResponse(items);

      return res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        data: cartData,
      });
    } else {
      let items = inMemoryCart.get(sessionId) || [];
      items = items.filter((item) => item.productId !== id && item.id !== id);
      inMemoryCart.set(sessionId, items);

      const cartData = formatCartResponse(items);
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        data: cartData,
      });
    }
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while removing item from cart',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/cart/update/:id
 * @desc    Update quantity for a specific cart item
 */
export const updateCartItemQuantity = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.body?.sessionId || 'default-session';
    const { id } = req.params;
    const { quantity } = req.body;

    const newQty = parseInt(quantity, 10);

    if (isNaN(newQty)) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required',
      });
    }

    if (newQty <= 0) {
      // Remove item if quantity is 0 or negative
      return removeFromCart(req, res);
    }

    if (isMongoConnected()) {
      let item = await CartItem.findOne({
        sessionId,
        $or: [{ productId: id }, ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : [])],
      });

      if (item) {
        item.quantity = newQty;
        await item.save();
      }

      const items = await CartItem.find({ sessionId }).sort({ createdAt: -1 });
      const cartData = formatCartResponse(items);

      return res.status(200).json({
        success: true,
        message: 'Cart quantity updated',
        data: cartData,
      });
    } else {
      let items = inMemoryCart.get(sessionId) || [];
      const itemIndex = items.findIndex((item) => item.productId === id || item.id === id);

      if (itemIndex > -1) {
        items[itemIndex].quantity = newQty;
      }
      inMemoryCart.set(sessionId, items);

      const cartData = formatCartResponse(items);
      return res.status(200).json({
        success: true,
        message: 'Cart quantity updated',
        data: cartData,
      });
    }
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating cart quantity',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear all items for the user / session
 */
export const clearCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || 'default-session';

    if (isMongoConnected()) {
      await CartItem.deleteMany({ sessionId });
    } else {
      inMemoryCart.delete(sessionId);
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: { items: [], totalCount: 0, subtotal: 0 },
    });
  } catch (error) {
    console.error('Error in clearCart:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while clearing cart',
      error: error.message,
    });
  }
};
