import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Auto-redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/user-home');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-green-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center transform transition-all duration-500 hover:shadow-xl mx-4">
        <div className="mb-6">
          {/* Animated checkmark */}
          <div className="w-20 h-20 mx-auto flex items-center justify-center bg-green-100 rounded-full mb-6 animate-scaleIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Cảm ơn bạn đã xác nhận đơn hàng
          </h1>

          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã sử dụng dịch vụ đặt sân của chúng tôi. Đơn hàng của bạn đã được xử lý thành công.
          </p>

          {/* Countdown timer */}
          <div className="mb-4 transition-all duration-500">
            <p className="text-sm text-gray-500 italic">
              Bạn sẽ được chuyển hướng tự động sau <span className="font-medium">{seconds}</span> giây...
            </p>
          </div>

          <button
            onClick={() => navigate('/user-home')}
            className="w-full md:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 transform hover:scale-105"
          >
            Quay về trang chủ
          </button>
        </div>

        <div className="text-xs text-gray-400 mt-8">
          <p>Hỗ trợ khách hàng: Sohusport@gmail.com | 035 396 9623</p>
        </div>
      </div>

      {/* CSS-in-JS for the animation */}
      <style jsx>{`
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ThankYou;
