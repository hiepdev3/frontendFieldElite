'use client';
import { useGoogleFont } from '../fonts/fonts'
import Components from "../componentUser"
import '../fonts/indexUser.css';
import React, { useEffect, useState } from 'react';
import { getListCart } from '../apiUser/PublicServices';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { changeListCartStatus,checkAvailability,removeCart,addListPayment } from '../apiUser/PublicServices';
import { message } from 'antd';
import Cookies from 'js-cookie';

export default function CartUser() {
  const fontFamily = useGoogleFont('Inter');
  const [cartItems, setCartItems] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Trạng thái hiển thị modal chỉnh sửa
  const [editingItem, setEditingItem] = useState(null); // Thông tin mục đang chỉnh sửa
  const navigate = useNavigate();
  // Lấy dữ liệu từ localStorage hoặc từ API khi component được render
  
  const currentUser = sessionStorage.getItem("user");
  const userId = sessionStorage.getItem('userid');
  const handleCheckout = async () => {
  try {
    if (currentUser === 'true' && userId) {
      // Gọi API để lấy danh sách giỏ hàng từ backend
      const response = await getListCart(parseInt(userId, 10));
      const cartData = response.data.data.map((item: any) => ({
        id: item.id,
        fieldId: item.id,
        fieldName: item.name,
        location: item.location,
        date: item.date,
        timeSlot: item.timeSlots,
        hours: item.duration,
        paymentCode: item.paymentCode,
        pricePerHour: item.pricePerHour,
        image: item.image,
      }));
      // Kiểm tra tính hợp lệ của ngày
     const invalidItems = cartData.filter((item) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt thời gian của ngày hôm nay về 00:00:00 để so sánh chính xác
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0); // Đặt thời gian của ngày item về 00:00:00 để so sánh chính xác

      // Nếu ngày nhỏ hơn hôm nay, không hợp lệ
      if (itemDate < today) {
        return true;
      }

      // Nếu ngày là hôm nay, kiểm tra timeSlot
      if (itemDate.getTime() === today.getTime()) {
        const currentTime = new Date();
        const [hour, minute] = item.timeSlot.split(':').map(Number); // Chuyển timeSlot thành giờ và phút
        const itemTime = new Date();
        itemTime.setHours(hour, minute, 0, 0); // Đặt giờ và phút của timeSlot

        // Nếu timeSlot nhỏ hơn thời gian hiện tại, không hợp lệ
        if (itemTime <= currentTime) {
          return true;
        }
      }

      // Nếu ngày lớn hơn hôm nay, hợp lệ
      return false;
    });

      if (invalidItems.length > 0) {
        // Hiển thị modal nếu có mục không hợp lệ
        Modal.warning({
          title: 'Invalid Date Detected',
          content: 'Some items in your cart have invalid dates. Please update them before proceeding.',
          okText: 'OK',
        });
      } else {
        // Nếu tất cả hợp lệ, tiếp tục xử lý checkout
        setCartItems(cartData);
        message.success('Proceeding to checkout...');
        // Thực hiện các bước tiếp theo, ví dụ: chuyển hướng đến trang thanh toán
        console.log('Cart data:', cartData);
        const paymentData = cartData.map((item: any) => {
        // Kết hợp date và timeSlot để tạo bookingDate
        const bookingDate = `${item.date}T${item.timeSlot}:00.000Z`;

        // Tính toán timeEnd dựa trên bookingDate và hours
        const [hour, minute] = item.timeSlot.split(':').map(Number); // Chuyển timeSlot thành giờ và phút
        const formattedMinute = minute.toString().padStart(2, '0');

        // Tính toán timeEnd dựa trên bookingDate và hours
        const timeEnd = `${item.date}T${hour + item.hours}:${formattedMinute}:00.000Z`;


        return {
          userId: parseInt(userId, 10),
          voucherCode: "GLOBAL0", // Mã giảm giá (có thể thay đổi tùy theo logic của bạn)
          fieldId: item.fieldId,
          discountAmount: 0, // Giảm giá (có thể thay đổi tùy theo logic của bạn)
          finalPrice: item.pricePerHour * item.hours,
          paidAt: new Date().toISOString(),
          paymentMethod: "VNPAY", // Phương thức thanh toán
          status: 1, // Trạng thái thanh toán (1: đã thanh toán)
          bookingDate, // Kết hợp ngày và thời gian
          timeEnd, // Thời gian kết thúc
          paymentCode: "",
          totalFinalAmount: cartData.reduce((total, item) => total + item.pricePerHour * item.hours, 0),
        };
      });
        console.log('Payment data:', paymentData);
        // Gửi dữ liệu thanh toán đến backend

        const paymentResponse = await addListPayment(paymentData);
        console.log('Payment response:', paymentResponse);
        if (paymentResponse.data.code === 200) {
          message.success('Payment processed successfully!');
          const paymentCode = paymentResponse.data.data;
          Cookies.set('paymentCode', paymentCode, { secure: true, sameSite: 'Strict' }); // Lưu vào cookie
    
          navigate('/checkout');
        }else if(paymentResponse.data.code === 204) {
          message.error(`${paymentResponse.data.message}`);
        }
      }
    } else {
      message.error('You must be logged in to proceed to checkout.');
    }
  } catch (error) {
        // Xử lý lỗi không có phản hồi từ server
        console.error('Failed to fetch cart items:', error);
        message.error('An unexpected error occurred. Please try again.');
      
  }
};

