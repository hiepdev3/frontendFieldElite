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


export const addListCart = (userId: number, carts: {
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
}[]) => {
  return ApiClient.post(`/api/Customer/addListCart?userId=${userId}`, { carts });
};


export const addTheCart = (userId: string, cart: { 
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
  // Định dạng payload
  const payload = {
    id: cart.id,
    name: cart.name,
    location: cart.location,
    rating: cart.rating,
    features: cart.features,
    availability: cart.availability,
    timeSlots: cart.timeSlots,
    pricePerHour: cart.pricePerHour,
    image: cart.image,
    date: cart.date,
    duration: cart.duration,
  };

  // Gửi payload trực tiếp
  return ApiClient.post(`/api/Customer/addTheCart?userId=${userId}`, payload);
};

export const getListCart = (userId: number) => {
   return ApiClient.get(`/api/Customer/viewAllCart?userId=${userId}`);
};

export const getCartCount = (userId: number) => {
  return ApiClient.get(`/api/Customer/countCartCount?userId=${userId}`);
};

export const sendVerificationCode = (email: string) => {
  return ApiClient.post(`/api/Auth/send-verification-code?email=${encodeURIComponent(email)}`);
};

export const verifyCode = (email: string, code: string) => {
  return ApiClient.post(`/api/Auth/verify-code?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
};

export const registerSimple = (payload: { 
  fullName: string; 
  email: string; 
  password: string; 
  roleId: number; 
  phoneNumber: string; 
}) => {
  return ApiClient.post('/api/Auth/register-simple', payload);
};


export const changeListCartStatus = (userId: number) => {
  return ApiClient.put(`/api/Customer/changeListCartStatus?userId=${userId}`);
};

export const checkAvailability = (payload: {
  userId: number;
  fieldId: number;
  date: string;
  timeSlot: string;
  duration: number;
}) => {
  return ApiClient.post('/api/Customer/check-availability-Cart', payload);
};

export const removeCart = (userId: number, fieldId: number) => {
  return ApiClient.delete(`/api/Customer/removeCart?userId=${userId}&fieldId=${fieldId}`);
};


export const addListPayment = (payload: {
  userId: number;
  voucherCode: string;
  fieldId: number;
  discountAmount: number;
  finalPrice: number;
  paidAt: string;
  paymentMethod: string;
  status: number;
  bookingDate: string;
  timeEnd: string;
  paymentCode: string;
  totalFinalAmount: number;
}[]) => {
  return ApiClient.post('/api/Payment/addMultiPayment', payload);
};


export const getPaymentSummary = (paymentCode: string, userId: number) => {
  return ApiClient.get(`/api/Payment/payment-summary?paymentCode=${paymentCode}&userId=${userId}`);
};

export const getAccountDetail = (accessToken: string) => {
  return ApiClient.get('/api/Auth/viewaccountdetail', {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Thêm accessToken vào header
      Accept: '*/*',
    },
  });
};

export const changeProfile = (payload: {
      userId: number;
      fullName: string;
      phoneNumber: string;
    }) => {
    return ApiClient.post('/api/Auth/changeProfile', payload, {
    });
};


export const changePassword = (payload: {
    userId: number;
    oldPassword: string;
    newPassword: string;
  }) => {
    return ApiClient.post('/api/Auth/changePassword', payload, {
    });
};


export const changeBookingStatus = (payload: {
  id: string;
  fieldId: string;
  status: string;
  paymentCode: string;
  statusAfter: string;
  userId: number;
}) => {
  return ApiClient.post('/api/Customer/changeStatusPayment', payload, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
};