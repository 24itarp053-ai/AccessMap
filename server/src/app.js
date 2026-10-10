import express from 'express';
import healthRoutes from './routes/health.routes.js';
import placeRoutes from './routes/place.routes.js';
import reportRoutes from './routes/report.routes.js';
import authRoutes from './routes/auth.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// API Routes
app.use('/api', healthRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler for undefined routes
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);

export default app;
