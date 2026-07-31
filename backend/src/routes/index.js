import express from 'express';
import songRoutes from './song.routes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SoundCloud clone backend is running.' });
});

// API Routes
router.use('/songs', songRoutes);

export default router;
