import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/services/productsService';



export const useProducts = (category) => {
    return useQuery({
        // کلید کش با دسته‌بندی تغییر می‌کند (products, laptop)
        queryKey: ["products" , category],
        queryFn: () => getProducts(category),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5
    })
}
