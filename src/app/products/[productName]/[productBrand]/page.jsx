"use client"
import { useParams } from "next/navigation"
import { useProductsByCategoryAndBrand } from "@/components/hooks/useProducts"
import ProductCard from "@/components/ProductCard/ProductCard"


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


export default function ProductBrand(){
    const params = useParams()
    const brand = params.productBrand
    const brandName = brandMap[brand]
    const category = params.productName
    const categoryName = categoryMap[category]
    
    const { data , isLoading , isError} = useProductsByCategoryAndBrand(category , brand)
    const products = typeof data === "string" ? JSON.parse(data) : data


    if (isLoading) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        );
    }
    if (isError) return <div>خطا در دریافت اطلاعات!</div>;
    
    
    return(
        <main className="container mx-auto px-4 py-8">  
            <h1 className="text-2xl font-bold mb-8 text-gray-800 in-[.dark]:text-gray-200">محصولات فروشگاه</h1>
            <h2 className="mb-2 text-center">لیست {categoryName}ی {brandName}</h2>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    )
}