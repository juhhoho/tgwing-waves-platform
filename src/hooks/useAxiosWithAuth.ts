
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAxiosWithAuth = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
        
        if (error.response?.status === 401 && originalRequest && !originalRequest.headers._retry) {
          originalRequest.headers._retry = true;
          
          try {
            // 토큰 재발급 시도
            const response = await axios.post(
              `${baseURL}/api/auth/reissue`,
              {},
              {
                withCredentials: true,
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                  'Refresh-Token': localStorage.getItem('refreshToken')
                }
              }
            );
            
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;
            
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // 원래 요청 재시도
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return axios(originalRequest);
          } catch (refreshError) {
            // 재발급 실패시 로그인 페이지로 리다이렉트
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
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
  }, [navigate, baseURL]);

  return axiosInstance;
};
