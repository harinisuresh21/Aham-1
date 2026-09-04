import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import cartRoutes from './routes/cartRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import adminProductRoutes from './routes/adminProductRoutes.js';
import adminCategoryRoutes from './routes/adminCategoryRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js';
import adminCustomerRoutes from './routes/adminCustomerRoutes.js';
import adminCouponRoutes from './routes/adminCouponRoutes.js';
import adminAnalyticsRoutes from './routes/adminAnalyticsRoutes.js';
import adminAuditLogRoutes from './routes/adminAuditLogRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/customers', adminCustomerRoutes);
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin/audit-logs', adminAuditLogRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AHAM E-Commerce Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌿 [AHAM Server] Backend API running at http://localhost:${PORT}`);
  console.log(`🛒 [Cart Routes] /api/cart (GET, POST /add, DELETE /remove/:id, PUT /update/:id)`);
});
