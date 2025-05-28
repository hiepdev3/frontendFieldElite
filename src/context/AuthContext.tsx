import { AppUser } from '../types/AppUser.ts';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loginAll, getMe } from '../userUI/apiUser/PublicServices';

import { addListCart} from '../userUI/apiUser/PublicServices';


interface IAuthContext {
  isLoggedIn: boolean;
  currentUser: AppUser | null;
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isLoggedIn: false,
  currentUser: null,
  login: async () => '',
  logout: () => {},
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

      if (response.data.code === 200) {
        // Lưu accessToken vào sessionStorage
        sessionStorage.setItem('accessToken', response.data.data.accessToken);

        // Gọi API lấy thông tin người dùng
        const userResponse = await getMe();
        if (userResponse.data.code == 200) {
          const data = userResponse.data.data;
          const cartCount  = 0 ;
          
          if(data.role.id == 3) {
                // Kiểm tra xem có giỏ hàng trong localStorage không
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                      const cart = JSON.parse(storedCart);
                      if (Array.isArray(cart) && cart.length > 0) {
                        const payload = {
                          userId: data.id,
                          carts: cart,
                        };

                    try {
                      const addCartResponse = await addListCart(payload);
                      if (addCartResponse.data.code !== 200) {
                        throw new Error(addCartResponse.data.message);
                      }
                      
                    } catch (error) {
                      throw new Error("Failed to sync cart.");
                    }
                  }
                }   
           }

            const userData: AppUser = {
                            id: data.id,
                            email: data.email,
                            cartCount: cartCount,
                            fullName: data.fullName,
                          };
          
         

          sessionStorage.setItem('fullname', data.fullName);
          sessionStorage.setItem('roleid', data.role.id.toString());
          sessionStorage.setItem('tierid', data.tierId.toString());
          sessionStorage.setItem('userid', data.id.toString());
          sessionStorage.setItem('user', 'true');
          localStorage.setItem('currentUser', 'true');

          // Cập nhật state
          setCurrentUser(userData);
          setIsLoggedIn(true);

          return "ok"; // Trả về "ok" nếu mọi thứ thành công
        } else {
          throw new Error("Failed to fetch user data.");
        }
      } else {
        throw new Error("Invalid username or password.");
      }
    } catch (error: any) {
      console.error("Login error:", error.message || error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  };

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();

    // Cập nhật state
    setIsLoggedIn(false);
    setCurrentUser(null);
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
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);