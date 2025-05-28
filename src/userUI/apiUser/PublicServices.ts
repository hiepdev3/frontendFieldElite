import {ApiClient} from '../../api/apiClient.ts';
import React, { useState } from "react";


export const getlistFieldForUser = () => {
   return ApiClient.post('/api/Public/listFieldForUser', {  });
};

export const getAllFieldForUser = () => {
   return ApiClient.post('/api/Public/listAllFieldForUser', {  });
};


export const loginAll = (email: string, password: string) => {
   return ApiClient.post('/api/Auth/login', {
      email: email, 
      password,
   });
};


export const getMe = async() => {
   const response = await ApiClient.get('/api/Auth/me');
   return response;
};

export const getAvailableFields = (
   payload: { date: string; startTime: string; duration: number }) => {
  return ApiClient.post('/api/Public/available-fields', payload);
};

export const loginWithGoogle = (accessToken: string) => {
   return ApiClient.post('/api/Public/login-google', {
      accessToken: accessToken,
   });
};
export const addListCart = (payload: { 
  userId: number; 
  carts: { 
    fieldId: number; 
    bookingDate: string; 
    timeEnd: string; 
    status: number; 
  }[] 
}) => {
  return ApiClient.post('/api/Customer/addListCart', payload);
};


export const addTheCart = (userId: number, cart: { 
      id: string; 
      name: string; 
      location: string; 
      rating: number; 
      features: string[]; 
      availability: string; 
      timeSlots: string; 
      pricePerHour: number; 
      image: string; 
      date: string; 
      duration: number; 
      }) => {
      return ApiClient.post(`/api/Customer/addTheCart?userId=${userId}`, {
         fieldId: parseInt(cart.id), // Chuyển đổi id từ string sang number
         bookingDate: `${cart.date}T${cart.timeSlots}:00.000Z`, // Kết hợp date và timeSlots
         timeEnd: new Date(
            new Date(`${cart.date}T${cart.timeSlots}:00.000Z`).getTime() +
            cart.duration * 60 * 1000 // Tính toán thời gian kết thúc
         ).toISOString(),
         status: 0, // Đặt mặc định là 0
      });
};

export const getListCart = (userId: number) => {
   return ApiClient.get(`/api/Customer/viewAllCart?userId=${userId}`);
};