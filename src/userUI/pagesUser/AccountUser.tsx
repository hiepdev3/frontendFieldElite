'use client';
import { useGoogleFont } from '../fonts/fonts'
import Components from "../componentUser"
import {useNavigate} from 'react-router-dom';
import '../fonts/indexUser.css';
import React from "react"
import {useAuth} from '../../context/AuthContext.tsx';
import {useQueryClient} from 'react-query';

export default function AccountUser() {
  const fontFamily = useGoogleFont('Inter')
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth(); // Lấy hàm logout từ AuthContext
    
  // Sample user data
  const user = {
    id: '12345',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    memberSince: 'January 2022',
    preferredLocation: 'Downtown'
  }
  
  // Sample booking history
  const bookings = [
    {
      id: 'B001',
      fieldId: '1',
      fieldName: 'Green Valley Stadium',
      location: 'Downtown, City Center',
      date: '2023-07-28',
      timeSlot: '18:00 - 20:00',
      hours: 2,
      totalPrice: 240,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
    },
    {
      id: 'B002',
      fieldId: '3',
      fieldName: 'Riverside Field',
      location: 'Eastside, River Park',
      date: '2023-08-05',
      timeSlot: '16:00 - 18:00',
      hours: 2,
      totalPrice: 160,
      status: 'completed',
      image: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80'
    },
    {
      id: 'B003',
      fieldId: '5',
      fieldName: 'Sunset Arena',
      location: 'Westside, Beach District',
      date: '2023-08-15',
      timeSlot: '18:00 - 20:00',
      hours: 2,
      totalPrice: 300,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1093&q=80'
    },
    {
      id: 'B004',
      fieldId: '2',
      fieldName: 'Urban Soccer Arena',
      location: 'Westside, Sports District',
      date: '2023-08-22',
      timeSlot: '19:00 - 21:00',
      hours: 2,
      totalPrice: 190,
      status: 'upcoming',
      image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    }
  ]
  
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
                href="/index.html?screen=Home"
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
                    <a href="#settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
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
                  <button className="text-green-600 font-medium flex items-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
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
                </div>
              </div>
              
              {/* Booking History */}
              <div id="bookings" className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Booking History</h2>
                </div>
                
                {/* Booking Tabs */}
                <div className="flex border-b border-gray-200">
                  <button className="px-6 py-3 border-b-2 border-green-600 text-green-600 font-medium">
                    All Bookings
                  </button>
                  <button className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium cursor-pointer">
                    Upcoming
                  </button>
                  <button className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium cursor-pointer">
                    Completed
                  </button>
                  <button className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium cursor-pointer">
                    Cancelled
                  </button>
                </div>
                
                {/* Bookings List */}
                <div className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
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
                            ${booking.totalPrice}
                          </div>
                          <div className="flex space-x-2">
                            {booking.status === 'upcoming' && (
                              <>
                                <button className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors cursor-pointer">
                                  Reschedule
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors cursor-pointer">
                                  Cancel
                                </button>
                              </>
                            )}
                            {booking.status === 'completed' && (
                              <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                                Book Again
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
                  <nav className="flex items-center">
                    <button className="px-3 py-1 rounded-l-lg border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 text-green-600 font-medium bg-green-50 cursor-pointer">
                      1
                    </button>
                    <button className="px-3 py-1 border-t border-b border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer">
                      2
                    </button>
                    <button className="px-3 py-1 rounded-r-lg border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
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
    </div>
  )
}