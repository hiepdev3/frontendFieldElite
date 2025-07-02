'use client';
import { useGoogleFont } from '../fonts/fonts'
import React from "react"
import { useNavigate} from 'react-router-dom';
import {  message } from 'antd';



export default function FieldCardUser({
  field,
}: {
  field: {
    id: string;
    name: string;
    location: string;
    rating: number;s
    pricePerHour: number;
    image: string;
    features?: string[];
  };
}) {
  const interFont = useGoogleFont('Inter');
  const playfairFont = useGoogleFont('Playfair Display');
  const navigate = useNavigate();

  const handleBookNow = () => {
    const accessToken = sessionStorage.getItem('accessToken'); // Kiểm tra token đăng nhập
    if (!accessToken) {
      sessionStorage.setItem('quickBook', 'true'); // Lưu trạng thái Quick Book
      message.warning('You need to log in to proceed!');
      navigate('/login'); // Điều hướng đến trang đăng nhập
    } else {
      message.success('You are logged in! Proceed with booking.');
      // Logic đặt sân hoặc điều hướng đến trang giỏ hàng nếu cần
      navigate('/cart-user'); // Điều hướng đến trang giỏ hàng
    }
  };
  
 
  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 group"
      style={{ fontFamily: interFont }}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={field.image}
          alt={field.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center space-x-1">
            {field.features &&
              field.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-xs px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            {field.features && field.features.length > 3 && (
              <span className="bg-white/20 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                +{field.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: playfairFont }}
        >
          {field.name}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {field.location}
        </div>
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(field.rating) ? 'text-yellow-400' : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-600">
            {field.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600">
               {new Intl.NumberFormat('vi-VN').format(field.pricePerHour)} Đ
            </span>
            <span className="text-sm font-normal text-gray-500">/Giờ</span>
          </div>
          <button
            onClick={handleBookNow}
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer flex items-center shadow-sm hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
             Đặt Sân Ngay
          </button>
        </div>
      </div>
    </div>
  );
}