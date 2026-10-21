"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaMagnifyingGlass, FaArrowLeft } from "react-icons/fa6";
import ProductCard from "@/components/ProductCard/ProductCard";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

function SearchResultsContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["search-all-products", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await axios.get(
        `/api/products/search?q=${encodeURIComponent(query)}&limit=24`
      );
      return response.data?.products || [];
    },
    enabled: Boolean(query.trim()) && mounted,
    staleTime: 1000 * 60 * 2,
  });

  const products = data || [];
  const showLoading = !mounted || isLoading || isFetching;

  return (
    <main className="container mx-auto px-4 py-8 min-h-[60vh]">
      {/* سربرگ صفحه جستجو */}
      <div className="mb-8 border-b border-zinc-200 in-[.dark]:border-zinc-800 pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-800 in-[.dark]:text-zinc-100 flex items-center gap-2">
          <FaMagnifyingGlass className="text-primary text-lg" />
          نتایج جستجو برای: <span className="text-primary">«{query}»</span>
        </h1>
        <p className="text-sm text-zinc-500 in-[.dark]:text-zinc-400 mt-2">
          {showLoading
            ? "در حال بررسی و بارگذاری کالاها..."
            : `تعداد ${products.length} کالا پیدا شد`}
        </p>
      </div>

      {/* ۱. وضعیت بارگذاری */}
      {showLoading && <LoadingSpinner />}

      {/* ۲. وضعیت بروز خطا */}
      {!showLoading && isError && (
        <div className="bg-red-50 in-[.dark]:bg-red-950/30 border border-red-200 in-[.dark]:border-red-900 rounded-2xl p-6 text-center text-red-600 in-[.dark]:text-red-400">
          <p>خطایی در بارگذاری نتایج رخ داده است. لطفاً مجدداً تلاش کنید.</p>
        </div>
      )}

      {/* ۳. وضعیت خالی بودن نتایج */}
      {!showLoading && !isError && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-zinc-100 in-[.dark]:bg-zinc-800 flex items-center justify-center text-zinc-400 text-3xl mb-4">
            <FaMagnifyingGlass />
          </div>
          <h2 className="text-lg font-bold text-zinc-700 in-[.dark]:text-zinc-200 mb-1">
            نتیجه‌ای پیدا نشد!
          </h2>
          <p className="text-sm text-zinc-500 in-[.dark]:text-zinc-400 max-w-md">
            کالایی مطابق با عبارت «{query}» یافت نشد. املای کلمه را بررسی کرده یا با کلمات کلی‌تر جستجو کنید.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            بازگشت به صفحه اصلی
            <FaArrowLeft className="text-xs" />
          </a>
        </div>
      )}

      {/* ۴. گرید محصولات با کامپوننت مشترک ProductCard */}
      {!showLoading && !isError && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 py-8 min-h-[60vh]">
          <LoadingSpinner />
        </main>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
