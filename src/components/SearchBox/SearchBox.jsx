"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaMagnifyingGlass, FaSpinner, FaXmark } from "react-icons/fa6";
import { useDebounce } from "@/components/hooks/useDebounce";

function getDesktopResultsClass() {
  return [
    "absolute top-full right-0 left-0 z-[110] mt-2 overflow-hidden rounded-xl",
    "border border-gray-200 in-[.dark]:border-gray-800",
    "bg-white in-[.dark]:bg-gray-900",
    "shadow-2xl",
  ].join(" ");
}

function getMobileFloatingPanelClass(isOpen) {
  const base = [
    "fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[380px]",
    "bg-white in-[.dark]:bg-gray-900",
    "border border-gray-200 in-[.dark]:border-gray-800",
    "p-4 shadow-2xl rounded-2xl lg:hidden",
    "transition-all duration-300 origin-top z-[100]",
  ].join(" ");

  if (isOpen) {
    return `${base} top-[70px] opacity-100 scale-y-100 pointer-events-auto`;
  }

  return `${base} top-[0px] opacity-0 scale-y-0 pointer-events-none`;
}

function getMobileResultsClass() {
  return [
    "mt-3 overflow-hidden rounded-xl",
    "border border-gray-200 in-[.dark]:border-gray-700",
    "bg-white in-[.dark]:bg-gray-900",
  ].join(" ");
}

