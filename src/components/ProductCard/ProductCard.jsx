"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="flex flex-col border border-gray-700 rounded-2xl p-4 bg-bg-secondary shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* بخش تصویر */}
      <Link href={`/product/${product.id}`}  className={`relative w-full aspect-square mb-4 overflow-hidden rounded-xl in-[.light]:bg-gray-300 in-[.dark]:bg-gray-500`}>
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* نام و مشخصات */}
      <div className="flex flex-col grow">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm in-[.dark]:text-gray-400 in-[.light]:text-gray-700 line-clamp-2 mb-4 leading-relaxed">
            {product.name}
          </h3>
        </Link>
        
        {/* نمایش مشخصات فنی (info) */}
        <p className="font-bold in-[.dark]:text-gray-700 in-[.light]:text-gray-400 text-xs  line-clamp-2 h-10 mb-2 leading-5">
          {product.info}
        </p>
      </div>

      {/* قیمت و دکمه */}
      <div className="mt-auto pt-4 border-t border-gray-100 in-[.light]:border-gray-900 flex items-center justify-between">
        <span className="text-primary font-bold text-sm">
          {new Intl.NumberFormat("fa-IR").format(product.price)} <span className="text-[10px] text-gray-400">تومان</span>
        </span>
        <Link href={`/product/${product.id}`}>
          <button className="border text-primary hover:bg-primary hover:border-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
            مشاهده
          </button>
        </Link>
      </div>
    </div>
  );
}