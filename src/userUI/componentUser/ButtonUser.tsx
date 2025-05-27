'use client';
import { useGoogleFont } from '../fonts/fonts'
import React from "react"

export default function ButtonUser({ 
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  href
}: { 
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  onClick?: () => void
  href?: string
}) {
  const fontFamily = useGoogleFont('Inter')
  
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer"
  
  const variantClasses = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg border border-transparent",
    secondary: "bg-white text-gray-800 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200",
    outline: "bg-transparent text-green-600 hover:bg-green-50 border border-green-600"
  }
  
  const sizeClasses = {
    sm: "text-sm px-4 py-2 rounded-lg",
    md: "text-base px-6 py-3 rounded-xl",
    lg: "text-base px-8 py-4 rounded-xl"
  }
  
  const widthClass = fullWidth ? "w-full" : ""
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`
  
  if (href) {
    return (
      <a 
        href={href}
        className={classes}
        style={{ fontFamily }}
      >
        {children}
      </a>
    )
  }
  
  return (
    <button 
      className={classes}
      onClick={onClick}
      style={{ fontFamily }}
    >
      {children}
    </button>
  )
}