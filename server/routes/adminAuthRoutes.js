import express from 'express';
import {
  loginAdmin,
  getAdminMe,
  logoutAdmin,
  setupInitialAdmin,
} from '../controllers/adminAuthController.js';
import { requireAdminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public setup & login routes
router.post('/login', loginAdmin);
router.post('/setup-initial', setupInitialAdmin);

// Protected routes
router.get('/me', requireAdminAuth, getAdminMe);
router.post('/logout', requireAdminAuth, logoutAdmin);

export default router;
