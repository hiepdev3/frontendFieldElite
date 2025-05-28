import { AppUser } from '../types/AppUser.ts';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loginAll, getMe } from '../userUI/apiUser/PublicServices';
import { message } from 'antd';
import { loginWithGoogle } from '../userUI/apiUser/PublicServices';
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
    // Gọi API để đăng nhập
    const response = await loginAll(username, password);
    console.log('Login response:', response);
    if (response.data.code == 200) {
      // Lưu accessToken vào sessionStorage
      sessionStorage.setItem('accessToken', response.data.data.accessToken);

      // Gọi API lấy thông tin người dùng
      const userResponse = await getMe();
      if (userResponse.data.code == 200) {
        const data = userResponse.data.data;
        // Lưu thông tin người dùng vào sessionStorage và localStorage
        const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                  const cart = JSON.parse(storedCart);
                  // Chuyển đổi cart thành định dạng carts
                  const carts = cart.map((item: any) => ({
                    fieldId: item.id,
                    bookingDate: `${item.date}T${item.timeSlots}:00.000Z`,
                    timeEnd: new Date(
                      new Date(`${item.date}T${item.timeSlots}:00.000Z`).getTime() +
                        item.duration * 60 * 1000
                    ).toISOString(),
                    status: 0,
                }));
              const payload = {
                userId: data.id,
                carts: carts,
              };
              
              try {
                const addCartResponse = await addListCart(payload);
                cartCount= addCartResponse.data.data.carts.length;
                
                console.log('Carts added successfully:', addCartResponse.data.message);
              } catch (error) {
                console.error('Error adding carts:', error);
              }
            } 


        const userData: AppUser = {
          id: data.id,
          email: data.email,
          cartCount: data.cartCount,
          fullName: data.fullName,
        };

        localStorage.setItem('cartCount', userData.cartCount.toString());
        localStorage.setItem('fullname', userData.fullName);
        sessionStorage.setItem('fullname', data.fullName);
        sessionStorage.setItem('roleid', data.role.id.toString());
        sessionStorage.setItem('tierid', data.tierId.toString());
        sessionStorage.setItem('userid', data.id.toString());
        sessionStorage.setItem('user', 'true');
        localStorage.setItem('currentUser','true');
        
        // Cập nhật state
        setCurrentUser(userData);
        setIsLoggedIn(true);

        return response.data.accessToken;
      } else {
        throw new Error(userResponse.data.message || 'Failed to fetch user data.');
      }
    } else {
      throw new Error(response.data.message || 'Login failed.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('roleid');
    sessionStorage.removeItem('tierid');
    localStorage.removeItem('cartCount');
    localStorage.removeItem('fullname');
    sessionStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('fullname');
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