function SearchResults({
  query,
  products,
  isFetching,
  isError,
  mobile,
  onResultClick,
  onViewAll,
}) {
  const trimmed = query.trim();
  const wrapperClass = mobile ? getMobileResultsClass() : getDesktopResultsClass();

  return (
    <div className={wrapperClass}>
      {isFetching && (
        <div className="flex items-center justify-center gap-2 p-5 text-sm text-gray-500">
          <FaSpinner className="h-4 w-4 animate-spin text-primary" />
          <span>در حال جستجو...</span>
        </div>
      )}

      {!isFetching && isError && (
        <div className="p-5 text-center text-sm text-red-500">
          خطا در دریافت نتایج جستجو
        </div>
      )}

      {!isFetching && !isError && products.length === 0 && (
        <div className="p-5 text-center text-sm text-gray-500">
          محصولی برای «{trimmed}» پیدا نشد.
        </div>
      )}

      {!isFetching && !isError && products.length > 0 && (
        <>
          <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto in-[.dark]:divide-gray-800">
            {products.map((product) => (
              <li key={product.id}>
                <a
                  href={`/product/${product.id}`}
                  onClick={onResultClick}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-gray-50 in-[.dark]:hover:bg-gray-800/70"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 in-[.dark]:bg-gray-800">
                    <Image
                      src={product.img || "/images/placeholder.png"}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800 in-[.dark]:text-gray-200">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {new Intl.NumberFormat("fa-IR").format(product.price)} تومان
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <a
            href={`/search?q=${encodeURIComponent(trimmed)}`}
            onClick={(e) => {
              e.preventDefault();
              onViewAll();
            }}
            className="block w-full border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-xs font-medium text-primary transition-colors hover:bg-gray-100 in-[.dark]:border-gray-800 in-[.dark]:bg-gray-800/80 in-[.dark]:hover:bg-gray-800 cursor-pointer"
          >
            مشاهده همه نتایج برای «{trimmed}»
          </a>
        </>
      )}
    </div>
  );
}

function DesktopSearch({ query, setQuery }) {
  return (
    <div className="hidden lg:flex items-center relative flex-1 max-w-md">
      <FaMagnifyingGlass className="absolute right-3.5 text-gray-400 w-4 h-4 pointer-events-none" />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجوی محصولات، برندها و دسته‌ها..."
        className="w-full bg-bg-secondary border border-gray-200 in-[.dark]:border-gray-700/80 rounded-xl pr-10 pl-10 py-2.5 text-gray-800 in-[.dark]:text-gray-200 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-inner [&::-webkit-search-cancel-button]:appearance-none"
        autoComplete="off"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute left-3 text-gray-400 hover:text-gray-600 in-[.dark]:hover:text-gray-200"
          aria-label="پاک کردن"
        >
          <FaXmark className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function MobileSearchTrigger({ isOpen, onToggle, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggle}
      className="lg:hidden p-2.5 rounded-xl bg-bg-secondary text-gray-600 in-[.dark]:text-gray-300 hover:bg-gray-200 in-[.dark]:hover:bg-gray-700 transition-colors"
      aria-label="جستجو"
      aria-expanded={isOpen}
    >
      <FaMagnifyingGlass className="w-4 h-4" />
    </button>
  );
}

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopFocused, setIsDesktopFocused] = useState(false);

  const router = useRouter();

  const desktopContainerRef = useRef(null);
  const mobileContainerRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const mobileInputRef = useRef(null);

  const debounced = useDebounce(searchQuery.trim(), 400);

  const normalizedQuery = useMemo(() => debounced.toLowerCase(), [debounced]);
  const enabled = normalizedQuery.length >= 2;

  const { data, isFetching, isError } = useQuery({
    queryKey: ["search-preview", normalizedQuery],
    queryFn: async ({ signal }) => {
      const res = await axios.get("/api/products/search", {
        params: { q: normalizedQuery, limit: 6 },
        signal,
      });

      return res.data?.products || [];
    },
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  const products = data || [];

  const showDesktopResults = isDesktopFocused && enabled;
  const showMobileResults = isMobileOpen && enabled;

  useEffect(() => {
    function outsideHandler(e) {
      const clickedDesktop = desktopContainerRef.current?.contains(e.target);
      const clickedMobileContainer = mobileContainerRef.current?.contains(e.target);
      const clickedMobileButton = mobileButtonRef.current?.contains(e.target);

      if (!clickedDesktop) {
        setIsDesktopFocused(false);
      }

      if (!clickedMobileContainer && !clickedMobileButton) {
        setIsMobileOpen(false);
      }
    }

    function escHandler(e) {
      if (e.key === "Escape") {
        setIsDesktopFocused(false);
        setIsMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", outsideHandler);
    document.addEventListener("keydown", escHandler);

    return () => {
      document.removeEventListener("mousedown", outsideHandler);
      document.removeEventListener("keydown", escHandler);
    };
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;

    const timer = setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [isMobileOpen]);

  function submitHandler(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const q = searchQuery.trim();
    if (!q) return;

    setIsDesktopFocused(false);
    setIsMobileOpen(false);

    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function closeMobile() {
    setIsMobileOpen(false);
  }

  function onResultClick() {
    setIsDesktopFocused(false);
    setIsMobileOpen(false);
  }

  return (
    <>
      {/* دسکتاپ */}
      <div
        ref={desktopContainerRef}
        onFocusCapture={() => setIsDesktopFocused(true)}
        className="relative flex-1 hidden lg:block max-w-md"
      >
        <form onSubmit={submitHandler}>
          <DesktopSearch
            query={searchQuery}
            setQuery={(v) => {
              setSearchQuery(v);
              setIsDesktopFocused(true);
            }}
          />
        </form>

        {showDesktopResults && (
          <SearchResults
            query={searchQuery}
            products={products}
            isFetching={isFetching}
            isError={isError}
            onResultClick={onResultClick}
            onViewAll={submitHandler}
            mobile={false}
          />
        )}
      </div>

      {/* موبایل: دکمه باز کردن */}
      <MobileSearchTrigger
        isOpen={isMobileOpen}
        onToggle={() => setIsMobileOpen((prev) => !prev)}
        buttonRef={mobileButtonRef}
      />

      {/* موبایل: پنل شناور و لیست نتایج */}
      <div ref={mobileContainerRef} className="lg:hidden">
        <div className={getMobileFloatingPanelClass(isMobileOpen)}>
          <form onSubmit={submitHandler}>
            <div className="relative flex items-center">
              <FaMagnifyingGlass className="absolute right-4 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی محصولات..."
                className="w-full bg-gray-50 in-[.dark]:bg-gray-800 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl pr-12 pl-12 py-3.5 text-gray-800 in-[.dark]:text-gray-200 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-inner [&::-webkit-search-cancel-button]:appearance-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={closeMobile}
                className="absolute left-3 p-1 text-gray-400 hover:text-gray-600 in-[.dark]:hover:text-gray-200 transition-colors"
                aria-label="بستن"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {showMobileResults && (
          <div
            className="fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[380px] z-[101]"
            style={{ top: "calc(70px + 78px)" }}
          >
            <SearchResults
              query={searchQuery}
              products={products}
              isFetching={isFetching}
              isError={isError}
              onResultClick={onResultClick}
              onViewAll={submitHandler}
              mobile
            />
          </div>
        )}
      </div>
    </>
  );
}
