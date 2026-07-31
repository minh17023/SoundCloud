import * as songService from '../services/song.service.js';

export const uploadSong = async (req, res) => {
  try {
    const audioFile = req.files?.['audio']?.[0];
    const imageFile = req.files?.['image']?.[0];
    const { title, artist, genre } = req.body;
    const userId = req.user?.id || null; // From verifyToken middleware
    
    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const newSong = await songService.uploadSong(audioFile, imageFile, title, artist, genre, userId);
    res.status(201).json({ message: 'Song uploaded successfully', song: newSong });

  } catch (err) {
    console.error('Controller Error during upload:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const getSongs = async (req, res) => {
  try {
    const songs = await songService.getSongs();
    res.json(songs);
  } catch (err) {
    console.error('Controller Error during fetch:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSongById = async (req, res) => {
  try {
    const song = await songService.getSongById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    console.error('Controller Error fetching song details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
