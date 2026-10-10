import { Router } from 'express';
import { createReport, trackReport } from '../controllers/report.controller.js';

const router = Router();

router.post('/', createReport);
router.get('/track/:trackingCode', trackReport);

export default router;
