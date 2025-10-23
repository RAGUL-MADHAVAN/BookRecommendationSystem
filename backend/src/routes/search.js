import { Router } from 'express';
import Book from '../models/Book.js';
import Author from '../models/Author.js';

const router = Router();

router.get('/', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.json({ books: [], authors: [] });
  
  // Search by title, author name, or genre
  const [books, authors] = await Promise.all([
    Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).limit(12).select('title coverUrl author genre rating reads isTrending description').populate('author','name'),
    Author.find({ name: { $regex: q, $options: 'i' } }).limit(8).select('name')
  ]);
  res.json({ books, authors });
});

export default router;
