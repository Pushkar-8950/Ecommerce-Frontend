import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongoServerInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/metraverify';

  try {
    // 1. Try connecting to specified / local MongoDB
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`[Database] Local MongoDB instance not reachable (${error.message}).`);
    console.log(`[Database] Starting embedded MongoDB engine with persistent storage...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const dbPath = path.resolve(__dirname, '../data/db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongoServerInstance = await MongoMemoryServer.create({
        instance: { dbPath },
      });

      const embeddedUri = mongoServerInstance.getUri();
      const conn = await mongoose.connect(embeddedUri);
      console.log(`[Database] Embedded MongoDB connected successfully: ${conn.connection.host}`);
    } catch (embeddedError) {
      console.error(`[Database Error] Failed to initialize embedded MongoDB: ${embeddedError.message}`);
      process.exit(1);
    }
  }

  // Auto-seed if database is empty
  try {
    const User = (await import('../models/User.js')).default;
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database] Database is empty. Running automatic initial seed...');
      const { seedDatabase } = await import('../seed/seedData.js');
      await seedDatabase(false);
    }
  } catch (seedErr) {
    console.warn('[Database] Auto-seed check warning:', seedErr.message);
  }
};

const shutdown = async () => {
  if (mongoServerInstance) {
    console.log('[Database] Stopping embedded MongoDB engine...');
    await mongoServerInstance.stop();
  }
};

process.on('SIGINT', async () => {
  await shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdown();
  process.exit(0);
});
