'use client';
import { useGoogleFont } from '../fonts/fonts'
import Components from "../componentUser"
import {useNavigate} from 'react-router-dom';
import '../fonts/indexUser.css';
import React from "react"
import {useAuth} from '../../context/AuthContext.tsx';
import {useQueryClient} from 'react-query';
import { getAccountDetail,createPaymentVNpay, changeProfile , changePassword,changeBookingStatus } from '../apiUser/PublicServices.ts';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import * as signalR from '@microsoft/signalr';


export default function AccountUser() {
  const fontFamily = useGoogleFont('Inter')
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth(); // Lấy hàm logout từ AuthContext
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const userId = sessionStorage.getItem('userid');
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all'); // Mặc định là 'all'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAcceptPopup, setShowAcceptPopup] = useState<{ open: boolean, booking: any | null }>({ open: false, booking: null });
  const [acceptChecked, setAcceptChecked] = useState(false);



  const [user, setUser] = useState({
      id: '12345',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      memberSince: 'January 2022',
      preferredLocation: 'Downtown',
    }); 
    
    
     useEffect(() => {
    const userId = sessionStorage.getItem('userid'); // Lấy userId từ sessionStorage
 
    // Tạo kết nối SignalR
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://backend-sohu-production.up.railway.app/paymentHub') // Đúng URL của SignalR hub
      .withAutomaticReconnect()
      .build();

    // Bắt đầu kết nối SignalR
    connection.start()
      .then(() => {
        console.log('Connected to SignalR hub');

        // Lắng nghe sự kiện từ server
        connection.on('ReceiveConfirmation', (data) => {
          const { paymentCode, userId: receivedUserId } = data;

          if (receivedUserId === parseInt(userId, 10)) {
            console.log('Nhận thông báo thanh toán cho user của mình:', paymentCode);
            setShowCheckout(true); // Hiển thị nút Check Out khi nhận được thông báo
          } else {
            console.log('SignalR gửi cho user khác');
          }
        });
      })
      .catch((err) => console.error('SignalR connection error:', err));

    // Cleanup khi component unmount
    return () => {
      connection.stop()
        .then(() => console.log('SignalR connection stopped'))
        .catch((err) => console.error('Error stopping SignalR connection:', err));
    };
    }, [setShowCheckout]);



    useEffect(() => {
    
    const fetchUserData = async () => {
      try {
          const accessToken = sessionStorage.getItem('accessToken');
          if (!accessToken) {
            console.error('Access token not found. Redirecting to login.');
            navigate('/login'); // Chuyển hướng về trang login nếu không có accessToken
            return;
          }

          // Gọi API để lấy thông tin người dùng
          const userResponse = await getAccountDetail(accessToken);
         
         if (userResponse.data.code === 200) {
           const responseData = userResponse.data.data;

      // Gán dữ liệu vào user
      const userData = {
        id: responseData.id || '12345',
        name: responseData.name || 'John Doe',
        email: responseData.email || 'john.doe@example.com',
        phone: responseData.phone || '+1 (555) 123-4567', // Nếu không có, giữ giá trị mặc định
        avatar:  'https://randomuser.me/api/portraits/men/32.jpg',
        memberSince:  '2025', // Mặc định
        preferredLocation:  'Hà Nội', // Mặc định
      };

      setUser(userData); // Lưu thông tin người dùng vào state

      // Gán dữ liệu vào bookings
      const bookingData = Array.isArray(responseData.bookings)
        ? responseData.bookings.map((booking) => ({
            id: booking.id,
            fieldId: booking.fieldId,
            fieldName: booking.fieldName,
            location: booking.location,
            date: booking.date,
            timeSlot: booking.timeSlot,
            hours: booking.hours,
            totalPrice: booking.totalPrice,
            status: booking.status,
            image: booking.image,
            paymentCode: booking.paymentCode,
            totalFinalAmount: booking.totalFinalAmount || 0, // Nếu không có totalFinalAmount, gán giá trị mặc định là 0
          }))
            : []; // Nếu không có bookings, gán mảng rỗng

          setBookings(bookingData); 
          const hasPendingOrProcessing = bookingData.some(
            (booking) => booking.status == "wait for confirmation" || booking.status == "wait for payment"
          );

          setShowCheckout(hasPendingOrProcessing); // Hiển thị nút Check Out nếu có booking đang chờ hoặc đang xử lý  
        } else {
          console.error('Failed to fetch user data:', userResponse.data.message);
          navigate('/login'); // Chuyển hướng về trang login nếu không lấy được dữ liệu
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Chuyển hướng về trang login nếu có lỗi
      }
    };

    fetchUserData();
  }, [navigate]);

const handlePayment = async (booking) => {
  try {
        const payloadTest = {
            orderType: 'other', 
            amount: booking.totalFinalAmount, 
            orderDescription: booking.paymentCode, 
            name: 'John Doe',
          };
          console.log('Payload for payment:', payloadTest);
            const response = await createPaymentVNpay(payloadTest);

            localStorage.setItem('paymentCode', booking.paymentCode);
            const accessToken = sessionStorage.getItem('accessToken');
            if (accessToken) {
              localStorage.setItem('accessToken', accessToken);
            }
          
            if (response && response.data && response.data.url) {
                // Chuyển người dùng đến URL thanh toán
                window.location.href = response.data.url;
            } else {
                message.error('Failed to retrieve payment URL. Please try again.');
            }

  } catch (error) {
    console.error('Error during payment:', error);
    message.error('Đã xảy ra lỗi khi thanh toán.');
  }
};
  const handleChangeStatus = async (booking, statusAfter) => {
      try {
          const response = await changeBookingStatus({
            id: booking.id,
            fieldId: booking.fieldId,
            status: booking.status,
            paymentCode: booking.paymentCode ,
            statusAfter,
            userId: parseInt(userId, 10), // Lấy userId từ sessionStorage
          });

        if (response.data.code === 200) {
          message.success('Status updated successfully!');

          // Cập nhật trạng thái trực tiếp trong state bookings
          setBookings((prevBookings) =>
            prevBookings.map((b) =>
              b.id === booking.id ? { ...b, status: statusAfter } : b
            )
          );
        } else {
          message.error('Failed to update status. Please try again.');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        message.error('An error occurred while updating status.');
      }
    };

  const filteredBookings = selectedStatus === 'all'
  ? bookings
  : bookings.filter((booking) => booking.status === selectedStatus);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily }}>
      {/* Navbar */}
      <Components.NavbarUser cartItemCount={2} />
      
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Account</h1>
              <p className="text-green-100">Manage your profile and view your booking history</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Components.ButtonUser 
                variant="secondary"
                href="/user-home"
              >
                Back to Home
              </Components.ButtonUser>
            </div>
          </div>
        </div>
      </section>
      
      {/* Account Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* Sidebar */}
            <div className="w-full lg:w-3/12 px-4 mb-8 lg:mb-0">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden sticky top-24">
                {/* User Profile */}
                <div className="p-6 text-center border-b border-gray-200">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600 text-sm">Member since {user.memberSince}</p>
                </div>
                
                {/* Navigation */}
                <div className="p-4">
                  <nav className="space-y-1">
                    <a href="#profile" className="flex items-center px-4 py-3 text-green-600 bg-green-50 rounded-lg font-medium cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </a>
                    <a href="#bookings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Bookings
                    </a>
                    <a href="#payments" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Payment Methods
                    </a>
                    <a href="#favorites" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Favorite Fields
                    </a>
                    <a href="#settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
                            setIsPasswordModalOpen(true);
                          }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Change Password
                    </a>
                  </nav>
                </div>
                
                {/* Logout */}
                <div className="p-4 border-t border-gray-200">
                  <button  onClick= {() => {
                        queryClient.clear();
                        logout();
                        navigate('/login');
                      }} className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="w-full lg:w-9/12 px-4">
              {/* Profile Section */}
         <div id="profile" className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
              <button
                className="text-green-600 font-medium flex items-center cursor-pointer"
                onClick={() => setIsProfileCollapsed(!isProfileCollapsed)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform ${
                    isProfileCollapsed ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {isProfileCollapsed ? 'Expand' : 'Collapse'}
              </button>
            </div>
            {!isProfileCollapsed && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                    <p className="text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Preferred Location</h3>
                    <p className="text-gray-800">{user.preferredLocation}</p>
                  </div>
                </div>
                <div className="mt-4 text-right ">
                  <button className="text-green-600 hover:text-green-700 flex items-center cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>

        {showCheckout && (
      <div id="payments" className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Các khoản thanh toán</h2>
        </div>

        {/* Danh sách khoản thanh toán */}
        <div className="divide-y divide-gray-200">
          {paginatedBookings.filter((booking) => booking.status =="wait for confirmation" || booking.status == "wait for payment")
            .map((booking) => (
              <div key={booking.id} className="p-6">
                <div className="flex flex-wrap -mx-4">
                  {/* Booking Details */}
                  <div className="w-full sm:w-9/12 px-4 mb-4 sm:mb-0">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 mr-3">{booking.fieldName}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {booking.status === "wait for confirmation" ? 'Chờ chủ sân duyệt' : 'Sẵn sàng thanh toán'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {booking.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {booking.timeSlot} ({booking.hours} hours)
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-full sm:w-3/12 px-4 flex flex-col items-end justify-between">
                    <div className="text-green-600 font-bold text-lg mb-2">
                      {booking.totalPrice} VNĐ
                    </div>
                    <div className="flex space-x-2">
                      {booking.status === "wait for confirmation" && (
                        <span className="px-3 py-1 bg-yellow-600 text-white text-sm font-medium rounded-full">
                          Chờ chủ sân duyệt
                        </span>
                      )}
                      {booking.status === "wait for payment" && (
                        <button
                          className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors cursor-pointer"
                          onClick={() => handlePayment(booking)}
                        >
                          Thanh toán
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )}




              {/* Booking History */}
              <div id="bookings" className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Booking History</h2>
                </div>
                
                {/* Booking Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-6 py-3 border-b-2 ${
                      selectedStatus === 'all' ? 'border-green-600 text-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedStatus('all');
                      setCurrentPage(1); // Reset về trang đầu
                    }}
                  >
                    All Bookings
                  </button>
                   <button
                    className={`px-6 py-3 border-b-2 ${
                      selectedStatus === 'not checked in' ? 'border-green-600 text-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedStatus('not checked in');
                      setCurrentPage(1); // Reset về trang đầu
                    }}
                  >
                    Not Checked In
                  </button>
                  <button
                    className={`px-6 py-3 border-b-2 ${
                      selectedStatus === 'ongoing' ? 'border-green-600 text-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedStatus('ongoing');
                      setCurrentPage(1); // Reset về trang đầu
                    }}
                  >
                    Ongoing
                  </button>
                  <button
                    className={`px-6 py-3 border-b-2 ${
                      selectedStatus === 'upcoming' ? 'border-green-600 text-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedStatus('upcoming');
                      setCurrentPage(1); // Reset về trang đầu
                    }}
                  >
                    Upcoming
                  </button>
                  <button
                    className={`px-6 py-3 border-b-2 ${
                      selectedStatus === 'completed' ? 'border-green-600 text-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedStatus('completed');
                      setCurrentPage(1); // Reset về trang đầu
                    }}
                  >
                    Completed
                  </button>
                  <button
                    className={`px-6 py-3 border-b-2 ${
                      selectedStatus === 'cancelled' ? 'border-green-600 text-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedStatus('cancelled');
                      setCurrentPage(1); // Reset về trang đầu
                    }}
                  >
                    Cancelled
                  </button>
                </div>
                
                {/* Bookings List */}
                <div className="divide-y divide-gray-200">
                  {paginatedBookings.map((booking) => (
                    <div key={booking.id} className="p-6">
                      <div className="flex flex-wrap -mx-4">
                        {/* Field Image */}
                        <div className="w-full sm:w-3/12 px-4 mb-4 sm:mb-0">
                          <div className="h-24 sm:h-32 rounded-xl overflow-hidden">
                            <img 
                              src={booking.image} 
                              alt={booking.fieldName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        {/* Booking Details */}
                        <div className="w-full sm:w-6/12 px-4 mb-4 sm:mb-0">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800 mr-3">{booking.fieldName}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              booking.status === 'completed' 
                                ? 'bg-blue-100 text-blue-800' 
                                : booking.status === 'upcoming' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {booking.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {booking.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {booking.timeSlot} ({booking.hours} hours)
                          </div>
                        </div>
                        
                        {/* Price and Actions */}
                        <div className="w-full sm:w-3/12 px-4 flex flex-col items-end justify-between">
                          <div className="text-green-600 font-bold text-lg mb-2">
                            {booking.totalPrice} VNĐ
                          </div>  
                          <div className="flex space-x-2">
                            {/* Hiển thị nút dựa trên trạng thái booking */}
                            {booking.status === 'not checked in' && (
                              <button className="px-3 py-1 bg-yellow-600 text-white text-sm font-medium rounded-full hover:bg-yellow-700 transition-colors cursor-pointer"
                                onClick={() => handleChangeStatus(booking, 'ongoing')}
                              >
                                Check In
                              </button>
                            )}
                            {booking.status === 'cancelled' && (
                              <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                                Rebook
                              </button>
                            )}
                            {booking.status === 'upcoming' && (
                              <>
                               <button
                                  className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors cursor-pointer ml-2"
                                  onClick={() => {
                                    setShowAcceptPopup({ open: true, booking });
                                    setAcceptChecked(false);
                                  }}
                                 
                                >
                                  Accept opponent's request
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                                  onClick={() => handleChangeStatus(booking, 'cancelled')}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {booking.status === 'completed' && (
                              <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                                Rebook
                              </button>
                            )}
                            {booking.status === 'ongoing' && (
                              <button className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors cursor-pointer"
                               onClick={() => handleChangeStatus(booking, 'completed')}
                              >
                                Checkout
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="p-6 bg-gray-50 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={`px-3 py-1 rounded-l-lg border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.ceil(bookings.length / itemsPerPage) }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 border-t border-b border-gray-300 ${
                          currentPage === index + 1 ? 'text-green-600 bg-green-50 font-medium' : 'text-gray-600 hover:bg-gray-100'
                        } cursor-pointer`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === Math.ceil(bookings.length / itemsPerPage)}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(bookings.length / itemsPerPage)))}
                      className={`px-3 py-1 rounded-r-lg border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer ${
                        currentPage === Math.ceil(bookings.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
              
              {/* Favorite Fields */}
              <div id="favorites" className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Favorite Fields</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center p-4 border border-gray-200 rounded-xl">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                          alt="Green Valley Stadium"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-medium">Green Valley Stadium</h3>
                        <p className="text-gray-600 text-sm">Downtown, City Center</p>
                      </div>
                      <button className="text-red-500 hover:text-red-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center p-4 border border-gray-200 rounded-xl">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1093&q=80" 
                          alt="Sunset Arena"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-medium">Sunset Arena</h3>
                        <p className="text-gray-600 text-sm">Westside, Beach District</p>
                      </div>
                      <button className="text-red-500 hover:text-red-700 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Components.FooterUser />

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h2>
            <form
               onSubmit={async (e) => {
                e.preventDefault();

                // Kiểm tra định dạng số điện thoại
                const phoneRegex = /^\+84\d{9}$/;
                if (!phoneRegex.test(user.phone)) {
                  message.error('Phone number must be in the format +84 followed by 9 digits.');
                  return;
                }

                try {
                  // Gọi API để cập nhật thông tin
                  const response = await changeProfile({
                    userId :  parseInt(userId, 10),
                    fullName: user.name,
                    phoneNumber: user.phone,
                  });

                  if (response.data.code === 200) {
                    message.success('Profile updated successfully!');
                    setIsModalOpen(false); // Đóng modal sau khi cập nhật thành công
                  } else {
                    message.error('Failed to update profile. Please try again.');
                  }
                } catch (error) {
                  console.error('Error updating profile:', error);
                  message.error('An error occurred while updating profile.');
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  defaultValue={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  defaultValue={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>
          
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    {isPasswordModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
            const form = e.target as HTMLFormElement; // Ép kiểu e.target thành HTMLFormElement
            const oldPassword = (form.elements.namedItem('oldPassword') as HTMLInputElement)?.value.trim();
            const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement)?.value.trim();
            const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement)?.value.trim();


          if (!oldPassword || !newPassword || !confirmPassword) {
              message.error('All fields are required.');
              return;
          }
          // Kiểm tra độ dài mật khẩu
          if (newPassword.length < 8 || newPassword.length > 30) {
            message.error('Password must be between 8 and 30 characters.');
            return;
          }

          // Kiểm tra mật khẩu xác nhận
          if (newPassword !== confirmPassword) {
            message.error('New password and confirm password do not match.');
            return;
          }

          try {
            // Gọi API để đổi mật khẩu
            const response = await changePassword({
              userId: parseInt(userId, 10),
              oldPassword,
              newPassword,
            });

            if (response.data.code === 200) {
              message.success('Password changed successfully!');
              setIsPasswordModalOpen(false); // Đóng modal sau khi đổi mật khẩu thành công
            } else {
              message.error('Failed to change password. Please try again.');
            }
          } catch (error) {
            console.error('Error changing password:', error);
            message.error('An error occurred while changing password.');
          }
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            name="oldPassword"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
            onClick={() => setIsPasswordModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
      </div>
    )}


    

{showAcceptPopup.open && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-lg font-bold mb-3">Xác nhận chính sách</h2>
      <p className="mb-4 text-gray-700">
        Khi chấp nhận cho phép đối thủ tìm kiếm trận đấu, bạn <span className="font-semibold text-red-600">không thể hủy thanh toán và hoàn tiền</span>.
      </p>
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={acceptChecked}
          onChange={e => setAcceptChecked(e.target.checked)}
          className="mr-2"
        />
        Tôi đồng ý với điều kiện trên
      </label>
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
          onClick={() => setShowAcceptPopup({ open: false, booking: null })}
        >
          Cancel
        </button>
        <button
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${!acceptChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!acceptChecked}
          onClick={() => {
            if (showAcceptPopup.booking) {
              handleChangeStatus(showAcceptPopup.booking, 'Find opponent');
              setShowAcceptPopup({ open: false, booking: null });
            }
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}