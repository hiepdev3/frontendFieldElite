import { useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '../userUI/apiUser/PublicServices';

export const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        // Gọi hàm login từ AuthContext
        const reponse = await login(formData.username, formData.password);
        console.log("hiep day" , reponse);
        message.success('Login successful!');
        const roleid = sessionStorage.getItem('roleid');
          if (roleid === '2' || roleid === '1') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        
      } catch (error: any) {
        message.error(error.message || 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
  };

    const handleGoogleClick = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
          console.log('Google login successful:', tokenResponse);
          handleGoogleLogin(tokenResponse.access_token);
          // tokenResponse.access_token → bạn dùng gọi API Google để lấy info người dùng
        },
        onError: () => {
          console.log('Google login failed');
        },  
    });
    const handleGoogleLogin = async (accessToken: string) => {
      try {
          const response = await loginWithGoogle(accessToken);
          console.log('Login successful:', response.data.data);
      } catch (error) {
          console.error('Error during Google login:', error);
      }
    };
  useEffect(() => {
    // Lưu trang hiện tại vào localStorage trước khi người dùng đăng nhập
    localStorage.setItem('previousPage', window.location.pathname);
    
  }, []);
  useEffect(() => {
   
}, []);
 

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
          {/* Header */}
          <div className="p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-center mb-8">Sign in to continue</p>

            {/* Google Login Button */}
             <button className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl mb-6 flex items-center justify-center transition-all hover:bg-gray-50 hover:shadow-md group"
              onClick={handleGoogleClick}>
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                  fill="#4285F4"
                />
              </svg>
              <span className="transform transition-transform group-hover:translate-x-1 duration-200">
                Continue with Google
              </span>
            </button> 
             
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Username */}
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl outline-none border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
                  />
                  <svg
                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-xl outline-none border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
                  />
                  <svg
                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-500 rounded focus:ring-indigo-400 border-gray-300"
                    />
                    <span className="ml-2">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a
                href="/registration"
                className="text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
