"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function AboutGallery() {
  const images = [
    "/images/profile1.jpeg", 
    "/images/profile2.jpeg",
    "/images/profile3.jpeg", 
    "/images/profile4.jpeg"
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto h-80 sm:h-96 flex items-center justify-center overflow-hidden">
        
        {/* کنترلر قبلی */}
        <button
          onClick={prevImage}
          className="absolute left-2 sm:left-6 bg-white/80 in-[.dark]:bg-gray-800/80 hover:bg-white in-[.dark]:hover:bg-gray-700 p-3 rounded-full shadow-md transition z-30 text-lg font-bold"
          aria-label="Previous Image"
        >
          ❯
        </button>

        {/* گالری چرخشی دایره‌ای داینامیک برای ۴ تصویر */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {images.map((src, idx) => {
              const isActive = idx === activeIndex;
              const offset = (idx - activeIndex + images.length) % images.length;
              
              let transformStyle = "scale-75 opacity-30 translate-x-32 z-0 pointer-events-none";
              
              if (isActive) {
                transformStyle = "scale-100 opacity-100 translate-x-0 z-20 shadow-2xl ring-4 ring-primary/50 pointer-events-auto";
              } else if (offset === 1) {
                // تصویر بعدی (سمت راست)
                transformStyle = "scale-85 opacity-60 translate-x-20 sm:translate-x-28 z-10 cursor-pointer";
              } else if (offset === images.length - 1) {
                // تصویر قبلی (سمت چپ)
                transformStyle = "scale-85 opacity-60 -translate-x-20 sm:-translate-x-28 z-10 cursor-pointer";
              } else {
                // تصویر چهارم (کاملاً در پس‌زمینه)
                transformStyle = "scale-60 opacity-0 translate-x-0 z-0 pointer-events-none";
              }

              return (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out rounded-full overflow-hidden bg-gray-200 in-[.dark]:bg-gray-800 cursor-pointer ${transformStyle}`}
                    onClick={() => setActiveIndex(idx)}
                >
                    <div className="relative w-full h-full flex items-center justify-center text-xs text-gray-500 in-[.dark]:text-gray-400">
                      <Image
                          src={src}
                          alt={`Amir Profile ${idx + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                      />
                    </div>
                </div>
              );
          })}
        </div>

        {/* کنترلر بعدی */}
        <button
          onClick={nextImage}
          className="absolute right-2 sm:right-6 bg-white/80 in-[.dark]:bg-gray-800/80 hover:bg-white in-[.dark]:hover:bg-gray-700 p-3 rounded-full shadow-md transition z-30 text-lg font-bold"
          aria-label="Next Image"
        >
           ❮
        </button>
    </div>
  );
}
