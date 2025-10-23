import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { protect, requireRole } from '../middleware/auth.js';
import Quiz from '../models/Quiz.js';
import Book from '../models/Book.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Get quiz for a book
router.get('/book/:bookId', async (req, res) => {
  const quiz = await Quiz.findOne({ book: req.params.bookId });
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  // Do not reveal correct answers
  const safe = {
    _id: quiz._id,
    book: quiz.book,
    questions: quiz.questions.map(q => ({ q: q.q, options: q.options, points: q.points }))
  };
  res.json({ quiz: safe });
});

// Admin create/update quiz for a book
router.post(
  '/',
  protect,
  requireRole('admin'),
  [
    body('bookId').notEmpty(),
    body('questions').isArray({ min: 1 })
  ],
  validate,
  async (req, res) => {
    const { bookId, questions } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(400).json({ message: 'Invalid book' });
    const doc = await Quiz.findOneAndUpdate(
      { book: bookId },
      { book: bookId, questions },
      { new: true, upsert: true }
    );
    res.status(201).json({ quiz: doc });
  }
);

// Submit quiz answers and compute score
router.post(
  '/submit',
  protect,
  [body('bookId').notEmpty(), body('answers').isArray()],
  validate,
  async (req, res) => {
    const { bookId, answers } = req.body;
    const quiz = await Quiz.findOne({ book: bookId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    let score = 0;
    const total = quiz.questions.reduce((s,q)=>s+(q.points||10),0);
    
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.answerIndex) score += q.points || 10;
    });
    
    // Award points based on quiz performance (bonus points for completing quiz)
    const User = (await import('../models/User.js')).default;
    const bonusPoints = Math.round((score / total) * 30); // Up to 30 bonus points for perfect score
    
    await User.updateOne(
      { _id: req.user._id },
      { $inc: { 'rewards.points': bonusPoints } }
    );
    
    // Update level if needed
    const user = await User.findById(req.user._id).select('rewards');
    const newLevel = Math.max(1, Math.floor((user.rewards.points || 0) / 100) + 1);
    if (user.rewards.level !== newLevel) {
      user.rewards.level = newLevel;
      await user.save();
    }
    
    res.json({ score, total, bonusPoints, message: `Great job! You earned ${bonusPoints} bonus points!` });
  }
);

export default router;
