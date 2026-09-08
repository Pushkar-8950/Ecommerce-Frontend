import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import aiRoutes from './routes/aiRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

// 1. Load environment variables from .env file immediately
dotenv.config();

// 2. Initialize database connection
connectDB();

// 3. Initialize Express application
const app: Application = express();

// 4. Global standard middleware
app.use(cors({
  origin: '*', // Adjust to your frontend URL (e.g. 'http://localhost:5173') in production
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Health check endpoint to verify server status
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'E-commerce API server is up and running.',
    timestamp: new Date().toISOString(),
  });
});

// 6. Mount application API routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

// 7. Error handling middleware (404 and Global Error Handler)
app.use(notFound);
app.use(errorHandler);

// 8. Start HTTP Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
});

// Handle unhandled Promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
