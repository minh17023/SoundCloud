import * as playlistService from '../services/playlist.service.js';

export const createPlaylist = async (req, res) => {
  try {
    const { title, coverImage } = req.body;
    const playlist = await playlistService.createPlaylist(req.user.id, title, coverImage);
    res.status(201).json(playlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await playlistService.getUserPlaylists(req.user.id);
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await playlistService.getPlaylistById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addSong = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const result = await playlistService.addSongToPlaylist(playlistId, songId, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
