'use client';
import { useGoogleFont } from '../fonts/fonts'
import React from "react"

export default function PromotionCardUser({ 
  promotion
}: { 
  promotion: {
    id: string
    title: string
    description: string
    discount: string
    image: string
    expiryDate: string
    isLimited: boolean
    code?: string
  }
}) {
  const interFont = useGoogleFont('Inter')
  const playfairFont = useGoogleFont('Playfair Display')
  
  return (
    <div 
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden min-w-[300px] max-w-sm flex-shrink-0 transition-all duration-300 hover:shadow-2xl border border-gray-100 group"
      style={{ fontFamily: interFont }}
    >
      {promotion.isLimited && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
          Limited Time
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={promotion.image} 
          alt={promotion.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="p-6 text-white w-full">
            <div className="bg-green-600/90 backdrop-blur-sm text-white text-lg font-bold px-4 py-2 rounded-lg inline-block mb-2 shadow-lg">
              {promotion.discount}
            </div>
            <h3 className="text-2xl font-bold" style={{ fontFamily: playfairFont }}>{promotion.title}</h3>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Expires: {promotion.expiryDate}
          </div>
        </div>
        <p className="text-gray-600 mb-6">{promotion.description}</p>
        
        {promotion.code && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-500 mb-1">Promo Code</div>
              <div className="font-mono font-bold text-gray-800">{promotion.code}</div>
            </div>
            <button className="text-green-600 text-sm font-medium hover:text-green-700 cursor-pointer">
              Copy
            </button>
          </div>
        )}
        
        <button className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer shadow-sm hover:shadow-md">
          Claim Offer
        </button>
      </div>
    </div>
  )
}