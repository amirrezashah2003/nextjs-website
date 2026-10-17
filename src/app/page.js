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
        <CarouselsSection />
      </Suspense>
    </main>
  );
}