const handleEdit = (id: number) => {
 const itemToEdit = cartItems.find((item) => item.id === id);
  setEditingItem(itemToEdit); // Lưu thông tin mục đang chỉnh sửa
  setIsEditModalVisible(true); // Hiển thị modal
};


const handleRemove = async ( fieldId: number) => {
  Modal.confirm({
    title: 'Are you sure you want to remove this item?',
    content: 'This action cannot be undone.',
    okText: 'Yes, Remove',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        // Lọc bỏ mục khỏi giỏ hàng
        const updatedCart = cartItems.filter((item) => item.fieldId !== fieldId);
        setCartItems(updatedCart); // Cập nhật giỏ hàng

        // Gọi API để xóa mục khỏi backend
        const response = await removeCart(parseInt(userId,10), fieldId);
        if (response.status === 200) {
          message.success('Item removed from cart successfully!');
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
        message.error('An error occurred. Please try again.');
      }
    },
    onCancel: () => {
      console.log('Remove action cancelled.');
    },
  });
};
  useEffect(() => {
    if (currentUser === 'true' && userId) {
      // Gọi API để lấy danh sách giỏ hàng từ backend
      getListCart(parseInt(userId, 10))
        .then((response) => {
          const cartData = response.data.data.map((item: any) => ({
            id: item.id,
            fieldId: item.id,
            fieldName: item.name,
            location: item.location,
            date: item.date,
            timeSlot: item.timeSlots,
            hours: item.duration,
            pricePerHour: item.pricePerHour,
            image: item.image,
          }));
          setCartItems(cartData);
        })
        .catch((error) => {
          console.error('Failed to fetch cart items:', error);
        });
    } else {
      // Lấy dữ liệu từ localStorage nếu không có currentUser
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart).map((item: any) => ({
          id: item.id,
          fieldId: item.id,
          fieldName: item.name,
          location: item.location,
          date: item.date,
          timeSlot: item.timeSlots,
          hours: item.duration,
          pricePerHour: item.pricePerHour,
          image: item.image,
        }));
        setCartItems(parsedCart);
      }
    }
  }, []);
  
  const handleCheckAvailability = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt thời gian của ngày hôm nay về 00:00:00 để so sánh chính xác
        const selectedDate = new Date(editingItem.date);
        selectedDate.setHours(0, 0, 0, 0); // Đặt thời gian của ngày được chọn về 00:00:00 để so sánh chính xác

        if (selectedDate < today) {
          message.error("The selected date must be today or later.");
          return; // Dừng xử lý nếu ngày không hợp lệ
        }
        // Nếu ngày là hôm nay, kiểm tra timeSlot
        if (selectedDate.getTime() === today.getTime()) {
          const currentTime = new Date();
          const [hour, minute] = editingItem.timeSlot.split(':').map(Number); // Chuyển timeSlot thành giờ và phút
          const selectedTime = new Date();
          selectedTime.setHours(hour, minute, 0, 0); // Đặt giờ và phút của timeSlot

          if (selectedTime <= currentTime) {
            message.error("The selected time slot must be later than the current time.");
            return; // Dừng xử lý nếu timeSlot không hợp lệ
          }
        }
        // Gửi thông tin đến backend để kiểm tra tính khả dụng
        const response = await checkAvailability({
          userId: parseInt(userId, 10), 
          fieldId: editingItem.fieldId,
          date: editingItem.date,
          timeSlot: editingItem.timeSlot,
          duration: editingItem.hours,
        });

        if (response.data.code === 200) {
          // Nếu sân khả dụng, cập nhật giỏ hàng
          const updatedCart = cartItems.map((item) =>
            item.id === editingItem.id ? editingItem : item
          );
          setCartItems(updatedCart);
          setIsEditModalVisible(false);
          message.success('Booking updated successfully!');
        }else{
          // Nếu sân không khả dụng, hiển thị thông báo lỗi
          message.error("The selected time slot is not available. Please choose another.");
        }
      } catch (error) {
          if (error.response && error.response.data) {
          if (error.response.data.errorMessage === "Time slot is available") {
            // Nếu time slot khả dụng
            message.success("Time slot is available!");
          } else {
            // Nếu time slot không khả dụng
            message.error( "Invalid time slot. Please choose another.");
          }
        } else {
          // Xử lý lỗi không có phản hồi từ server
          message.error("An unexpected error occurred. Please try again!");
        }
      }
    };
  const clearCart = () => {
    if (currentUser === 'true') {
          Modal.confirm({
          title: 'Do you want to clear the cart?',
          content: 'This action will remove all items from your cart.',
          okText: 'Yes',
          cancelText: 'No',
          onOk: async () => {
            try {
              if (userId) {
                // Gọi API để cập nhật trạng thái giỏ hàng
                await changeListCartStatus(parseInt(userId, 10)); // 0 là trạng thái giỏ hàng đã xóa
              }
              localStorage.removeItem('cart'); // Xóa giỏ hàng khỏi localStorage
              setCartItems([]); // Cập nhật state giỏ hàng
              message.success('Cart cleared successfully!');
            } catch (error) {
              console.error('Failed to clear cart:', error);
              message.error('Failed to clear cart. Please try again.');
            }
          },
          onCancel: () => {
            console.log('Clear cart action cancelled.');
          },
        });
    } else {
      // Nếu không phải currentUser, chỉ xóa khỏi localStorage
      localStorage.removeItem('cart');
      setCartItems([]);
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.pricePerHour * item.hours), 0)
  const tax = subtotal * 0.05 // 8% tax
  const total = subtotal + tax
  
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily }}>
      {/* Navbar */}
      <Components.NavbarUser cartItemCount={cartItems.length} />
      
      {/* Page Header */}
      <section className="pt-24 pb-12 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Your Cart</h1>
              <p className="text-green-100">Review your selected fields and proceed to checkout</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Components.ButtonUser 
                variant="secondary"
                href="/fields-user"
              >
                Continue Booking
              </Components.ButtonUser>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* Cart Items */}
            <div className="w-full lg:w-8/12 px-4 mb-8 lg:mb-0">
              {cartItems.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Field Bookings ({cartItems.length})</h2>
                  </div>
                  
                  {/* Cart Items List */}
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex flex-wrap -mx-4">
                          {/* Field Image */}
                          <div className="w-full sm:w-3/12 px-4 mb-4 sm:mb-0">
                            <div className="h-24 sm:h-32 rounded-xl overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.fieldName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          {/* Field Details */}
                          <div className="w-full sm:w-6/12 px-4 mb-4 sm:mb-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.fieldName}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {item.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {item.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {item.timeSlot} ({item.hours} hour{item.hours > 1 ? 's' : ''})
                            </div>
                          </div>
                          
                          {/* Price and Actions */}
                          <div className="w-full sm:w-3/12 px-4 flex flex-col items-end justify-between">
                            <div className="text-green-600 font-bold text-lg mb-2">
                              {item.pricePerHour * item.hours} VNĐ
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-gray-500 hover:text-gray-700 cursor-pointer"
                              onClick={() => handleEdit(item.id)}
                               >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button className="text-red-500 hover:text-red-700 cursor-pointer"
                               onClick={() => handleRemove(item.id)}
                               >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Cart Actions */}
                  <div className="p-6 bg-gray-50 flex flex-wrap justify-between items-center">
                    <button className="text-green-600 font-medium flex items-center cursor-pointer"
                      onClick={() => navigate('/fields-user')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add More Fields
                    </button>
                    <button
                        className="text-red-600 font-medium flex items-center cursor-pointer"
                        onClick={clearCart} // Gọi hàm clearCart khi nhấn
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Cart
                      </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Looks like you haven't added any fields to your cart yet.</p>
                  <Components.ButtonUser 
                    variant="primary"
                    href="/fields-user"
                  >
                    Browse Fields
                  </Components.ButtonUser>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="w-full lg:w-4/12 px-4">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-800 font-medium">{subtotal.toFixed(2)}VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (5%)</span>
                      <span className="text-gray-800 font-medium">{tax.toFixed(2)}VNĐ</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200"> 
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-lg font-bold text-green-600">{total.toFixed(2)}VNĐ</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mt-6">
                    <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="promo-code"
                        placeholder="Enter code"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-lg font-medium hover:bg-gray-300 transition-colors cursor-pointer">
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <div className="mt-6">
                    <Components.ButtonUser 
                      variant="primary"
                      size="lg"
                      fullWidth
                       onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Components.ButtonUser>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Secure payment processing. Your data is protected.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Need Help */}
              <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  If you have any questions about your booking or need assistance, our support team is here to help.
                </p>
                <button className="w-full flex items-center justify-center text-green-600 border border-green-600 px-4 py-2 rounded-full font-medium hover:bg-green-50 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Components.FooterUser />

      {/* Edit Booking Modal */}
      <Modal
        title="Edit Booking"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)} // Đóng modal
        onOk={handleCheckAvailability} 
      >
        {editingItem && (
          <div className="space-y-4">
            {/* Chọn ngày */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={editingItem.date}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Chọn khung thời gian */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
              <select
                value={editingItem.timeSlot}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, timeSlot: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {Array.from({ length: 36 }, (_, i) => {
                  const hour = Math.floor(i / 2) + 6;
                  const minute = i % 2 === 0 ? '00' : '30';
                  return (
                    <option key={i} value={`${hour}:${minute}`}>
                      {`${hour}:${minute}`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Chọn thời lượng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
              <select
                value={editingItem.hours}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, hours: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {Array.from({ length: 9 }, (_, i) => (i + 2) / 2).map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} hour{duration > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}