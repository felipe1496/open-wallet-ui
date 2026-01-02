import axios from 'axios';
import { env } from '../utils/functions';

export const client = axios.create({
  baseURL: env().API_URL,
});

client.defaults.headers.post['Content-Type'] = 'application/json';

client.interceptors.request.use((config) => {
  const access_token = localStorage.getItem('access_token');

  if (access_token) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
  }

  return config;
});
