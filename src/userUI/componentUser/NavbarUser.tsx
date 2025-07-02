'use client';
import { useGoogleFont } from '../fonts/fonts';

import React, { useEffect, useState } from "react";
import { Button  } from "antd";
import { useNavigate } from 'react-router-dom';
import {initializeCartCount} from '../../utils/cartUtils'; // Giả sử bạn có một hàm để khởi tạo cartCount


export default function NavbarUser({ cartItemCount = 0 }: { cartItemCount?: number }) {
  const navigate = useNavigate(); // Chuyển ra ngoài phần tham số
  const interFont = useGoogleFont('Inter');
  const playfairFont = useGoogleFont('Playfair Display');
  const [currentUser, setCurrentUser] = useState(null);

  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
        // Lấy thông tin currentUser từ sessionStorage
         const storedUser = sessionStorage.getItem("user");
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
       // Lấy giá trị cartCount từ localStorage khi component được mount
      initializeCartCount(setCartCount);
     // Lắng nghe sự kiện storage để cập nhật cartCount khi localStorage thay đổi
      const handleStorageChange = (event: StorageEvent) => {
       
        if (event.key == 'cartCount') {
          const updatedCartCount = event.newValue;
          if (updatedCartCount) {
            setCartCount(parseInt(updatedCartCount, 10));
          }
        }
      };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);



  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100" style={{ fontFamily: interFont }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <a href="/user-home" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-auto text-green-600 font-bold text-2xl flex items-center" style={{ fontFamily: playfairFont }}>
             
                 
                <img src="../z6685029163397_73ce9ea0bbae8003020504cb48876513.jpg"
                    alt="Logo"
                    className="h-8 w-8 mr-2" // Kích thước và khoảng cách
                />
                SoHu
              </div>
            </a>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="/user-home" className="inline-flex items-center px-1 pt-1 border-b-2 border-green-500 text-sm font-medium text-gray-900">
                Trang Chủ
              </a>
              <a href="/fields-user" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer transition-colors duration-200">
               Sân 

              </a>
              <a href="/promotions-user" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer transition-colors duration-200">
               Khuyến Mãi
              </a>
              {/* {currentUser && (
                <a href="/Match-Manage" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer transition-colors duration-200">
                  Tìm Đối
                </a>
              )} */}
              {/* <a href="/account-user" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer transition-colors duration-200">
                Account
              </a> */}
            </div>
          </div>
          <div className="flex items-center">
            <a href="/cart-user" className="ml-4 flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 cursor-pointer relative transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </a>

            {!currentUser && (
              <Button type="primary" className="ml-4" onClick={() => navigate('/login')}>
                Đăng Nhập
              </Button>
            )}

            {/* <a href="/index.html?screen=Account" className="ml-4 hidden md:flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a> */}

             {currentUser && (
              <a href="/account-user" className="ml-4 hidden md:flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </a>
            )}
            <div className="ml-4 md:hidden">
              <button className="bg-white p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 cursor-pointer transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      
   
    </nav>
  );
}