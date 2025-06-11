import axios from "axios";

const axiosInstance = axios.create({
  baseURL: (import.meta as any).env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupInterceptors = (logout: () => void) => {
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
