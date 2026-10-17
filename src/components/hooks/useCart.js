import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, removeFromCart, updateCartItem } from "@/components/api/services/cartService";
import { getGuestCart } from "@/utils/guestCart";

// ۱. هوک دریافت سبد خرید کاربر
export const useCart = (userId) => {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getCart(userId),
    enabled: !!userId, // فقط زمانی ریکوئست بزند که userId وجود داشته باشد
  });
};

// ۲. هوک افزودن محصول به سبد خرید
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, productId, quantity }) =>
      addToCart({ userId, productId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// ۳. هوک ویرایش تعداد یک آیتم
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }) =>
      updateCartItem({ itemId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// ۴. هوک حذف یک آیتم از سبد خرید
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};