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
   baseURL: 'https://backend-sohu-production.up.railway.app', // URL gốc của backend
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
          'https://backend-sohu-production.up.railway.app/refresh',
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





// import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// import { AccessTokenResponse } from '../types/AccessTokenResponse.ts';

// const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
//   const token = localStorage.getItem('accessToken');
//   if (token)
//     config.headers.Authorization = `Bearer ${token}`;

//   return config;
// };


// export const ApiClient = axios.create({
//   baseURL: import.meta.env.VITE_ROOT_URL,
//   //withCredentials: true,
//    headers: {
//     'Content-Type': 'application/json',
//   },
// });

// ApiClient.interceptors.request.use(authRequestInterceptor);

// const RoutesShouldNotRefresh = ['api/accounts/login'];

// ApiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
// ApiClient.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     const originalUrl = originalRequest.url;

//     if (RoutesShouldNotRefresh.includes(originalUrl)) {
//       return Promise.reject(error?.response?.data);
//     }

//     if (error.response?.status === 401) {
//       // Very important to return a promise, otherwise react-query get error before this interceptor finished
//       return new Promise((resolve, reject) => {
//         axios<never, AxiosResponse<AccessTokenResponse>>({
//           method: 'POST',
//           url: `${import.meta.env.VITE_ROOT_URL}api/accounts/refresh`,
//           withCredentials: true,
//           headers: {
//             Accept: 'application/json',
//           },
//           data: {
//             refreshToken: localStorage.getItem('refreshToken'),
//           },
//         })
//           .then((response) => {

//             // Making client SPA safe is out of scope for this project.
//             // So, just throw these into local storage.

//             localStorage.setItem('accessToken', response.data.accessToken);
//             localStorage.setItem('refreshToken', response.data.refreshToken);
//             originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

//             ApiClient(originalRequest)
//               .then((response) => {
//                 resolve(response);
//               })
//               .catch((error) => {
//                 reject(error?.response?.data);
//               });
//           })
//           .catch((error) => {
//             reject(error?.response?.data);
//           });
//       });
//     } else {
//       return Promise.reject(error?.response?.data);
//     }
//   },
// );