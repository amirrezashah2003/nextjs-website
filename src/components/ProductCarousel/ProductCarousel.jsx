'use client';
import { useRef } from 'react';
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


export default function ProductCarousel({ category , title }) {
    const { data, isLoading , isError } = useProducts(category);
    const productsArray = data?.products || [];

    const swiperRef = useRef(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
            
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

                {/* ۳. دکمه‌های سفارشی که بیرون از محدوده overflow سوایپر هستند */}
                {/* این دکمه‌ها به والد (div relative) نسبت به موقعیت قرار می‌گیرند */}
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 z-100 bg-black/20 in-[.dark]:bg-white/20 hover:bg-primary text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all"
                    aria-label="Previous slide"
                >
                    <IoChevronBack size={24} />
                </button>

                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute -right-5 top-1/2 -translate-y-1/2 z-100 bg-black/20 in-[.dark]:bg-white/20 hover:bg-primary text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all"
                    aria-label="Next slide"
                >
                    <IoChevronForward size={24} />
                </button>

            </div>
            
        </div>
    );
}