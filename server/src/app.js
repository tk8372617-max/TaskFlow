import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeTaskRouter } from './presentation/taskRoutes.js';

export function createApp(TaskModel) {
  const app = express();
  app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }));
  app.use(express.json());
  app.get('/api/health', (_req, res) => res.json({ success: true, message: 'TaskFlow API is running.' }));
  app.use('/api/tasks', makeTaskRouter(TaskModel));
  const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => req.path.startsWith('/api/') ? next() : res.sendFile(path.join(clientDist, 'index.html'), err => err && next()));
  app.use((err, _req, res, _next) => {
    const status = err.status || (err.name === 'CastError' ? 400 : 500);
    res.status(status).json({ success: false, message: err.message || 'Server error.', errors: err.details || undefined });
  });
  return app;
}
