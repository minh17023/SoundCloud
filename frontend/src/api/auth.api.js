import axiosClient from './axiosClient';

export const authApi = {
  login: (email, password) => {
    return axiosClient.post('/auth/login', { email, password });
  },
  
  register: (email, password, username) => {
    return axiosClient.post('/auth/register', { email, password, username });
  }
};
