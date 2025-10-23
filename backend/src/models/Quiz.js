import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  q: { type: String, required: true },
  options: [{ type: String, required: true }],
  answerIndex: { type: Number, required: true },
  points: { type: Number, default: 10 }
}, { _id: false });

const QuizSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, unique: true },
  questions: { type: [QuestionSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Quiz', QuizSchema);
