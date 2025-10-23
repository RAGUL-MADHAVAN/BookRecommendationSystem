import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  percentage: { type: Number, default: 0 },
  completedAt: { type: Date, default: null }
}, { timestamps: true, indexes: [{ user: 1, book: 1, unique: true }] });

export default mongoose.model('Progress', ProgressSchema);
