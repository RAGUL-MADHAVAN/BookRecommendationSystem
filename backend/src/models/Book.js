import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  genre: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  coverUrl: { type: String, required: true },
  contentUrl: { type: String, default: '' },
  reads: { type: Number, default: 0 },
  isTrending: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Book', BookSchema);
