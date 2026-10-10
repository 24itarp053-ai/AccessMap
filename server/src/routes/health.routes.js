import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

const getDbState = (state) => {
  switch (state) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    case 0:
    default:
      return 'disconnected';
  }
};

router.get('/health', (req, res) => {
  const dbStateCode = mongoose.connection.readyState;
  const dbStatus = getDbState(dbStateCode);
  const isHealthy = dbStateCode === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'OK' : 'DEGRADED',
    service: 'AccessMap API',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

export default router;
