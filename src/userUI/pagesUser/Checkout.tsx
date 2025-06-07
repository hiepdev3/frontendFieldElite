import React, { useEffect, useState } from 'react';
import Components from '../componentUser'; // Import các component dùng chung, bao gồm NavbarUser
import Cookies from 'js-cookie';
import { getPaymentSummary } from '../apiUser/PublicServices';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate(); // Hook để điều hướng

  const userId = sessionStorage.getItem('userid');

  // State để lưu thông tin từ API
  const [userInfo, setUserInfo] = useState({
    fullName: "John Doe",
    phoneNumber: "+123 456 7890",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    totalAmount: "$120.00",
    paymentMethod: "Credit Card (**** **** **** 1234)", // Mặc định
  });

  const [bookedFields, setBookedFields] = useState([
    { name: "Tennis Court", date: "2025-06-15", time: "10:00 AM", timeEnd : "11:00 AM", status: "Confirmed" },
    { name: "Basketball Court", date: "2025-06-16", time: "02:00 PM",timeEnd : "04:00 PM", status: "Confirmed" },
  ]);

  useEffect(() => {
    const paymentCode = Cookies.get('paymentCode');
    if (paymentCode && userId) {
      // Gọi API để lấy thông tin thanh toán
      getPaymentSummary(paymentCode, parseInt(userId, 10))
        .then((response) => {
          if (response.status === 200) {
            const data = response.data.data;
            console.log('Payment summary data:', response);
            // Gán dữ liệu trả về vào các state
            setUserInfo({
              fullName: data.fullName,
              phoneNumber: "+123 456 7890", // Mặc định
            });

            setPaymentInfo({
              totalAmount: `${data.totalAmount} VNĐ`,
              paymentMethod: "Credit Card (**** **** **** 1234)", // Mặc định
            });
            console.log('Payment details:', data.fields);
            setBookedFields(response.data.data.fields);
          } else {
            message.error('Failed to fetch payment details.');
          }
        })
        .catch((error) => {
          console.error('Error fetching payment details:', error);
          message.error('An error occurred while fetching payment details.');
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Components.NavbarUser cartItemCount={2} />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">
          {/* Title and Confirmation */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Successful Checkout</h1>
            <div className="flex items-center justify-center mt-2">
              <p className="text-xl text-green-500">✅ Your payment was successful!</p>
            </div>
          </div>

          {/* User and Payment Information */}
          <div className="grid grid-cols-2 gap-x-8 mb-6">
            {/* User Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700">User Information</h3>
              <p className="text-gray-600">Full Name: <span className="font-semibold">{userInfo.fullName}</span></p>
              <p className="text-gray-600">Phone Number: <span className="font-semibold">{userInfo.phoneNumber}</span></p>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Payment Information</h3>
              <p className="text-gray-600">Total Amount: <span className="font-semibold">{paymentInfo.totalAmount}</span></p>
              <p className="text-gray-600">Payment Method: <span className="font-semibold">{paymentInfo.paymentMethod}</span></p>
            </div>
          </div>

          {/* Booked Fields */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Booked Fields</h3>
            <div className="space-y-2">
              {Array.isArray(bookedFields) && bookedFields.map((field, index) => (
                <div key={index} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{field.name}</p>
                      <p className="text-gray-600">{field.date}, {field.time} - {field.timeEnd}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        field.status === "Confirmed" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {field.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <button
              className="w-full md:w-auto bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
              onClick={() => navigate('/user-home')}
            >
              Back to Home Page
            </button>
            <button
              className="w-full md:w-auto bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
              onClick={() => navigate('/account-user')}
            >
              View Field Booking History
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Components.FooterUser />
    </div>
  );
}

