import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { env } from '@/core/config/env';
import { getStoredToken } from '@/core/auth/auth.context';

export const axiosInstance = axios.create({
  baseURL: env.apiUrl,
});

// Adjunta el JWT almacenado en localStorage en cada request autenticado.
axiosInstance.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.request<T>(config).then((response) => response.data);
};
