import {ApiClient} from './apiClient.ts';

export const getAllUsersForAdmin = () => {
  return ApiClient.get('/api/Admin/getAllUsers'); // Gửi yêu cầu GET đến API
};

export const editAccountForAdmin = (accountData: any) => {
  return ApiClient.put('/api/Admin/editAccount', accountData); // Gửi dữ liệu form đến API
};