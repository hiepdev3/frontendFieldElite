import {ApiClient} from './apiClient.ts';
import axios from 'axios';
import React, { useState } from "react";

// Lấy tất cả field theo userId
export const getAllFieldByUserId = (userId: string) => {
  return ApiClient.post('/api/Field/getallfieldbyUserid', {
     UserId: ""+userId  // Đặt userId trong đối tượng request
  });
};




// Các hàm xử lý khác cho Field sẽ thêm ở đây sau này

export const addField = (fieldData: any) => {
  return ApiClient.post('/api/Field/addfield', fieldData);
};


// 📦 Hàm upload ảnh lên Cloudinary (unsigned)
export const uploadImageToCloudinary = async (
  file: File,
  uploadPreset: string = 'my_unsigned_preset', // Cho phép truyền upload_preset từ bên ngoài
  folder: string = 'user_uploads' // Cho phép truyền folder từ bên ngoài
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset); // Sử dụng upload_preset từ tham số
    formData.append('folder', folder); // Sử dụng folder từ tham số

    const response = await axios.post('https://api.cloudinary.com/v1_1/dnma6wea8/image/upload', formData);
    return response.data.secure_url; // ✅ Trả về link ảnh
  } catch (error: any) {
    console.error('Upload to Cloudinary failed:', error.response?.data || error.message);
    throw new Error('Không thể upload ảnh. Vui lòng thử lại.');
  }
};

