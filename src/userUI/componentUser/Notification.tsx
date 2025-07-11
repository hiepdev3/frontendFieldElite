import React, { useEffect, useRef, useState } from 'react';

interface NotificationProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
}

const ICONS: Record<string, JSX.Element> = {
  success: (
    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
    </svg>
  ),
};

const CONFIG: Record<string, {
  border: string;
  title: string;
  text: string;
  message: string;
  progress: string;
}> = {
  success: {
    border: 'border-green-500 bg-green-600',
    title: 'Success!',
    text: 'text-white',
    message: 'text-green-100',
    progress: 'from-green-400 to-green-600',
  },
  error: {
    border: 'border-red-500 bg-red-600',
    title: 'Error!',
    text: 'text-white',
    message: 'text-red-100',
    progress: 'from-red-400 to-red-600',
  },
  warning: {
    border: 'border-yellow-500 bg-yellow-500',
    title: 'Warning!',
    text: 'text-white',
    message: 'text-yellow-100',
    progress: 'from-yellow-400 to-yellow-600',
  },
  info: {
    border: 'border-blue-500 bg-blue-600',
    title: 'Information',
    text: 'text-white',
    message: 'text-blue-100',
    progress: 'from-blue-400 to-blue-600',
  },
};

const Notification: React.FC<NotificationProps> = ({
  type = 'info',
  message,
  onClose,
}) => {
  const [hiding, setHiding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setTimeout(() => handleClose(), 5000);
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleClose = () => {
    setHiding(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const config = CONFIG[type] || CONFIG.info;

  return (
    <div
      className={`notification relative mb-4 p-4 rounded-lg shadow-lg border-l-4 overflow-hidden transition-all duration-500 ${
        config.border
      } ${hiding ? 'opacity-0 translate-x-full' : 'translate-x-0'}`}
      onMouseEnter={() => clearTimeout(timerRef.current)}
      onMouseLeave={() => {
        timerRef.current = setTimeout(() => handleClose(), 1000);
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{ICONS[type]}</div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${config.text}`}>{config.title}</p>
          <p className={`mt-1 text-sm ${config.message}`}>{message}</p>
        </div>
        <button onClick={handleClose} className="text-gray-200 hover:text-white ml-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${config.progress}`}></div>
    </div>
  );
};

export default Notification;
