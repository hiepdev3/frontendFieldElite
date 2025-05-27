'use client';
import { useGoogleFont } from '../fonts/fonts'
import Components from "../componentUser"
import '../fonts/indexUser.css';
import React from "react"

export default function PromotionsUser() {
  const fontFamily = useGoogleFont('Inter')
  
  // Sample data for promotions
  const promotions = [
    {
      id: '1',
      title: 'Weekend Special',
      description: 'Book any field for 3 hours on weekends and get 20% off the total price. Valid for all fields and time slots during Saturday and Sunday.',
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      expiryDate: 'Aug 31, 2023',
      isLimited: true,
      code: 'WEEKEND20'
    },
    {
      id: '2',
      title: 'Group Discount',
      description: 'Book for a team of 10+ players and receive a special group discount. Just enter the promo code at checkout and enjoy savings on your booking.',
      discount: '15% OFF',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1093&q=80',
      expiryDate: 'Sep 15, 2023',
      isLimited: false,
      code: 'GROUP15'
    },
    {
      id: '3',
      title: 'Early Bird Offer',
      description: 'Book morning slots (6 AM - 10 AM) and get 25% off your booking. Perfect for early risers who want to start their day with a game.',
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1029&q=80',
      expiryDate: 'Aug 20, 2023',
      isLimited: true,
      code: 'EARLY25'
    },
    {
      id: '4',
      title: 'Season Pass',
      description: 'Regular player? Get our season pass for unlimited access to select fields. Pay once and enjoy playing throughout the season without additional booking fees.',
      discount: 'SAVE 30%',
      image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      expiryDate: 'Dec 31, 2023',
      isLimited: false,
      code: 'SEASON30'
    },
    {
      id: '5',
      title: 'First-Time Booking',
      description: 'New to FieldRental? Get 10% off on your first booking. Welcome to our community of football enthusiasts!',
      discount: '10% OFF',
      image: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      expiryDate: 'Ongoing',
      isLimited: false,
      code: 'WELCOME10'
    },
    {
      id: '6',
      title: 'Midweek Madness',
      description: 'Book any field from Monday to Thursday and enjoy special midweek rates. Perfect for those who want to avoid weekend crowds.',
      discount: '15% OFF',
      image: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80',
      expiryDate: 'Sep 30, 2023',
      isLimited: true,
      code: 'MIDWEEK15'
    },
    {
      id: '7',
      title: 'Refer a Friend',
      description: 'Refer a friend to FieldRental and both of you get 20% off on your next booking. Spread the word and save!',
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1521731978332-9e9e714bdd20?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      expiryDate: 'Ongoing',
      isLimited: false,
      code: 'REFER20'
    },
    {
      id: '8',
      title: 'Holiday Special',
      description: 'Special holiday rates for Christmas and New Year bookings. Celebrate the festive season with a game of football!',
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1536122985607-4fe00b283652?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      expiryDate: 'Dec 31, 2023',
      isLimited: true,
      code: 'HOLIDAY25'
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
              <h1 className="text-4xl font-bold text-white mb-2">Promotions & Offers</h1>
              <p className="text-green-100">Discover our latest deals and save on your next booking</p>
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
      
      {/* Featured Promotion */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-semibold mb-4">
                  Limited Time Offer
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Summer Championship Package</h2>
                <p className="text-white/90 mb-6">
                  Book a field for your summer championship and get exclusive benefits including referee services, equipment rental, and post-match refreshments.
                </p>
                <div className="flex items-center mb-6">
                  <div className="text-4xl font-bold text-white">40% OFF</div>
                  <div className="ml-4 text-white/80">
                    <div>Use code: <span className="font-mono font-bold">SUMMER40</span></div>
                    <div className="text-sm">Valid until August 31, 2023</div>
                  </div>
                </div>
                <Components.ButtonUser 
                  variant="secondary" 
                  size="lg"
                >
                  Claim This Offer
                </Components.ButtonUser>
              </div>
              <div className="w-full lg:w-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Summer Championship"
                  className="w-full h-full object-cover"
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* All Promotions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">All Current Promotions</h2>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 mb-8">
            <button className="text-green-600 border-b-2 border-green-600 pb-2 mr-8 font-medium">
              All Promotions
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-2 mr-8 font-medium cursor-pointer">
              Limited Time
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-2 mr-8 font-medium cursor-pointer">
              Ongoing
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-2 font-medium cursor-pointer">
              Seasonal
            </button>
          </div>
          
          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {promotions.map(promotion => (
              <div 
                key={promotion.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {promotion.isLimited && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    Limited Time
                  </div>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={promotion.image} 
                    alt={promotion.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold">{promotion.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-green-600 font-bold text-xl">{promotion.discount}</div>
                    <div className="text-sm text-gray-500">Expires: {promotion.expiryDate}</div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{promotion.description}</p>
                  <div className="bg-gray-100 p-3 rounded-lg mb-4">
                    <div className="text-xs text-gray-500 mb-1">Promo Code:</div>
                    <div className="flex justify-between items-center">
                      <div className="font-mono font-bold text-gray-800">{promotion.code}</div>
                      <button className="text-green-600 text-sm font-medium cursor-pointer">
                        Copy
                      </button>
                    </div>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer">
                    Claim Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter to receive the latest promotions and offers directly to your inbox.
            </p>
            <div className="flex flex-wrap max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 min-w-0 px-4 py-3 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-r-full font-medium hover:bg-green-700 transition-colors cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Components.FooterUser />
    </div>
  )
}