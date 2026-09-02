import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/aham_ecommerce';

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoURI}. Error: ${error.message}`);
    console.warn('[MongoDB Warning] Falling back to in-memory cart store for local testing.');
  }
};
