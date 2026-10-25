'use client';
import { useRef, useState, useEffect } from 'react'; // اضافه شدن useState و useEffect
// ایمپورت کامپوننت‌های اصلی
import { Swiper, SwiperSlide } from 'swiper/react';

// ایمپورت ماژول‌های مورد نیاز (مثلاً دکمه و نقطه‌های پایین)
import { Navigation } from 'swiper/modules';
import Image from 'next/image';

import { useProducts } from '../hooks/useProducts';
import Link from 'next/link';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
// ایمپورت استایل‌های سوایپر
import 'swiper/css';

export default function ProductCarousel({ category, title }) {
    const { data, isLoading, isError } = useProducts(category);
    const productsArray = data?.products || [];

    const swiperRef = useRef(null);
    
    // ۱. اضافه کردن استیت برای جلوگیری از Hydration Mismatch
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (isLoading) {
        return (
            <div className="p-3 my-20 bg-gray-800 in-[.light]:bg-gray-200 rounded-lg">
                <div className="h-8 w-48 bg-gray-400/20 animate-pulse rounded mb-6" /> {/* اسکلتون عنوان */}
                
                {/* ایجاد شبکه‌ای شبیه به اسلایدهای کروسل */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="h-80 flex flex-col justify-between rounded-lg p-4 bg-bg-secondary">
                            {/* اسکلتون عکس */}
                            <div className="w-full h-40 bg-gray-400/20 animate-pulse rounded-md" />
                            
                            <div className="space-y-3">
                                {/* اسکلتون نام محصول */}
                                <div className="h-5 w-3/4 bg-gray-400/20 animate-pulse rounded" />
                                {/* اسکلتون قیمت */}
                                <div className="h-4 w-1/2 bg-gray-400/20 animate-pulse rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    if (isError) {
        return (
            <div className="text-center py-12 text-red-500">
                خطا در دریافت اطلاعات!
            </div>
        );
    }

    // ۲. اگر هنوز در مرحله Hydration هستیم، چیزی رندر نکن تا خطا نگیری
    if (!isMounted) {
        return <div className="h-80 w-full bg-gray-100 in-[.dark]:bg-gray-800 animate-pulse rounded-lg" />;
    }

    return (
        <div className="p-3 my-20 bg-gray-800 in-[.light]:bg-gray-200 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
            
            <div className='relative group'>
                <Swiper
                    modules={[Navigation]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)} // ذخیره کردن نمونه سوایپر
                    spaceBetween={20}
                    slidesPerView={2}
                    breakpoints={{
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="mySwiper"
                >
                    {productsArray.map(product => (
                        <SwiperSlide key={product.id}>
                            <div className="h-80 border border-gray-400 in-[.light]:border-gray-700 flex flex-col justify-between rounded-lg p-4 bg-bg-secondary">
                                <div className='relative w-full h-40 md:h-50 overflow-hidden rounded-md'>
                                    <Link href={`/product/${product.id}`}>
                                        <Image 
                                            src={product.img} 
                                            alt={product.name} 
                                            fill 
                                            className="object-contain"
                                        />
                                    </Link>
                                </div>
                                <div>
                                    <h3 className="mt-4 font-bold">{product.name}</h3>
                                    <p className="text-primary">
                                        {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* دکمه‌های سفارشی */}
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-black/20 in-[.dark]:bg-white/20 hover:bg-primary text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all"
                    aria-label="Previous slide"
                >
                    <IoChevronBack size={24} />
                </button>

                <button
                onClick={() => swiperRef.current?.slidePrev()} 
                    className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-black/20 in-[.dark]:bg-white/20 hover:bg-primary text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all"
                    aria-label="Next slide"
                >
                    <IoChevronForward size={24} />
                </button>

            </div>
        </div>
    );
}
