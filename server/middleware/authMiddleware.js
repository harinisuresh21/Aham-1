import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aham_customer_jwt_secret_dev_key_2026';

/**
 * Middleware to protect customer routes and attach user info to req.user
 */
export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please sign in to continue.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User account not found.',
        });
      }
      req.user = user;
    } else {
      // Fallback user object if DB is offline
      req.user = {
        _id: decoded.id,
        email: decoded.email,
        name: decoded.name || 'AHAM Customer',
        role: decoded.role || 'CUSTOMER',
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please sign in again.',
      error: error.message,
    });
  }
};
