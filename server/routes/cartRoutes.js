import express from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

// @route POST /api/cart/add
router.post('/add', addToCart);

// @route GET /api/cart
router.get('/', getCart);

// @route DELETE /api/cart/remove/:id
router.delete('/remove/:id', removeFromCart);

// @route PUT /api/cart/update/:id
router.put('/update/:id', updateCartItemQuantity);

// @route DELETE /api/cart/clear
router.delete('/clear', clearCart);

export default router;
