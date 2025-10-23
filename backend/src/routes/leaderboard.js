import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Public leaderboard: top users by points (then level, then recent)
router.get('/', async (_req, res) => {
  const users = await User.find({}, { name: 1, 'rewards.points': 1, 'rewards.level': 1 })
    .sort({ 'rewards.points': -1, 'rewards.level': -1, updatedAt: -1 })
    .limit(10);
  res.json({ users });
});

export default router;
