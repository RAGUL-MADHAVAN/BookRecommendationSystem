import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Review from '../models/Review.js';
import Book from '../models/Book.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Get reviews for a book (approved only for public)
router.get('/book/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const reviews = await Review.find({ book: bookId, approved: true }).populate('user', 'name');
  res.json({ reviews });
});

// Create review (user)
router.post(
  '/',
  protect,
  [
    body('bookId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isString(),
  ],
  validate,
  async (req, res) => {
    const { bookId, rating, comment = '' } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(400).json({ message: 'Invalid book' });
    const review = await Review.create({ book: bookId, user: req.user._id, rating, comment });
    res.status(201).json({ review });
  }
);

// Admin: approve or reject review
router.patch('/:id/approve', protect, requireRole('admin'), async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ review });
});

router.patch('/:id/reject', protect, requireRole('admin'), async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { approved: false }, { new: true });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ review });
});

export default router;
