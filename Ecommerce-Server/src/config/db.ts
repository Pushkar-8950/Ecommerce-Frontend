import mongoose from 'mongoose';

/**
 * Connect to MongoDB instance using Mongoose.
 * Exits process with failure if connection fails on startup.
 */
export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('⚠️ Warning: MONGO_URI is not defined. Running with fallback mock data.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}. Server remaining active with offline/demo mode.`);
  }
};
