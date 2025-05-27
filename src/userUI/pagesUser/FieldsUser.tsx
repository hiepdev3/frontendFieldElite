'use client';
import { useGoogleFont } from '../fonts/fonts'
import Components from "../componentUser"
import '../fonts/indexUser.css';
import React, { useState, useEffect } from "react";
import { getAllFieldForUser } from '../apiUser/PublicServices';
import {initializeCartCount} from '../../utils/cartUtils'; // Giả sử bạn có một hàm để khởi tạo cartCount
import { getAvailableFields } from '../apiUser/PublicServices';
import { message } from 'antd';



export default function FieldsUser() {
  const [cartCount, setCartCount] = useState<number>(0);

  const [allfields, setFields] = useState([]); // State để lưu danh sách fields
  const [loading, setLoading] = useState(true); // State để hiển thị trạng thái loading
 
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [activeFilter, setActiveFilter] = useState<string>('All Fields')
  

  useEffect(() => {
    initializeCartCount(setCartCount); // Gọi hàm từ cartUtils
  }, []);

  const addToCart = (field: any) => {
    // Lấy danh sách giỏ hàng hiện tại từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingField = cart.find((item: any) => item.id === field.id);

    if (!existingField) {
      // Nếu chưa tồn tại, thêm sản phẩm vào giỏ hàng
      const updatedField = {
        ...field,
        timeSlots: selectedStartTime, // Chỉ giữ lại timeSlot được chọn
        date: selectedDate, // Thêm ngày từ selectedDate
        duration: selectedDuration,
      };
      cart.push(updatedField);
      localStorage.setItem('cart', JSON.stringify(cart)); // Lưu lại vào localStorage
      const cartCount = cart.length;
      localStorage.setItem('cartCount', cartCount.toString());
      setCartCount(cartCount); // Gọi trực tiếp hàm cập nhật state trong cùng tab
      initializeCartCount(setCartCount); // Cập nhật cartCount trong localStorage
    
      message.success('Added to cart successfully!');

    } else {
       message.error('This field is already in the cart!');
 
    }
  };
  const mapFieldData = (data) => {
      return data.map((item) => ({
        id: String(item.id), // Chuyển `id` thành chuỗi
        name: item.name, // Giữ nguyên tên
        location: `${item.ward}, ${item.district}, ${item.province}`, // Gộp ward, district, province thành location
        rating: parseFloat((Math.random() * (5 - 4) + 4).toFixed(1)), // Random rating từ 4.0 đến 5.0
        features: ['Floodlights', 'Changing Rooms', 'Parking', 'Spectator Area']
          .sort(() => Math.random() - 0.5) // Trộn ngẫu nhiên
          .slice(0, 3), // Lấy 3 trong 4 features
        availability: 'High', // Mặc định là High
        timeSlots: generateTimeSlots(), // Tạo time slots tự động
        pricePerHour: item.price, // Gán giá trị price
        image: item.image , // Nếu `image` null, dùng ảnh mặc định
      }));
    };

  const fetchAllFields = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const response = await getAllFieldForUser(); // Gọi API
      const mappedFields = mapFieldData(response.data);
      setFields(mappedFields); // Lưu dữ liệu đã map vào state
    } catch (error) {
      console.error("Error fetching fields:", error); // Xử lý lỗi
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };
  // const generateTimeSlots = () => {
  //     const slots = [];
  //     for (let hour = 6; hour <= 23; hour++) {
  //       for (let minute of ['00', '30']) {
  //         slots.push({ time: `${hour}:${minute}`, available: true }); // Tất cả time slots đều available
  //       }
  //     }
  //     return slots;
  // };
  useEffect(() => {
      fetchAllFields(); // Gọi hàm fetchAllFields
    }, []);
  // Gọi `handleAvailableField` khi bất kỳ giá trị nào thay đổi
    
      const interFont = useGoogleFont('Inter')
      const playfairFont = useGoogleFont('Playfair Display')
        // Function to get today's date in YYYY-MM-DD format
      const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
    
  const getDefaultStartTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60); 
    const minutes = now.getMinutes();
    const roundedMinutes = minutes <= 30 ? 30 : 60; 
    if (roundedMinutes === 60) {
      now.setHours(now.getHours() + 1); 
    }
    now.setMinutes(roundedMinutes % 60); 
    return now.toTimeString().slice(0, 5); 
  };
   const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [selectedStartTime, setSelectedStartTime] = useState<string>(getDefaultStartTime());
  const [selectedDuration, setSelectedDuration] = useState<number>(2)

  const handleAvailableField = async () => {
  try {
    const payload = {
      date: `${selectedDate}T00:00:00`, 
      startTime: `${selectedStartTime}:00`, 
      duration: selectedDuration * 60, 
    };


    
    // Gửi dữ liệu đến backend
    
    const response = await getAvailableFields(payload);
    
   
    // Xử lý dữ liệu trả về từ backend (nếu cần)
    
    const mappedFields = mapFieldData(response.data);
    setFields(mappedFields);
  } catch (error) {
    console.error("Error checking available fields:", error);
  }
};
  // Sample data for fields
  // const fields = [
  //   {
  //     id: '1',
  //     name: 'Green Valley Stadium',
  //     location: 'Downtown, City Center',
  //     rating: 4.8,
  //     pricePerHour: 120,
  //     image: 'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  //     features: ['Floodlights', 'Changing Rooms', 'Parking', 'Spectator Area'],
  //     availability: 'High',
  //     size: 'Standard (11-a-side)',
  //     timeSlots: [
  //       { time: '13:00', available: true },
  //       { time: '13:30', available: true },
  //       { time: '14:00', available: true },
  //       { time: '14:30', available: true },
  //       { time: '15:00', available: true },
  //       { time: '15:30', available: true },
  //       { time: '16:00', available: true },
  //       { time: '16:30', available: false },
  //       { time: '17:00', available: false },
  //       { time: '17:30', available: true },
  //       { time: '18:00', available: true },
  //       { time: '18:30', available: true },
  //       { time: '19:00', available: true },
  //       { time: '19:30', available: true },
  //       { time: '20:00', available: true },
  //       { time: '20:30', available: true },
  //       { time: '21:00', available: true },
  //     ]
  //   },
  //   {
  //     id: '2',
  //     name: 'Urban Soccer Arena',
  //     location: 'Westside, Sports District',
  //     rating: 4.5,
  //     pricePerHour: 95,
  //     image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  //     features: ['Floodlights', 'Changing Rooms', 'Parking'],
  //     availability: 'Medium',
  //     size: '7-a-side',
  //     timeSlots: [
  //       { time: '13:00', available: false },
  //       { time: '13:30', available: false },
  //       { time: '14:00', available: false },
  //       { time: '14:30', available: true },
  //       { time: '15:00', available: true },
  //       { time: '15:30', available: true },
  //       { time: '16:00', available: true },
  //       { time: '16:30', available: true },
  //       { time: '17:00', available: true },
  //       { time: '17:30', available: true },
  //       { time: '18:00', available: true },
  //       { time: '18:30', available: true },
  //       { time: '19:00', available: false },
  //       { time: '19:30', available: false },
  //       { time: '20:00', available: false },
  //       { time: '20:30', available: true },
  //       { time: '21:00', available: true },
  //     ]
  //   },
  //   {
  //     id: '3',
  //     name: 'Riverside Football Complex',
  //     location: 'Eastside, River View',
  //     rating: 4.9,
  //     pricePerHour: 150,
  //     image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  //     features: ['Floodlights', 'Changing Rooms', 'Parking', 'Spectator Area', 'Cafe', 'Pro Equipment'],
  //     availability: 'Low',
  //     size: 'Standard (11-a-side)',
  //     timeSlots: [
  //       { time: '13:00', available: false },
  //       { time: '13:30', available: false },
  //       { time: '14:00', available: false },
  //       { time: '14:30', available: false },
  //       { time: '15:00', available: false },
  //       { time: '15:30', available: false },
  //       { time: '16:00', available: true },
  //       { time: '16:30', available: true },
  //       { time: '17:00', available: true },
  //       { time: '17:30', available: false },
  //       { time: '18:00', available: false },
  //       { time: '18:30', available: false },
  //       { time: '19:00', available: false },
  //       { time: '19:30', available: true },
  //       { time: '20:00', available: true },
  //       { time: '20:30', available: true },
  //       { time: '21:00', available: true },
  //     ]
  //   },
  //   {
  //     id: '4',
  //     name: 'Elite Sports Center',
  //     location: 'Northside, Elite District',
  //     rating: 5.0,
  //     pricePerHour: 200,
  //     image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1293&q=80',
  //     features: ['Floodlights', 'Changing Rooms', 'Parking', 'Spectator Area', 'Cafe', 'Pro Equipment', 'Personal Trainer', 'VIP Lounge'],
  //     availability: 'Medium',
  //     size: 'Standard (11-a-side)',
  //     timeSlots: [
  //       { time: '13:00', available: true },
  //       { time: '13:30', available: true },
  //       { time: '14:00', available: true },
  //       { time: '14:30', available: true },
  //       { time: '15:00', available: false },
  //       { time: '15:30', available: false },
  //       { time: '16:00', available: false },
  //       { time: '16:30', available: false },
  //       { time: '17:00', available: true },
  //       { time: '17:30', available: true },
  //       { time: '18:00', available: true },
  //       { time: '18:30', available: true },
  //       { time: '19:00', available: true },
  //       { time: '19:30', available: false },
  //       { time: '20:00', available: false },
  //       { time: '20:30', available: true },
  //       { time: '21:00', available: true },
  //     ]
  //   },
  //   {
  //     id: '5',
  //     name: 'Community Sports Hub',
  //     location: 'Southside, Community Area',
  //     rating: 4.2,
  //     pricePerHour: 75,
  //     image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  //     features: ['Floodlights', 'Changing Rooms', 'Parking'],
  //     availability: 'High',
  //     size: '5-a-side',
  //     timeSlots: [
  //       { time: '13:00', available: true },
  //       { time: '13:30', available: true },
  //       { time: '14:00', available: true },
  //       { time: '14:30', available: true },
  //       { time: '15:00', available: true },
  //       { time: '15:30', available: true },
  //       { time: '16:00', available: true },
  //       { time: '16:30', available: true },
  //       { time: '17:00', available: true },
  //       { time: '17:30', available: true },
  //       { time: '18:00', available: false },
  //       { time: '18:30', available: false },
  //       { time: '19:00', available: true },
  //       { time: '19:30', available: true },
  //       { time: '20:00', available: true },
  //       { time: '20:30', available: true },
  //       { time: '21:00', available: true },
  //     ]
  //   },
  //   {
  //     id: '6',
  //     name: 'Premier Football Academy',
  //     location: 'Central District',
  //     rating: 4.7,
  //     pricePerHour: 180,
  //     image: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80',
  //     features: ['Floodlights', 'Changing Rooms', 'Parking', 'Spectator Area', 'Cafe', 'Pro Equipment', 'Personal Trainer'],
  //     availability: 'Medium',
  //     size: 'Standard (11-a-side)',
  //     timeSlots: [
  //       { time: '13:00', available: false },
  //       { time: '13:30', available: false },
  //       { time: '14:00', available: true },
  //       { time: '14:30', available: true },
  //       { time: '15:00', available: true },
  //       { time: '15:30', available: true },
  //       { time: '16:00', available: false },
  //       { time: '16:30', available: false },
  //       { time: '17:00', available: false },
  //       { time: '17:30', available: true },
  //       { time: '18:00', available: true },
  //       { time: '18:30', available: true },
  //       { time: '19:00', available: true },
  //       { time: '19:30', available: true },
  //       { time: '20:00', available: true },
  //       { time: '20:30', available: false },
  //       { time: '21:00', available: false },
  //     ]
  //   }
  // ]
  
  // Filter options
  const filterOptions = ['All Fields', 'Available Now', 'Premium', 'Standard Size', '5-a-side', '7-a-side']
  
  // Generate time slots for selection
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute of ['00', '30']) {
        const timeString = `${hour}:${minute}`
        slots.push(timeString)
      }
    }
    return slots
  }
  
  const timeSlots = generateTimeSlots()
  
  // Duration options in hours
  const durationOptions = [ 1, 1.5, 2, 2.5, 3, 3.5, 4 , 4.5, 5 ]
  
  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime: string, durationHours: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + durationHours * 60
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }
  
  const endTime = calculateEndTime(selectedStartTime, selectedDuration)
  
  // Format price with currency
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)}`
  }
  
  // Calculate total price based on duration
  const calculateTotalPrice = (pricePerHour: number, duration: number) => {
    return pricePerHour * duration
  }
  
  // Check if a field is available for the selected time slot
  const isFieldAvailable = (field: any) => {
    // This is a simplified availability check
    // In a real app, this would check against the selected date and time range
    return field.availability !== 'Low'
  }
  useEffect(() => {
      handleAvailableField(); // Gọi khi các giá trị thay đổi
    }, [selectedDate, selectedStartTime, selectedDuration]);



  
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: interFont }}>
      <Components.NavbarUser />
      
      {/* Luxurious Hero Section */}
      <div className="relative bg-gradient-to-r from-green-900 via-green-800 to-green-900 pt-32 pb-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-700/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-700/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: playfairFont }}>
              Discover Premium Football Fields
            </h1>
            <p className="text-green-100 text-lg mb-8">
              Book the perfect pitch for your game with our curated selection of elite venues
            </p>
          </div>
        </div>
      </div>
      
      {/* Luxurious Time Selection Panel */}
      <div className="bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6" style={{ fontFamily: playfairFont }}>
              Select Your Preferred Time
            </h2> 
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                   onChange={(e) => {
                      setSelectedDate(e.target.value);
                      handleAvailableField(); // Gọi hàm khi giá trị thay đổi
                    }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              
              {/* Start Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <select
                  value={selectedStartTime}
                   onChange={(e) => {
                    setSelectedStartTime(e.target.value);
                    handleAvailableField(); // Gọi hàm khi giá trị thay đổi
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <div className="relative">
                  <select
                    value={selectedDuration}
                    onChange={(e) => {
                      setSelectedDuration(parseFloat(e.target.value));
                      handleAvailableField(); // Gọi hàm khi giá trị thay đổi
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  >
                    {durationOptions.map((hours) => (
                      <option key={hours} value={hours}>
                        {hours === 0.5 ? '30 minutes' : hours === 1 ? '1 hour' : `${hours} hours`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Time Summary */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Your booking time:</span>
                </div>
                <div className="text-green-800 font-semibold">
                  {selectedStartTime} - {endTime} ({selectedDuration === 0.5 ? '30 minutes' : selectedDuration === 1 ? '1 hour' : `${selectedDuration} hours`})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: playfairFont }}>Filters</h3>
              
              {/* Price Range */}
              {/* <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">$50</span>
                    <span className="text-xs text-gray-500">$250</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="250" 
                    defaultValue="200" 
                    className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Max: $200/hour</span>
                  </div>
                </div>
              </div> */}
              
              {/* Field Size */}
              {/* <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Field Size</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-4 w-4" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Standard (11-a-side)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-4 w-4" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">7-a-side</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-4 w-4" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">5-a-side</span>
                  </label>
                </div>
              </div>
               */}
              {/* Amenities */}
              {/* <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Amenities</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-4 w-4" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Floodlights</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-4 w-4" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Changing Rooms</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-4 w-4" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Parking</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-4 w-4" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Spectator Area</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-4 w-4" />
                    <span className="ml-2 text-sm text-gray-700">Cafe</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 h-4 w-4" />
                    <span className="ml-2 text-sm text-gray-700">Pro Equipment</span>
                  </label>
                </div>
              </div> */}
              
              {/* Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Minimum Rating</h4>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4" selected>4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="5">5 Stars Only</option>
                </select>
              </div>
              
              {/* Apply Filters Button */}
              <Components.ButtonUser variant="primary" fullWidth>
                Apply Filters
              </Components.ButtonUser>
              
              {/* Reset Filters */}
              <button className="w-full text-center text-sm text-gray-500 hover:text-green-600 mt-4 transition-colors duration-200">
                Reset All Filters
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Top Bar with Sorting and View Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-gray-700 font-medium mr-3">Sort by:</span>
                <select className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="availability">Availability</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">View:</span>
                <button 
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${viewType === 'grid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${viewType === 'list' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Quick Filter Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 overflow-x-auto">
              <div className="flex space-x-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                      activeFilter === filter 
                        ? 'bg-green-600 text-white font-medium shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800" style={{ fontFamily: playfairFont }}>
                {allfields.length} Available Fields
              </h2>
              <p className="text-gray-600">
                For {selectedDate} • {selectedStartTime} - {endTime}
              </p>
            </div>
            
            {/* Fields Grid/List */}
            {viewType === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {allfields.map((field) => (
                  <div 
                    key={field.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={field.image} 
                        alt={field.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Field Size Badge */}
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                        {field.size}
                      </div>
                      
                      {/* Availability Badge */}
                      <div className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full ${
                        field.availability === 'High' 
                          ? 'bg-green-500/90 backdrop-blur-sm' 
                          : field.availability === 'Medium'
                            ? 'bg-yellow-500/90 backdrop-blur-sm'
                            : 'bg-red-500/90 backdrop-blur-sm'
                      }`}>
                        {field.availability} Availability
                      </div>
                      
                      {/* Quick Book Button (Visible on Hover) */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full shadow-lg transition-all duration-200">
                          Quick Book
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-200">
                          {field.name}
                        </h3>
                        <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm font-semibold text-gray-700">{field.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{field.location}</span>
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {field.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {feature}
                          </span>
                        ))}
                        {field.features.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{field.features.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      {/* Time Slots */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Time Slots:</h4>
                        <div className="flex flex-wrap gap-2">
                          {field.timeSlots.slice(0, 5).map((slot, index) => (
                            <span 
                              key={index} 
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                slot.available 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-400 line-through'
                              }`}
                            >
                              {slot.time}
                            </span>
                          ))}
                          {field.timeSlots.length > 5 && (
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{field.timeSlots.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-2xl font-bold text-gray-800">{formatPrice(field.pricePerHour)}</span>
                          <span className="text-gray-600 text-sm">/hour</span>
                          <div className="text-sm text-gray-500">
                            Total: {formatPrice(calculateTotalPrice(field.pricePerHour, selectedDuration))}
                          </div>
                        </div>
                        <Components.ButtonUser 
                          variant="primary"
                            onClick={() => addToCart(field)} // Truyền thông tin field vào hàm addToCart
                          >
                            Add to Cart
                        </Components.ButtonUser>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {allfields.map((field) => (
                  <div 
                    key={field.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 group flex flex-col md:flex-row"
                  >
                    <div className="relative md:w-1/3 h-56 md:h-auto overflow-hidden">
                      <img 
                        src={field.image} 
                        alt={field.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Field Size Badge */}
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                        {field.size}
                      </div>
                      
                      {/* Availability Badge */}
                      <div className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full ${
                        field.availability === 'High' 
                          ? 'bg-green-500/90 backdrop-blur-sm' 
                          : field.availability === 'Medium'
                            ? 'bg-yellow-500/90 backdrop-blur-sm'
                            : 'bg-red-500/90 backdrop-blur-sm'
                      }`}>
                        {field.availability} Availability
                      </div>
                    </div>
                    
                    <div className="p-6 md:w-2/3 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-200">
                          {field.name}
                        </h3>
                        <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm font-semibold text-gray-700">{field.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{field.location}</span>
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {field.features.map((feature, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      {/* Time Slots */}
                      <div className="mb-4 flex-grow">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Time Slots:</h4>
                        <div className="flex flex-wrap gap-2">
                          {field.timeSlots.slice(0, 8).map((slot, index) => (
                            <span 
                              key={index} 
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                slot.available 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-400 line-through'
                              }`}
                            >
                              {slot.time}
                            </span>
                          ))}
                          {field.timeSlots.length > 8 && (
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{field.timeSlots.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-2xl font-bold text-gray-800">{formatPrice(field.pricePerHour)}</span>
                          <span className="text-gray-600 text-sm">/hour</span>
                          <div className="text-sm text-gray-500">
                            Total: {formatPrice(calculateTotalPrice(field.pricePerHour, selectedDuration))}
                          </div>
                        </div>
                        <Components.ButtonUser variant="primary">
                          Add to CartAdd to Cart
                        </Components.ButtonUser>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                <button className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium">1</button>
                <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">2</button>
                <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">3</button>
                <span className="px-4 py-2 text-gray-600">...</span>
                <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">8</button>
                <button className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium CTA Section */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: playfairFont }}>
            Upgrade to Premium Membership
          </h2>
          <p className="text-green-100 text-lg max-w-3xl mx-auto mb-8">
            Get exclusive access to premium fields, priority booking, and special discounts with our Premium Membership.
          </p>
          <Components.ButtonUser variant="secondary" size="lg">
            Learn More
          </Components.ButtonUser>
        </div>
      </div>
      
      <Components.FooterUser />
    </div>
  )
}