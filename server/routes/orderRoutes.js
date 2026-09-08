import express from 'express';
import {
  createOrder,
  getOrdersByEmail,
  getOrderByNumber,
} from '../controllers/orderController.js';

const router = express.Router();

// @route POST /api/orders (Create customer order in Mongoose)
router.post('/', createOrder);

// @route GET /api/orders/user?email=...
router.get('/user', getOrdersByEmail);

// @route GET /api/orders/:orderNumber
router.get('/:orderNumber', getOrderByNumber);

export default router;
