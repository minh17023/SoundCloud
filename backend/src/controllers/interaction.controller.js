import * as interactionService from '../services/interaction.service.js';

export const likeSong = async (req, res) => {
  try {
    const result = await interactionService.toggleLike(req.user.id, req.body.songId);
    res.json({ message: result.action === 'liked' ? 'Liked successfully' : 'Unliked successfully' });
  } catch (error) {
    res.status(error.message === 'songId is required' ? 400 : 500).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { songId, content, timestamp } = req.body;
    const comment = await interactionService.createComment(req.user.id, songId, content, timestamp);
    res.status(201).json(comment);
  } catch (error) {
    res.status(error.message.includes('required') ? 400 : 500).json({ error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await interactionService.getCommentsBySongId(req.params.songId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
