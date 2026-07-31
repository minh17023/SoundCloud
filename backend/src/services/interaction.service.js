import Comment from '../models/comment.model.js';
import Like from '../models/like.model.js';
import Song from '../models/song.model.js';
import User from '../models/user.model.js';

export const toggleLike = async (userId, songId) => {
  if (!songId) throw new Error('songId is required');

  const existingLike = await Like.findOne({ where: { user_id: userId, song_id: songId } });

  if (existingLike) {
    await existingLike.destroy();
    await Song.decrement('listens', { by: 1, where: { id: songId } });
    return { action: 'unliked' };
  } else {
    await Like.create({ user_id: userId, song_id: songId });
    await Song.increment('listens', { by: 1, where: { id: songId } });
    return { action: 'liked' };
  }
};

export const createComment = async (userId, songId, content, timestamp) => {
  if (!songId || !content) {
    throw new Error('songId and content are required');
  }

  const comment = await Comment.create({
    user_id: userId,
    song_id: songId,
    content,
    timestamp: timestamp || 0
  });

  return await Comment.findByPk(comment.id, {
    include: [{ model: User, attributes: ['username', 'avatar'] }]
  });
};

export const getCommentsBySongId = async (songId) => {
  return await Comment.findAll({
    where: { song_id: songId },
    include: [{ model: User, attributes: ['username', 'avatar'] }],
    order: [['timestamp', 'ASC']]
  });
};
