"use client"
import { useParams, useSearchParams } from "next/navigation"
import { notFound } from "next/navigation" 
import { useProducts } from "@/components/hooks/useProducts";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/pagination/pagination";

const categoryMap = {
    laptop: "لپتاپ ها",
    mobile: "موبایل ها",
    tablet: "تبلت ها",
    console: "کنسول ها"
};
const ALLOWED_CATEGORIES = ['laptop', 'mobile', 'tablet', 'console'];

export default function ProductName() {
    const params = useParams();
    const searchParams = useSearchParams();
    
    // ۱. گرفتن نام از پارامتر، اگر نبود یعنی صفحه اصلی است
    const myName = params.productName || null; 
    if (myName && !ALLOWED_CATEGORIES.includes(myName)) {
        notFound();
    }
    
    // ۲. تعیین عنوان: اگر myName نبود، یعنی صفحه اصلی است
    const title = myName ? (categoryMap[myName] || "محصولات") : "محصولات ویژه";

    const page = parseInt(searchParams.get("page") || "1", 10);

    // ۳. اصلاح هوک: اگر myName نبود، مقدار null یا رشته خالی بفرست تا هوک بداند فیلتری لازم نیست
    // (باید مطمئن شویم هوک useProducts وقتی ورودی null می‌گیرد، همه محصولات را می‌آورد)
    const { data, isLoading, isError } = useProducts(myName, page);
    
    const products = data?.products ?? [];
    const totalPages = data?.totalPages ?? 1;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                خطا در دریافت اطلاعات محصولات!
            </div>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8 text-gray-800 in-[.dark]:text-gray-200">فروشگاه ما</h1>
            <h2 className="mb-5 text-lg">{title}</h2>

            {products.length === 0 ? (
                <p className="text-center py-12 text-zinc-500">محصولی در این صفحه یافت نشد.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <Pagination totalPages={totalPages} currentPage={page} />
                </>
            )}
        </main>
    );
}
