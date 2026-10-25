"use client"
import { useParams, useSearchParams } from "next/navigation"
import { notFound } from "next/navigation" 
import { useProductsByCategoryAndBrand } from "@/components/hooks/useProducts"
import ProductCard from "@/components/ProductCard/ProductCard"
import Pagination from "@/components/pagination/pagination"

const categoryMap = {
    laptop: "لپتاپ ها",
    mobile: "موبایل ها",
    tablet: "تبلت ها",
    console: "کنسول ها"
};

const brandMap = {
    asus: "ایسوس",
    lenovo: "لنوو",
    apple: "اپل",
    hp: "اچ پی",
    msi: "ام اس آی",
    samsung: "سامسونگ",
    xiaomi: "شیائومی",
    sony: "سونی",
    microsoft: "مایکروسافت"
}
const ALLOWED_BRANDS = ['asus', 'lenovo', 'apple', 'hp', 'msi' , 'samsung' , 'xiaomi' , 'sony' , 'microsoft'];
const ALLOWED_CATEGORIES = ['laptop', 'mobile', 'tablet', 'console'];

export default function ProductBrand(){
    const params = useParams()
    const searchParams = useSearchParams()
    
    // خواندن شماره صفحه از URL (پیش‌فرض صفحه 1)
    const page = Number(searchParams.get("page")) || 1;

    const brand = params.productBrand
    const category = params.productName
    if (
        (category && !ALLOWED_CATEGORIES.includes(category)) || 
        (brand && !ALLOWED_BRANDS.includes(brand))
    ) {
        notFound();
    }
    const brandName = brandMap[brand] || ""
    const categoryName = categoryMap[category] || "محصولات"
    
    // ارسال صفحه به هوک
    const { data, isLoading, isError } = useProductsByCategoryAndBrand(category, brand, page)
    const products = data?.products ?? [];
    const totalPages = data?.totalPages ?? 1;
    

    if (isLoading) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        );
    }
    
    if (isError) return <div className="text-center py-20 text-red-500">خطا در دریافت اطلاعات!</div>;
    
    // امن‌سازی استخراج محصولات و تعداد کل صفحات از آبجکت دریافتی

    return(
        <main className="container mx-auto px-4 py-8">  
            <h1 className="text-2xl font-bold mb-8 text-gray-800 in-[.dark]:text-gray-200">محصولات فروشگاه</h1>
            <h2 className="mb-6 text-lg font-medium text-gray-600 in-[.dark]:text-gray-400">لیست {categoryName}ی {brandName}</h2>
    
            {/* گرید محصولات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* کامپوننت پجینیشن */}
            {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                    <Pagination totalPages={totalPages} currentPage={page} />
                </div>
            )}
        </main>
    )
}
