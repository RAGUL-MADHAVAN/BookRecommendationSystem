import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
  approved: { type: Boolean, default: true } // simple flow; admin can toggle later
}, { timestamps: true });

export default mongoose.model('Review', ReviewSchema);
