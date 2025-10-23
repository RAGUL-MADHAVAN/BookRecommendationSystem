import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Book from '../models/Book.js';
import Author from '../models/Author.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Public list with filters: q (title), genre, authorId, sort (rating|reads|createdAt), order (asc|desc)
router.get('/', async (req, res) => {
  const { q, genre, authorId, sort = 'createdAt', order = 'desc' } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (genre) filter.genre = genre;
  if (authorId) filter.author = authorId;
  const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
  const books = await Book.find(filter).populate('author').sort(sortObj).limit(100);
  res.json({ books });
});

router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id).populate('author');
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json({ book });
});

// Admin create/update/delete
router.post(
  '/',
  protect,
  requireRole('admin'),
  [
    body('title').trim().notEmpty(),
    body('authorId').notEmpty(),
    body('genre').trim().notEmpty(),
    body('coverUrl').trim().notEmpty(),
    body('description').optional().isString(),
    body('contentUrl').optional().isString(),
  ],
  validate,
  async (req, res) => {
    const { title, authorId, genre, description = '', coverUrl, contentUrl = '' } = req.body;
    const author = await Author.findById(authorId);
    if (!author) return res.status(400).json({ message: 'Invalid author' });
    const created = await Book.create({ title, author: authorId, genre, description, coverUrl, contentUrl });
    res.status(201).json({ book: await created.populate('author') });
  }
);

router.put(
  '/:id',
  protect,
  requireRole('admin'),
  [body('title').optional().trim().notEmpty()],
  validate,
  async (req, res) => {
    const updates = { ...req.body };
    if (updates.authorId) {
      const a = await Author.findById(updates.authorId);
      if (!a) return res.status(400).json({ message: 'Invalid author' });
      updates.author = updates.authorId;
      delete updates.authorId;
    }
    const updated = await Book.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('author');
    if (!updated) return res.status(404).json({ message: 'Book not found' });
    res.json({ book: updated });
  }
);

router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  const deleted = await Book.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Book not found' });
  res.json({ ok: true });
});

export default router;
