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


// Upload ảnh lên Cloudinary
export const uploadImage = async (image: File) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "my_unsigned_preset"); // Thay bằng preset của bạn

  try {
    // Gửi ảnh lên Cloudinary
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dnma6wea8/image/upload", // Thay bằng cloud name của bạn
      formData
    );

    console.log("Cloudinary upload result:", res.data);

    // Lấy thông tin ảnh từ Cloudinary
    const publicId = res.data.public_id;
    
    // Gửi thông tin ảnh lên backend để lưu vào cơ sở dữ liệu
    await axios.post("http://localhost:8080/save-image", { publicId });

    // Trả về kết quả upload
    return { publicId };
  } catch (err) {
    console.error("Upload error:", err);
    throw new Error("Failed to upload image");
  }
};

// Xóa ảnh
export const deleteImage = (fileName: string) => {
  return ApiClient.post('/api/delete-image', { fileName });
};
