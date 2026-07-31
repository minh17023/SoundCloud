import express from 'express';
import { createPlaylist, getUserPlaylists, getPlaylistById, addSong } from '../controllers/playlist.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All playlist routes require authentication except getting details maybe? 
// For simplicity, let's say anyone can get playlist details, but creating/adding needs auth.
router.get('/:id', getPlaylistById);

router.use(verifyToken);
router.post('/', createPlaylist);
router.get('/', getUserPlaylists); // Gets my playlists
router.post('/add-song', addSong);

export default router;
