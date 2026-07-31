import axiosClient from './axiosClient';

export const songApi = {
  getAll: () => {
    return axiosClient.get('/songs');
  },
  
  getById: (id) => {
    return axiosClient.get(`/songs/${id}`);
  },
  
  upload: (formData) => {
    return axiosClient.post('/songs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
