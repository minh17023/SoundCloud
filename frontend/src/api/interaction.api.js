import axiosClient from './axiosClient';

export const interactionApi = {
  toggleLike: (songId) => {
    return axiosClient.post('/interactions/like', { songId });
  },
  
  addComment: (songId, content, timestamp) => {
    return axiosClient.post('/interactions/comment', { songId, content, timestamp });
  },
  
  getComments: (songId) => {
    return axiosClient.get(`/interactions/comment/${songId}`);
  }
};
