import express from 'express';
import { likeSong, addComment, getComments } from '../controllers/interaction.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/like', verifyToken, likeSong);
router.post('/comment', verifyToken, addComment);
router.get('/comment/:songId', getComments);

export default router;
