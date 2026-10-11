import { Router } from 'express';
import {
  createReport,
  trackReport,
  getReportsAdmin,
  updateReportStatus
} from '../controllers/report.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', createReport);
router.get('/track/:trackingCode', trackReport);

router.get('/', authenticate, authorize('admin'), getReportsAdmin);
router.patch('/:id/status', authenticate, authorize('admin'), updateReportStatus);

export default router;
