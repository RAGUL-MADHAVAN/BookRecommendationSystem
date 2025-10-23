import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';
import apiRouter from './routes/index.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRouter);

// Health
app.get('/', (_req, res) => res.send({ status: 'ok' }));

// 404 and error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}).catch((err) => {
  console.error('Failed to connect DB', err);
  process.exit(1);
});
