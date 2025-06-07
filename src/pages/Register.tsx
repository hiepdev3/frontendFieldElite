import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { EyeIcon, EyeOffIcon, UserIcon, MailIcon, LockIcon, PhoneIcon } from "lucide-react";
import { registerSimple } from '../userUI/apiUser/PublicServices';
import { sendVerificationCode,verifyCode } from '../userUI/apiUser/PublicServices'; // Import the function to send verification code
import { message } from 'antd'; // Import message từ Ant Design



interface RegistrationFormProps {
  onSubmit: (email: string) => void;
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    roleId: 3, // Default role for customer
    phoneNumber: "",
    verificationCode: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement| HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleSendCode = async () => {
    try {
      // Gọi API gửi mã xác minh
      await sendVerificationCode(formData.email);
      setIsCodeSent(true);
      message.success("Verification code sent to your email!"); // Hiển thị thông báo thành công
       setTimeout(() => {
        setIsCodeSent(false);
      }, 60000);
    } catch (error) {
     message.error("Failed to send verification code. Please try again."); // Hiển thị thông báo lỗi
  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
// Kiểm tra các trường trước khi gửi
      if (!formData.fullName.trim()) {
        message.error('Full Name is required.');
        setIsLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        message.error('Email is required.');
        setIsLoading(false);
        return;
      }

      if (!formData.password.trim()) {
        message.error('Password is required.');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 8 || formData.password.length > 30) {
        message.error('Password must be between 8 and 30 characters.');
        setIsLoading(false);
        return;
      }

      if (!formData.phoneNumber.trim()) {
        message.error('Phone Number is required.');
        setIsLoading(false);
        return;
      }
      if (!formData.verificationCode.trim()) {
        message.error('Verification Code is required.');
        setIsLoading(false);
        return;
      }
        

      
     
  try {
    // Gọi API verifyCode để kiểm tra mã xác minh
    const verifyResponse = await verifyCode(formData.email, formData.verificationCode);

    // Kiểm tra phản hồi từ API
    if (verifyResponse.data.code === 200) {
      // Nếu mã xác minh hợp lệ, tiếp tục gửi form đăng ký
      const response = await registerSimple(formData);

      if (response.data.code === 200) {
        message.success('Registration successful!');
        window.location.href = '/login'; // Chuyển hướng đến trang đăng nhập
      } 
    } 
  } catch (error: any) {
    // Xử lý lỗi từ Axios
      if (error.response && error.response.data) {
        console.log('Error response:', error.response.data);
        if( error.response.data.message === "User already exists") {
          message.error('Email already exists. Please use a different email.');
        }else{
          message.error('Invalid verification code. Please check and try again!');
        }
      } else {
        // Xử lý lỗi không có phản hồi từ server
        message.error('An unexpected error occurred. Please try again!');
      }
  } finally {
    setIsLoading(false);
  }

};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-zinc-500">
            Enter your information to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.fullName}
                  onChange={handleChange}
                  
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  
                />
              </div>
               <div className="flex items-center space-x-2 mt-2">
                <Input
                  id="verificationCode"
                  name="verificationCode"
                  placeholder="Enter verification code"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isCodeSent}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isCodeSent ? "Code Sent" : "Send"}
                </Button>
              </div>
            </div>
            

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  
        
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="pl-10"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleId">Role</Label>
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                
              >
                <option value={3}>Customer</option>
                <option value={2}>Người quản lý sân cho thuê</option>
              </select>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}