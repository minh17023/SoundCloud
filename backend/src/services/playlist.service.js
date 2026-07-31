import { Playlist, PlaylistSong } from '../models/playlist.model.js';
import Song from '../models/song.model.js';
import User from '../models/user.model.js';

export const createPlaylist = async (userId, title, coverImage) => {
  if (!title) throw new Error('Title is required');
  
  return await Playlist.create({
    user_id: userId,
    title,
    cover_image: coverImage || null,
  });
};

export const getUserPlaylists = async (userId) => {
  return await Playlist.findAll({
    where: { user_id: userId },
    include: [{ model: Song, attributes: ['id'] }], // Include songs to get count
    order: [['createdAt', 'DESC']]
  });
};

export const getPlaylistById = async (playlistId) => {
  return await Playlist.findByPk(playlistId, {
    include: [
      { model: User, attributes: ['id', 'username'] },
      { 
        model: Song, 
        include: [{ association: 'uploader', attributes: ['id', 'username'] }] 
      }
    ]
  });
};

export const addSongToPlaylist = async (playlistId, songId, userId) => {
  const playlist = await Playlist.findByPk(playlistId);
  if (!playlist) throw new Error('Playlist not found');
  if (playlist.user_id !== userId) throw new Error('Unauthorized'); // Only owner can add

  const song = await Song.findByPk(songId);
  if (!song) throw new Error('Song not found');

  // Check if song already exists in playlist
  const existingEntry = await PlaylistSong.findOne({
    where: { playlist_id: playlistId, song_id: songId }
  });

  if (existingEntry) {
    throw new Error('Song already in playlist');
  }

  await PlaylistSong.create({
    playlist_id: playlistId,
    song_id: songId
  });

  return { message: 'Song added to playlist' };
};
