"use client";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/components/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import { FaTrashCan, FaPlus, FaMinus, FaArrowRight } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import Styles from "./Cart.module.css"; // حتما این فایل را بساز
import { useMemo } from "react";
import { useUser } from "@/components/hooks/useUser";

export default function CartPage() {
    const { userId, isLoading: isUserLoading } = useUser();
    const { data: cart, isLoading: isCartLoading, isError } = useCart(userId);

    const updateCartItemMutation = useUpdateCartItem();
    const removeFromCartMutation = useRemoveFromCart();
    const isUpdating = updateCartItemMutation.isPending || removeFromCartMutation.isPending;
    
    const items = cart?.items || [];
    const subtotal = useMemo(() => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [items]);



    const handleIncrease = (item) => {
        updateCartItemMutation.mutate({
        itemId: item.id,
        quantity: item.quantity + 1,
        });
    };


    const handleDecrease = (item) => {
        if (item.quantity === 1) {
        removeFromCartMutation.mutate(item.id);
        return;
        }

        updateCartItemMutation.mutate({
        itemId: item.id,
        quantity: item.quantity - 1,
        });
    };



    const handleRemove = (itemId) => {
        removeFromCartMutation.mutate(itemId);
    };



    if (isUserLoading) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        );
    }


    if (!userId) {
        return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
            <h2 className="text-xl font-bold text-text-primary mb-3">
                برای مشاهده سبد خرید باید وارد حساب کاربری شوید
            </h2>
            <Link
                href="/auth"
                className="bg-primary text-white px-6 py-3 rounded-xl inline-flex items-center gap-2"
            >
                ورود به حساب
            </Link>
            </div>
        </div>
        );
    }


    if (isCartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }



    if (isError) {
        return (
        <div className="min-h-screen flex items-center justify-center text-red-500">
            خطایی در دریافت اطلاعات سبد خرید رخ داد.
        </div>
        );
    }





  return (
    <div className="bg-bg-primary min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        {isUpdating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 dark:bg-black/50 backdrop-blur-[2px] transition-all">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )}

        
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
          <FaShoppingBag className="text-primary" />
          سبد خرید شما
        </h1>

        {items.length === 0 ? (
          /* حالت سبد خرید خالی */
          <div className="bg-bg-tertiary rounded-2xl p-12 text-center shadow-sm border border-gray-100 in-[.dark]:border-gray-800">
            <div className="bg-gray-100 in-[.dark]:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">سبد خرید شما خالی است!</h2>
            <p className="text-text-secondary mb-8">به نظر می‌رسد هنوز محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
            <Link
              href="/"
              className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all inline-flex items-center gap-2"
            >
              <FaArrowRight />
              بازگشت به فروشگاه
            </Link>
          </div>
        ) : (
          /* حالت سبد خرید دارای محصول */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* بخش لیست محصولات (ستون اصلی) */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={`${Styles.cartItem} bg-bg-tertiary rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 in-[.dark]:border-gray-800 flex flex-col sm:flex-row items-center gap-4 md:gap-6 transition-all hover:shadow-md`}
                >
                  {/* تصویر محصول */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden bg-gray-50 in-[.dark]:bg-gray-700">
                    <Image
                      src={item.product.img || "/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* اطلاعات محصول */}
                  <div className="flex-1 text-center sm:text-right">
                    <h3 className="text-lg font-bold text-text-primary mb-1">{item.product.name}</h3>
                    <p className="text-primary font-semibold mb-2">{item.price.toLocaleString()} تومان</p>
                    <p className="text-xs text-text-secondary">کد محصول: {item.product.id}</p>
                  </div>

                  {/* کنترل تعداد و حذف */}
                  <div className="flex items-center justify-between w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 in-[.dark]:border-gray-800">
                    <div className="flex items-center border border-gray-200 in-[.dark]:border-gray-700 rounded-lg overflow-hidden">
                      <button 
                        disabled={isUpdating}
                        onClick={() => handleDecrease(item)}
                        className={`${Styles.quantityBtn} p-2 hover:bg-gray-100 in-[.dark]:hover:bg-gray-800`}
                        >
                        <FaMinus className="text-xs" />
                      </button>

                      <span className="px-4 font-medium text-text-primary">{item.quantity}</span>


                      <button 
                        disabled={isUpdating}
                        onClick={() => handleIncrease(item)}
                        className={`${Styles.quantityBtn} p-2 hover:bg-gray-100 in-[.dark]:hover:bg-gray-800`}
                        >
                        <FaPlus className="text-xs" />
                       </button>
                    </div>

                    <button 
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 in-[.dark]:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <FaTrashCan className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* بخش خلاصه سفارش (ستون کناری) */}
            <div className="lg:col-span-1">
              <div className="bg-bg-tertiary rounded-2xl p-6 shadow-sm border border-gray-100 in-[.dark]:border-gray-800 sticky top-24">
                <h2 className="text-xl font-bold text-text-primary mb-6">خلاصه سفارش</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-text-secondary">
                    <span>جمع محصولات</span>
                    <span className="text-text-primary">{subtotal.toLocaleString()} تومان</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>هزینه ارسال</span>
                    <span className="text-green-500">رایگان</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>مالیات (VAT)</span>
                    <span className="text-text-primary">۰ تومان</span>
                  </div>
                  <div className="border-t border-gray-100 in-[.dark]:border-gray-800 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-text-primary">مجموع کل</span>
                    <span className="text-xl font-black text-primary">{subtotal.toLocaleString()} تومان</span>
                  </div>
                </div>

                <button 
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95"
                  onClick={() => alert("در مرحله پرداخت قرار می‌گیرید...")}
                >
                  تایید و ادامه خرید
                </button>

                <Link 
                  href="/" 
                  className="block text-center mt-4 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  ادامه خرید محصولات
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
