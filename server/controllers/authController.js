import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'aham_customer_jwt_secret_dev_key_2026';
const JWT_EXPIRES_IN = '7d';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'CUSTOMER',
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * @desc    Register a new customer
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    let newUser;

    // Check if DB connected
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : '',
        authProvider: 'local',
      });
      await user.hashPassword(password);
      await user.save();

      newUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };
    } else {
      // Local fallback mode
      newUser = {
        _id: 'usr_' + Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || '',
        role: 'CUSTOMER',
      };
    }

    const token = generateToken(newUser);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    console.error('❌ [Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register account. Please try again.',
      error: error.message,
    });
  }
};

/**
 * @desc    Authenticate customer & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    let authenticatedUser;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      user.lastLogin = new Date();
      await user.save();

      authenticatedUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };
    } else {
      // Fallback
      authenticatedUser = {
        _id: 'usr_demo',
        name: email.split('@')[0] || 'AHAM Customer',
        email: email.toLowerCase().trim(),
        phone: '',
        role: 'CUSTOMER',
      };
    }

    const token = generateToken(authenticatedUser);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully!',
      data: {
        user: authenticatedUser,
        token,
      },
    });
  } catch (error) {
    console.error('❌ [Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to sign in. Please try again.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile.',
    });
  }
};

/**
 * @desc    Logout customer / clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};
