import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { env } from '@/core/config/env';

export const axiosInstance = axios.create({
  baseURL: env.apiUrl,
});

// El backend gestiona la sesión via HttpOnly Cookie.
// withCredentials adjunta la cookie automáticamente en llamadas cross-origin.
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use((config) => config);

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
