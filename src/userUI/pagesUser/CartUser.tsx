'use client';
import { useGoogleFont } from '../fonts/fonts'
import Components from "../componentUser"
import '../fonts/indexUser.css';
import React, { useEffect, useState } from 'react';


export default function CartUser() {
  const fontFamily = useGoogleFont('Inter')
  const [cartItems, setCartItems] = useState([]);

  // Lấy dữ liệu từ localStorage khi component được render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
       const parsedCart = JSON.parse(storedCart).map((item) => ({
        id: item.id,
        fieldId: item.id, // Nếu cần ánh xạ `id` thành `fieldId`
        fieldName: item.name, // Ánh xạ `name` thành `fieldName`
        location: item.location,
        date: item.date , // Nếu không có `date`, đặt giá trị mặc định
        timeSlot: item.timeSlots , // Nếu không có `timeSlot`, đặt giá trị mặc định
        hours: item.duration , // Nếu không có `hours`, đặt giá trị mặc định là 1
        pricePerHour: item.pricePerHour,
        image: item.image,
      }));
      console.log("Parsed Cart Items:", parsedCart);
      setCartItems(parsedCart);
    }
  }, []);
  // Sample cart data
  // const cartItems = [
  //   {
  //     id: '1',
  //     fieldId: '1',
  //     fieldName: 'Green Valley Stadium',
  //     location: 'Downtown, City Center',
  //     date: '2023-08-15',
  //     timeSlot: '18:00 - 20:00',
  //     hours: 2,
  //     pricePerHour: 120,
  //     image: 'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
  //   },
  //   {
  //     id: '2',
  //     fieldId: '5',
  //     fieldName: 'Sunset Arena',
  //     location: 'Westside, Beach District',
  //     date: '2023-08-18',
  //     timeSlot: '16:00 - 18:00',
  //     hours: 2,
  //     pricePerHour: 150,
  //     image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1093&q=80'
  //   }
  // ]
  const clearCart = () => {
    // Xóa giỏ hàng trong localStorage
    localStorage.removeItem('cart');
    
    // Đặt lại state giỏ hàng
    setCartItems([]);
  };
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.pricePerHour * item.hours), 0)
  const tax = subtotal * 0.08 // 8% tax
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
                              ${item.pricePerHour * item.hours}
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button className="text-red-500 hover:text-red-700 cursor-pointer">
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
                    <button className="text-green-600 font-medium flex items-center cursor-pointer">
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
                      <span className="text-gray-800 font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="text-gray-800 font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-lg font-bold text-green-600">${total.toFixed(2)}</span>
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
    </div>
  )
}