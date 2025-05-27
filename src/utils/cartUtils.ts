

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