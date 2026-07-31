import axiosClient from './axiosClient';

export const playlistApi = {
  create: (title, coverImage) => {
    return axiosClient.post('/playlists', { title, coverImage });
  },
  
  getUserPlaylists: () => {
    return axiosClient.get('/playlists');
  },
  
  getById: (id) => {
    return axiosClient.get(`/playlists/${id}`);
  },
  
  addSong: (playlistId, songId) => {
    return axiosClient.post('/playlists/add-song', { playlistId, songId });
  }
};
