import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Author from '../models/Author.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Public list & read
router.get('/', async (req, res) => {
  const q = req.query.q?.trim();
  const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
  const authors = await Author.find(filter).sort({ name: 1 });
  res.json({ authors });
});

router.get('/:id', async (req, res) => {
  const Book = (await import('../models/Book.js')).default;
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json({ message: 'Author not found' });
  
  // Get books by this author
  const books = await Book.find({ author: req.params.id }).populate('author', 'name');
  
  res.json({ author, books });
});

// Admin create/update/delete
router.post(
  '/',
  protect,
  requireRole('admin'),
  [body('name').trim().notEmpty().withMessage('Name required')],
  validate,
  async (req, res) => {
    const { name, bio = '', avatarUrl = '' } = req.body;
    const created = await Author.create({ name, bio, avatarUrl });
    res.status(201).json({ author: created });
  }
);

router.put(
  '/:id',
  protect,
  requireRole('admin'),
  [body('name').optional().trim().notEmpty()],
  validate,
  async (req, res) => {
    const updated = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Author not found' });
    res.json({ author: updated });
  }
);

router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  const deleted = await Author.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Author not found' });
  res.json({ ok: true });
});

// Follow / Unfollow author
router.post('/:id/follow', protect, async (req, res) => {
  const { id } = req.params;
  const author = await Author.findByIdAndUpdate(
    id,
    { $addToSet: { followers: req.user._id } },
    { new: true }
  );
  if (!author) return res.status(404).json({ message: 'Author not found' });
  res.json({ author });
});

router.post('/:id/unfollow', protect, async (req, res) => {
  const { id } = req.params;
  const author = await Author.findByIdAndUpdate(
    id,
    { $pull: { followers: req.user._id } },
    { new: true }
  );
  if (!author) return res.status(404).json({ message: 'Author not found' });
  res.json({ author });
});

export default router;
