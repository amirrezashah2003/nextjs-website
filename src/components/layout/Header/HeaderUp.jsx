"use client";
import Image from "next/image";
import { FaBasketShopping, FaMagnifyingGlass } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import Styles from "./HeaderUp.module.css";
import { useCart } from "@/components/hooks/useCart"; 
import { usePathname } from "next/navigation";

function HeaderUp({ userPhone, userId }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0); // ذخیره تعداد برای حالت مهمان
  const inputRef = useRef(null);
  const magnifyRef = useRef(null);

  const { data: cart } = useCart(userId);

  // ۱. تابع خواندن تعداد محصولات از لوکال‌استوریج برای کاربر مهمان
  const updateGuestCount = () => {
    try {
      const items = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const total = items.reduce((acc, item) => acc + Number(item.quantity || 1), 0);
      setGuestCount(total);
    } catch {
      setGuestCount(0);
    }
  };

  // ۲. مدیریت لیسنرها برای آپدیت آنی تعداد مهمان
  useEffect(() => {
    if (!userId) {
      updateGuestCount();
    }

    const handleGuestCartUpdate = () => {
      updateGuestCount();
    };

    window.addEventListener("guest_cart_updated", handleGuestCartUpdate);
    window.addEventListener("storage", handleGuestCartUpdate);

    return () => {
      window.removeEventListener("guest_cart_updated", handleGuestCartUpdate);
      window.removeEventListener("storage", handleGuestCartUpdate);
    };
  }, [userId]);

  // ۳. محاسبه تعداد کل: اگر لاگین بود از دیتابیس، در غیر این صورت از لوکال‌استوریج
  const serverItemsCount = cart?.items?.reduce((acc, item) => acc + Number(item.quantity || 1), 0) || 0;
  const totalItems = userId ? serverItemsCount : guestCount;

  useEffect(() => {
    const outsideInputHandler = (e) => {
      const insideInput = inputRef.current?.contains(e.target);
      const magnify = magnifyRef.current?.contains(e.target);
      if (!insideInput && !magnify) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", outsideInputHandler);
    return () => {
      document.removeEventListener("click", outsideInputHandler);
    };
  }, [inputRef, magnifyRef]);

  const searchHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-bg-tertiary h-20 select-none text-xs sm:text-sm md:text-base">
      <div className="container h-10/10">
        <div className="row h-10/10 grid grid-cols-[1fr_9fr] lg:grid-cols-[4fr_6fr]">
          <div className="flex items-center">
            <div className="flex items-center relative w-14 h-14 md:w-20 md:h-20">
              <a href="/">
                <Image 
                  src="/logo/amir-logo.png"
                  alt="amir logo"
                  fill
                />
              </a>
            </div>
            {/* اینپوت سرچ دسکتاپ */}
            <div className="input items-center hidden lg:flex flex-1">
              <input className={`${Styles.input}`} type="text" placeholder="جستجوی محصولات ..." />
            </div>
          </div>

          <div className="flex gap-0.5 md:gap-4 justify-end items-center relative">
            <FaMagnifyingGlass ref={magnifyRef} onClick={searchHandler} className="lg:hidden w-5 h-5 me-2" />
            {/* اینپوت سرچ موبایل */}
            <div ref={inputRef} className={`${Styles.searchcontainer} ${isOpen ? Styles.active : ""} lg:hidden`}> 
              <input className={`${Styles.search}`} type="text" placeholder="جستجوی محصولات ..." />
            </div>

            <ThemeToggle />

            <div>
              {userPhone ? (
                <div className="flex items-end gap-1 md:gap-3">
                  <span className="text-xs font-medium border-b border-primary rounded-[5px] px-2 py-1">
                    {userPhone}
                  </span>
                  <button
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.reload();
                    }}
                    className="border border-primary rounded-[5px] px-2 py-1"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <a
                  href={`/auth?callback=${encodeURIComponent(pathname)}`}
                  className="border border-primary rounded-[5px] px-2 py-1"
                >
                  ورود | ثبت‌نام
                </a>
              )}
            </div>

            <a href="/cart" className="flex items-center border border-primary rounded-[5px] px-2 py-1 relative">
              <span>سبد خرید</span>
              <FaBasketShopping className="h-4 w-4 md:h-6 md:w-6" />
            
              {/* نمایش تعداد آیتم‌ها */}
              {totalItems > 0 && (
                <span className={`${Styles.shopnumber} text-white`}>
                  {totalItems}
                </span>
              )}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderUp;
