"use client"
import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useProductsById } from "@/components/hooks/useProducts"
import { useAddToCart } from "@/components/hooks/useCart"
import { toast, Toaster } from "react-hot-toast" 
import { FaShoppingCart, FaHeart, FaRegHeart, FaShareAlt, FaShieldAlt, FaTruck, FaUndo, FaCheckCircle } from 'react-icons/fa';
import { useUser } from "@/components/hooks/useUser";

function ProductPage(){
    const params = useParams()
    const productId = params.id
    const { data , isLoading , isError } = useProductsById(productId)
    const product = typeof data === "string" ? JSON.parse(data) : data

    const { userId, isLoading: isUserLoading } = useUser();
    // استفاده از هوک افزودن به سبد خرید
    const { mutate: addToCart, isPending: isAdding } = useAddToCart();
    

    const [isFavorite, setIsFavorite] = useState(false)
    const [quantity, setQuantity] = useState(1)

    //  تعریف تابع مدیریت کلیک روی دکمه افزودن به سبد خرید
    const addToCartHandler = () => {
        if (!product || product.length === 0) return;

        const currentProduct = product[0];

        // اگر کاربر لاگین نکرده باشد (userId وجود نداشته باشد)
        if (!userId) {
            try {
                // خواندن سبد خرید فعلی از localStorage
                const existingCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
                
                // بررسی اینکه آیا محصول قبلاً در سبد خرید مهمان هست یا خیر
                const existingIndex = existingCart.findIndex(item => item.productId === currentProduct.id);
                
                if (existingIndex > -1) {
                    existingCart[existingIndex].quantity += quantity;
                } else {
                    existingCart.push({
                        productId: currentProduct.id,
                        name: currentProduct.name,
                        price: currentProduct.price,
                        img: currentProduct.img,
                        brand: currentProduct.brand,
                        quantity: quantity
                    });
                }

                // ذخیره مجدد در localStorage
                localStorage.setItem("guest_cart", JSON.stringify(existingCart));
                window.dispatchEvent(new Event("guest_cart_updated"));
                
                toast.success("محصول با موفقیت به سبد خرید مهمان اضافه شد!");
            } catch (error) {
                console.error("Guest cart error:", error);
                toast.error("خطایی در افزودن محصول رخ داد");
            }
            return;
        }

        // اگر کاربر لاگین کرده باشد، درخواست به سرور ارسال می‌شود
        addToCart({
            userId: userId,
            productId: currentProduct.id, 
            quantity: quantity
        }, {
            onSuccess: () => {
                toast.success("محصول با موفقیت به سبد خرید اضافه شد!");
            },
            onError: (err) => {
                toast.error("خطایی در افزودن محصول رخ داد");
                console.error(err);
            }
        });
    };


    if (isLoading){
        return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        );
    }
    if (isError || !product) return <div>خطا در دریافت اطلاعات!</div>;


    return (
        <div className="min-h-screen bg-gray-50 in-[.dark]:bg-gray-950 py-8 transition-colors">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="container px-4">
                
                {/* مسیر راهنما (Breadcrumb) */}
                <nav className="text-sm text-gray-500 in-[.dark]:text-gray-400 mb-6 flex items-center gap-2">
                    <span>خانه</span> / 
                    <span className="uppercase">{product[0].category}</span> / 
                    <span className="uppercase">{product[0].brand}</span> / 
                    <span className="text-gray-900 in-[.dark]:text-white font-medium truncate">{product[0].model}</span>
                </nav>

                {/* بدنه اصلی صفحه محصول */}
                <div className="bg-white in-[.dark]:bg-gray-900 border border-gray-200 in-[.dark]:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* ستون اول: تصویر محصول (۵ ستون) */}
                        <div className="lg:col-span-5 flex flex-col gap-4">
                            <div className="relative w-full aspect-square bg-gray-100 in-[.dark]:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 in-[.dark]:border-gray-800 group">
                                <Image
                                    src={product[0].img}
                                    alt={product[0].name}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />

                                {/* دکمه علاقه‌مندی */}
                                <button 
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className="absolute top-4 left-4 p-3 bg-white/80 in-[.dark]:bg-gray-900/80 backdrop-blur-md rounded-full shadow-md text-red-500 hover:scale-110 transition-transform"
                                    aria-label="افزودن به علاقه‌مندی‌ها"
                                >
                                    {isFavorite ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5 text-gray-600 in-[.dark]:text-gray-300" />}
                                </button>
                            </div>

                            {/* بنرهای ویژگی‌های خرید */}
                            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                                <div className="p-3 bg-gray-50 in-[.dark]:bg-gray-800/50 rounded-xl flex flex-col items-center justify-center gap-1 text-xs text-gray-600 in-[.dark]:text-gray-400">
                                    <FaShieldAlt className="text-primary-hover text-lg" />
                                    <span>ضمانت اصالت</span>
                                </div>
                                <div className="p-3 bg-gray-50 in-[.dark]:bg-gray-800/50 rounded-xl flex flex-col items-center justify-center gap-1 text-xs text-gray-600 in-[.dark]:text-gray-400">
                                    <FaTruck className="text-primary-hover text-lg" />
                                    <span>ارسال سریع</span>
                                </div>
                                <div className="p-3 bg-gray-50 in-[.dark]:bg-gray-800/50 rounded-xl flex flex-col items-center justify-center gap-1 text-xs text-gray-600 in-[.dark]:text-gray-400">
                                    <FaUndo className="text-primary-hover text-lg" />
                                    <span>۷ روز ضمانت بازگشت</span>
                                </div>
                            </div>
                        </div>

                        {/* ستون دوم: اطلاعات و خرید (۷ ستون) */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                            
                            <div className="space-y-4">
                                {/* برند و وضعیت موجودی */}
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 bg-indigo-50 in-[.dark]:bg-indigo-950/50 text-primary-hover in-[.dark]:text-primary text-xs font-bold rounded-full uppercase">
                                        {product[0].brand}
                                    </span>
                                    <span className="flex items-center gap-1 text-emerald-600 in-[.dark]:text-emerald-400 text-xs font-semibold">
                                        <FaCheckCircle /> موجود در انبار
                                    </span>
                                </div>

                                {/* نام محصول */}
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 in-[.dark]:text-white leading-relaxed">
                                    {product[0].name}
                                </h1>

                                {/* اطلاعات فنی (info) */}
                                {product[0].info && (
                                    <p className="text-sm text-gray-500 in-[.dark]:text-gray-400 bg-gray-50 in-[.dark]:bg-gray-800/50 p-3 rounded-xl border border-gray-100 in-[.dark]:border-gray-800 font-mono">
                                        {product[0].info}
                                    </p>
                                )}

                                <p className="bg-primary inline-block text-gray-100 py-1 px-3 rounded-xl">همراه با 18 ماه گارانتی</p>
                            </div>

                            {/* بخش قیمت و عملیات خرید */}
                            <div className="pt-6 border-t border-gray-100 in-[.dark]:border-gray-800 space-y-6">
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 in-[.dark]:text-gray-400">قیمت نهایی:</span>
                                    <div className="text-left">
                                        <span className="text-2xl md:text-3xl font-black text-gray-900 in-[.dark]:text-white">
                                            {product[0].price ? product[0].price.toLocaleString() : '۰'}
                                        </span>
                                        <span className="text-xs text-gray-500 mr-1">تومان</span>
                                    </div>
                                </div>

                                {/* تعداد و دکمه سبد خرید */}
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    
                                    {/* کنترلر تعداد */}
                                    <div className="flex items-center border border-gray-200 in-[.dark]:border-gray-700 rounded-xl overflow-hidden bg-gray-50 in-[.dark]:bg-gray-800">
                                        <button 
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="px-4 py-3 text-gray-600 in-[.dark]:text-gray-300 hover:bg-gray-200 in-[.dark]:hover:bg-gray-700 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 font-bold text-gray-900 in-[.dark]:text-white">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className="px-4 py-3 text-gray-600 in-[.dark]:text-gray-300 hover:bg-gray-200 in-[.dark]:hover:bg-gray-700 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* دکمه افزودن به سبد خرید */}
                                    <button 
                                        onClick={addToCartHandler}
                                        disabled={isAdding}
                                        className="w-full flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isAdding ? (
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            <FaShoppingCart className="text-lg" />
                                        )}
                                        {isAdding ? "در حال افزودن..." : "افزودن به سبد خرید"}
                                    </button>

                                    {/* دکمه اشتراک‌گذاری */}
                                    <button 
                                        className="p-4 border border-gray-200 in-[.dark]:border-gray-700 rounded-xl text-gray-600 in-[.dark]:text-gray-300 hover:bg-gray-200 in-[.dark]:hover:bg-gray-800 transition-colors"
                                        aria-label="اشتراک گذاری"
                                    >
                                        <FaShareAlt className="text-lg" />
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
export default ProductPage