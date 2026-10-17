'use client';

// ایمپورت کامپوننت‌های اصلی
import { Swiper, SwiperSlide } from 'swiper/react';

// ایمپورت ماژول‌های مورد نیاز (مثلاً دکمه و نقطه‌های پایین)
import { Navigation } from 'swiper/modules';
import Image from 'next/image';

// ایمپورت استایل‌های سوایپر
import 'swiper/css';
import 'swiper/css/navigation';

import { useProducts } from '../hooks/useProducts';
import Link from 'next/link';



export default function ProductCarousel({ category , title }) {
    const { data, isLoading , isError } = useProducts(category);
    const products = typeof data === "string" ? JSON.parse(data) : data


    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
            
            </div>
        );
    }
    if (isError) return <div>خطا در دریافت اطلاعات!</div>;

    return (
        <div className="p-3 my-20 bg-gray-800 in-[.light]:bg-gray-200 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
            
            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                slidesPerView={2} // حالت موبایل
                breakpoints={{
                768: { slidesPerView: 3 }, // تبلت
                1024: { slidesPerView: 4 }, // دسکتاپ
                }}
            >
                {products.map( product => (
                    <SwiperSlide key={product.id}>
                        <div className="h-80 border border-gray-400 in-[.light]:border-gray-700 flex flex-col justify-between rounded-lg p-4 bg-bg-secondary">
                            <div className='relative w-full h-40 md:h-50 overflow-hidden rounded-md'>
                                <Link href={`/product/${product.id}`}>
                                    <Image 
                                        src={product.img} 
                                        alt={product.name} 
                                        fill 
                                        className="object-contain"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
        </div>
    );
}