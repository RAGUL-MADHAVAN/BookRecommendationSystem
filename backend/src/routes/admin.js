import { Router } from 'express';
import { protect, requireRole } from '../middleware/auth.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Author from '../models/Author.js';
import Review from '../models/Review.js';

const router = Router();

router.use(protect, requireRole('admin'));

router.get('/stats', async (_req, res) => {
  const [books, authors, users, reviews] = await Promise.all([
    Book.countDocuments(),
    Author.countDocuments(),
    User.countDocuments(),
    Review.countDocuments({ approved: true })
  ]);
  const topBooks = await Book.find().sort({ reads: -1 }).limit(5).select('title reads coverUrl').populate('author','name');
  res.json({
    totals: { books, authors, users, reviews },
    topBooks
  });
});

export default router;
