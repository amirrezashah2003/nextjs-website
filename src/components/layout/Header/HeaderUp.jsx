"use client";

import Image from "next/image";
import Link from "next/link";
import { FaBasketShopping } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import { useCart } from "@/components/hooks/useCart";
import { usePathname } from "next/navigation";
import SearchBox from "@/components/SearchBox/SearchBox";

function HeaderUp({ userPhone, userId }) {
  const pathname = usePathname();
  const [guestCount, setGuestCount] = useState(0);

  const { data: cart } = useCart(userId);

  const updateGuestCount = () => {
    try {
      const items = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      const total = items.reduce(
        (acc, item) => acc + Number(item.quantity || 1),
        0
      );
      setGuestCount(total);
    } catch {
      setGuestCount(0);
    }
  };

  useEffect(() => {
    if (!userId) {
      updateGuestCount();
    }
    const handleGuestCartUpdate = () => updateGuestCount();
    window.addEventListener("guest_cart_updated", handleGuestCartUpdate);
    window.addEventListener("storage", handleGuestCartUpdate);
    return () => {
      window.removeEventListener("guest_cart_updated", handleGuestCartUpdate);
      window.removeEventListener("storage", handleGuestCartUpdate);
    };
  }, [userId]);

  const serverItemsCount =
    cart?.items?.reduce((acc, item) => acc + Number(item.quantity || 1), 0) || 0;

  const totalItems = userId ? serverItemsCount : guestCount;

  return (
    <div className="bg-bg-tertiary h-20 select-none text-xs sm:text-sm md:text-base transition-colors relative z-50">
      <div className="container h-full px-4 flex items-center">
        <div className="w-full grid grid-cols-10 justify-start ">
          {/* سمت راست: لوگو + سرچ دسکتاپ */}
          <div className="col-span-3 md:col-span-5 flex items-center gap-1 flex-1 justify-start">
            <div className="flex items-center relative w-12 h-12 md:w-16 md:h-16 shrink-0">
              <Link href="/" className="relative w-full h-full block">
                <Image
                  src="/logo/amir-logo.png"
                  alt="amir logo"
                  fill
                  className="object-contain"
                  sizes="64px"
                  priority
                />
              </Link>
            </div>

            {/* این کامپوننت هم سرچ دسکتاپ دارد هم موبایل (دکمه+پنل) */}
            <SearchBox />
          </div>

          {/* سمت چپ: اکشن‌ها */}
          <div className="col-span-7 md:col-span-5 flex items-center gap-1 md:gap-4 relative justify-end">
            {/* SearchBox دکمه موبایلش را خودش می‌آورد، پس اینجا چیزی اضافه نمی‌کنیم */}
            <ThemeToggle />

            {/* بخش کاربر */}
            <div>
              {userPhone ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary! border border-primary! rounded-lg px-2.5 py-1.5 inline-block">
                    {userPhone}
                  </span>
                  <button
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.reload();
                    }}
                    className="border border-red-200 in-[.dark]:border-red-900/50 text-red-600 in-[.dark]:text-red-400 hover:bg-red-50 in-[.dark]:hover:bg-red-950/30 rounded-lg px-3 py-1.5 transition-colors text-xs font-medium"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <Link
                  href={`/auth?callback=${encodeURIComponent(pathname)}`}
                  className="border border-primary text-primary hover:bg-primary hover:text-white! rounded-lg px-3 py-1.5 transition-colors text-xs font-medium"
                >
                  ورود | ثبت‌نام
                </Link>
              )}
            </div>

            {/* سبد خرید */}
            <Link
              href="/cart"
              className="flex items-center gap-1 bg-primary hover:bg-primary-hover text-gray-100! rounded-lg px-3.5 py-1.5 transition-all shadow-sm active:scale-[0.98] relative"
            >
              <FaBasketShopping className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline font-medium">سبد خرید</span>

              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HeaderUp;
