import express from 'express';
import { getDashboardAnalytics } from '../controllers/adminAnalyticsController.js';
import { requireAdminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();
router.use(requireAdminAuth);

router.get('/dashboard', getDashboardAnalytics);

export default router;
