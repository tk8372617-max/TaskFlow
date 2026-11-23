import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import mongoose from 'mongoose';
import { createApp } from './app.js';

// Always load server/.env, regardless of the terminal's current directory.
const currentDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDir, '../.env') });

const PORT = process.env.PORT || 5000;
const app = createApp();
const mongoUri = process.env.MONGODB_URI?.trim();

if (!mongoUri) {
  console.error('\nMissing MONGODB_URI. Create server/.env and add:');
  console.error('MONGODB_URI=mongodb://127.0.0.1:27017/taskflow\n');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`TaskFlow API running on port ${PORT}`));
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
