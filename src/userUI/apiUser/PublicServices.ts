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