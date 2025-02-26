
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


export const useAxiosWithAuth = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const interceptorRegistered = useRef(false); // ✅ 중복 방지용 ref


  // ✅ useRef로 axios 인스턴스 생성 & 유지
  const axiosInstanceRef = useRef<AxiosInstance>(
    axios.create({
      baseURL,
      timeout: 5000,
    })
  );

  function getCookie(name: string): string | null {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  const axiosInstance = axiosInstanceRef.current; // 🔥 useRef로 감싸진 axiosInstance 가져오기

  useEffect(() => {
    console.log("🟢 useEffect 실행됨");

    if (interceptorRegistered.current) return; // ✅ 이미 등록된 경우 다시 실행 안 함
    interceptorRegistered.current = true;

    // request 인터셉터
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {

        const accessToken = localStorage.getItem("accessToken");
        console.log("🟢refresh: ", getCookie("refresh"));

        if (accessToken) {
          config.headers.access = accessToken;
          config.headers.ccc = "asdasd";
          console.log("🟢access: ", accessToken);
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
            console.log("🔄 토큰 재발급 시도...");
            const response = await axios.post(`${baseURL}/api/reissue`,
              {},
              {
                withCredentials: true,
                headers: {
                  access: localStorage.getItem("accessToken"),
                },
              }
            );

            console.log("✅ 토큰 재발급 성공");
            const newAccessToken = response.headers["access"];
            console.log("재발급된 access: " + newAccessToken);
            console.log("재발급된 refresh: " + getCookie("refresh"));

            localStorage.setItem("accessToken", newAccessToken);

            if (originalRequest.headers) {
              originalRequest.headers.access = newAccessToken;
            }
            return axios(originalRequest);
          } catch (refreshError) {
            console.log("❌ 토큰 재발급 실패");
            localStorage.removeItem("accessToken");
            navigate("/login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      console.log("🟡 useEffect cleanup 실행됨");
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, baseURL, axiosInstance]);

  return axiosInstance;
};