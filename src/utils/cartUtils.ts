// Hàm khởi tạo cartCount từ localStorage
export const initializeCartCount = (setCartCount: (count: number) => void) => {
  const storedCartCount = localStorage.getItem('cartCount');
  if (storedCartCount) {
    setCartCount(parseInt(storedCartCount, 10));
  } else {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Lấy mảng cart
    const cartLength = cart.length; // Tính độ dài của mảng cart
    localStorage.setItem('cartCount', cartLength.toString()); // Lưu cartCount vào localStorage
    setCartCount(cartLength); // Cập nhật state
  }
};

// Hàm cập nhật cartCount khi giỏ hàng thay đổi
export const handleupdateCartCount = (setCartCount: (count: number) => void) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Lấy mảng cart
  const cartLength = cart.length; // Tính độ dài của mảng cart
  localStorage.setItem('cartCount', cartLength.toString()); // Lưu cartCount vào localStorage
  setCartCount(cartLength); // Cập nhật state
};

// Hàm thêm sản phẩm vào giỏ hàng
export const handleaddToCart = (item: any, setCartCount: (count: number) => void) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
  const isItemInCart = cart.some((cartItem: any) => cartItem.id === item.id);
  if (isItemInCart) {
    // Nếu sản phẩm đã tồn tại, hiển thị thông báo
    return false; // Trả về false để biết rằng sản phẩm đã tồn tại
  }
  // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng
  cart.push(item); // Thêm sản phẩm vào mảng cart
  localStorage.setItem('cart', JSON.stringify(cart)); // Lưu lại giỏ hàng vào localStorage
  handleupdateCartCount(setCartCount); // Cập nhật cartCount
  return true; // Trả về true để biết rằng sản phẩm đã được thêm thành công
};


// Hàm xóa sản phẩm khỏi giỏ hàng
export const handleremoveFromCart = (itemId: string, setCartCount: (count: number) => void) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const updatedCart = cart.filter((item: any) => item.id !== itemId); // Xóa sản phẩm khỏi mảng cart
  localStorage.setItem('cart', JSON.stringify(updatedCart)); // Lưu lại giỏ hàng
  handleupdateCartCount(setCartCount); // Cập nhật cartCount
};