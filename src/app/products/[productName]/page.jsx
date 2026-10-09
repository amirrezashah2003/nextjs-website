"use client"
import { useParams } from "next/navigation"
import { useProducts } from "@/components/hooks/useProducts";
import ProductCard from "@/components/ProductCard/ProductCard";

const categoryMap = {
    laptop: "لپتاپ ها",
    mobile: "موبایل ها",
    tablet: "تبلت ها",
    console: "کنسول ها"
};
export default function ProductName(){
    const params = useParams()
    const myName = params.productName 
    const title = categoryMap[myName]

    const { data , isLoading , isError} = useProducts(myName)
    const products = typeof data === "string" ? JSON.parse(data) : data



    if (isLoading) return <div>در حال بارگذاری محصولات {title}...</div>;
    if (isError) return <div>خطا در دریافت اطلاعات!</div>;

    return(
    <main className="container mx-auto px-4 py-8">  
        <h1 className="text-2xl font-bold mb-8 text-gray-800 in-[.dark]:text-gray-200">محصولات فروشگاه</h1>
        <h2 className="mb-2 text-center">لیست {title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    </main>
    )
}