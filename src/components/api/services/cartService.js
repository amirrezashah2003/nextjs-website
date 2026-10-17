import http from "../http";

// ۱. دریافت سبد خرید یک کاربر خاص با آیدی کاربر
export const getCart = async (userId) => {
  const res = await http.get(`/carts/${userId}`);
  return res.data;
};

// ۲. افزودن محصول به سبد خرید کاربر
// userId: آیدی کاربر | productId: آیدی محصول | quantity: تعداد
export const addToCart = async ({ userId, productId, quantity = 1 }) => {
  const res = await http.post(`/carts/${userId}`, { productId, quantity });
  return res.data;
};

// ۳. تغییر تعداد یک آیتم در سبد خرید
// itemId: شناسه همان ردیف در CartItem | quantity: تعداد جدید
export const updateCartItem = async ({ itemId, quantity }) => {
  const res = await http.put(`/carts/${itemId}`, { quantity });
  return res.data;
};

// ۴. حذف یک آیتم از سبد خرید
// itemId: شناسه ردیف در CartItem
export const removeFromCart = async (itemId) => {
  const res = await http.delete(`/carts/${itemId}`);
  return res.data;
};


// ۵. ادغام سبد خرید مهمان با سبد خرید سرور (هنگام لاگین)
export const mergeCart = async ({ userId, items }) => {
  const res = await http.post(`/carts/merge`, { userId, items });
  return res.data;
};