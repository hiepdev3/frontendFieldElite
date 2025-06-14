import { AppUser } from '../types/AppUser.ts';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loginAll, getMe } from '../userUI/apiUser/PublicServices';

import { addListCart} from '../userUI/apiUser/PublicServices';
import { message } from 'antd';

interface IAuthContext {  
  isLoggedIn: boolean;
  currentUser: AppUser | null;
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
  fetchUserData: () => Promise<AppUser | null>;
}

const AuthContext = createContext<IAuthContext>({
  isLoggedIn: false,
  currentUser: null,
  login: async () => '',
  logout: () => {},
  fetchUserData: async () => null, 
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    sessionStorage.getItem('user') === 'true'
  );
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  const login = async (username: string, password: string): Promise<string> => {
    try {
      // Gọi API để đăng nhập
      const response = await loginAll(username, password);

        if (response.data.code == 200) {
           if (response.data.data.status === false) {
              // Chuyển hướng đến trang account-disabled
              window.location.href = '/account-disabled';
              return; // Dừng xử lý tiếp theo
            }
            // Lưu accessToken vào sessionStorage
            sessionStorage.setItem('accessToken', response.data.data.accessToken);
            // Gọi API lấy thông tin người dùng
            const userData = await fetchUserData();
            if (!userData) {
                throw new Error("Failed to fetch user data.");
            }
                // Cập nhật state
                setCurrentUser(userData);
                setIsLoggedIn(true);
        } 
          return "ok"; 
    } catch (error: any) {
      message.error('Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập của bạn và thử lại.');
    }
  };

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();

    // Cập nhật state
    setIsLoggedIn(false);
    setCurrentUser(null);
  };


  const fetchUserData = async (): Promise<AppUser | null> => {
      try {
        // Gọi API lấy thông tin người dùng
        const userResponse = await getMe();
        if (userResponse.data.code === 200) {
          
          const data = userResponse.data.data;

          // Kiểm tra role và xử lý giỏ hàng nếu cần
          if (data.role.id === 3) {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
              const cart = JSON.parse(storedCart);
              if (Array.isArray(cart) && cart.length > 0) {
                // const payload = {
                //   userId: data.id,
                //   carts: cart,
                // };

                try {
                  
                  const addCartResponse = await addListCart(data.id, cart );
                  if (addCartResponse.data.code !== 200) {
                    throw new Error(addCartResponse.data.message);
                  }
                } catch (error) {
                  throw new Error("Failed to sync cart.");
                }
              }
            }
          }

          // Tạo đối tượng AppUser
          const userData: AppUser = {
            id: data.id,
            email: data.email,
            cartCount: 0, // Giá trị mặc định, có thể cập nhật sau
            fullName: data.fullName,
          };

          // Lưu thông tin vào sessionStorage
          sessionStorage.setItem('fullname', data.fullName);
          sessionStorage.setItem('roleid', data.role.id.toString());
          sessionStorage.setItem('tierid', data.tierId.toString());
          sessionStorage.setItem('userid', data.id.toString());
          sessionStorage.setItem('user', 'true');
        

          return userData;
        } else {
          throw new Error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    };

  useEffect(() => {
    // Khởi tạo danh sách cart nếu chưa tồn tại
    const storedCart = localStorage.getItem('cart');
    if (!storedCart) {
      localStorage.setItem('cart', JSON.stringify([]));
    }

    const handleBeforeUnload = () => {
      localStorage.removeItem('cartCount');
      localStorage.removeItem('fullname');
      localStorage.removeItem('previousPage');
      localStorage.removeItem('role');
      localStorage.removeItem('roleid');
      localStorage.removeItem('username');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);