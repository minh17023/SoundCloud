import axiosClient from './axiosClient';

export const songApi = {
  getAll: () => {
    return axiosClient.get('/songs');
  },
  
  getById: async (id) => {
    const response = await axiosClient.get(`/songs/${id}`);
    return response.data;
  },

  recordPlay: async (id) => {
    const response = await axiosClient.post(`/songs/${id}/play`);
    return response.data;
  },
  
  upload: (formData) => {
    return axiosClient.post('/songs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
