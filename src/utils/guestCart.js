// src/utils/guestCart.js

export const getGuestCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem('guest_cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const addToGuestCart = (product, quantity = 1) => {
  const cart = getGuestCart();
  const existingIndex = cart.findIndex((item) => item.productId === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      product: product, // اطلاعات کامل محصول برای نمایش در صفحه سبد خرید
      quantity: quantity,
    });
  }

  localStorage.setItem('guest_cart', JSON.stringify(cart));
  // ایجاد یک ایونت کاستوم برای آپدیت لحظه‌ای هدر در همان تب
  window.dispatchEvent(new Event('guestCartUpdated'));
};

export const clearGuestCart = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('guest_cart');
  window.dispatchEvent(new Event('guestCartUpdated'));
};
