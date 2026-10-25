import { Suspense } from "react";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import { getProducts } from "@/components/api/services/productsService";

async function CarouselsSection() {
  const [laptops, mobiles, tablets, consoles] = await Promise.all([
    getProducts("laptop"),
    getProducts("mobile"),
    getProducts("tablet"),
    getProducts("console"),
  ]);

  return (
    <div className="space-y-8">
      <ProductCarousel category="laptop" title="لپ‌تاپ‌های پیشنهادی" initialData={laptops} />
      <ProductCarousel category="mobile" title="موبایل‌های پرفروش" initialData={mobiles} />
      <ProductCarousel category="tablet" title="تبلت های پرفروش" initialData={tablets} />
      <ProductCarousel category="console" title="کنسول های پرفروش" initialData={consoles} />
    </div>
  );
}


// استفاده از generateMetadata برای سئو و بهینه‌سازی موتورهای جستجو
export const metadata = {
  title: "فروشگاه تکنولوژی | خرید آنلاین لپ‌تاپ و موبایل",
  description: "بهترین قیمت‌ها برای خرید انواع محصولات دیجیتال در فروشگاه ما.",
  keywords: ["خرید لپ تاپ", "موبایل", "کنسول بازی", "فروشگاه آنلاین"],
};



export default function Home() {
  return (
    <main className="container px-4 py-8">
      <Suspense 
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }
      >
        <h1 className="text-3xl font-bold mb-6 text-center">به فروشگاه امیررضا خوش آمدید!</h1>
        <p className="text-center mb-12 text-gray-600 in-[.dark]:text-gray-400">
          بهترین مکان برای خرید آنلاین لپ‌تاپ، موبایل، تبلت و کنسول‌های بازی.
        </p>
        <CarouselsSection />
      </Suspense>
    </main>
  );
}
