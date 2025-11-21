import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  mongoose.set('strictQuery', true);
  const dbName = uri.split('/').pop().split('?')[0];
  await mongoose.connect(uri, { dbName });
  console.log('MongoDB connected');
};
