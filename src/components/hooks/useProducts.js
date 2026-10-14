import { useQuery } from '@tanstack/react-query';
import { getProducts , getProductByBrand , getProductsByCategoryAndBrand , getProductsByCategoryAndBrandAndModel , getProductsById} from '../api/services/productsService';



export const useProducts = (category) => {
    return useQuery({
        // کلید کش با دسته‌بندی تغییر می‌کند (products, laptop)
        queryKey: ["products" , category],
        queryFn: () => getProducts(category),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5
    })
}



export const useProductsByBrand = (brand) => {
    return useQuery({
        queryKey: ["products" , brand],
        queryFn: () => getProductByBrand(brand),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5
    })
}


export const useProductsByCategoryAndBrand = (category , brand) => {
    return useQuery({
        queryKey: ["products" , category , brand],
        queryFn: () => getProductsByCategoryAndBrand(category , brand),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5
    })
}



export const useProductsByCategoryAndBrandAndModel = (category , brand , model) => {
    return useQuery({
        queryKey: ["products" , category , brand , model],
        queryFn: () => getProductsByCategoryAndBrandAndModel(category , brand , model),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5
    })
}


export const useProductsById = (id) => {
    return useQuery({
        queryKey: [id , "products"],
        queryFn: () => getProductsById(id),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5
    })
}