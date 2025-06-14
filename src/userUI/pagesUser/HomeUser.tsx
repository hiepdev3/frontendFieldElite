'use client';
import { useGoogleFont } from '../fonts/fonts'

import Components from "../componentUser"
import '../fonts/indexUser.css';
import React, { useState, useEffect } from "react";
import { getlistFieldForUser } from '../apiUser/PublicServices';


export default function HomeUser() {
  const interFont = useGoogleFont('Inter');
  const playfairFont = useGoogleFont('Playfair Display');
  const [loading, setLoading] = useState(true); // State để hiển thị trạng thái loading
  const [fields, setFields] = useState([]); 

  // Hàm gọi API
  const fetchFieldsforUser = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const response = await getlistFieldForUser(); // Gọi API
      const convertedFields = response.data.data.map((item) => ({
          id: String(item.id), // Chuyển `id` thành chuỗi
          name: item.name, // Giữ nguyên tên
          location: `${item.ward}, ${item.district}, ${item.province}`, // Gộp ward, district, province thành location
          rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1)), // Random rating từ 3.0 đến 5.0
          pricePerHour: item.price, // Gán giá trị price
          image: item.image || 'https://via.placeholder.com/150', // Nếu `image` null, dùng ảnh mặc định
      }));

      setFields(convertedFields); // Lưu dữ liệu trả về vào state
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
     fetchFieldsforUser();
  },[]);


  // Sample data for promotions
  const promotions = [
    {
      id: '1',
      title: 'Diamond Exclusive Week',
      description: 'Diamond members receive 30% off all bookings from Monday to Friday during the promotional week.',
      discount: '10% OFF',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1293&q=80',
      expiryDate: 'May 31, 2025',
      isLimited: true
    },
    {
      id: '2',
      title: 'Gold Evening Special',
      description: 'Special offer for Gold members: Enjoy 15% off when booking a field from 5:00 PM to 9:00 PM any day throughout June.',
      discount: '8% OFF',
      image: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80',
      expiryDate: 'Jun 30, 2025',
      isLimited: true
    },
    // {
    //   id: '3',
    //   title: 'Silver Morning Deal',
    //   description: 'Exclusive for Silver members: Get 10% off when booking a field between 6:00 AM and 11:00 AM on weekdays.',
    //   discount: '5% OFF',
    //   image: 'https://images.unsplash.com/photo-1599059811221-234c2f9fc8ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
    //   expiryDate: 'Jul 31, 2025',
    //   isLimited: true
    // },
    // {
    //   id: '4',
    //   title: 'Morning Field Rush',
    //   description: 'Book a field between 6:00 AM and 10:00 AM during the golden hours and get 5% off – available for all customers.',
    //   discount: '5% OFF',
    //   image: 'https://images.unsplash.com/photo-1509228627159-6452f6b7a2dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
    //   expiryDate: 'Jul 15, 2025',
    //   isLimited: false
    // }

  ]
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Đội trưởng, FC United",
      quote: "Chất lượng sân bóng trên nền tảng này thật sự tuyệt vời. Việc đặt sân rất dễ dàng và dịch vụ chăm sóc khách hàng cực kỳ chuyên nghiệp.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Nhà tổ chức sự kiện",
      quote: "Chúng tôi đã tổ chức nhiều giải đấu qua nền tảng này. Quy trình luôn suôn sẻ và sân đúng như mô tả.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Người chơi giải trí",
      quote: "Là người chơi bóng để vui cùng bạn bè, tôi thấy nền tảng này giúp việc tìm và đặt sân chất lượng gần nhà trở nên vô cùng đơn giản.",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ]
  
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: interFont }}>
      {/* Navbar */}
      <Components.NavbarUser cartItemCount={2} />
      
      {/* Hero Section */}
      <section className="relative pt-16 flex content-center items-center justify-center" style={{ minHeight: "90vh" }}>
        <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1540379708242-14a809bef941?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}>
          <span className="w-full h-full absolute bg-gradient-to-r from-black/80 to-black/40"></span>
        </div>
        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <h1 className="text-white text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: playfairFont }}>
                Nâng Tầm Trò Chơi
              </h1>
              <h2 className="text-green-400 text-2xl md:text-3xl font-light mb-8">
                Sân Bóng Đá Cao Cấp Trong Tầm Tay
              </h2>
              <p className="text-gray-200 text-lg mb-10 max-w-lg">
             Khám phá và đặt sân bóng đá chất lượng cho các trận đấu, giải đấu hoặc buổi tập luyện của bạn. Trải nghiệm sự tiện lợi, chất lượng và đẳng cấp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Components.ButtonUser 
                  variant="primary" 
                  size="lg"
                  href="/fields-user"
                >
                  Explore Fields
                </Components.ButtonUser>
                <Components.ButtonUser 
                  variant="outline" 
                  size="lg"
                >
                  How It Works
                </Components.ButtonUser>
              </div>
              <div className="mt-12 flex items-center">
                <div className="flex -space-x-2">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/men/67.jpg" alt="" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/women/21.jpg" alt="" />
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <p className="ml-2 text-white font-medium">4.9/5</p>
                  </div>
                  <p className="text-gray-300 text-sm">from over 2,000 reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,197.3C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: playfairFont }}>Vì Sao Chọn Chúng Tôi</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Trải nghiệm sự khác biệt với dịch vụ cho thuê sân bóng cao cấp – chất lượng, tiện lợi và giá trị vượt trội.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="w-16 h-16 bg-green-600/10 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Đặt Sân Siêu Nhanh</h3>
              <p className="text-gray-600">
               Chọn sân – chọn giờ – xác nhận, chỉ trong vài phút!
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chất Lượng Đỉnh Cao</h3>
              <p className="text-gray-600">
                Mỗi sân đều được kiểm định kỹ lưỡng và bảo trì thường xuyên, đảm bảo mặt sân luôn trong tình trạng tốt nhất.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Giá Cả Minh Bạch</h3>
              <p className="text-gray-600">
               Không phí ẩn – không phát sinh bất ngờ. Giá rõ ràng, cạnh tranh và ưu đãi đặc biệt cho khách hàng thân thiết.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Fields Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: playfairFont }}>Sân Nổi Bật</h2>
              <div className="w-24 h-1 bg-green-600 mb-4"></div>
              <p className="text-gray-600 max-w-xl">Khám phá danh sách các sân bóng cao cấp với cơ sở vật chất hiện đại và chất lượng thi đấu tuyệt vời.</p>
            </div>
            <Components.ButtonUser 
              variant="outline"
              href="/fields-user"
            >
              Xem Tất Cả Sân
            </Components.ButtonUser>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fields.map(field => (
              <Components.FieldCardUser 
                key={field.id} 
                field={field} 
                onAddToCart={(id) => console.log(`Added field ${id} to cart`)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: playfairFont }}>Khách Hàng Nói Gì Về Chúng Tôi</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">Đừng chỉ nghe từ chúng tôi – hãy xem các đội bóng và nhà tổ chức đánh giá thế nào về dịch vụ của chúng tôi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Promotions Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: playfairFont }}>Ưu Đãi Đặc Biệt</h2>
              <div className="w-24 h-1 bg-green-600 mb-4"></div>
              <p className="text-gray-600 max-w-xl">Tận dụng các chương trình khuyến mãi có thời hạn và ưu đãi độc quyền để tiết kiệm cho lần đặt sân tiếp theo.</p>
            </div>
            <Components.ButtonUser 
              variant="outline"
              href="/promotions-user"
            >
             Xem Tất Cả Ưu Đãi
            </Components.ButtonUser>
          </div>
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
              {promotions.map(promotion => (
                <Components.PromotionCardUser key={promotion.id} promotion={promotion} />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 L40 20" stroke="white" strokeWidth="1" fill="none" />
                <path d="M20 0 L20 40" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: playfairFont }}>Sẵn Sàng Trải Nghiệm Sân Bóng Đá Cao Cấp?</h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
             Hàng ngàn cầu thủ và đội bóng đã nâng tầm trận đấu của họ cùng chúng tôi. Đặt sân ngay hôm nay để cảm nhận sự khác biệt!</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Components.ButtonUser 
                variant="secondary" 
                size="lg"
                href="/fields-user"
              >
               Đặt Sân Ngay
              </Components.ButtonUser>
              <Components.ButtonUser 
                variant="outline" 
                size="lg"
              >
                Liên Hệ Hỗ Trợ
              </Components.ButtonUser>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Components.FooterUser />
    </div>
  )
}