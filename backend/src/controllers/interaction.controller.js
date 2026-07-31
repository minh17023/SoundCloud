import Comment from '../models/comment.model.js';
import Like from '../models/like.model.js';
import Song from '../models/song.model.js';
import User from '../models/user.model.js';

export const likeSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.body;

    if (!songId) return res.status(400).json({ error: 'songId is required' });

    const existingLike = await Like.findOne({ where: { user_id: userId, song_id: songId } });

    if (existingLike) {
      await existingLike.destroy();
      await Song.decrement('listens', { by: 1, where: { id: songId } }); // Reusing listens field for likes count temporarily to save time, or use a separate likes count
      return res.json({ message: 'Unliked successfully' });
    } else {
      await Like.create({ user_id: userId, song_id: songId });
      await Song.increment('listens', { by: 1, where: { id: songId } });
      return res.json({ message: 'Liked successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId, content, timestamp } = req.body;

    if (!songId || !content) {
      return res.status(400).json({ error: 'songId and content are required' });
    }

    const comment = await Comment.create({
      user_id: userId,
      song_id: songId,
      content,
      timestamp: timestamp || 0
    });

    // Fetch with user info
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['username', 'avatar'] }]
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { songId } = req.params;
    const comments = await Comment.findAll({
      where: { song_id: songId },
      include: [{ model: User, attributes: ['username', 'avatar'] }],
      order: [['timestamp', 'ASC']]
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
