import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImage: { type: String, default: '' },
  likedGenres: [{ type: String }],
  reading: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  completed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  rewards: {
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
    level: { type: Number, default: 1 }
  }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
