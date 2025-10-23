import { Router } from 'express';
import authRouter from './auth.js';
import authorsRouter from './authors.js';
import booksRouter from './books.js';
import reviewsRouter from './reviews.js';
import adminRouter from './admin.js';
import quizzesRouter from './quizzes.js';
import progressRouter from './progress.js';
import searchRouter from './search.js';
import leaderboardRouter from './leaderboard.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Mount auth routes
router.use('/auth', authRouter);
router.use('/authors', authorsRouter);
router.use('/books', booksRouter);
router.use('/reviews', reviewsRouter);
router.use('/admin', adminRouter);
router.use('/quizzes', quizzesRouter);
router.use('/progress', progressRouter);
router.use('/search', searchRouter);
router.use('/leaderboard', leaderboardRouter);

export default router;