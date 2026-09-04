import mongoose from 'mongoose';
import { Coupon } from '../models/Coupon.js';
import { recordAuditLog } from '../middleware/adminAuthMiddleware.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

let inMemoryCoupons = [
  {
    _id: "cpn-1",
    id: "cpn-1",
    code: "WELCOME10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 499,
    usageLimit: 500,
    usedCount: 42,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "cpn-2",
    id: "cpn-2",
    code: "ORGANICFLAT100",
    discountType: "FLAT",
    discountValue: 100,
    minOrderAmount: 999,
    usageLimit: 200,
    usedCount: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "cpn-3",
    id: "cpn-3",
    code: "FESTIVE20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderAmount: 1499,
    usageLimit: 100,
    usedCount: 100,
    isActive: false,
    createdAt: new Date().toISOString(),
  },
];

export const getAdminCoupons = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        const count = await Coupon.countDocuments();
        if (count > 0) {
          const coupons = await Coupon.find().sort({ createdAt: -1 });
          return res.json({ success: true, count: coupons.length, coupons });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Coupon DB Warning]: Fallback to in-memory store:', dbErr.message);
      }
    }
    return res.json({ success: true, count: inMemoryCoupons.length, coupons: inMemoryCoupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch coupons', error: error.message });
  }
};

export const createAdminCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, isActive } = req.body;
    if (!code || discountValue === undefined) {
      return res.status(400).json({ success: false, message: 'Promo code and discount value are required' });
    }

    const formattedCode = code.toUpperCase().trim();
    const newCouponData = {
      code: formattedCode,
      discountType: discountType || 'PERCENTAGE',
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usedCount: 0,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString(),
    };

    if (isMongoConnected()) {
      try {
        const coupon = await Coupon.create(newCouponData);
        return res.status(201).json({ success: true, message: `Coupon '${coupon.code}' created`, coupon });
      } catch (dbErr) {
        console.warn('⚠️ [Coupon DB Warning]: Fallback to in-memory create:', dbErr.message);
      }
    }

    const inMemCoupon = {
      _id: `cpn-${Date.now()}`,
      id: `cpn-${Date.now()}`,
      ...newCouponData,
    };
    inMemoryCoupons.unshift(inMemCoupon);

    return res.status(201).json({ success: true, message: `Coupon '${inMemCoupon.code}' created`, coupon: inMemCoupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create coupon', error: error.message });
  }
};

export const updateAdminCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        const coupon = await Coupon.findById(id);
        if (coupon) {
          Object.keys(updates).forEach(k => {
            if (updates[k] !== undefined) coupon[k] = updates[k];
          });
          await coupon.save();
          return res.json({ success: true, message: 'Coupon updated successfully', coupon });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Coupon DB Warning]: Fallback to in-memory update:', dbErr.message);
      }
    }

    const index = inMemoryCoupons.findIndex(c => c._id === id || c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    inMemoryCoupons[index] = { ...inMemoryCoupons[index], ...updates };
    return res.json({ success: true, message: 'Coupon updated successfully', coupon: inMemoryCoupons[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update coupon', error: error.message });
  }
};

export const deleteAdminCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        await Coupon.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Coupon deleted successfully' });
      } catch (dbErr) {
        console.warn('⚠️ [Coupon DB Warning]: Fallback to in-memory delete:', dbErr.message);
      }
    }

    const index = inMemoryCoupons.findIndex(c => c._id === id || c.id === id);
    if (index !== -1) {
      inMemoryCoupons.splice(index, 1);
      return res.json({ success: true, message: 'Coupon deleted successfully' });
    }

    return res.status(404).json({ success: false, message: 'Coupon not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete coupon', error: error.message });
  }
};
