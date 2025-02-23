
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useEffect } from 'react';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAxiosWithAuth = () => {
  const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
  });

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest) {
          try {
            // Attempt to refresh the token
            const response = await axios.post(`${baseURL}/api/auth/reissue`, {}, {
              withCredentials: true // Needed for cookies
            });
            
            const newAccessToken = response.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);
            
            // Retry the original request with the new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosInstance;
};
