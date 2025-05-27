import { ApiClient } from './apiClient.ts';

// Lấy tất cả voucher theo userId
export const getAllVouchersByUserId = (userId: string) => {
  return ApiClient.post('/api/Voucher/getallvoucherbyUserid', { UserId: ""+userId });
};

// Thêm voucher mớia
export const addVoucher = (voucherData: any) => {
 
  return ApiClient.post('/api/Voucher/addvoucher', voucherData);
};

export const updateVoucher = (voucherData: any) => {
  return ApiClient.put('/api/Voucher/updatevoucher', voucherData);
};