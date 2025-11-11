import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import generationRoutes from './routes/generations';
import { errorHandler } from './middleware/errorHandler';
import runMigrations from './db/migrate';

// Load environment variables
dotenv.config();

// Initialize database
runMigrations();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.join(process.cwd(), uploadDir)));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/generations', generationRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
