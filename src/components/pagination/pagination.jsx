"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Pagination({ totalPages, currentPage }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="صفحه قبل"
      >
        <HiChevronRight />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-primary text-white border-primary"
              : "border-zinc-300 in-[.dark]:border-zinc-700 text-zinc-700 in-[.dark]:text-zinc-300 hover:border-primary"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="صفحه بعد"
      >
        <HiChevronLeft />
      </button>
    </nav>
  );
}
