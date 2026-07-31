import express from 'express';
import { uploadSong, getSongs, getSongById, recordPlay } from '../controllers/song.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, upload.fields([{ name: 'audio' }, { name: 'image' }]), uploadSong);
router.get('/', getSongs);
router.get('/:id', getSongById);
router.post('/:id/play', recordPlay);

export default router;
