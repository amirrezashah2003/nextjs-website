// app/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../../lib/get-query-client";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import { getProducts } from "@/components/api/services/productsService";


export default async function Home() {
  const queryClient = getQueryClient();

  // پیش‌بارگذاری برای هر ۴ دسته
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ["products", "laptop"], queryFn: () => getProducts("laptop") }),
    queryClient.prefetchQuery({ queryKey: ["products", "mobile"], queryFn: () => getProducts("mobile") }),
    queryClient.prefetchQuery({ queryKey: ["products", "tablet"], queryFn: () => getProducts("tablet") }),
    queryClient.prefetchQuery({ queryKey: ["products", "console"], queryFn: () => getProducts("console") }),
    
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="container px-4">
        <ProductCarousel category="laptop" title="لپ‌تاپ‌های پیشنهادی" />
        <ProductCarousel category="mobile" title="موبایل‌های پرفروش" />
        <ProductCarousel category="tablet" title="تبلت های پرفروش" />
        <ProductCarousel category="console" title="کنسول های پرفروش" />
      </main>
    </HydrationBoundary>
  );
}

