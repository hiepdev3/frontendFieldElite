import axios, { InternalAxiosRequestConfig } from 'axios';
import { AccessTokenResponse } from '../types/AccessTokenResponse.ts';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}
// Interceptor để thêm Authorization header
const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = sessionStorage.getItem('accessToken'); // Lấy accessToken từ sessionStorage
 if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Thêm Authorization header
  }
  return config;
};

// Tạo instance của axios
export const ApiClient = axios.create({
  // baseURL: import.meta.env.VITE_ROOT_URL, // URL gốc của backend
  // headers: {
  //   'Content-Type': 'application/json', // Định dạng JSON
  // },
  // baseURL: 'http://localhost:5000', // URL gốc của backend
  baseURL: 'https://backend-sohu-production.up.railway.app', // URL gốc của backend
//  baseURL: 'https://17cd-2001-ee0-40c1-5c38-4482-5ac2-fff8-b75d.ngrok-free.app', // URL gốc của backend
   headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm request interceptor để tự động thêm Authorization header
ApiClient.interceptors.request.use(authRequestInterceptor);


// Xử lý lỗi response, bao gồm làm mới token nếu cần
ApiClient.interceptors.response.use(
  (response) => {
      return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Ngăn vòng lặp vô hạn

      try {
        // Gọi API refresh token
        const refreshResponse = await axios.post(
         // 'http://localhost:5000/refresh', // Địa chỉ API làm mới token
          'https://backend-sohu-production.up.railway.app/refresh',
       //   'https://17cd-2001-ee0-40c1-5c38-4482-5ac2-fff8-b75d.ngrok-free.app/refresh',
          {
            userId: sessionStorage.getItem('userid'), // Lấy userId từ sessionStorage
            refreshToken: sessionStorage.getItem('refreshToken'), // Lấy refreshToken từ sessionStorage
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Lưu token mới vào localStorage
        sessionStorage.setItem('accessToken', refreshResponse.data.accessToken);
        sessionStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

        // Cập nhật request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;

        // Gửi lại request ban đầu
        return ApiClient(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);

        // Xóa token và chuyển hướng đến trang đăng nhập
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('userid');
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Trả về lỗi khác
    return Promise.reject(error);
  }
);



