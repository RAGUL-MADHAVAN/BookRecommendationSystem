import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Get current user's progress list
router.get('/', protect, async (req, res) => {
  const list = await Progress.find({ user: req.user._id }).populate('book');
  res.json({ progress: list });
});

// Update progress percentage; mark complete if >=100
router.post(
  '/',
  protect,
  [body('bookId').notEmpty(), body('percentage').isFloat({ min: 0, max: 100 })],
  validate,
  async (req, res) => {
    const { bookId, percentage } = req.body;
    const updates = { percentage };
    if (percentage >= 100) {
      updates.completedAt = new Date();
      // add to completed and remove from reading
      await User.updateOne(
        { _id: req.user._id },
        { $addToSet: { completed: bookId }, $pull: { reading: bookId }, $inc: { 'rewards.points': 20 } }
      );
    } else {
      await User.updateOne(
        { _id: req.user._id },
        { $addToSet: { reading: bookId } }
      );
    }
    const doc = await Progress.findOneAndUpdate(
      { user: req.user._id, book: bookId },
      { user: req.user._id, book: bookId, ...updates },
      { upsert: true, new: true }
    );

    // Level up simple rule: +1 level every 100 points
    const fresh = await User.findById(req.user._id).select('rewards');
    const newLevel = Math.max(1, Math.floor((fresh.rewards.points || 0) / 100) + 1);
    if (fresh.rewards.level !== newLevel) {
      fresh.rewards.level = newLevel;
      await fresh.save();
    }

    res.json({ progress: doc });
  }
);

export default router;
